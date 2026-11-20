<#
.SYNOPSIS
    Asistente interactivo y a color para versionado SemVer y tags en GitHub
    para el ecosistema de Pablo Bejas (WebSite, Frontend o Backend en un solo paso).

.DESCRIPTION
    Permite actualizar la versión de WebSite (Next.js 15), Frontend (Next.js API) o Backend (.NET 9),
    o de todos los proyectos activos simultáneamente.
    Calcula automáticamente incrementos PATCH, MINOR o MAJOR, o permite ingreso manual.
    Soporta repositorios con o sin commits previos, actualiza archivos de proyecto (.csproj / package.json / datosVersion.ts),
    genera commit y tag anotado, y publica en GitHub.

.PARAMETER Simular
    Ejecuta en modo simulación (dry-run) sin alterar archivos ni Git.

.PARAMETER SoloCargarFunciones
    Carga funciones en memoria para pruebas sin abrir el menú.

.EXAMPLE
    .\actualizar-version.ps1
    .\actualizar-version.ps1 -Simular
#>

[CmdletBinding()]
param(
    [switch]$Simular,
    [switch]$SoloCargarFunciones
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ==============================================================================
# CONSTANTES Y CONFIGURACIÓN VISUAL
# ==============================================================================
$PATRON_SEMVER = '^(?<mayor>0|[1-9]\d*)\.(?<menor>0|[1-9]\d*)\.(?<parche>0|[1-9]\d*)(?:-(?<pre>[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$'
$VERSION_INICIAL_DEFECTO = '0.0.0'
$MAXIMO_COMMITS_RESUMEN = 10
$RAMAS_PRINCIPALES = @('main', 'master')

$COLOR_TITULO = 'Yellow'
$COLOR_ACENTO = 'Cyan'
$COLOR_EXITO = 'Green'
$COLOR_ADVERTENCIA = 'DarkYellow'
$COLOR_ERROR = 'Red'
$COLOR_TENUE = 'DarkGray'
$COLOR_TEXTO = 'White'

# ==============================================================================
# SECCIÓN 1: UTILIDADES DE CONSOLA Y ENTRADA
# ==============================================================================

function Configurar-ConsolaUtf8 {
    try {
        [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        [Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
    }
    catch { }
}

function Escribir-Estado {
    param(
        [Parameter(Mandatory)]
        [ValidateSet('Info', 'Exito', 'Advertencia', 'Error')]
        [string]$Tipo,

        [Parameter(Mandatory)]
        [string]$Mensaje
    )

    switch ($Tipo) {
        'Info'        { $icono = '[i]'; $color = $COLOR_ACENTO }
        'Exito'       { $icono = '[OK]'; $color = $COLOR_EXITO }
        'Advertencia' { $icono = '[!]'; $color = $COLOR_ADVERTENCIA }
        'Error'       { $icono = '[X]'; $color = $COLOR_ERROR }
    }

    Write-Host "  $icono " -ForegroundColor $color -NoNewline
    Write-Host $Mensaje -ForegroundColor $COLOR_TEXTO
}

function Mostrar-Banner {
    param([switch]$ModoSimulacion)

    try { Clear-Host } catch { Write-Host '' }

    $lineaSuperior = '  ╔══════════════════════════════════════════════════════════════════╗'
    $lineaMedia    = '  ║           PABLO BEJAS — GESTOR DE VERSIONADO PARA GITHUB         ║'
    $lineaSub      = '  ║     WebSite (Portafolio) · Frontend (API) · Backend (.NET)       ║'
    $lineaInferior = '  ╚══════════════════════════════════════════════════════════════════╝'

    Write-Host ''
    Write-Host $lineaSuperior -ForegroundColor $COLOR_TITULO
    Write-Host $lineaMedia    -ForegroundColor $COLOR_TITULO
    Write-Host $lineaSub      -ForegroundColor $COLOR_ACENTO
    Write-Host $lineaInferior -ForegroundColor $COLOR_TITULO

    if ($ModoSimulacion) {
        Write-Host ''
        Write-Host '  >>> MODO SIMULACIÓN ACTIVO: no se modificarán archivos ni Git <<<' -ForegroundColor Magenta
    }
    Write-Host ''
}

function Mostrar-Seccion {
    param([Parameter(Mandatory)][string]$Titulo)

    Write-Host ''
    Write-Host "  ── $Titulo " -ForegroundColor $COLOR_ACENTO -NoNewline
    $largoRestante = [Math]::Max(4, 62 - $Titulo.Length)
    Write-Host ('─' * $largoRestante) -ForegroundColor $COLOR_TENUE
    Write-Host ''
}

function Es-ConsolaInteractiva {
    try {
        if ([Console]::IsInputRedirected -or [Console]::IsOutputRedirected) {
            return $false
        }
        $null = [Console]::KeyAvailable
        $null = [Console]::CursorTop
        return $true
    }
    catch {
        return $false
    }
}

function Obtener-AnchoConsolaSeguro {
    try {
        $ancho = [Console]::WindowWidth
        if ($ancho -gt 20) { return $ancho }
    }
    catch {}
    return 100
}

function Dibujar-OpcionesMenu {
    param(
        [Parameter(Mandatory)][array]$Opciones,
        [Parameter(Mandatory)][int]$IndiceSeleccionado
    )

    $anchoMaximo = (Obtener-AnchoConsolaSeguro) - 2

    for ($i = 0; $i -lt $Opciones.Count; $i++) {
        $opcion = $Opciones[$i]
        $numero = $i + 1
        $esActual = ($i -eq $IndiceSeleccionado)
        $prefijo = if ($esActual) { "  ▸ [$numero] " } else { "    [$numero] " }
        $etiqueta = $opcion.Etiqueta
        $detalle = if ($opcion.ContainsKey('Detalle') -and $opcion.Detalle) { "  $($opcion.Detalle)" } else { '' }

        $espacioDetalle = $anchoMaximo - ($prefijo.Length + $etiqueta.Length)
        if ($espacioDetalle -lt 4) {
            $detalle = ''
        }
        elseif ($detalle.Length -gt $espacioDetalle) {
            $detalle = $detalle.Substring(0, $espacioDetalle - 1) + '…'
        }

        $relleno = [Math]::Max(0, $anchoMaximo - ($prefijo.Length + $etiqueta.Length + $detalle.Length))

        if ($esActual) {
            Write-Host $prefijo -ForegroundColor $COLOR_TITULO -NoNewline
            Write-Host $etiqueta -ForegroundColor Black -BackgroundColor $COLOR_ACENTO -NoNewline
            if ($detalle) {
                Write-Host $detalle -ForegroundColor $COLOR_ACENTO -NoNewline
            }
            Write-Host (' ' * $relleno)
        }
        else {
            Write-Host $prefijo -ForegroundColor $COLOR_TENUE -NoNewline
            Write-Host $etiqueta -ForegroundColor $COLOR_TEXTO -NoNewline
            if ($detalle) {
                Write-Host $detalle -ForegroundColor $COLOR_TENUE -NoNewline
            }
            Write-Host (' ' * $relleno)
        }
    }
}

function Mostrar-MenuInteractivo {
    param(
        [Parameter(Mandatory)][string]$Titulo,
        [Parameter(Mandatory)][array]$Opciones,
        [string]$Subtitulo = 'Elegí una opción (1-{0}) o usá ↑/↓ y Enter. 0 para cancelar.'
    )

    $subtituloFormateado = $Subtitulo -f $Opciones.Count
    Mostrar-Seccion -Titulo $Titulo
    Write-Host "  $subtituloFormateado" -ForegroundColor $COLOR_TENUE
    Write-Host ''

    if (-not (Es-ConsolaInteractiva)) {
        return Mostrar-MenuNumericoFallback -Opciones $Opciones
    }

    $indice = 0
    $cursorVisiblePrevio = $true
    try { $cursorVisiblePrevio = [Console]::CursorVisible; [Console]::CursorVisible = $false } catch {}

    try {
        Dibujar-OpcionesMenu -Opciones $Opciones -IndiceSeleccionado $indice
        $lineaInicio = [Math]::Max(0, [Console]::CursorTop - $Opciones.Count)

        while ($true) {
            $tecla = [Console]::ReadKey($true)

            if ($tecla.Key -eq [ConsoleKey]::UpArrow) {
                $indice = if ($indice -eq 0) { $Opciones.Count - 1 } else { $indice - 1 }
            }
            elseif ($tecla.Key -eq [ConsoleKey]::DownArrow) {
                $indice = if ($indice -eq ($Opciones.Count - 1)) { 0 } else { $indice + 1 }
            }
            elseif ($tecla.Key -eq [ConsoleKey]::Enter) {
                Write-Host ''
                return $Opciones[$indice].Valor
            }
            elseif ($tecla.Key -eq [ConsoleKey]::Escape) {
                Write-Host ''
                return $null
            }
            elseif ($tecla.KeyChar -eq '0') {
                Write-Host ''
                return $null
            }
            elseif ($tecla.KeyChar -match '^[1-9]$') {
                $elegido = [int]::Parse($tecla.KeyChar.ToString()) - 1
                if ($elegido -ge 0 -and $elegido -lt $Opciones.Count) {
                    $indice = $elegido
                    [Console]::SetCursorPosition(0, $lineaInicio)
                    Dibujar-OpcionesMenu -Opciones $Opciones -IndiceSeleccionado $indice
                    Write-Host ''
                    return $Opciones[$indice].Valor
                }
            }

            [Console]::SetCursorPosition(0, $lineaInicio)
            Dibujar-OpcionesMenu -Opciones $Opciones -IndiceSeleccionado $indice
        }
    }
    finally {
        try { [Console]::CursorVisible = $cursorVisiblePrevio } catch {}
    }
}

function Mostrar-MenuNumericoFallback {
    param([Parameter(Mandatory)][array]$Opciones)

    for ($i = 0; $i -lt $Opciones.Count; $i++) {
        $numero = $i + 1
        $detalle = if ($Opciones[$i].ContainsKey('Detalle') -and $Opciones[$i].Detalle) { " — $($Opciones[$i].Detalle)" } else { '' }
        Write-Host "  [$numero] $($Opciones[$i].Etiqueta)$detalle" -ForegroundColor $COLOR_TEXTO
    }
    Write-Host "  [0] Cancelar / Salir" -ForegroundColor $COLOR_TENUE

    while ($true) {
        Write-Host ''
        $entrada = Read-Host "  Opción (1-$($Opciones.Count), 0 para cancelar)"
        if ($entrada -eq '0') { return $null }

        $numero = 0
        if ([int]::TryParse($entrada, [ref]$numero) -and $numero -ge 1 -and $numero -le $Opciones.Count) {
            return $Opciones[$numero - 1].Valor
        }
        Escribir-Estado -Tipo 'Advertencia' -Mensaje 'Opción no válida. Ingresá el número correspondiente.'
    }
}

function Pedir-Confirmacion {
    param(
        [Parameter(Mandatory)][string]$Pregunta,
        [bool]$PorDefectoSi = $true
    )

    $sugerencia = if ($PorDefectoSi) { '[S/n]' } else { '[s/N]' }

    while ($true) {
        Write-Host "  ? $Pregunta " -ForegroundColor $COLOR_TITULO -NoNewline
        Write-Host "${sugerencia}: " -ForegroundColor $COLOR_TENUE -NoNewline
        $respuesta = Read-Host

        if ([string]::IsNullOrWhiteSpace($respuesta)) {
            return $PorDefectoSi
        }

        $normalizada = $respuesta.Trim().ToLowerInvariant()
        if ($normalizada -in @('s', 'si', 'sí', 'y', 'yes')) { return $true }
        if ($normalizada -in @('n', 'no')) { return $false }

        Escribir-Estado -Tipo 'Advertencia' -Mensaje 'Respondé con S (sí) o N (no).'
    }
}

# ==============================================================================
# SECCIÓN 2: LÓGICA DE VERSIONADO SEMÁNTICO (SEMVER)
# ==============================================================================

function Convertir-TextoASemVer {
    param([string]$TextoVersion)

    if ([string]::IsNullOrWhiteSpace($TextoVersion)) {
        return $null
    }

    $limpia = $TextoVersion.Trim()
    if ($limpia.StartsWith('v') -or $limpia.StartsWith('V')) {
        $limpia = $limpia.Substring(1)
    }

    $coincidencia = [regex]::Match($limpia, $PATRON_SEMVER)
    if (-not $coincidencia.Success) {
        return $null
    }

    $pre = $coincidencia.Groups['pre'].Value
    $mayor = [int]$coincidencia.Groups['mayor'].Value
    $menor = [int]$coincidencia.Groups['menor'].Value
    $parche = [int]$coincidencia.Groups['parche'].Value

    $textoNormalizado = if ($pre) { "$mayor.$menor.$parche-$pre" } else { "$mayor.$menor.$parche" }

    return [PSCustomObject]@{
        Mayor          = $mayor
        Menor          = $menor
        Parche         = $parche
        Prelanzamiento = $pre
        Texto          = $textoNormalizado
        Tag            = "v$textoNormalizado"
    }
}

function Comparar-SemVer {
    param(
        [Parameter(Mandatory)][PSCustomObject]$VersionA,
        [Parameter(Mandatory)][PSCustomObject]$VersionB
    )

    foreach ($campo in @('Mayor', 'Menor', 'Parche')) {
        if ($VersionA.$campo -gt $VersionB.$campo) { return 1 }
        if ($VersionA.$campo -lt $VersionB.$campo) { return -1 }
    }

    $tienePreA = -not [string]::IsNullOrEmpty($VersionA.Prelanzamiento)
    $tienePreB = -not [string]::IsNullOrEmpty($VersionB.Prelanzamiento)

    if (-not $tienePreA -and $tienePreB) { return 1 }
    if ($tienePreA -and -not $tienePreB) { return -1 }
    if (-not $tienePreA -and -not $tienePreB) { return 0 }

    return [string]::Compare($VersionA.Prelanzamiento, $VersionB.Prelanzamiento, [System.StringComparison]::Ordinal)
}

function Calcular-SiguienteVersion {
    param(
        [Parameter(Mandatory)][PSCustomObject]$VersionActual,
        [Parameter(Mandatory)][ValidateSet('Patch', 'Minor', 'Major')][string]$TipoCambio
    )

    switch ($TipoCambio) {
        'Major' { $nueva = "$($VersionActual.Mayor + 1).0.0" }
        'Minor' { $nueva = "$($VersionActual.Mayor).$($VersionActual.Menor + 1).0" }
        'Patch' { $nueva = "$($VersionActual.Mayor).$($VersionActual.Menor).$($VersionActual.Parche + 1)" }
    }

    return Convertir-TextoASemVer -TextoVersion $nueva
}

function Resolver-VersionBase {
    param(
        [PSCustomObject]$VersionTag,
        [PSCustomObject]$VersionArchivo
    )

    if ($null -eq $VersionTag -and $null -eq $VersionArchivo) {
        return [PSCustomObject]@{
            Version       = Convertir-TextoASemVer -TextoVersion $VERSION_INICIAL_DEFECTO
            Origen        = 'Inicial (sin tags ni versión en archivo)'
            HayDiferencia = $false
        }
    }

    if ($null -ne $VersionTag -and $null -eq $VersionArchivo) {
        return [PSCustomObject]@{
            Version       = $VersionTag
            Origen        = 'Último tag de Git'
            HayDiferencia = $false
        }
    }

    if ($null -eq $VersionTag -and $null -ne $VersionArchivo) {
        return [PSCustomObject]@{
            Version       = $VersionArchivo
            Origen        = 'Archivo de proyecto'
            HayDiferencia = $false
        }
    }

    $comparacion = Comparar-SemVer -VersionA $VersionTag -VersionB $VersionArchivo
    if ($comparacion -eq 0) {
        return [PSCustomObject]@{
            Version       = $VersionTag
            Origen        = 'Tag Git y archivo sincronizados'
            HayDiferencia = $false
        }
    }

    $mayor = if ($comparacion -gt 0) { $VersionTag } else { $VersionArchivo }
    return [PSCustomObject]@{
        Version       = $mayor
        Origen        = 'Mayor versión encontrada'
        HayDiferencia = $true
    }
}

# ==============================================================================
# SECCIÓN 3: OPERACIONES CON GIT Y GITHUB
# ==============================================================================

function Ejecutar-ComandoGit {
    param(
        [Parameter(Mandatory)][string]$RutaRepositorio,
        [Parameter(Mandatory)][string[]]$Argumentos
    )

    $preferenciaPrevia = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'

    try {
        $salida = & git -C $RutaRepositorio @Argumentos 2>&1
        $codigo = $LASTEXITCODE
        $lineas = @($salida | ForEach-Object { $_.ToString() })

        return [PSCustomObject]@{
            Exitoso      = ($codigo -eq 0)
            CodigoSalida = $codigo
            Lineas       = $lineas
            Texto        = ($lineas -join [Environment]::NewLine).Trim()
        }
    }
    finally {
        $ErrorActionPreference = $preferenciaPrevia
    }
}

function Verificar-GitInstalado {
    $comando = Get-Command git -ErrorAction SilentlyContinue
    return ($null -ne $comando)
}

function Obtener-UltimoTagSemVer {
    param([Parameter(Mandatory)][string]$RutaRepositorio)

    $resultado = Ejecutar-ComandoGit -RutaRepositorio $RutaRepositorio -Argumentos @('tag', '--list', 'v*')
    if (-not $resultado.Exitoso -or [string]::IsNullOrWhiteSpace($resultado.Texto)) {
        return $null
    }

    $mayorVersion = $null
    foreach ($linea in $resultado.Lineas) {
        $version = Convertir-TextoASemVer -TextoVersion $linea
        if ($null -eq $version) { continue }

        if ($null -eq $mayorVersion -or (Comparar-SemVer -VersionA $version -VersionB $mayorVersion) -gt 0) {
            $mayorVersion = $version
        }
    }

    return $mayorVersion
}

function Existe-TagEnRepositorio {
    param(
        [Parameter(Mandatory)][string]$RutaRepositorio,
        [Parameter(Mandatory)][string]$NombreTag,
        [bool]$TieneRemoto = $false
    )

    $local = Ejecutar-ComandoGit -RutaRepositorio $RutaRepositorio -Argumentos @('tag', '--list', $NombreTag)
    if ($local.Exitoso -and -not [string]::IsNullOrWhiteSpace($local.Texto)) {
        return [PSCustomObject]@{ Existe = $true; Donde = 'repositorio local' }
    }

    if ($TieneRemoto) {
        $remoto = Ejecutar-ComandoGit -RutaRepositorio $RutaRepositorio -Argumentos @('ls-remote', '--tags', 'origin', "refs/tags/$NombreTag*")
        if ($remoto.Exitoso -and -not [string]::IsNullOrWhiteSpace($remoto.Texto)) {
            return [PSCustomObject]@{ Existe = $true; Donde = 'GitHub (remoto origin)' }
        }
    }

    return [PSCustomObject]@{ Existe = $false; Donde = '' }
}

function Obtener-CommitsDesdeTag {
    param(
        [Parameter(Mandatory)][string]$RutaRepositorio,
        [PSCustomObject]$UltimoTag,
        [bool]$TieneCommits = $true
    )

    if (-not $TieneCommits) {
        return ,@()
    }

    $rango = if ($null -ne $UltimoTag) { "$($UltimoTag.Tag)..HEAD" } else { 'HEAD' }
    $resultado = Ejecutar-ComandoGit -RutaRepositorio $RutaRepositorio -Argumentos @(
        'log', $rango, "--max-count=$MAXIMO_COMMITS_RESUMEN", '--pretty=format:%h %s'
    )

    if (-not $resultado.Exitoso -or [string]::IsNullOrWhiteSpace($resultado.Texto)) {
        return ,@()
    }

    $lineasFiltradas = @($resultado.Lineas | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    return ,@($lineasFiltradas)
}

function Construir-UrlReleaseGitHub {
    param(
        [string]$UrlRemoto,
        [Parameter(Mandatory)][string]$Tag
    )

    if ([string]::IsNullOrWhiteSpace($UrlRemoto)) { return $null }

    $limpia = $UrlRemoto.Trim()
    if ($limpia -match '^git@github\.com:(.+?)(?:\.git)?$') {
        return "https://github.com/$($Matches[1])/releases/new?tag=$Tag"
    }

    if ($limpia -match '^https?://github\.com/(.+?)(?:\.git)?/?$') {
        return "https://github.com/$($Matches[1])/releases/new?tag=$Tag"
    }

    return $null
}

# ==============================================================================
# SECCIÓN 4: LECTURA Y ACTUALIZACIÓN DE ARCHIVOS DE PROYECTO
# ==============================================================================

function Buscar-ArchivoProyecto {
    param(
        [Parameter(Mandatory)][string]$TipoProyecto,
        [Parameter(Mandatory)][string]$RutaRepositorio
    )

    if ($TipoProyecto -eq 'Backend') {
        $carpetaSrc = Join-Path $RutaRepositorio 'src'
        if (Test-Path -LiteralPath $carpetaSrc) {
            $encontrado = Get-ChildItem -Path $carpetaSrc -Filter '*.csproj' -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($null -ne $encontrado) { return $encontrado.FullName }
        }

        $encontradoRaiz = Get-ChildItem -Path $RutaRepositorio -Filter '*.csproj' -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($null -ne $encontradoRaiz) { return $encontradoRaiz.FullName }

        return $null
    }

    # Para WebSite y Frontend (proyectos Next.js / Node.js)
    $packageJson = Join-Path $RutaRepositorio 'package.json'
    if (Test-Path -LiteralPath $packageJson) {
        return $packageJson
    }

    return $null
}

function Leer-VersionArchivoProyecto {
    param(
        [Parameter(Mandatory)][string]$TipoProyecto,
        [string]$RutaArchivo
    )

    if ([string]::IsNullOrWhiteSpace($RutaArchivo) -or -not (Test-Path -LiteralPath $RutaArchivo)) {
        return $null
    }

    $contenido = [System.IO.File]::ReadAllText($RutaArchivo, [System.Text.Encoding]::UTF8)

    if ($TipoProyecto -eq 'Backend') {
        $coincidencia = [regex]::Match($contenido, '<Version>\s*([^<\s]+)\s*</Version>')
        if (-not $coincidencia.Success) { return $null }
        return Convertir-TextoASemVer -TextoVersion $coincidencia.Groups[1].Value
    }

    try {
        $json = $contenido | ConvertFrom-Json
        if ($null -eq $json.version) { return $null }
        return Convertir-TextoASemVer -TextoVersion $json.version.ToString()
    }
    catch {
        return $null
    }
}

function Actualizar-VersionArchivoProyecto {
    param(
        [Parameter(Mandatory)][string]$TipoProyecto,
        [Parameter(Mandatory)][string]$RutaArchivo,
        [Parameter(Mandatory)][string]$NuevaVersion,
        [switch]$ModoSimulacion
    )

    if (-not (Test-Path -LiteralPath $RutaArchivo)) {
        throw "No se encontró el archivo de proyecto: $RutaArchivo"
    }

    $contenido = [System.IO.File]::ReadAllText($RutaArchivo, [System.Text.Encoding]::UTF8)

    if ($TipoProyecto -eq 'Backend') {
        $nuevoContenido = Actualizar-ContenidoCsproj -ContenidoXml $contenido -NuevaVersion $NuevaVersion
    }
    else {
        $nuevoContenido = Actualizar-ContenidoPackageJson -ContenidoJson $contenido -NuevaVersion $NuevaVersion
    }

    if (-not $ModoSimulacion) {
        $utf8SinBom = [System.Text.UTF8Encoding]::new($false)
        [System.IO.File]::WriteAllText($RutaArchivo, $nuevoContenido, $utf8SinBom)

        # Para WebSite: sincronizar también datosVersion.ts si existe
        if ($TipoProyecto -eq 'WebSite') {
            $rutaRepo = Split-Path $RutaArchivo -Parent
            $rutaDatosVersion = Join-Path $rutaRepo 'src\data\datosVersion.ts'
            if (Test-Path -LiteralPath $rutaDatosVersion) {
                $contenidoDatosVersion = @"
/**
 * Fuente única de verdad para el número de versión oficial del sitio web.
 * Sigue el estándar de versionado semántico SemVer (Mayor.Menor.Parche).
 */
export const VERSION_SITIO = "$NuevaVersion";
"@
                [System.IO.File]::WriteAllText($rutaDatosVersion, $contenidoDatosVersion, $utf8SinBom)
            }
        }
    }

    return $nuevoContenido
}

function Actualizar-ContenidoCsproj {
    param(
        [Parameter(Mandatory)][string]$ContenidoXml,
        [Parameter(Mandatory)][string]$NuevaVersion
    )

    $patronVersion = '<Version>[^<]*</Version>'
    if ([regex]::IsMatch($ContenidoXml, $patronVersion)) {
        $regex = [regex]::new($patronVersion)
        return $regex.Replace($ContenidoXml, "<Version>$NuevaVersion</Version>", 1)
    }

    $patronCierreGrupo = '(\r?\n)([ \t]*)</PropertyGroup>'
    if ([regex]::IsMatch($ContenidoXml, $patronCierreGrupo)) {
        $regexGrupo = [regex]::new($patronCierreGrupo)
        return $regexGrupo.Replace(
            $ContenidoXml,
            {
                param($match)
                $salto = $match.Groups[1].Value
                $sangria = $match.Groups[2].Value
                return "$salto$sangria  <Version>$NuevaVersion</Version>$salto$sangria</PropertyGroup>"
            },
            1
        )
    }

    throw 'El archivo .csproj no contiene un bloque <PropertyGroup> válido para insertar <Version>.'
}

function Actualizar-ContenidoPackageJson {
    param(
        [Parameter(Mandatory)][string]$ContenidoJson,
        [Parameter(Mandatory)][string]$NuevaVersion
    )

    $patronVersion = '("version"\s*:\s*)"[^"]*"'
    if (-not [regex]::IsMatch($ContenidoJson, $patronVersion)) {
        throw 'El archivo package.json no contiene el campo "version".'
    }

    $regex = [regex]::new($patronVersion)
    return $regex.Replace($ContenidoJson, "`${1}`"$NuevaVersion`"", 1)
}

# ==============================================================================
# SECCIÓN 5: INSPECCIÓN Y VALIDACIÓN DE REPOSITORIOS
# ==============================================================================

function Obtener-EstadoRepositorio {
    param(
        [Parameter(Mandatory)][string]$TipoProyecto,
        [Parameter(Mandatory)][string]$RutaRaiz
    )

    $rutaRepo = Join-Path $RutaRaiz $TipoProyecto
    $existeCarpeta = Test-Path -LiteralPath $rutaRepo
    $esRepoGit = $existeCarpeta -and (Test-Path -LiteralPath (Join-Path $rutaRepo '.git'))

    $estado = [PSCustomObject]@{
        Tipo              = $TipoProyecto
        Ruta              = $rutaRepo
        ExisteCarpeta     = $existeCarpeta
        EsRepoGit         = $esRepoGit
        RamaActual        = ''
        TieneCommits      = $false
        UrlOrigin         = ''
        TieneOrigin       = $false
        CambiosPendientes = @()
        ArchivoProyecto   = $null
        VersionTag        = $null
        VersionArchivo    = $null
        VersionResuelta   = $null
    }

    if (-not $esRepoGit) {
        return $estado
    }

    $head = Ejecutar-ComandoGit -RutaRepositorio $rutaRepo -Argumentos @('rev-parse', '--verify', 'HEAD')
    $estado.TieneCommits = $head.Exitoso

    $rama = Ejecutar-ComandoGit -RutaRepositorio $rutaRepo -Argumentos @('symbolic-ref', '--short', 'HEAD')
    if (-not $rama.Exitoso) {
        $rama = Ejecutar-ComandoGit -RutaRepositorio $rutaRepo -Argumentos @('rev-parse', '--abbrev-ref', 'HEAD')
    }
    if ($rama.Exitoso -and -not [string]::IsNullOrWhiteSpace($rama.Texto)) {
        $estado.RamaActual = $rama.Texto
    }
    else {
        $estado.RamaActual = 'main'
    }

    $remoto = Ejecutar-ComandoGit -RutaRepositorio $rutaRepo -Argumentos @('remote', 'get-url', 'origin')
    $estado.TieneOrigin = $remoto.Exitoso -and -not [string]::IsNullOrWhiteSpace($remoto.Texto)
    $estado.UrlOrigin = if ($estado.TieneOrigin) { $remoto.Texto } else { '' }

    $porcelain = Ejecutar-ComandoGit -RutaRepositorio $rutaRepo -Argumentos @('status', '--porcelain')
    if ($porcelain.Exitoso -and -not [string]::IsNullOrWhiteSpace($porcelain.Texto)) {
        $estado.CambiosPendientes = @($porcelain.Lineas | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    }

    $estado.ArchivoProyecto = Buscar-ArchivoProyecto -TipoProyecto $TipoProyecto -RutaRepositorio $rutaRepo
    $estado.VersionTag = Obtener-UltimoTagSemVer -RutaRepositorio $rutaRepo
    $estado.VersionArchivo = Leer-VersionArchivoProyecto -TipoProyecto $TipoProyecto -RutaArchivo $estado.ArchivoProyecto
    $estado.VersionResuelta = Resolver-VersionBase -VersionTag $estado.VersionTag -VersionArchivo $estado.VersionArchivo

    return $estado
}

function Formatear-DetalleRepositorioMenu {
    param([Parameter(Mandatory)][PSCustomObject]$Estado)

    if (-not $Estado.ExisteCarpeta) {
        return '(Carpeta no encontrada)'
    }
    if (-not $Estado.EsRepoGit) {
        return '(Sin repositorio Git — falta git init)'
    }

    $version = $Estado.VersionResuelta.Version.Tag
    $commits = if ($Estado.TieneCommits) { '' } else { ' | sin commits' }
    $remoto = if ($Estado.TieneOrigin) { 'GitHub: conectado' } else { 'Solo local' }
    return "[$version | rama: $($Estado.RamaActual)$commits | $remoto]"
}

function Evaluar-CondicionesPrevias {
    param(
        [Parameter(Mandatory)][PSCustomObject]$Estado,
        [switch]$ModoSimulacion,
        [bool]$PreguntarFetch = $true
    )

    if (-not $Estado.EsRepoGit) {
        Escribir-Estado -Tipo 'Error' -Mensaje "La carpeta '$($Estado.Tipo)' no es un repositorio Git."
        return $null
    }

    if ($Estado.TieneOrigin -and $PreguntarFetch) {
        $sincronizar = Pedir-Confirmacion -Pregunta "[$($Estado.Tipo)] ¿Traer últimos tags de GitHub (git fetch origin --tags)?" -PorDefectoSi $true
        if ($sincronizar) {
            if ($ModoSimulacion) {
                Escribir-Estado -Tipo 'Info' -Mensaje "[$($Estado.Tipo)] [Simulación] Se omitió fetch."
            }
            else {
                Escribir-Estado -Tipo 'Info' -Mensaje "[$($Estado.Tipo)] Sincronizando tags con GitHub..."
                $fetch = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('fetch', 'origin', '--tags')
                if ($fetch.Exitoso) {
                    Escribir-Estado -Tipo 'Exito' -Mensaje "[$($Estado.Tipo)] Tags sincronizados."
                    $Estado = Obtener-EstadoRepositorio -TipoProyecto $Estado.Tipo -RutaRaiz (Split-Path $Estado.Ruta -Parent)
                }
                else {
                    Escribir-Estado -Tipo 'Advertencia' -Mensaje "No se pudo sincronizar tags: $($fetch.Texto)"
                }
            }
        }
    }

    if ($Estado.RamaActual -notin $RAMAS_PRINCIPALES) {
        Escribir-Estado -Tipo 'Advertencia' -Mensaje "[$($Estado.Tipo)] Estás en la rama '$($Estado.RamaActual)' (no es main/master)."
        if (-not (Pedir-Confirmacion -Pregunta "¿Versionar esta rama '$($Estado.RamaActual)' de todas formas?" -PorDefectoSi $false)) {
            return $null
        }
    }

    $estrategiaCommit = Evaluar-CambiosPendientes -Estado $Estado
    if ($null -eq $estrategiaCommit) {
        return $null
    }

    return [PSCustomObject]@{
        Estado           = $Estado
        EstrategiaCommit = $estrategiaCommit
    }
}

function Evaluar-CambiosPendientes {
    param([Parameter(Mandatory)][PSCustomObject]$Estado)

    $cantidad = @($Estado.CambiosPendientes).Length
    if (-not $Estado.TieneCommits) {
        Write-Host ''
        Escribir-Estado -Tipo 'Info' -Mensaje "[$($Estado.Tipo)] Repositorio nuevo sin commits previos."

        if ($cantidad -eq 0 -and $null -eq $Estado.ArchivoProyecto) {
            Escribir-Estado -Tipo 'Advertencia' -Mensaje "[$($Estado.Tipo)] No hay archivos para commitear. Se creará un commit inicial vacío para el tag."
            return 'Todos'
        }

        $opcionesInicial = @(
            @{ Etiqueta = "Crear commit inicial con los archivos disponibles ($cantidad) + versión"; Valor = 'Todos'; Detalle = '(Recomendado)' }
            @{ Etiqueta = 'Cancelar operación para este repositorio'; Valor = $null; Detalle = '' }
        )
        return Mostrar-MenuInteractivo -Titulo "Primer commit para $($Estado.Tipo)" -Opciones $opcionesInicial
    }

    if ($cantidad -eq 0) {
        return 'SoloVersion'
    }

    Write-Host ''
    Escribir-Estado -Tipo 'Advertencia' -Mensaje "Hay $cantidad archivo(s) pendientes en $($Estado.Tipo):"
    $vistaPrevia = $Estado.CambiosPendientes | Select-Object -First 5
    foreach ($archivo in $vistaPrevia) {
        Write-Host "      $archivo" -ForegroundColor $COLOR_ADVERTENCIA
    }
    if ($cantidad -gt 5) {
        Write-Host "      ... y $($cantidad - 5) más." -ForegroundColor $COLOR_TENUE
    }

    $opciones = @(
        @{ Etiqueta = 'Incluir TODOS los cambios pendientes en este commit'; Valor = 'Todos'; Detalle = "(git add -A con los $cantidad cambios) (Recomendado)" }
        @{ Etiqueta = 'Commitear SOLO el archivo de versión'; Valor = 'SoloVersion'; Detalle = '(deja otros cambios en working tree)' }
        @{ Etiqueta = 'Cancelar operación para este repositorio'; Valor = $null; Detalle = '' }
    )

    return Mostrar-MenuInteractivo -Titulo "Cambios pendientes en $($Estado.Tipo)" -Opciones $opciones
}

# ==============================================================================
# SECCIÓN 6: SELECCIÓN DE VERSIÓN Y NOTAS
# ==============================================================================

function Mostrar-PanelVersionActual {
    param([Parameter(Mandatory)][PSCustomObject]$Estado)

    Mostrar-Seccion -Titulo "Estado de $($Estado.Tipo)"

    $versionBase = $Estado.VersionResuelta.Version
    Write-Host '  Versión base actual : ' -ForegroundColor $COLOR_TENUE -NoNewline
    Write-Host $versionBase.Tag -ForegroundColor $COLOR_TITULO -NoNewline
    Write-Host "  ($($Estado.VersionResuelta.Origen))" -ForegroundColor $COLOR_TENUE

    if ($Estado.VersionResuelta.HayDiferencia) {
        Escribir-Estado -Tipo 'Advertencia' -Mensaje "Tag Git: $($Estado.VersionTag.Tag) vs Archivo: $($Estado.VersionArchivo.Tag). Se sincronizarán."
    }

    $textoArchivo = if ($Estado.ArchivoProyecto) { Split-Path $Estado.ArchivoProyecto -Leaf } else { '(Sin archivo de manifiesto — se etiquetará commit Git)' }
    Write-Host '  Archivo de versión  : ' -ForegroundColor $COLOR_TENUE -NoNewline
    Write-Host $textoArchivo -ForegroundColor $COLOR_TEXTO

    Write-Host '  Rama activa         : ' -ForegroundColor $COLOR_TENUE -NoNewline
    Write-Host $Estado.RamaActual -ForegroundColor $COLOR_ACENTO

    if ($Estado.TieneCommits) {
        $commits = @(Obtener-CommitsDesdeTag -RutaRepositorio $Estado.Ruta -UltimoTag $Estado.VersionTag -TieneCommits $Estado.TieneCommits)
        if (@($commits).Length -gt 0) {
            Write-Host ''
            $desdeTexto = if ($Estado.VersionTag) { "desde $($Estado.VersionTag.Tag)" } else { 'recientes' }
            Write-Host "  Últimos commits ($desdeTexto):" -ForegroundColor $COLOR_ACENTO
            foreach ($commit in $commits) {
                Write-Host "    • $commit" -ForegroundColor $COLOR_TENUE
            }
        }
    }
}

function Pedir-VersionManual {
    param(
        [Parameter(Mandatory)][PSCustomObject]$Estado,
        [Parameter(Mandatory)][PSCustomObject]$VersionBase
    )

    Mostrar-Seccion -Titulo "Ingreso manual de versión — $($Estado.Tipo)"
    Write-Host '  Formato SemVer: MAYOR.MENOR.PARCHE (ej: 0.1.0, 1.0.1, 1.2.0, 2.0.0-rc.1).' -ForegroundColor $COLOR_TENUE
    Write-Host '  Presioná Enter vacío para volver al menú anterior.' -ForegroundColor $COLOR_TENUE
    Write-Host ''

    while ($true) {
        Write-Host '  Nueva versión: ' -ForegroundColor $COLOR_TITULO -NoNewline
        $entrada = Read-Host

        if ([string]::IsNullOrWhiteSpace($entrada)) {
            return $null
        }

        $candidata = Convertir-TextoASemVer -TextoVersion $entrada
        if ($null -eq $candidata) {
            Escribir-Estado -Tipo 'Error' -Mensaje 'Formato inválido. Usá 3 números separados por puntos (ej: 1.0.1).'
            continue
        }

        $chequeoTag = Existe-TagEnRepositorio -RutaRepositorio $Estado.Ruta -NombreTag $candidata.Tag -TieneRemoto $Estado.TieneOrigin
        if ($chequeoTag.Existe) {
            Escribir-Estado -Tipo 'Error' -Mensaje "El tag '$($candidata.Tag)' ya existe en $($chequeoTag.Donde). Elegí otra versión."
            continue
        }

        $comparacion = Comparar-SemVer -VersionA $candidata -VersionB $VersionBase
        if ($comparacion -le 0 -and $VersionBase.Texto -ne $VERSION_INICIAL_DEFECTO) {
            Escribir-Estado -Tipo 'Advertencia' -Mensaje "La versión $($candidata.Tag) es menor o igual a la actual ($($VersionBase.Tag))."
            if (-not (Pedir-Confirmacion -Pregunta '¿Querés usarla igualmente?' -PorDefectoSi $false)) {
                continue
            }
        }

        return $candidata
    }
}

function Seleccionar-NuevaVersion {
    param([Parameter(Mandatory)][PSCustomObject]$Estado)

    $actual = $Estado.VersionResuelta.Version
    $siguientePatch = Calcular-SiguienteVersion -VersionActual $actual -TipoCambio 'Patch'
    $siguienteMinor = Calcular-SiguienteVersion -VersionActual $actual -TipoCambio 'Minor'
    $siguienteMajor = Calcular-SiguienteVersion -VersionActual $actual -TipoCambio 'Major'

    while ($true) {
        $opciones = @(
            @{ Etiqueta = "PATCH  →  $($siguientePatch.Tag)"; Valor = 'Patch';  Detalle = 'Correcciones o ajustes menores (3er número)' }
            @{ Etiqueta = "MINOR  →  $($siguienteMinor.Tag)"; Valor = 'Minor';  Detalle = 'Nueva funcionalidad compatible / avance de fase (2do número)' }
            @{ Etiqueta = "MAJOR  →  $($siguienteMajor.Tag)"; Valor = 'Major';  Detalle = 'Cambio mayor o de contrato (1er número)' }
            @{ Etiqueta = 'MANUAL →  Escribir versión';       Valor = 'Manual'; Detalle = 'Ingreso libre (ej: 0.1.0, 1.0.0-rc.1)' }
            @{ Etiqueta = 'Volver / Cancelar';                Valor = $null;    Detalle = '' }
        )

        $tipo = Mostrar-MenuInteractivo -Titulo "Elegí el incremento para $($Estado.Tipo) (actual: $($actual.Tag))" -Opciones $opciones
        if ($null -eq $tipo) { return $null }

        if ($tipo -eq 'Manual') {
            $manual = Pedir-VersionManual -Estado $Estado -VersionBase $actual
            if ($null -ne $manual) { return $manual }
            continue
        }

        $elegida = switch ($tipo) {
            'Patch' { $siguientePatch }
            'Minor' { $siguienteMinor }
            'Major' { $siguienteMajor }
        }

        $chequeoTag = Existe-TagEnRepositorio -RutaRepositorio $Estado.Ruta -NombreTag $elegida.Tag -TieneRemoto $Estado.TieneOrigin
        if ($chequeoTag.Existe) {
            Escribir-Estado -Tipo 'Error' -Mensaje "El tag '$($elegida.Tag)' ya existe en $($chequeoTag.Donde). Usá otra opción o entrada manual."
            continue
        }

        return $elegida
    }
}

function Pedir-NotasVersion {
    param(
        [Parameter(Mandatory)][string]$NombreProyecto,
        [Parameter(Mandatory)][PSCustomObject]$NuevaVersion
    )

    Mostrar-Seccion -Titulo "Descripción para el tag — $NombreProyecto ($($NuevaVersion.Tag))"
    $defecto = "Lanzamiento de $NombreProyecto $($NuevaVersion.Tag)"
    Write-Host "  Escribí una nota para el tag anotado (Enter para usar: `"$defecto`"):" -ForegroundColor $COLOR_TENUE
    Write-Host '  Nota: ' -ForegroundColor $COLOR_TITULO -NoNewline
    $nota = Read-Host

    if ([string]::IsNullOrWhiteSpace($nota)) {
        return $defecto
    }

    return $nota.Trim()
}

# ==============================================================================
# SECCIÓN 7: APLICACIÓN Y PUBLICACIÓN DE VERSIONADO
# ==============================================================================

function Construir-MensajeTag {
    param(
        [Parameter(Mandatory)][PSCustomObject]$Estado,
        [Parameter(Mandatory)][string]$NotaVersion
    )

    if (-not $Estado.TieneCommits) {
        return $NotaVersion
    }

    $commits = @(Obtener-CommitsDesdeTag -RutaRepositorio $Estado.Ruta -UltimoTag $Estado.VersionTag -TieneCommits $Estado.TieneCommits)
    if (@($commits).Length -eq 0) {
        return $NotaVersion
    }

    $lista = ($commits | ForEach-Object { "- $_" }) -join [Environment]::NewLine
    return "$NotaVersion$([Environment]::NewLine)$([Environment]::NewLine)Cambios incluidos:$([Environment]::NewLine)$lista"
}

function Ejecutar-CommitVersion {
    param(
        [Parameter(Mandatory)][PSCustomObject]$Estado,
        [Parameter(Mandatory)][string]$MensajeCommit,
        [Parameter(Mandatory)][string]$EstrategiaCommit
    )

    if (-not $Estado.TieneCommits) {
        $add = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('add', '-A')
        if (-not $add.Exitoso) { throw "Error en git add inicial: $($add.Texto)" }

        $tieneStaged = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('diff', '--cached', '--name-only')
        if (-not $tieneStaged.Exitoso -or [string]::IsNullOrWhiteSpace($tieneStaged.Texto)) {
            $commitVacio = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('commit', '--allow-empty', '-m', $MensajeCommit)
            if (-not $commitVacio.Exitoso) { throw "Error en git commit inicial vacío: $($commitVacio.Texto)" }
            return $true
        }

        $commitInicial = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('commit', '-m', $MensajeCommit)
        if (-not $commitInicial.Exitoso) { throw "Error en git commit inicial: $($commitInicial.Texto)" }
        return $true
    }

    if ($EstrategiaCommit -eq 'Todos') {
        $add = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('add', '-A')
        if (-not $add.Exitoso) { throw "Error en git add: $($add.Texto)" }

        $sinCambios = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('diff', '--cached', '--quiet')
        if ($sinCambios.Exitoso) {
            return $false
        }

        $commit = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('commit', '-m', $MensajeCommit)
        if (-not $commit.Exitoso) { throw "Error en git commit: $($commit.Texto)" }
        return $true
    }

    if ($null -eq $Estado.ArchivoProyecto) {
        return $false
    }

    $rutaRelativa = $Estado.ArchivoProyecto.Substring($Estado.Ruta.Length).TrimStart('\', '/')
    $estadoArchivo = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('status', '--porcelain', '--', $rutaRelativa)
    if ($estadoArchivo.Exitoso -and [string]::IsNullOrWhiteSpace($estadoArchivo.Texto)) {
        return $false
    }

    $addArchivo = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('add', '--', $rutaRelativa)
    if (-not $addArchivo.Exitoso) { throw "Error en git add de ${rutaRelativa}: $($addArchivo.Texto)" }

    $commitSolo = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('commit', '--only', '-m', $MensajeCommit, '--', $rutaRelativa)
    if (-not $commitSolo.Exitoso) { throw "Error en git commit: $($commitSolo.Texto)" }
    return $true
}

function Publicar-EnGitHub {
    param(
        [Parameter(Mandatory)][PSCustomObject]$Estado,
        [Parameter(Mandatory)][PSCustomObject]$NuevaVersion,
        [Parameter(Mandatory)][string]$MensajeTag
    )

    Escribir-Estado -Tipo 'Info' -Mensaje "[$($Estado.Tipo)] Subiendo rama '$($Estado.RamaActual)' a GitHub..."
    $pushRama = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('push', '-u', 'origin', $Estado.RamaActual)
    if (-not $pushRama.Exitoso) {
        Escribir-Estado -Tipo 'Error' -Mensaje "[$($Estado.Tipo)] Falló git push: $($pushRama.Texto)"
        Escribir-Estado -Tipo 'Info' -Mensaje "Reintentá con: git -C `"$($Estado.Ruta)`" push -u origin $($Estado.RamaActual)"
        return
    }
    Escribir-Estado -Tipo 'Exito' -Mensaje "[$($Estado.Tipo)] Rama '$($Estado.RamaActual)' subida."

    Escribir-Estado -Tipo 'Info' -Mensaje "[$($Estado.Tipo)] Subiendo tag '$($NuevaVersion.Tag)'..."
    $pushTag = Ejecutar-ComandoGit -RutaRepositorio $Estado.Ruta -Argumentos @('push', 'origin', "refs/tags/$($NuevaVersion.Tag)")
    if (-not $pushTag.Exitoso) {
        Escribir-Estado -Tipo 'Error' -Mensaje "[$($Estado.Tipo)] Falló push del tag: $($pushTag.Texto)"
        Escribir-Estado -Tipo 'Info' -Mensaje "Reintentá con: git -C `"$($Estado.Ruta)`" push origin refs/tags/$($NuevaVersion.Tag)"
        return
    }
    Escribir-Estado -Tipo 'Exito' -Mensaje "[$($Estado.Tipo)] Tag '$($NuevaVersion.Tag)' publicado en GitHub."

    $urlRelease = Construir-UrlReleaseGitHub -UrlRemoto $Estado.UrlOrigin -Tag $NuevaVersion.Tag
    if ($urlRelease) {
        Write-Host "      Release: $urlRelease" -ForegroundColor $COLOR_ACENTO
    }
}

function Aplicar-VersionadoIndividual {
    param(
        [Parameter(Mandatory)][PSCustomObject]$Plan,
        [switch]$ModoSimulacion
    )

    $estado = $Plan.Estado
    $nuevaVersion = $Plan.NuevaVersion
    $notaVersion = $Plan.NotaVersion
    $estrategiaCommit = $Plan.EstrategiaCommit
    $subirAGitHub = $Plan.SubirAGitHub

    $mensajeCommit = "chore(release): actualizar versión a $($nuevaVersion.Tag)"
    $mensajeTag = Construir-MensajeTag -Estado $estado -NotaVersion $notaVersion

    if ($ModoSimulacion) {
        Mostrar-Seccion -Titulo "Resultado de simulación — $($estado.Tipo)"
        if ($estado.ArchivoProyecto) {
            $null = Actualizar-VersionArchivoProyecto -TipoProyecto $estado.Tipo -RutaArchivo $estado.ArchivoProyecto -NuevaVersion $nuevaVersion.Texto -ModoSimulacion
            Escribir-Estado -Tipo 'Exito' -Mensaje "[Simulación] $(Split-Path $estado.ArchivoProyecto -Leaf) se actualizaría a $($nuevaVersion.Texto)"
        }
        Escribir-Estado -Tipo 'Exito' -Mensaje "[Simulación] Commit: $mensajeCommit"
        Escribir-Estado -Tipo 'Exito' -Mensaje "[Simulación] Tag anotado: $($nuevaVersion.Tag)"
        if ($subirAGitHub) {
            Escribir-Estado -Tipo 'Exito' -Mensaje "[Simulación] Push a origin ($($estado.RamaActual) + tag $($nuevaVersion.Tag))"
        }
        return $true
    }

    Mostrar-Seccion -Titulo "Aplicando versión en $($estado.Tipo)"

    try {
        if ($estado.ArchivoProyecto) {
            $null = Actualizar-VersionArchivoProyecto -TipoProyecto $estado.Tipo -RutaArchivo $estado.ArchivoProyecto -NuevaVersion $nuevaVersion.Texto
            Escribir-Estado -Tipo 'Exito' -Mensaje "Archivo actualizado: $(Split-Path $estado.ArchivoProyecto -Leaf) → $($nuevaVersion.Texto)"
        }

        $commitCreado = Ejecutar-CommitVersion -Estado $estado -MensajeCommit $mensajeCommit -EstrategiaCommit $estrategiaCommit
        if ($commitCreado) {
            Escribir-Estado -Tipo 'Exito' -Mensaje "Commit creado: $mensajeCommit"
        }
        else {
            Escribir-Estado -Tipo 'Info' -Mensaje 'No había cambios nuevos para commitear; se etiquetará el commit actual.'
        }

        $crearTag = Ejecutar-ComandoGit -RutaRepositorio $estado.Ruta -Argumentos @('tag', '-a', $nuevaVersion.Tag, '-m', $mensajeTag)
        if (-not $crearTag.Exitoso) {
            throw "Error al crear tag $($nuevaVersion.Tag): $($crearTag.Texto)"
        }
        Escribir-Estado -Tipo 'Exito' -Mensaje "Tag anotado creado: $($nuevaVersion.Tag)"

        if ($subirAGitHub -and $estado.TieneOrigin) {
            Publicar-EnGitHub -Estado $estado -NuevaVersion $nuevaVersion -MensajeTag $mensajeTag
        }
        elseif (-not $estado.TieneOrigin) {
            Escribir-Estado -Tipo 'Info' -Mensaje 'Sin remoto origin. Para subirlo manualmente: git push -u origin <rama> --follow-tags'
        }

        Escribir-Estado -Tipo 'Exito' -Mensaje "¡$($estado.Tipo) actualizado con éxito a $($nuevaVersion.Tag)!"
        return $true
    }
    catch {
        Escribir-Estado -Tipo 'Error' -Mensaje "Error en $($estado.Tipo): $($_.Exception.Message)"
        return $false
    }
}

# ==============================================================================
# SECCIÓN 8: FLUJOS DE OPERACIÓN (INDIVIDUAL Y AMBOS)
# ==============================================================================

function Preparar-PlanRepositorio {
    param(
        [Parameter(Mandatory)][PSCustomObject]$Estado,
        [switch]$ModoSimulacion,
        [bool]$PreguntarFetch = $true,
        [PSCustomObject]$VersionSugerida = $null,
        [string]$NotaSugerida = ''
    )

    $eval = Evaluar-CondicionesPrevias -Estado $Estado -ModoSimulacion:$ModoSimulacion -PreguntarFetch:$PreguntarFetch
    if ($null -eq $eval) { return $null }

    Mostrar-PanelVersionActual -Estado $eval.Estado

    $nuevaVersion = $null
    if ($null -ne $VersionSugerida) {
        $chequeo = Existe-TagEnRepositorio -RutaRepositorio $eval.Estado.Ruta -NombreTag $VersionSugerida.Tag -TieneRemoto $eval.Estado.TieneOrigin
        if (-not $chequeo.Existe) {
            $usarMisma = Pedir-Confirmacion -Pregunta "[$($Estado.Tipo)] ¿Aplicar la misma versión $($VersionSugerida.Tag)?" -PorDefectoSi $true
            if ($usarMisma) {
                $nuevaVersion = $VersionSugerida
            }
        }
    }

    if ($null -eq $nuevaVersion) {
        $nuevaVersion = Seleccionar-NuevaVersion -Estado $eval.Estado
        if ($null -eq $nuevaVersion) { return $null }
    }

    $nota = if (-not [string]::IsNullOrWhiteSpace($NotaSugerida)) {
        Pedir-NotasVersion -NombreProyecto $Estado.Tipo -NuevaVersion $nuevaVersion
    } else {
        Pedir-NotasVersion -NombreProyecto $Estado.Tipo -NuevaVersion $nuevaVersion
    }

    $subir = $false
    if ($eval.Estado.TieneOrigin) {
        Write-Host ''
        $subir = Pedir-Confirmacion -Pregunta "[$($Estado.Tipo)] ¿Subir rama y tag $($nuevaVersion.Tag) a GitHub automáticamente?" -PorDefectoSi $true
    }

    return [PSCustomObject]@{
        Estado           = $eval.Estado
        NuevaVersion     = $nuevaVersion
        NotaVersion      = $nota
        EstrategiaCommit = $eval.EstrategiaCommit
        SubirAGitHub     = $subir
    }
}

function Mostrar-ResumenPlanes {
    param(
        [Parameter(Mandatory)][array]$Planes,
        [switch]$ModoSimulacion
    )

    Mostrar-Seccion -Titulo 'Resumen general antes de aplicar'
    $borde = '  ┌──────────────────────────────────────────────────────────────────┐'
    $pie   = '  └──────────────────────────────────────────────────────────────────┘'

    Write-Host $borde -ForegroundColor $COLOR_ACENTO
    foreach ($plan in $Planes) {
        $est = $plan.Estado
        $arch = if ($est.ArchivoProyecto) { Split-Path $est.ArchivoProyecto -Leaf } else { '(sin archivo)' }
        $push = if ($plan.SubirAGitHub) { "SÍ (origin/$($est.RamaActual))" } else { 'NO (local)' }

        Write-Host "    [$($est.Tipo)]" -ForegroundColor $COLOR_TITULO
        Write-Host "      Versión        : $($est.VersionResuelta.Version.Tag) → " -ForegroundColor $COLOR_TENUE -NoNewline
        Write-Host $plan.NuevaVersion.Tag -ForegroundColor $COLOR_EXITO
        Write-Host "      Rama           : $($est.RamaActual)" -ForegroundColor $COLOR_TEXTO
        Write-Host "      Archivo        : $arch" -ForegroundColor $COLOR_TEXTO
        Write-Host "      Alcance commit : $($plan.EstrategiaCommit)" -ForegroundColor $COLOR_TEXTO
        Write-Host "      Subir a GitHub : $push" -ForegroundColor $(if ($plan.SubirAGitHub) { $COLOR_EXITO } else { $COLOR_ADVERTENCIA })
        Write-Host "      Nota tag       : $($plan.NotaVersion)" -ForegroundColor $COLOR_TENUE
        Write-Host ''
    }
    if ($ModoSimulacion) {
        Write-Host '    Modo             : SIMULACIÓN (sin escritura)' -ForegroundColor Magenta
    }
    Write-Host $pie -ForegroundColor $COLOR_ACENTO
    Write-Host ''
}

function Iniciar-AsistenteVersionado {
    param([switch]$ModoSimulacion)

    Configurar-ConsolaUtf8
    $rutaRaiz = $PSScriptRoot

    if (-not (Verificar-GitInstalado)) {
        Mostrar-Banner -ModoSimulacion:$ModoSimulacion
        Escribir-Estado -Tipo 'Error' -Mensaje 'Git no está instalado o no se encuentra en el PATH del sistema.'
        return
    }

    while ($true) {
        Mostrar-Banner -ModoSimulacion:$ModoSimulacion

        $estadoWebSite = Obtener-EstadoRepositorio -TipoProyecto 'WebSite' -RutaRaiz $rutaRaiz
        $estadoFront   = Obtener-EstadoRepositorio -TipoProyecto 'Frontend' -RutaRaiz $rutaRaiz
        $estadoBack    = Obtener-EstadoRepositorio -TipoProyecto 'Backend' -RutaRaiz $rutaRaiz

        $detalleWebSite = Formatear-DetalleRepositorioMenu -Estado $estadoWebSite
        $detalleFront   = Formatear-DetalleRepositorioMenu -Estado $estadoFront
        $detalleBack    = Formatear-DetalleRepositorioMenu -Estado $estadoBack

        $opcionesRepo = @(
            @{ Etiqueta = 'Todos los proyectos activos (WebSite + Frontend + Backend)'; Valor = 'Todos';   Detalle = 'Sincronizar proyectos activos en un solo paso' }
            @{ Etiqueta = 'WebSite   (Portafolio Personal Next.js)';                   Valor = 'WebSite'; Detalle = $detalleWebSite }
            @{ Etiqueta = 'Frontend  (Front de la API Next.js)';                       Valor = 'Frontend';Detalle = $detalleFront }
            @{ Etiqueta = 'Backend   (API REST .NET 9)';                               Valor = 'Backend'; Detalle = $detalleBack }
            @{ Etiqueta = 'Salir';                                                     Valor = $null;     Detalle = '' }
        )

        $elegido = Mostrar-MenuInteractivo -Titulo '¿Qué repositorio deseás versionar?' -Opciones $opcionesRepo
        if ($null -eq $elegido) {
            Write-Host ''
            Escribir-Estado -Tipo 'Info' -Mensaje 'Hasta luego.'
            Write-Host ''
            return
        }

        $planesAEjecutar = @()

        if ($elegido -eq 'Todos') {
            Mostrar-Seccion -Titulo 'Configurando versionado conjunto de proyectos activos'

            $reposActivos = @()
            if ($estadoWebSite.EsRepoGit) { $reposActivos += $estadoWebSite }
            if ($estadoFront.EsRepoGit)   { $reposActivos += $estadoFront }
            if ($estadoBack.EsRepoGit)    { $reposActivos += $estadoBack }

            if ($reposActivos.Count -eq 0) {
                Escribir-Estado -Tipo 'Advertencia' -Mensaje 'No se encontraron repositorios Git activos en WebSite, Frontend o Backend.'
                continue
            }

            $versionSugerida = $null
            $notaSugerida = $null

            foreach ($repo in $reposActivos) {
                $plan = Preparar-PlanRepositorio `
                    -Estado $repo `
                    -ModoSimulacion:$ModoSimulacion `
                    -VersionSugerida $versionSugerida `
                    -NotaSugerida $notaSugerida

                if ($null -eq $plan) {
                    Escribir-Estado -Tipo 'Advertencia' -Mensaje "Operación cancelada en $($repo.Tipo)."
                    $planesAEjecutar = @()
                    break
                }

                if ($null -eq $versionSugerida) {
                    $versionSugerida = $plan.NuevaVersion
                    $notaSugerida = $plan.NotaVersion
                }

                $planesAEjecutar += $plan
            }

            if ($planesAEjecutar.Count -eq 0) {
                continue
            }
        }
        else {
            $estadoSeleccionado = switch ($elegido) {
                'WebSite'  { $estadoWebSite }
                'Frontend' { $estadoFront }
                'Backend'  { $estadoBack }
            }
            $planUnico = Preparar-PlanRepositorio -Estado $estadoSeleccionado -ModoSimulacion:$ModoSimulacion
            if ($null -eq $planUnico) {
                continue
            }
            $planesAEjecutar = @($planUnico)
        }

        Mostrar-ResumenPlanes -Planes $planesAEjecutar -ModoSimulacion:$ModoSimulacion

        if (Pedir-Confirmacion -Pregunta '¿Confirmás ejecutar la actualización con estos datos?' -PorDefectoSi $true) {
            foreach ($plan in $planesAEjecutar) {
                $null = Aplicar-VersionadoIndividual -Plan $plan -ModoSimulacion:$ModoSimulacion
            }
        }
        else {
            Escribir-Estado -Tipo 'Advertencia' -Mensaje 'Operación cancelada. No se modificó nada.'
        }

        Write-Host ''
        if (-not (Pedir-Confirmacion -Pregunta '¿Deseás realizar otra operación de versionado?' -PorDefectoSi $false)) {
            Write-Host ''
            Escribir-Estado -Tipo 'Info' -Mensaje 'Hasta luego.'
            Write-Host ''
            return
        }
    }
}

if (-not $SoloCargarFunciones) {
    Iniciar-AsistenteVersionado -ModoSimulacion:$Simular
}
