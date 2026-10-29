<#
.SYNOPSIS
    Script interactivo y modular de PowerShell para control de versiones y subida automatica a Git.
.DESCRIPTION
    Permite gestionar de forma guiada el ambito de cambios (Frontend, Backend o Todo),
    el mensaje de commit con prefijo semantico, y el versionado SemVer (Parche, Menor, Mayor).
    Es 100% portable y reutilizable en cualquier proyecto.
.NOTES
    Autor: Pablo Bejas
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$Mensaje,

    [Parameter(Mandatory = $false)]
    [string]$Ambito,

    [Parameter(Mandatory = $false)]
    [string]$Version
)

function Mostrar-Encabezado {
    Clear-Host
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "       CONTROL DE VERSIONES Y DESPLIEGUE A GIT            " -ForegroundColor Yellow
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
    # 1. Comprobar si la carpeta donde reside el script contiene .git
    if (Test-Path (Join-Path $PSScriptRoot ".git")) {
        return $PSScriptRoot
    }
    # 2. Comprobar si existe la subcarpeta Frontend con .git
    $rutaFrontendGit = Join-Path $PSScriptRoot "Frontend\.git"
    if (Test-Path $rutaFrontendGit) {
        return (Join-Path $PSScriptRoot "Frontend")
    }
    # 3. Comprobar la ubicacion actual de ejecucion
    $ubicacionActual = (Get-Location).Path
    if (Test-Path (Join-Path $ubicacionActual ".git")) {
        return $ubicacionActual
    }
    # 4. Fallback al directorio del script
    return $PSScriptRoot
}

function Seleccionar-AmbitoInteractivo {
    param([string]$RutaRepo)

    $existeFrontend = Test-Path (Join-Path $RutaRepo "Frontend")
    $existeBackend = Test-Path (Join-Path $RutaRepo "Backend")

    if (-not $existeFrontend -and -not $existeBackend) {
        return "todo"
    }

    Write-Host "Que parte del proyecto deseas actualizar?" -ForegroundColor Yellow
    Write-Host "  [1] Todo el proyecto (Completo)" -ForegroundColor White
    if ($existeFrontend) {
        Write-Host "  [2] Solo Frontend (Frontend/)" -ForegroundColor White
    }
    if ($existeBackend) {
        Write-Host "  [3] Solo Backend (Backend/)" -ForegroundColor White
    }

    $opcion = Read-Host "Selecciona una opcion [1]"
    switch ($opcion) {
        "2" { return "frontend" }
        "3" { return "backend" }
        default { return "todo" }
    }
}

function Obtener-MensajeCommitInteractivo {
    Write-Host ""
    Write-Host "Tipo de cambio (Conventional Commits):" -ForegroundColor Yellow
    Write-Host "  [1] feat:     (Nueva funcionalidad o componente)" -ForegroundColor White
    Write-Host "  [2] fix:      (Correccion de error o bug)" -ForegroundColor White
    Write-Host "  [3] style:    (Diseno visual, fondo, colores, espaciados)" -ForegroundColor White
    Write-Host "  [4] refactor: (Codigo limpio, SOLID, optimizacion)" -ForegroundColor White
    Write-Host "  [5] docs:     (Documentacion o propuestas)" -ForegroundColor White
    Write-Host "  [6] Libre     (Texto personalizado sin prefijo)" -ForegroundColor White

    $tipoOpcion = Read-Host "Elige el tipo de cambio [1]"
    $prefijo = switch ($tipoOpcion) {
        "2" { "fix: " }
        "3" { "style: " }
        "4" { "refactor: " }
        "5" { "docs: " }
        "6" { "" }
        default { "feat: " }
    }

    $descripcion = Read-Host "Ingresa la descripcion del commit"
    while ([string]::IsNullOrWhiteSpace($descripcion)) {
        Write-Host "[!] La descripcion no puede estar vacia." -ForegroundColor Yellow
        $descripcion = Read-Host "Ingresa la descripcion del commit"
    }

    return "$prefijo$descripcion"
}

function Obtener-VersionActual {
    param([string]$RutaRepo)

    # 1. Intentar leer desde package.json
    $rutasPackageJson = @(
        (Join-Path $RutaRepo "package.json"),
        (Join-Path $PSScriptRoot "Frontend\package.json"),
        (Join-Path $PSScriptRoot "package.json")
    )

    foreach ($rutaJson in $rutasPackageJson) {
        if (Test-Path $rutaJson) {
            try {
                $contenido = Get-Content $rutaJson -Raw | ConvertFrom-Json
                if ($contenido.version) {
                    return $contenido.version
                }
            } catch {
                # Ignorar error y seguir con fallback
            }
        }
    }

    # 2. Intentar leer ultimo Git tag
    try {
        $ultimoTag = git -C "$RutaRepo" describe --tags --abbrev=0 2>$null
        if ($ultimoTag) {
            return ($ultimoTag.Trim() -replace "^v", "")
        }
    } catch {
        # Fallback predeterminado
    }

    return "1.0.0"
}

