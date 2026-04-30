$files = Get-ChildItem "content\hub\ko\*.mdx"
foreach ($f in $files) {
    $raw = Get-Content $f.FullName -Raw -Encoding UTF8
    $parts = $raw -split '---', 3
    if ($parts.Count -lt 3) { continue }
    $body = $parts[2]
    # Remove H2 lines, bullet lines, image lines, HTML/JSX blocks, blank lines
    $lines = $body -split "`n"
    $clean = $lines | Where-Object {
        $_ -notmatch '^\s*##' -and
        $_ -notmatch '^\s*-\s' -and
        $_ -notmatch '^\s*!\[' -and
        $_ -notmatch '^\s*<' -and
        $_ -notmatch '^\s*$'
    }
    $text = ($clean -join '') -replace '\s+', ''
    $charCount = $text.Length
    Write-Output "$charCount`t$($f.Name)"
}
