# Configuração de Variáveis de Ambiente

## Arquivo .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xphtkyghdsozrqyfpaij.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_IQGYtezseZP8zbAzKq0JSw_vKnZoDMQ

# Site Configuration
VITE_SITE_URL=https://www.pechintech.com.br

# Google Gemini API (para geração de conteúdo de blog)
VITE_GEMINI_API_KEY=AIzaSyDxtqMoWu7HpLdsUiYIytffFk91_Rz7QVQ
```

## Como obter as chaves

### Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione o projeto: `xphtkyghdsozrqyfpaij`
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL**: `https://xphtkyghdsozrqyfpaij.supabase.co`
   - **anon/public key**: Cole no `VITE_SUPABASE_PUBLISHABLE_KEY`

### Google Gemini API

1. Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key" ou "Get API Key"
4. Copie a chave e cole no `VITE_GEMINI_API_KEY`

**Importante sobre variáveis de ambiente:**
- **Frontend (Vite/React)**: Use `VITE_GEMINI_API_KEY` (com prefixo `VITE_`)
  - O Vite só expõe variáveis que começam com `VITE_` para o código do navegador
  - Esta é a forma correta para aplicações frontend
  
- **Backend (Node.js)**: Use `GEMINI_API_KEY` (sem prefixo)
  - A documentação oficial do Google menciona `GEMINI_API_KEY` para uso no backend
  - No frontend, isso não funcionará porque o Vite não expõe variáveis sem `VITE_`

**Nota:** A chave API do Gemini é necessária apenas para a funcionalidade de geração automática de posts de blog. Se você não usar essa funcionalidade, pode deixar essa variável vazia.

## Importante

- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ✅ O arquivo `.env` já está no `.gitignore`
- ✅ Use `.env.example` como referência
- 🔄 Após criar/editar `.env`, reinicie o servidor de desenvolvimento

## Verificação

Após configurar, o console do navegador deve mostrar:
```
✅ Cliente Supabase inicializado: { url: '...', hasKey: true, keyLength: ... }
✅ URL do Supabase corresponde ao project_id configurado
✅ Conexão com Supabase verificada com sucesso
```

