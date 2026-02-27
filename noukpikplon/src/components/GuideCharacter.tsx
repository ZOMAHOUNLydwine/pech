import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GuideCharacterProps {
  message?: string;
  emotion?: 'happy' | 'neutral' | 'excited' | 'thinking';
  position?: 'bottom-right' | 'inline' | 'center';
  className?: string;
}

export default function GuideCharacter({ 
  message, 
  emotion = 'happy', 
  position = 'inline',
  className 
}: GuideCharacterProps) {
  
  // Simple emoji avatars for now, could be replaced with SVG assets later
  const avatars = {
    happy: "🦁", // Lion (symbol of Benin) or a friendly character
    neutral: "🦁",
    excited: "🦁",
    thinking: "🦁"
  };

  return (
    <div className={cn(
      "flex items-end space-x-3",
      position === 'center' && "flex-col items-center space-x-0 space-y-3",
      className
    )}>
      {/* Character Avatar */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-16 h-16 bg-benin-yellow rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white z-10 relative">
          {avatars[emotion]}
        </div>
        {/* Simple body hint */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-6 bg-benin-green rounded-t-full -z-0" />
      </motion.div>

      {/* Message Bubble */}
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "bg-white border-2 border-earth-200 p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[250px]",
            position === 'center' && "rounded-bl-2xl text-center"
          )}
        >
          <p className="text-earth-800 font-medium leading-snug">{message}</p>
        </motion.div>
      )}
    </div>
  );
}