function Calcular-SiguienteVersion {
    param(
        [string]$VersionActual,
        [string]$TipoIncremento
    )

    $partes = $VersionActual.Split(".")
    $mayor = if ($partes.Length -gt 0) { [int]$partes[0] } else { 1 }
    $menor = if ($partes.Length -gt 1) { [int]$partes[1] } else { 0 }
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

    Write-Host ""
    Write-Host "Version actual detectada: " -NoNewline
    Write-Host "v$VersionActual" -ForegroundColor Cyan
    Write-Host "Que tipo de version deseas asignar?" -ForegroundColor Yellow
    Write-Host "  [1] Parche (Patch - bugfix/cambio menor)  -> $(Calcular-SiguienteVersion $VersionActual 'parche')" -ForegroundColor White
    Write-Host "  [2] Menor  (Minor - nueva funcion/mejora) -> $(Calcular-SiguienteVersion $VersionActual 'menor')" -ForegroundColor White
    Write-Host "  [3] Mayor  (Major - cambio estructural)   -> $(Calcular-SiguienteVersion $VersionActual 'mayor')" -ForegroundColor White
    Write-Host "  [4] Mantener version actual (sin crear Tag de version)" -ForegroundColor White
    Write-Host "  [5] Personalizada (escribir numero exacto)" -ForegroundColor White

    $opcion = Read-Host "Selecciona una opcion de version [4]"
    switch ($opcion) {
        "1" { return (Calcular-SiguienteVersion $VersionActual "parche") }
        "2" { return (Calcular-SiguienteVersion $VersionActual "menor") }
        "3" { return (Calcular-SiguienteVersion $VersionActual "mayor") }
        "5" {
            $personalizada = Read-Host "Escribe la version deseada (ejemplo: 2.1.0)"
            return ($personalizada -replace "^v", "")
        }
        default { return $null }
    }
}

