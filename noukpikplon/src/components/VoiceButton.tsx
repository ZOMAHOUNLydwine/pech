import React from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VoiceButtonProps {
  text?: string; // The text to read (mock functionality)
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export default function VoiceButton({ text, className, size = 'default' }: VoiceButtonProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    // Mock audio playback duration
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePlay}
      className={cn(
        "rounded-full bg-benin-green/10 text-benin-green hover:bg-benin-green/20 hover:text-benin-green transition-all",
        isPlaying && "animate-pulse ring-2 ring-benin-green/50",
        size === 'sm' && "h-8 w-8",
        size === 'default' && "h-10 w-10",
        size === 'lg' && "h-14 w-14",
        className
      )}
      aria-label="Écouter le texte"
    >
      <Volume2 className={cn(
        size === 'sm' && "h-4 w-4",
        size === 'default' && "h-5 w-5",
        size === 'lg' && "h-7 w-7"
      )} />
    </Button>
  );
}
