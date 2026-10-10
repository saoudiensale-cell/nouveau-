import React, { useState } from 'react';

interface TeamBadgeProps {
  badge: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({
  badge,
  name,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-7 h-7 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];

  const isUrl = badge && (badge.startsWith('http://') || badge.startsWith('https://'));

  if (isUrl && !hasError) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center p-0.5 rounded-full bg-slate-900 border border-slate-800 ${sizeClasses} ${className}`}>
        <img
          src={badge}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback to stylized team letter badge or emoji
  const isEmoji = badge && !isUrl && badge.length <= 4 && !badge.match(/[a-zA-Z0-9]/);
  if (isEmoji) {
    return <span className={`shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}>{badge}</span>;
  }

  const initial = (name || 'T').substring(0, 2).toUpperCase();
  return (
    <div
      className={`shrink-0 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center justify-center select-none text-[10px] tracking-tight ${sizeClasses} ${className}`}
      title={name}
    >
      {initial}
    </div>
  );
};
