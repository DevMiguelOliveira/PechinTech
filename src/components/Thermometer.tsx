import { Flame, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThermometerProps {
  temperature: number;
  hotVotes: number;
  coldVotes: number;
  onVoteHot: () => void;
  onVoteCold: () => void;
  size?: 'sm' | 'md' | 'lg';
  showButtons?: boolean;
}

export function Thermometer({
  temperature,
  hotVotes,
  coldVotes,
  onVoteHot,
  onVoteCold,
  size = 'md',
  showButtons = true,
}: ThermometerProps) {
  const getTemperatureColor = () => {
    if (temperature >= 80) return 'text-temperature-hot';
    if (temperature >= 60) return 'text-neon-orange';
    if (temperature >= 40) return 'text-yellow-500';
    if (temperature >= 20) return 'text-cyber-blue';
    return 'text-temperature-cold';
  };

  const getTemperatureLabel = () => {
    if (temperature >= 80) return 'Em chamas!';
    if (temperature >= 60) return 'Quente';
    if (temperature >= 40) return 'Morno';
    if (temperature >= 20) return 'Frio';
    return 'Congelando';
  };

  const sizeClasses = {
    sm: {
      container: 'gap-1',
      temp: 'text-lg font-bold',
      bar: 'h-1.5',
      button: 'h-7 w-7',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'gap-2',
      temp: 'text-2xl font-bold',
      bar: 'h-2',
      button: 'h-8 w-8',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'gap-3',
      temp: 'text-3xl font-bold',
      bar: 'h-3',
      button: 'h-10 w-10',
      icon: 'h-5 w-5',
    },
  };

  const styles = sizeClasses[size];

  return (
    <div className={cn('flex flex-col', styles.container)}>
      {/* Temperature Display */}
      <div className="flex items-center gap-2">
        <span className={cn(styles.temp, getTemperatureColor())}>
          {temperature}°
        </span>
        <span className="text-xs text-muted-foreground">{getTemperatureLabel()}</span>
      </div>

      {/* Temperature Bar */}
      <div 
        className={cn('w-full rounded-full bg-muted overflow-hidden', styles.bar)}
        role="progressbar"
        aria-valuenow={temperature}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Temperatura: ${temperature}°C - ${getTemperatureLabel()}`}
      >
        <div
          className="h-full thermometer-gradient transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, temperature))}%` }}
        />
      </div>

      {/* Vote Buttons */}
      {showButtons && (
        <div className="flex items-center justify-between mt-1" role="group" aria-label="Votar na temperatura da promoção">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full hover:bg-temperature-hot/20 hover:text-temperature-hot transition-all',
              'focus:ring-2 focus:ring-primary focus:ring-offset-2',
              styles.button
            )}
            onClick={onVoteHot}
            aria-label={`Votar quente. Atualmente ${hotVotes} votos quentes.`}
          >
            <Flame className={styles.icon} aria-hidden="true" />
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-temperature-hot" aria-hidden="true" />
              <span aria-label={`${hotVotes} votos quentes`}>{hotVotes}</span>
            </span>
            <span className="flex items-center gap-1">
              <Snowflake className="h-3 w-3 text-temperature-cold" aria-hidden="true" />
              <span aria-label={`${coldVotes} votos frios`}>{coldVotes}</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full hover:bg-temperature-cold/20 hover:text-temperature-cold transition-all',
              'focus:ring-2 focus:ring-primary focus:ring-offset-2',
              styles.button
            )}
            onClick={onVoteCold}
            aria-label={`Votar frio. Atualmente ${coldVotes} votos frios.`}
          >
            <Snowflake className={styles.icon} aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
