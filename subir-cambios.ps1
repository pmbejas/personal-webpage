<#
.SYNOPSIS
    Script interactivo de PowerShell para control de versiones y publicación en GitHub.
.DESCRIPTION
    Permite gestionar de forma guiada el versionado SemVer (Parche, Menor, Mayor o Manual),
    el detalle descriptivo del commit (Conventional Commits), y publica los cambios
    y tags automáticamente en el repositorio remoto de GitHub.
.NOTES
    Autor: Pablo Bejas
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$Mensaje,

    [Parameter(Mandatory = $false)]
    [string]$Version
)

function Mostrar-Encabezado {
    Clear-Host
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "       CONTROL DE VERSIONES Y PUBLICACION EN GITHUB       " -ForegroundColor Yellow
    Write-Host "                 Pablo Bejas Dev                          " -ForegroundColor DarkGray
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Validar-GitInstalado {
    $comandoGit = Get-Command git -ErrorAction SilentlyContinue
    if (-not $comandoGit) {
        Write-Host "[ERROR] Git no esta instalado o no se encuentra en el PATH del sistema." -ForegroundColor Red
        exit 1
    }
}

function Obtener-RutaRepositorio {
    # 1. Comprobar si existe la subcarpeta Frontend con .git (estructura oficial del proyecto)
    $rutaFrontendGit = Join-Path $PSScriptRoot "Frontend\.git"
    if (Test-Path $rutaFrontendGit) {
        return (Join-Path $PSScriptRoot "Frontend")
    }

    # 2. Comprobar si la carpeta donde reside el script contiene .git
    if (Test-Path (Join-Path $PSScriptRoot ".git")) {
        return $PSScriptRoot
    }

    # 3. Comprobar la ubicacion actual de ejecucion
    $ubicacionActual = (Get-Location).Path
    if (Test-Path (Join-Path $ubicacionActual ".git")) {
        return $ubicacionActual
    }

    return (Join-Path $PSScriptRoot "Frontend")
}

function Obtener-VersionActual {
    param([string]$RutaRepo)

    # 1. Intentar leer desde datosVersion.ts
    $rutasDatosVersion = @(
        (Join-Path $RutaRepo "src\data\datosVersion.ts"),
        (Join-Path $PSScriptRoot "Frontend\src\data\datosVersion.ts"),
        (Join-Path $PSScriptRoot "src\data\datosVersion.ts")
    )

    foreach ($rutaVersionTs in $rutasDatosVersion) {
        if (Test-Path $rutaVersionTs) {
            try {
                $contenidoTs = Get-Content $rutaVersionTs -Raw
                if ($contenidoTs -match 'VERSION_SITIO\s*=\s*"([^"]+)"') {
                    return $Matches[1]
                }
            } catch {
                # Continuar con el siguiente intento
            }
        }
    }

    # 2. Intentar leer desde package.json
    $rutasPackageJson = @(
        (Join-Path $RutaRepo "package.json"),
        (Join-Path $PSScriptRoot "Frontend\package.json"),
        (Join-Path $PSScriptRoot "package.json")
    )

    foreach ($rutaJson in $rutasPackageJson) {
        if (Test-Path $rutaJson) {
            try {
                $contenidoJson = Get-Content $rutaJson -Raw | ConvertFrom-Json
                if ($contenidoJson.version) {
                    return $contenidoJson.version
                }
            } catch {
                # Continuar
            }
        }
    }

    return "3.1.0"
}

function Calcular-SiguienteVersion {
    param(
        [string]$VersionActual,
        [string]$TipoIncremento
    )

    $partes = $VersionActual.Split(".")
    $mayor = if ($partes.Length -gt 0) { [int]$partes[0] } else { 3 }
    $menor = if ($partes.Length -gt 1) { [int]$partes[1] } else { 1 }
    $parche = if ($partes.Length -gt 2) { [int]$partes[2] } else { 0 }

    switch ($TipoIncremento) {
        "parche" { return "$mayor.$menor.$($parche + 1)" }
        "menor"  { return "$mayor.$($menor + 1).0" }
        "mayor"  { return "$($mayor + 1).0.0" }
        default  { return $VersionActual }
    }
}

function Seleccionar-VersionInteractiva {
    param([string]$VersionActual)

    $sigParche = Calcular-SiguienteVersion $VersionActual "parche"
    $sigMenor  = Calcular-SiguienteVersion $VersionActual "menor"
    $sigMayor  = Calcular-SiguienteVersion $VersionActual "mayor"

    Write-Host ""
    Write-Host "Version actual de la pagina: " -NoNewline
    Write-Host "v$VersionActual" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Que tipo de cambio realizaste en esta version? (SemVer):" -ForegroundColor Yellow
    Write-Host "  [1] Parche (Patch - correccion de bug o ajuste menor) -> Cambia el 3er numero ($sigParche)" -ForegroundColor White
    Write-Host "  [2] Menor  (Minor - nueva funcionalidad o seccion)     -> Cambia el 2do numero ($sigMenor)" -ForegroundColor White
    Write-Host "  [3] Mayor  (Major - rediseno o cambio arquitectural)   -> Cambia el 1er numero ($sigMayor)" -ForegroundColor White
    Write-Host "  [4] Manual (ingresar numero exacto de version)" -ForegroundColor White
    Write-Host "  [5] Mantener actual ($VersionActual)" -ForegroundColor White
    Write-Host ""

    $opcion = Read-Host "Elige una opcion [5]"
    switch ($opcion) {
        "1" { return $sigParche }
        "2" { return $sigMenor }
        "3" { return $sigMayor }
        "4" {
            $manual = Read-Host "Escribe el numero de version deseado (ej: 3.1.5)"
            $versionLimpia = ($manual.Trim() -replace "^v", "")
            while ([string]::IsNullOrWhiteSpace($versionLimpia)) {
                Write-Host "[!] La version no puede estar vacia." -ForegroundColor Yellow
                $manual = Read-Host "Escribe el numero de version deseado (ej: 3.1.5)"
                $versionLimpia = ($manual.Trim() -replace "^v", "")
            }
            return $versionLimpia
        }
        default { return $null }
    }
}

function Obtener-MensajeCommitInteractivo {
    Write-Host ""
    Write-Host "Tipo de cambio para el Commit (Conventional Commits):" -ForegroundColor Yellow
    Write-Host "  [1] feat:     (Nueva funcionalidad, seccion o feature)" -ForegroundColor White
    Write-Host "  [2] fix:      (Correccion de error, bug o detalle visual)" -ForegroundColor White
    Write-Host "  [3] i18n:     (Traduccion o textos en idiomas ingles/portugues)" -ForegroundColor White
    Write-Host "  [4] style:    (Diseno visual, colores, efectos, spotlight, espaciados)" -ForegroundColor White
    Write-Host "  [5] refactor: (Optimizacion de codigo, SOLID, limpieza)" -ForegroundColor White
    Write-Host "  [6] docs:     (Documentacion, informes o propuestas)" -ForegroundColor White
    Write-Host "  [7] Libre     (Escribir texto personalizado sin prefijo)" -ForegroundColor White
    Write-Host ""

    $tipoOpcion = Read-Host "Elige el tipo de cambio [1]"
    $prefijo = switch ($tipoOpcion) {
        "2" { "fix: " }
        "3" { "i18n: " }
        "4" { "style: " }
        "5" { "refactor: " }
        "6" { "docs: " }
        "7" { "" }
        default { "feat: " }
    }

    Write-Host ""
    $descripcion = Read-Host "Ingresa el detalle del cambio realizado"
    while ([string]::IsNullOrWhiteSpace($descripcion)) {
        Write-Host "[!] El detalle del commit no puede estar vacio." -ForegroundColor Yellow
        $descripcion = Read-Host "Ingresa el detalle del cambio realizado"
    }

    return "$prefijo$descripcion"
}

function Actualizar-ArchivosVersion {
    param(
        [string]$RutaRepo,
        [string]$NuevaVersion
    )

    $utf8SinBom = New-Object System.Text.UTF8Encoding($false)

    # 1. Actualizar Frontend/src/data/datosVersion.ts
    $rutasDatosVersion = @(
        (Join-Path $RutaRepo "src\data\datosVersion.ts"),
        (Join-Path $PSScriptRoot "Frontend\src\data\datosVersion.ts")
    )

    foreach ($rutaTs in $rutasDatosVersion) {
        if (Test-Path $rutaTs) {
            try {
                $contenidoNuevo = @"
/**
 * Fuente única de verdad para el número de versión oficial del sitio web.
 * Sigue el estándar de versionado semántico SemVer (Mayor.Menor.Parche).
 */
export const VERSION_SITIO = "$NuevaVersion";
"@
                [System.IO.File]::WriteAllText($rutaTs, $contenidoNuevo, $utf8SinBom)
                Write-Host "  -> Archivo datosVersion.ts actualizado a v$NuevaVersion" -ForegroundColor Green
            } catch {
                Write-Host "  [!] No se pudo actualizar $rutaTs" -ForegroundColor Yellow
            }
        }
    }

    # 2. Actualizar Frontend/package.json (siempre sin marca de orden de bytes / BOM para compatibilidad con Node.js y Webpack)
    $rutasPackageJson = @(
        (Join-Path $RutaRepo "package.json"),
        (Join-Path $PSScriptRoot "Frontend\package.json")
    )

    foreach ($rutaJson in $rutasPackageJson) {
        if (Test-Path $rutaJson) {
            try {
                $textoJson = [System.IO.File]::ReadAllText($rutaJson)
                $reemplazo = [regex]::Replace($textoJson, '"version":\s*"[^"]+"', ('"version": "' + $NuevaVersion + '"'))
                [System.IO.File]::WriteAllText($rutaJson, $reemplazo, $utf8SinBom)
                Write-Host "  -> Archivo package.json actualizado a version $NuevaVersion (UTF-8 sin BOM)" -ForegroundColor Green
            } catch {
                Write-Host "  [!] No se pudo actualizar $rutaJson" -ForegroundColor Yellow
            }
        }
    }
}

# ========================================================
# FLUJO PRINCIPAL DE EJECUCION
# ========================================================

Mostrar-Encabezado
Validar-GitInstalado

# 1. Detectar ubicacion del repositorio Git
$rutaRepositorio = Obtener-RutaRepositorio

try {
    [System.IO.Directory]::SetCurrentDirectory($rutaRepositorio)
} catch {
    # Continuar
}
Set-Location $rutaRepositorio

try {
    # 2. Obtener rama actual de trabajo
    $salidaRama = git -C "$rutaRepositorio" branch --show-current 2>&1
    $ramaActual = if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($salidaRama)) {
        ($salidaRama -join "").Trim()
    } else {
        "main"
    }

    Write-Host "Repositorio activo : $rutaRepositorio" -ForegroundColor DarkGray
    Write-Host "Rama Git actual    : " -NoNewline
    Write-Host $ramaActual -ForegroundColor Cyan
    Write-Host ""

    # 3. Inspeccionar estado de cambios en Git
    $salidaStatus = git -C "$rutaRepositorio" status --porcelain 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR GIT al verificar estado]:" -ForegroundColor Red
        $salidaStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        exit $LASTEXITCODE
    }

    $lineasCambios = @($salidaStatus | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    if ($lineasCambios.Count -eq 0) {
        Write-Host "[OK] No hay cambios pendientes para subir." -ForegroundColor Green
        Write-Host "El arbol de trabajo esta completamente limpio." -ForegroundColor DarkGray
        exit 0
    }

    Write-Host "Cambios detectados ($($lineasCambios.Count) archivos):" -ForegroundColor Yellow
    git -C "$rutaRepositorio" status -s
    Write-Host ""

    # 4. Obtener version actual e interactuar con el usuario
    $versionActual = Obtener-VersionActual -RutaRepo $rutaRepositorio
    $nuevaVersion = if ($PSBoundParameters.ContainsKey("Version")) {
        ($Version -replace "^v", "")
    } else {
        Seleccionar-VersionInteractiva -VersionActual $versionActual
    }

    # 5. Obtener detalle del commit
    $mensajeFinalCommit = if ($PSBoundParameters.ContainsKey("Mensaje")) {
        $Mensaje
    } else {
        Obtener-MensajeCommitInteractivo
    }

    # 6. Resumen de la operacion
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "RESUMEN DE LA PUBLICACION:" -ForegroundColor Yellow
    Write-Host "  Rama destino     : $ramaActual" -ForegroundColor White
    Write-Host "  Mensaje commit   : $mensajeFinalCommit" -ForegroundColor White
    if ($nuevaVersion) {
        Write-Host "  Nueva Version    : v$nuevaVersion (se creara Tag en Git)" -ForegroundColor Green
    } else {
        Write-Host "  Version          : v$versionActual (sin cambio de version)" -ForegroundColor DarkGray
    }
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host ""

    $confirmacion = Read-Host "Deseas confirmar y publicar estos cambios en GitHub? (S/N) [S]"
    if ($confirmacion -eq "N" -or $confirmacion -eq "n") {
        Write-Host "[!] Publicacion cancelada por el usuario." -ForegroundColor Yellow
        exit 0
    }

    Write-Host ""
    Write-Host "Iniciando proceso de publicacion a GitHub..." -ForegroundColor Cyan

    # 7. Actualizar archivos de version si cambio
    if ($nuevaVersion) {
        Actualizar-ArchivosVersion -RutaRepo $rutaRepositorio -NuevaVersion $nuevaVersion
    }

    # 8. git add
    Write-Host "1/3 Agregando archivos (git add)..." -ForegroundColor White
    git -C "$rutaRepositorio" add .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Ocurrio un error al ejecutar git add." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    # 9. git commit
    Write-Host "2/3 Creando commit..." -ForegroundColor White
    git -C "$rutaRepositorio" commit -m $mensajeFinalCommit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Ocurrio un error al crear el commit." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    # 10. git tag si cambio la version
    if ($nuevaVersion) {
        $etiquetaTag = "v$nuevaVersion"
        Write-Host "  -> Creando etiqueta de version $etiquetaTag..." -ForegroundColor Cyan
        git -C "$rutaRepositorio" tag -a $etiquetaTag -m "Version ${nuevaVersion} - $mensajeFinalCommit"
    }

    # 11. git push
    Write-Host "3/3 Enviando cambios a GitHub (git push)..." -ForegroundColor White
    git -C "$rutaRepositorio" push origin $ramaActual
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] No se pudo completar el git push hacia origin/$ramaActual." -ForegroundColor Red
        Write-Host "Verifica tu conexion a internet y permisos en GitHub." -ForegroundColor Yellow
        exit $LASTEXITCODE
    }

    if ($nuevaVersion) {
        Write-Host "  -> Enviando etiqueta $etiquetaTag a GitHub..." -ForegroundColor White
        git -C "$rutaRepositorio" push origin $etiquetaTag
    }

    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " [EXITO] Cambios y version publicados en GitHub!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host "[ERROR INESPERADO] $($_.Exception.Message)" -ForegroundColor Red
}
