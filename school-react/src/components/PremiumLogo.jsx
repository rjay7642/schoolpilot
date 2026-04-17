import React, { useId } from 'react';

export default function PremiumLogo({
  size = 'md',
  showText = false,
  title = 'SchoolPilot',
  subtitle = 'School Operations Suite',
  className = '',
}) {
  const gradientId = useId().replace(/:/g, '');
  const markClass = `premium-logo premium-logo-${size} ${showText ? 'with-text' : ''} ${className}`.trim();

  return (
    <div className={markClass}>
      <div className="premium-logo-mark" aria-hidden="true">
        <img 
          src="/logo.png" 
          alt="SchoolPilot" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            borderRadius: '12px'
          }} 
        />
      </div>

      {showText ? (
        <div className="premium-logo-copy">
          <div className="premium-logo-title">{title}</div>
          <div className="premium-logo-subtitle">{subtitle}</div>
        </div>
      ) : null}
    </div>
  );
}
