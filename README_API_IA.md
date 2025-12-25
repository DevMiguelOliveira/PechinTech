# Integração Segura de IA - PechinTech

## 📋 Arquitetura

Este projeto implementa uma integração segura com Google Gemini API seguindo as melhores práticas de segurança:

```
Frontend (Vite + React)
    ↓
    POST /api/gerar-post
    ↓
Backend Serverless (Vercel)
    ↓
Google Gemini API
```

**⚠️ IMPORTANTE:** A chave da API nunca é exposta no frontend. Ela existe apenas no backend (variável de ambiente `GEMINI_API_KEY`).

## 🏗️ Estrutura de Arquivos

```
/
├── api/
│   └── gerar-post.js          # API Serverless (Vercel)
├── src/
│   ├── components/
│   │   └── GeradorIA.tsx     # Componente React para gerar posts
│   ├── services/
│   │   └── api.ts            # Serviço frontend (chama apenas /api/gerar-post)
│   └── pages/admin/
│       └── BlogPosts.tsx     # Página admin (usa GeradorIA)
├── vercel.json                # Configuração Vercel
└── .env                       # Variáveis de ambiente (NÃO commitado)
```

## 🔐 Variáveis de Ambiente

### Backend (Vercel)

Configure no painel da Vercel ou no arquivo `.env` local:

```env
GEMINI_API_KEY=AIzaSyDxtqMoWu7HpLdsUiYIytffFk91_Rz7QVQ
```

**⚠️ NUNCA** adicione esta chave no frontend ou em arquivos commitados.

### Frontend (Opcional)

```env
VITE_API_URL=/api
```

Por padrão, o frontend usa `/api` (endpoint relativo).

## 🚀 Como Usar

### 1. Desenvolvimento Local

#### Backend (API Serverless)

Para testar a API localmente, você pode usar o Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Ou usar um servidor Node.js simples para desenvolvimento.

#### Frontend

```bash
npm run dev
```

O Vite está configurado para fazer proxy de `/api` para o servidor de desenvolvimento.

### 2. Deploy na Vercel

1. **Configure a variável de ambiente:**
   - Acesse o painel da Vercel
   - Vá em Settings > Environment Variables
   - Adicione: `GEMINI_API_KEY` = `AIzaSyDxtqMoWu7HpLdsUiYIytffFk91_Rz7QVQ`

2. **Faça o deploy:**
   ```bash
   vercel
   ```

3. **A API serverless estará disponível em:**
   - `https://seu-projeto.vercel.app/api/gerar-post`

## 📝 Endpoint da API

### POST `/api/gerar-post`

**Request:**
```json
{
  "tema": "Como escolher a melhor placa de vídeo para gaming",
  "descricao": "Guia completo sobre placas de vídeo...",
  "palavrasChave": ["GPU", "gaming", "NVIDIA", "AMD"]
}
```

**Response (Sucesso):**
```json
{
  "content": "# Como escolher a melhor placa de vídeo...\n\n..."
}
```

**Response (Erro):**
```json
{
  "error": "Mensagem de erro descritiva"
}
```

## 🎯 Componente GeradorIA

O componente `GeradorIA.tsx` fornece uma interface amigável para gerar conteúdo:

```tsx
<GeradorIA
  initialTema="Tema inicial (opcional)"
  onContentGenerated={(content) => {
    // Callback quando o conteúdo é gerado
    console.log(content);
  }}
/>
```

## ✅ Boas Práticas Implementadas

- ✅ Chave da API apenas no backend
- ✅ Frontend nunca chama APIs externas diretamente
- ✅ Validação de entrada no backend
- ✅ Tratamento de erros adequado
- ✅ Código limpo e comentado
- ✅ Separação de responsabilidades
- ✅ Aviso sobre revisão humana do conteúdo

## 🔒 Segurança

1. **Chave da API protegida:**
   - Existe apenas em `process.env.GEMINI_API_KEY` (backend)
   - Nunca é enviada ao frontend
   - Nunca aparece em logs públicos

2. **Validação de entrada:**
   - Tema: 5-200 caracteres
   - Método HTTP: apenas POST
   - Tipos de dados validados

3. **Tratamento de erros:**
   - Erros não expõem detalhes sensíveis
   - Mensagens de erro amigáveis ao usuário
   - Logs detalhados apenas no backend

## 📚 Documentação Adicional

- [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)

