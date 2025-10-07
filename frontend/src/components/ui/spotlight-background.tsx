import React, { useEffect, useRef, ReactNode } from 'react';

interface SpotlightBackgroundProps {
  children: ReactNode;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  intensity?: number;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 }
};

const SpotlightBackground: React.FC<SpotlightBackgroundProps> = ({ 
  children, 
  glowColor = 'purple',
  intensity = 0.15
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      
      if (containerRef.current) {
        containerRef.current.style.setProperty('--x', x.toFixed(2));
        containerRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        containerRef.current.style.setProperty('--y', y.toFixed(2));
        containerRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const containerStyles: React.CSSProperties = {
    '--base': base,
    '--spread': spread,
    '--size': '300',
    '--spotlight-size': 'calc(var(--size, 300) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    '--intensity': intensity,
    position: 'relative',
    minHeight: '100vh',
  } as React.CSSProperties;

  const spotlightStyles = `
    .spotlight-container::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 280) 100% 70% / var(--intensity, 0.15)), 
        transparent
      );
      z-index: 1;
      mix-blend-mode: screen;
    }
    
    .spotlight-content {
      position: relative;
      z-index: 2;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: spotlightStyles }} />
      <div
        ref={containerRef}
        className="spotlight-container"
        style={containerStyles}
      >
        <div className="spotlight-content">
          {children}
        </div>
      </div>
    </>
  );
};

export { SpotlightBackground };
