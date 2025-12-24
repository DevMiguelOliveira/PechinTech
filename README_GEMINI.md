# Configuração do Google Gemini para Geração de Conteúdo

Este projeto utiliza a API do Google Gemini para gerar automaticamente conteúdo de blog posts baseado nos produtos cadastrados.

## Como Configurar

### 1. Obter API Key do Google Gemini

1. Acesse o [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key" ou "Get API Key"
4. Copie a chave gerada

### 2. Configurar no Projeto

1. Crie ou edite o arquivo `.env` na raiz do projeto
2. Adicione a seguinte linha:

```env
VITE_GEMINI_API_KEY=sua_chave_api_aqui
```

3. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Como Usar

1. Acesse a página de administração do blog (`/admin/blog`)
2. Role até a seção "Criar Posts em Lote"
3. Clique em "Criar Posts para X Produtos"
4. O sistema irá:
   - Buscar produtos ativos no site
   - Gerar conteúdo único para cada produto usando Gemini
   - Criar posts automaticamente com link de afiliado
   - Usar a imagem do produto como imagem do post

## Limitações

- Serão criados posts para até 10 produtos por vez
- É necessário ter produtos cadastrados no site
- A API do Gemini tem limites de uso (consulte a documentação oficial)
- Cada geração de conteúdo leva alguns segundos

## Troubleshooting

### Erro: "VITE_GEMINI_API_KEY não está configurada"

- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que a variável está escrita corretamente: `VITE_GEMINI_API_KEY`
- Reinicie o servidor de desenvolvimento após adicionar a variável

### Erro: "Erro na API Gemini"

- Verifique se a API Key está válida
- Confirme se você tem créditos/quota disponível na API
- Verifique a conexão com a internet

### Posts não estão sendo criados

- Verifique se há produtos ativos no site
- Confirme se a tabela `blog_posts` existe no banco de dados
- Verifique os logs do console para mais detalhes


