# Configuração de Variáveis de Ambiente

## Arquivo .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xphtkyghdsozrqyfpaij.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_anon_aqui

# Site Configuration
VITE_SITE_URL=https://www.pechintech.com.br
```

## Como obter as chaves do Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione o projeto: `xphtkyghdsozrqyfpaij`
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL**: `https://xphtkyghdsozrqyfpaij.supabase.co`
   - **anon/public key**: Cole no `VITE_SUPABASE_PUBLISHABLE_KEY`

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

