import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { ETIQUETA_CACHE_CATALOGO } from "@/services/ServicioCatalogo";

const SECRETO_REVALIDACION_POR_DEFECTO = "pb_revalidate_secret_2026_dev";

/**
 * Extrae el secreto de autenticación desde la cabecera X-Revalidate-Secret o el parámetro de consulta 'secreto'.
 */
function extraerSecretoPeticion(peticion: NextRequest): string | null {
  const secretoCabecera = peticion.headers.get("x-revalidate-secret");
  if (secretoCabecera && secretoCabecera.trim().length > 0) {
    return secretoCabecera.trim();
  }

  const secretoConsulta = peticion.nextUrl.searchParams.get("secreto");
  if (secretoConsulta && secretoConsulta.trim().length > 0) {
    return secretoConsulta.trim();
  }

  return null;
}

/**
 * Webhook de Revalidación On-Demand (ISR) invocado por el Backend API Core (.NET 10)
 * cuando se actualizan tarifas del catálogo o se activan/modifican campañas promocionales.
 */
export async function POST(peticion: NextRequest) {
  const secretoConfigurado =
    process.env.REVALIDATE_SECRET || SECRETO_REVALIDACION_POR_DEFECTO;
  const secretoRecibido = extraerSecretoPeticion(peticion);

  if (!secretoRecibido || secretoRecibido !== secretoConfigurado) {
    return NextResponse.json(
      {
        exito: false,
        revalidado: false,
        mensaje: "Control de acceso: el secreto de revalidación es inválido o no fue provisto.",
      },
      { status: 401 }
    );
  }

  const etiquetaConsulta = peticion.nextUrl.searchParams.get("tag");
  const etiquetaRevalidar =
    etiquetaConsulta && etiquetaConsulta.trim().length > 0
      ? etiquetaConsulta.trim()
      : ETIQUETA_CACHE_CATALOGO;

  try {
    revalidateTag(etiquetaRevalidar);
    revalidatePath("/", "layout");

    return NextResponse.json(
      {
        exito: true,
        revalidado: true,
        tag: etiquetaRevalidar,
        fechaHoraUtc: new Date().toISOString(),
        mensaje: `Caché ISR purgada exitosamente para la etiqueta '${etiquetaRevalidar}'.`,
      },
      { status: 200 }
    );
  } catch (error) {
    const detalleError =
      error instanceof Error ? error.message : "Error desconocido al purgar la caché.";

    return NextResponse.json(
      {
        exito: false,
        revalidado: false,
        tag: etiquetaRevalidar,
        mensaje: `No fue posible completar la revalidación ISR: ${detalleError}`,
      },
      { status: 500 }
    );
  }
}
