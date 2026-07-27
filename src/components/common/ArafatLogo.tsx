import React from 'react';

interface ArafatLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const ArafatLogo: React.FC<ArafatLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const chosenSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      <div className={`relative ${chosenSize} drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Gold Gradients */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7E6AA" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#AA820A" />
              <stop offset="75%" stopColor="#F3E0A0" />
              <stop offset="100%" stopColor="#997000" />
            </linearGradient>

            <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE89C" />
              <stop offset="100%" stopColor="#C59B27" />
            </linearGradient>

            <radialGradient id="greenBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#043A2C" />
              <stop offset="70%" stopColor="#022118" />
              <stop offset="100%" stopColor="#01140E" />
            </radialGradient>

            {/* Subtle Islamic Geometric Pattern */}
            <pattern id="islamicPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 20 10 L 10 20 L 0 10 Z M 5 5 L 15 5 L 15 15 L 5 15 Z"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
                strokeOpacity="0.12"
              />
            </pattern>
          </defs>

          {/* Outer Rounded Container */}
          <rect
            x="4"
            y="4"
            width="192"
            height="192"
            rx="40"
            fill="url(#greenBg)"
            stroke="url(#goldGradient)"
            strokeWidth="5"
          />

          {/* Inner Geometric Pattern Layer */}
          <rect x="8" y="8" width="184" height="184" rx="36" fill="url(#islamicPattern)" />

          {/* Inner Golden Arch Frame (Mihrab Frame) */}
          <path
            d="M 35 170 L 35 90 C 35 50, 100 20, 100 20 C 100 20, 165 50, 165 90 L 165 170 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 42 165 L 42 92 C 42 56, 100 28, 100 28 C 100 28, 158 56, 158 92 L 158 165 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />

          {/* Central Calligraphy Arabic Letter "ع" (Ain) */}
          <g transform="translate(100, 92) scale(0.85)">
            {/* Shadow path behind Ain */}
            <path
              d="M -5 -42 C 15 -42, 30 -30, 30 -12 C 30 8, 5 18, -18 20 C -5 28, 18 30, 32 15 C 40 4, 45 -12, 35 -30 C 22 -48, -10 -50, -32 -32 C -42 -22, -45 -5, -40 10 C -32 30, 0 45, -12 60 C -22 68, -48 60, -52 45 C -42 52, -22 52, -15 42 C -5 28, -32 20, -35 -2 C -38 -20, -25 -42, -5 -42 Z"
              fill="#000"
              opacity="0.5"
            />
            {/* Gold Calligraphic Ain Body */}
            <path
              d="M 0 -45 C 22 -45, 38 -32, 38 -12 C 38 10, 12 22, -15 24 C 2 32, 26 32, 42 15 C 52 2, 55 -15, 42 -35 C 28 -54, -12 -55, -38 -34 C -48 -23, -52 -5, -46 12 C -38 35, -2 48, -15 65 C -25 74, -54 65, -58 48 C -46 56, -24 56, -16 45 C -4 30, -35 22, -39 -2 C -42 -22, -28 -45, 0 -45 Z"
              fill="url(#goldGlow)"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
            />
          </g>

          {/* Kaaba Symbol at Bottom Center */}
          <g transform="translate(100, 160)">
            {/* Golden Base Crescent Waves */}
            <path
              d="M -50 15 Q -25 5 0 15 Q 25 5 50 15"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M -35 20 Q 0 12 35 20"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />

            {/* Kaaba Box */}
            <rect
              x="-18"
              y="-18"
              width="36"
              height="30"
              rx="2"
              fill="#0A0A0A"
              stroke="url(#goldGradient)"
              strokeWidth="2"
            />
            {/* Kaaba Gold Kiswah Belt */}
            <line
              x1="-18"
              y1="-10"
              x2="18"
              y2="-10"
              stroke="url(#goldGlow)"
              strokeWidth="3"
            />
            {/* Kaaba Door */}
            <rect
              x="2"
              y="-8"
              width="7"
              height="16"
              fill="url(#goldGlow)"
              rx="1"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <span className="mt-1 font-black text-[#D4AF37] text-xs tracking-wide">
          وطهر بيتي
        </span>
      )}
    </div>
  );
};

export default ArafatLogo;
