# Script de verificação das variáveis de ambiente
Write-Host "=== Verificação das Variáveis de Ambiente ===" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
    Write-Host ""
    
    $content = Get-Content $envFile -Raw
    
    # Verificar cada variável
    $vars = @(
        @{Name="VITE_SUPABASE_URL"; Required=$true},
        @{Name="VITE_SUPABASE_PUBLISHABLE_KEY"; Required=$true},
        @{Name="VITE_SITE_URL"; Required=$true},
        @{Name="VITE_GEMINI_API_KEY"; Required=$false}
    )
    
    foreach ($var in $vars) {
        if ($content -match "$($var.Name)=(.+)") {
            $value = $matches[1].Trim()
            if ($value -and $value -ne "sua_chave_aqui" -and $value -ne "sua_chave_anon_aqui") {
                Write-Host "✅ $($var.Name): Configurada" -ForegroundColor Green
            } else {
                Write-Host "⚠️  $($var.Name): Não configurada ou valor padrão" -ForegroundColor Yellow
            }
        } else {
            if ($var.Required) {
                Write-Host "❌ $($var.Name): Não encontrada (OBRIGATÓRIA)" -ForegroundColor Red
            } else {
                Write-Host "⚠️  $($var.Name): Não encontrada (opcional)" -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host ""
    Write-Host "=== Instruções ===" -ForegroundColor Cyan
    Write-Host "1. Se alguma variável estiver faltando, edite o arquivo .env" -ForegroundColor White
    Write-Host "2. REINICIE o servidor de desenvolvimento (Ctrl+C e depois 'npm run dev')" -ForegroundColor Yellow
    Write-Host "3. O Vite só carrega variáveis do .env quando o servidor é iniciado" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Crie o arquivo .env na raiz do projeto com as variáveis necessárias." -ForegroundColor Yellow
}

