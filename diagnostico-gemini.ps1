# Script de diagnóstico da API Key do Google Gemini
Write-Host "=== Diagnóstico da API Key do Google Gemini ===" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"
$apiKeyValue = "AIzaSyDxtqMoWu7HpLdsUiYIytffFk91_Rz7QVQ"

# Verificar arquivo .env
Write-Host "1. Verificando arquivo .env..." -ForegroundColor Yellow
if (Test-Path $envFile) {
    Write-Host "   ✅ Arquivo .env encontrado" -ForegroundColor Green
    
    $content = Get-Content $envFile -Raw -Encoding UTF8
    
    if ($content -match "VITE_GEMINI_API_KEY=(.+)") {
        $foundKey = $matches[1].Trim()
        
        if ($foundKey -eq $apiKeyValue) {
            Write-Host "   ✅ API Key encontrada e correta" -ForegroundColor Green
            Write-Host "   Chave: $($foundKey.Substring(0, 10))...$($foundKey.Substring($foundKey.Length - 4))" -ForegroundColor Gray
        } else {
            Write-Host "   ⚠️  API Key encontrada mas com valor diferente" -ForegroundColor Yellow
            Write-Host "   Valor encontrado: $($foundKey.Substring(0, 10))..." -ForegroundColor Gray
            Write-Host "   Valor esperado: $($apiKeyValue.Substring(0, 10))..." -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ Variável VITE_GEMINI_API_KEY não encontrada no .env" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Arquivo .env não encontrado!" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Verificando processo do servidor..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ⚠️  Processos Node.js encontrados. Certifique-se de reiniciar o servidor." -ForegroundColor Yellow
    Write-Host "   Para reiniciar:" -ForegroundColor White
    Write-Host "   1. Pare o servidor (Ctrl+C no terminal)" -ForegroundColor Gray
    Write-Host "   2. Execute: npm run dev" -ForegroundColor Gray
} else {
    Write-Host "   ✅ Nenhum processo Node.js em execução" -ForegroundColor Green
}

Write-Host ""
Write-Host "3. Instruções para resolver:" -ForegroundColor Yellow
Write-Host "   a) Certifique-se de que o arquivo .env contém:" -ForegroundColor White
Write-Host "      VITE_GEMINI_API_KEY=$apiKeyValue" -ForegroundColor Gray
Write-Host ""
Write-Host "   b) Pare o servidor de desenvolvimento (Ctrl+C)" -ForegroundColor White
Write-Host ""
Write-Host "   c) Reinicie o servidor:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   d) Limpe o cache do navegador:" -ForegroundColor White
Write-Host "      - Pressione Ctrl+Shift+R (Windows/Linux)" -ForegroundColor Gray
Write-Host "      - Ou Ctrl+Shift+Delete e limpe o cache" -ForegroundColor Gray
Write-Host ""
Write-Host "   e) Verifique o console do navegador (F12) para logs detalhados" -ForegroundColor White
Write-Host ""

Write-Host "=== Diagnóstico Concluído ===" -ForegroundColor Cyan

