param()

# Start local ChromaDB with Docker Compose
Set-Location -Path (Join-Path $PSScriptRoot "..")
docker compose up -d chromadb
if ($LASTEXITCODE -eq 0) {
  Write-Host "ChromaDB container started (port 8000)."
} else {
  Write-Host "Failed to start ChromaDB container. Ensure Docker is running." -ForegroundColor Red
}
