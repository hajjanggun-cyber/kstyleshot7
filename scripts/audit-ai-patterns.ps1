# Check AI patterns across all KO files
$files = Get-ChildItem "content\hub\ko\*.mdx"

Write-Output "=== '~pyeoni' pattern count (>= 3) ==="
foreach ($f in $files) {
    $raw = Get-Content $f.FullName -Raw -Encoding UTF8
    $matches = [regex]::Matches($raw, [regex]::Escape("`uD3B8`uC774") + "\s")
    if ($matches.Count -ge 3) {
        Write-Output "$($matches.Count)`t$($f.Name)"
    }
}

Write-Output ""
Write-Output "=== H2 ending with question marks ==="
foreach ($f in $files) {
    $lines = Get-Content $f.FullName -Encoding UTF8
    $h2lines = $lines | Where-Object { $_ -match '^\s*##\s' }
    $total = $h2lines.Count
    $questionH2 = ($h2lines | Where-Object { $_ -match '[?`uAE4C`uC77C`uAC00]$' }).Count
    if ($total -gt 0 -and $questionH2 -ge [math]::Ceiling($total / 2)) {
        Write-Output "$questionH2/$total`t$($f.Name)"
    }
}

Write-Output ""
Write-Output "=== Files with 'gyeong-u-ga manta' (4+) ==="
foreach ($f in $files) {
    $raw = Get-Content $f.FullName -Raw -Encoding UTF8
    $m = [regex]::Matches($raw, "`uACBD`uC6B0`uAC00\s`uB9CE")
    if ($m.Count -ge 4) {
        Write-Output "$($m.Count)`t$($f.Name)"
    }
}
