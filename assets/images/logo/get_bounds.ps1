Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("C:\VS Code\aarohana\assets\images\logo\logo.jpeg")
$minX = $img.Width
$minY = $img.Height
$maxX = 0
$maxY = 0

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
Write-Output "Bounds: $minX, $minY, $maxX, $maxY | Size: $($img.Width)x$($img.Height)"
$img.Dispose()
