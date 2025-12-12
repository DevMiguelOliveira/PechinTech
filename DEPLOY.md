# Guia de Deploy - PechinTech

Este guia contém instruções para fazer deploy do projeto PechinTech em diferentes plataformas.

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

1. ✅ Variáveis de ambiente configuradas:
   - `VITE_SUPABASE_URL` - URL do seu projeto Supabase
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Chave pública (anon key) do Supabase

2. ✅ Build funcionando localmente:
   ```bash
   npm run build
   ```

---

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

**Por que Vercel:**
- ✅ Deploy automático via Git
- ✅ SSL automático
- ✅ CDN global
- ✅ Preview deployments
- ✅ Suporte nativo a Vite/React

**Passos:**

1. **Instale a CLI da Vercel (opcional):**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Configure o projeto:**
   ```bash
   vercel
   ```

4. **Configure variáveis de ambiente no dashboard:**
   - Acesse https://vercel.com/dashboard
   - Vá em Settings > Environment Variables
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

5. **Deploy de produção:**
   ```bash
   vercel --prod
   ```

**Ou via GitHub:**
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

**Configuração:** Já incluída (`vercel.json`)

---

### 2. Netlify

**Por que Netlify:**
- ✅ Deploy automático via Git
- ✅ SSL automático
- ✅ CDN global
- ✅ Formulários serverless
- ✅ Edge Functions

**Passos:**

1. **Instale a CLI da Netlify:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Faça login:**
   ```bash
   netlify login
   ```

3. **Inicialize o projeto:**
   ```bash
   netlify init
   ```

4. **Configure variáveis de ambiente:**
   ```bash
   netlify env:set VITE_SUPABASE_URL "sua-url"
   netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "sua-chave"
   ```

5. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

**Ou via GitHub:**
1. Conecte seu repositório no Netlify
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

**Configuração:** Já incluída (`netlify.toml`)

---

### 3. Cloudflare Pages

**Por que Cloudflare Pages:**
- ✅ Deploy rápido e gratuito
- ✅ CDN global
- ✅ SSL automático
- ✅ Workers integration

**Passos:**

1. **Via GitHub:**
   - Acesse https://pages.cloudflare.com
   - Conecte seu repositório
   - Configure:
     - Build command: `npm run build`
     - Build output directory: `dist`

2. **Configure variáveis de ambiente:**
   - No dashboard do Cloudflare Pages
   - Vá em Settings > Environment Variables
   - Adicione as variáveis necessárias

---

### 4. GitHub Pages

**Nota:** Requer configuração adicional para SPA (Single Page Application)

**Passos:**

1. **Adicione o plugin do GitHub Pages ao vite.config.ts:**
   ```bash
   npm install --save-dev vite-plugin-gh-pages
   ```

2. **Configure o vite.config.ts** (já será adicionado se necessário)

3. **Configure o package.json:**
   ```json
   "scripts": {
     "deploy:gh": "npm run build && gh-pages -d dist"
   }
   ```

4. **Instale gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

5. **Deploy:**
   ```bash
   npm run deploy:gh
   ```

---

### 5. AWS Amplify

**Passos:**

1. Acesse https://aws.amazon.com/amplify/
2. Conecte seu repositório
3. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Base directory: `/` (ou deixe vazio)

4. Configure variáveis de ambiente no console

---

### 6. Railway

**Passos:**

1. Acesse https://railway.app
2. Conecte seu repositório
3. Configure as variáveis de ambiente
4. Railway detecta automaticamente o build

---

## 🔐 Configuração de Variáveis de Ambiente

Independente da plataforma, você precisa configurar:

### Variáveis Obrigatórias:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
```

### Como obter no Supabase:

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Settings > API
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`

⚠️ **IMPORTANTE:** Nunca exponha a chave `service_role` (secret key) no front-end!

---

## 📝 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando (`npm run build`)
- [ ] Nenhum erro no build
- [ ] Testado localmente (`npm run preview`)
- [ ] CORS configurado no Supabase (se necessário)
- [ ] URLs de redirect configuradas no Supabase Auth

---

## 🔧 Configurações Adicionais

### Configurar CORS no Supabase

Se encontrar erros de CORS:

1. Acesse Supabase Dashboard
2. Vá em Settings > API
3. Adicione seu domínio na lista de URLs permitidas

### Configurar Redirect URLs no Supabase

Para autenticação funcionar:

1. Acesse Supabase Dashboard
2. Vá em Authentication > URL Configuration
3. Adicione suas URLs:
   - Site URL: `https://seu-dominio.com`
   - Redirect URLs: `https://seu-dominio.com/**`

---

## 🐛 Troubleshooting

### Build falha

- Verifique se todas as dependências estão instaladas
- Verifique variáveis de ambiente
- Verifique logs de build na plataforma

### Erro 404 em rotas

- Configure corretamente os redirects (SPA mode)
- Verifique se o `vercel.json` ou `netlify.toml` estão corretos

### Erros de CORS

- Configure CORS no Supabase
- Verifique se as variáveis de ambiente estão corretas

### Autenticação não funciona

- Verifique redirect URLs no Supabase
- Verifique se as variáveis de ambiente estão configuradas

---

## 📊 Monitoramento Pós-Deploy

Após o deploy, recomendamos:

1. ✅ Testar todas as funcionalidades
2. ✅ Verificar performance (Lighthouse)
3. ✅ Configurar monitoramento (opcional):
   - Sentry para error tracking
   - Google Analytics
   - Vercel Analytics (se usar Vercel)

---

## 🎉 Deploy Concluído!

Após o deploy bem-sucedido, seu site estará disponível em:

- **Vercel:** `https://seu-projeto.vercel.app`
- **Netlify:** `https://seu-projeto.netlify.app`
- **Cloudflare Pages:** `https://seu-projeto.pages.dev`

Para conectar um domínio customizado, siga as instruções da plataforma escolhida.

---

**Precisa de ajuda?** Abra uma issue no repositório ou consulte a documentação da plataforma escolhida.

