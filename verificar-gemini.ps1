# Script de verificação da API Key do Google Gemini
Write-Host "=== Verificação da API Key do Google Gemini ===" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
    Write-Host ""
    
    $content = Get-Content $envFile -Raw -Encoding UTF8
    
    # Verificar se a API Key está configurada
    if ($content -match "VITE_GEMINI_API_KEY=(.+)") {
        $apiKey = $matches[1].Trim()
        
        if ($apiKey -and $apiKey.Length -gt 10 -and $apiKey -ne "sua_chave_aqui") {
            Write-Host "✅ API Key configurada:" -ForegroundColor Green
            Write-Host "   $($apiKey.Substring(0, 10))..." -ForegroundColor Gray
            Write-Host "   Tamanho: $($apiKey.Length) caracteres" -ForegroundColor Gray
            Write-Host ""
            Write-Host "✅ A API Key está corretamente configurada no arquivo .env" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
            Write-Host "   Para que a API Key seja carregada, você precisa:" -ForegroundColor White
            Write-Host "   1. Parar o servidor de desenvolvimento (Ctrl+C)" -ForegroundColor White
            Write-Host "   2. Reiniciar o servidor: npm run dev" -ForegroundColor White
            Write-Host ""
            Write-Host "   O Vite só carrega variáveis de ambiente quando o servidor é iniciado." -ForegroundColor Gray
        } else {
            Write-Host "⚠️  API Key encontrada mas parece estar vazia ou com valor padrão" -ForegroundColor Yellow
            Write-Host "   Valor atual: $apiKey" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ API Key não encontrada no arquivo .env" -ForegroundColor Red
        Write-Host ""
        Write-Host "Adicione a seguinte linha no arquivo .env:" -ForegroundColor White
        Write-Host "VITE_GEMINI_API_KEY=AIzaSyDxtqMoWu7HpLdsUiYIytffFk91_Rz7QVQ" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Crie o arquivo .env na raiz do projeto com:" -ForegroundColor White
    Write-Host "VITE_GEMINI_API_KEY=AIzaSyDxtqMoWu7HpLdsUiYIytffFk91_Rz7QVQ" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Verificação Concluída ===" -ForegroundColor Cyan

