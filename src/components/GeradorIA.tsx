/**
 * Componente para geração de conteúdo de blog usando IA
 * 
 * Este componente consome apenas o endpoint interno /api/gerar-post,
 * nunca chama APIs externas diretamente.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { gerarPostComIA, type GerarPostRequest } from '@/services/api';

interface GeradorIAProps {
  /**
   * Callback chamado quando o conteúdo é gerado com sucesso
   * @param content - Conteúdo gerado em Markdown
   */
  onContentGenerated?: (content: string) => void;
  
  /**
   * Tema inicial (opcional)
   */
  initialTema?: string;
}

export function GeradorIA({ onContentGenerated, initialTema = '' }: GeradorIAProps) {
  const [tema, setTema] = useState(initialTema);
  const [descricao, setDescricao] = useState('');
  const [palavrasChave, setPalavrasChave] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Valida os campos antes de gerar
   */
  const validateInput = (): boolean => {
    if (!tema || tema.trim().length < 5) {
      setError('O tema deve ter pelo menos 5 caracteres.');
      return false;
    }

    if (tema.trim().length > 200) {
      setError('O tema deve ter no máximo 200 caracteres.');
      return false;
    }

    return true;
  };

  /**
   * Gera o conteúdo usando a API interna
   */
  const handleGerar = async () => {
    // Resetar estados
    setError(null);
    setSuccess(false);

    // Validar entrada
    if (!validateInput()) {
      return;
    }

    setIsGenerating(true);

    try {
      // Preparar requisição
      const request: GerarPostRequest = {
        tema: tema.trim(),
        descricao: descricao.trim() || undefined,
        palavrasChave: palavrasChave
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0),
      };

      // Chamar API interna (que chama o Gemini no backend)
      const response = await gerarPostComIA(request);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (!response.content) {
        setError('Nenhum conteúdo foi gerado.');
        return;
      }

      // Sucesso - chamar callback se fornecido
      setSuccess(true);
      if (onContentGenerated) {
        onContentGenerated(response.content);
      }

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('[GeradorIA] Erro ao gerar conteúdo:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erro desconhecido ao gerar conteúdo.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Gerador de Conteúdo com IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo Tema */}
        <div>
          <Label htmlFor="tema">
            Tema do Post <span className="text-destructive">*</span>
          </Label>
          <Input
            id="tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ex: Como escolher a melhor placa de vídeo para gaming em 2024"
            disabled={isGenerating}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Mínimo 5 caracteres, máximo 200 caracteres
          </p>
        </div>

        {/* Campo Descrição */}
        <div>
          <Label htmlFor="descricao">Descrição Adicional (opcional)</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Forneça contexto adicional sobre o tema..."
            disabled={isGenerating}
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Campo Palavras-chave */}
        <div>
          <Label htmlFor="palavras-chave">Palavras-chave (opcional)</Label>
          <Input
            id="palavras-chave"
            value={palavrasChave}
            onChange={(e) => setPalavrasChave(e.target.value)}
            placeholder="Ex: placa de vídeo, GPU, gaming, NVIDIA, AMD"
            disabled={isGenerating}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separe múltiplas palavras-chave por vírgula
          </p>
        </div>

        {/* Mensagens de Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Mensagem de Sucesso */}
        {success && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Conteúdo gerado com sucesso! O texto foi preenchido automaticamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Botão de Gerar */}
        <Button
          onClick={handleGerar}
          disabled={isGenerating || !tema.trim() || tema.trim().length < 5}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando conteúdo...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Conteúdo com IA
            </>
          )}
        </Button>

        {/* Aviso sobre revisão */}
        <p className="text-xs text-muted-foreground text-center">
          ⚠️ O conteúdo gerado por IA deve ser revisado antes de publicar.
        </p>
      </CardContent>
    </Card>
  );
}