function Actualizar-PackageJson {
    param(
        [string]$RutaRepo,
        [string]$NuevaVersion
    )

    $rutasPackageJson = @(
        (Join-Path $RutaRepo "package.json"),
        (Join-Path $PSScriptRoot "Frontend\package.json"),
        (Join-Path $PSScriptRoot "package.json")
    )

    foreach ($rutaJson in $rutasPackageJson) {
        if (Test-Path $rutaJson) {
            try {
                $contenidoTexto = Get-Content $rutaJson -Raw
                $reemplazo = [regex]::Replace($contenidoTexto, '"version":\s*"[^"]+"', ('"version": "' + $NuevaVersion + '"'))
                Set-Content -Path $rutaJson -Value $reemplazo -Encoding UTF8
                Write-Host "  -> Archivo package.json actualizado a version $NuevaVersion" -ForegroundColor Green
            } catch {
                Write-Host "  [!] No se pudo actualizar automaticamente $rutaJson" -ForegroundColor Yellow
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

# Sincronizar directorio de trabajo
try {
    [System.IO.Directory]::SetCurrentDirectory($rutaRepositorio)
} catch {
    # Continuar; el flag -C garantiza la ruta en git
}
Set-Location $rutaRepositorio

# Determinar si el repositorio es la subcarpeta Frontend o la raiz
$esRepoEnFrontend = (Test-Path (Join-Path $rutaRepositorio "package.json")) -and ($rutaRepositorio -match "[\\/]Frontend$")

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

    # 3. Determinar ambito de cambios
    $ambitoSeleccionado = if ($PSBoundParameters.ContainsKey("Ambito")) {
        $Ambito.ToLower()
    } else {
        Seleccionar-AmbitoInteractivo -RutaRepo $PSScriptRoot
    }

    # 4. Determinar ruta de staging para git
    $rutaStaging = "."
    if (-not $esRepoEnFrontend) {
        if ($ambitoSeleccionado -eq "frontend" -and (Test-Path (Join-Path $rutaRepositorio "Frontend"))) {
            $rutaStaging = "Frontend"
        } elseif ($ambitoSeleccionado -eq "backend" -and (Test-Path (Join-Path $rutaRepositorio "Backend"))) {
            $rutaStaging = "Backend"
        }
    }

    # 5. Inspeccionar estado de cambios en Git con manejo explicito de error
    $salidaStatus = git -C "$rutaRepositorio" status --porcelain $rutaStaging 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR GIT al verificar estado]:" -ForegroundColor Red
        $salidaStatus | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        exit $LASTEXITCODE
    }

    $lineasCambios = @($salidaStatus | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    if ($lineasCambios.Count -eq 0) {
        Write-Host ""
        Write-Host "[OK] No hay cambios pendientes para subir en el ambito '$ambitoSeleccionado'." -ForegroundColor Green
        Write-Host "El arbol de trabajo esta completamente limpio." -ForegroundColor DarkGray
        exit 0
    }

    Write-Host ""
    Write-Host "Cambios detectados ($($lineasCambios.Count) archivos):" -ForegroundColor Yellow
    git -C "$rutaRepositorio" status -s $rutaStaging
    Write-Host ""

    # 6. Obtener mensaje de commit
    $mensajeFinalCommit = if ($PSBoundParameters.ContainsKey("Mensaje")) {
        $Mensaje
    } else {
        Obtener-MensajeCommitInteractivo
    }

    # 7. Gestionar version (SemVer)
    $versionActual = Obtener-VersionActual -RutaRepo $rutaRepositorio
    $nuevaVersion = if ($PSBoundParameters.ContainsKey("Version")) {
        ($Version -replace "^v", "")
    } else {
        Seleccionar-VersionInteractiva -VersionActual $versionActual
    }

    # 8. Resumen de operaciones y confirmacion
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "RESUMEN DE LA OPERACION:" -ForegroundColor Yellow
    Write-Host "  Ambito de subida : $ambitoSeleccionado ($rutaStaging)" -ForegroundColor White
    Write-Host "  Rama destino     : $ramaActual" -ForegroundColor White
    Write-Host "  Mensaje commit   : $mensajeFinalCommit" -ForegroundColor White
    if ($nuevaVersion) {
        Write-Host "  Nueva Version    : v$nuevaVersion (se creara Tag en Git)" -ForegroundColor Green
    } else {
        Write-Host "  Version          : Sin cambio de version" -ForegroundColor DarkGray
    }
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host ""

    $confirmacion = Read-Host "Deseas confirmar y subir estos cambios a Git? (S/N) [S]"
    if ($confirmacion -eq "N" -or $confirmacion -eq "n") {
        Write-Host "[!] Operacion cancelada por el usuario." -ForegroundColor Yellow
        exit 0
    }

    Write-Host ""
    Write-Host "Ejecutando operaciones Git..." -ForegroundColor Cyan

    # 9. Actualizar package.json si cambio la version
    if ($nuevaVersion) {
        Actualizar-PackageJson -RutaRepo $rutaRepositorio -NuevaVersion $nuevaVersion
    }

    # 10. git add
    Write-Host "1/3 Agregando archivos al staging (git add)..." -ForegroundColor White
    git -C "$rutaRepositorio" add $rutaStaging
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Ocurrio un error al ejecutar git add." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    # 11. git commit
    Write-Host "2/3 Creando commit..." -ForegroundColor White
    git -C "$rutaRepositorio" commit -m $mensajeFinalCommit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Ocurrio un error al crear el commit." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    # 12. git tag (si aplica)
    if ($nuevaVersion) {
        $etiquetaTag = "v$nuevaVersion"
        Write-Host "  -> Creando etiqueta de version $etiquetaTag..." -ForegroundColor Cyan
        git -C "$rutaRepositorio" tag -a $etiquetaTag -m "Version ${nuevaVersion} - $mensajeFinalCommit"
    }

    # 13. git push
    Write-Host "3/3 Enviando cambios al repositorio remoto (git push)..." -ForegroundColor White
    git -C "$rutaRepositorio" push origin $ramaActual
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] No se pudo completar el git push hacia origin/$ramaActual." -ForegroundColor Red
        Write-Host "Verifica tu conexion y credenciales de GitHub." -ForegroundColor Yellow
        exit $LASTEXITCODE
    }

    if ($nuevaVersion) {
        Write-Host "  -> Enviando etiqueta de version $etiquetaTag..." -ForegroundColor White
        git -C "$rutaRepositorio" push origin $etiquetaTag
    }

    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " [EXITO] Cambios subidos correctamente al repositorio!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host "[ERROR INESPERADO] $($_.Exception.Message)" -ForegroundColor Red
}
