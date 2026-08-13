Add-Type -AssemblyName System.Drawing
function Crop-Auto ($inPath, $outPath) {
    if (-not (Test-Path $inPath)) { Write-Output "File not found: $inPath"; return }
    $img = [System.Drawing.Bitmap]::FromFile($inPath)
    $minX = $img.Width; $minY = $img.Height; $maxX = 0; $maxY = 0

    for ($y = 0; $y -lt $img.Height; $y += 5) {
        for ($x = 0; $x -lt $img.Width; $x += 5) {
            $pixel = $img.GetPixel($x, $y)
            if ($pixel.R -lt 240 -or $pixel.G -lt 240 -or $pixel.B -lt 240) {
                if ($x -lt $minX) { $minX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    
    $w = $maxX - $minX
    $h = $maxY - $minY
    $size = [math]::Max($w, $h) + 100
    $centerX = $minX + ($w / 2)
    $centerY = $minY + ($h / 2)
    
    $x = [math]::Max(0, $centerX - ($size / 2))
    $y = [math]::Max(0, $centerY - ($size / 2))
    
    if ($x + $size -gt $img.Width) { $size = $img.Width - $x }
    if ($y + $size -gt $img.Height) { $size = $img.Height - $y }
    
    $intX = [int]$x
    $intY = [int]$y
    $intSize = [int]$size

    $rect = New-Object System.Drawing.Rectangle $intX, $intY, $intSize, $intSize
    $bmp = New-Object System.Drawing.Bitmap $intSize, $intSize
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $destRect = New-Object System.Drawing.Rectangle 0, 0, $intSize, $intSize
    $g.DrawImage($img, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $img.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Output "Cropped to $intSize x $intSize"
}

Crop-Auto "C:\VS Code\aarohana\assets\images\logo\logo.jpeg" "C:\VS Code\aarohana\assets\images\logo\logo_tmp.jpeg"
Crop-Auto "C:\VS Code\aarohana\assets\images\logo\favicon.jpeg" "C:\VS Code\aarohana\assets\images\logo\favicon_tmp.jpeg"
Move-Item -Path "C:\VS Code\aarohana\assets\images\logo\logo_tmp.jpeg" -Destination "C:\VS Code\aarohana\assets\images\logo\logo.jpeg" -Force
Move-Item -Path "C:\VS Code\aarohana\assets\images\logo\favicon_tmp.jpeg" -Destination "C:\VS Code\aarohana\assets\images\logo\favicon.jpeg" -Force
