import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BannerGrupos() {
  const handleJoinWhatsApp = () => {
    window.open('https://chat.whatsapp.com/JwprOlOJlecIRHLZ2zJWpx', '_blank', 'noopener,noreferrer');
  };

  const handleJoinTelegram = () => {
    window.open('https://t.me/pechintech', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Junte-se à nossa comunidade!
          </h3>
          <p className="text-sm text-muted-foreground">
            Receba as melhores promoções em primeira mão nos nossos grupos.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleJoinWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            size="sm"
          >
            <Phone className="w-4 h-4" />
            Entrar no WhatsApp
          </Button>
          <Button
            onClick={handleJoinTelegram}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center gap-2"
            size="sm"
          >
            <MessageCircle className="w-4 h-4" />
            Entrar no Telegram
          </Button>
        </div>
      </div>
    </div>
  );
}