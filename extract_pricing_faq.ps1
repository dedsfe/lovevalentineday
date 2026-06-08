$html = Get-Content -Raw -Path "C:\Users\dedsf\.gemini\antigravity\brain\4e71bcf4-73a9-4d71-a13b-e8d326709724\.system_generated\steps\34\content.md"
$idx = $html.IndexOf("Escolha o plano")
if ($idx -ne -1) {
    Write-Host $html.Substring($idx, 15000)
} else {
    Write-Host "Not found"
}
