# ⚠️ IMPORTANTE: Reinicie o Servidor

## Problema
A API Key do Gemini está configurada no arquivo `.env`, mas o servidor de desenvolvimento precisa ser **REINICIADO** para carregar as novas variáveis de ambiente.

## Solução

### 1. Pare o servidor atual
- No terminal onde o `npm run dev` está rodando, pressione: **Ctrl + C**

### 2. Reinicie o servidor
```bash
npm run dev
```

### 3. Verifique
- Acesse: `http://localhost:5173/admin/blog`
- O alerta sobre API Key não configurada deve desaparecer
- Você poderá criar posts automaticamente

## Por que isso é necessário?

O Vite (servidor de desenvolvimento) só carrega as variáveis do arquivo `.env` quando o servidor é **iniciado**. Se você adicionar ou modificar variáveis no `.env` enquanto o servidor está rodando, elas não serão carregadas automaticamente.

## Verificação Rápida

Execute este comando para verificar se a chave está no arquivo:
```bash
Get-Content .env | Select-String "GEMINI"
```

Deve mostrar:
```
VITE_GEMINI_API_KEY=AIzaSyDxtqMoWu7HpLdsUiYIytffFk91_Rz7QVQ
```

Se mostrar isso, a chave está configurada corretamente. Apenas reinicie o servidor!

