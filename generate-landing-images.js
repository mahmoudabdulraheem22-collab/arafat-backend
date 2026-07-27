import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.join(process.cwd(), 'public', 'images', 'landing');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Makkah Clock Tower SVG
const makkahSvg = `
<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Night Sky Gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020d09"/>
      <stop offset="40%" stop-color="#04221b"/>
      <stop offset="80%" stop-color="#073d30"/>
      <stop offset="100%" stop-color="#031b14"/>
    </linearGradient>

    <!-- Golden Glow Gradient -->
    <radialGradient id="clockGlow" cx="50%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#ffd700" stop-opacity="0.8"/>
      <stop offset="30%" stop-color="#d4af37" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#c5a059" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Clock Face Metallic Gradient -->
    <radialGradient id="clockFace" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="75%" stop-color="#f0e6c8"/>
      <stop offset="88%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#8a6d3b"/>
    </radialGradient>

    <!-- Tower Gold Texture Gradient -->
    <linearGradient id="towerGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8a6d3b"/>
      <stop offset="25%" stop-color="#d4af37"/>
      <stop offset="50%" stop-color="#f5e5a3"/>
      <stop offset="75%" stop-color="#c5a059"/>
      <stop offset="100%" stop-color="#5e4922"/>
    </linearGradient>

    <!-- Body Shader -->
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#082b22"/>
      <stop offset="30%" stop-color="#114e3e"/>
      <stop offset="70%" stop-color="#0d3f32"/>
      <stop offset="100%" stop-color="#041a14"/>
    </linearGradient>
  </defs>

  <!-- Sky -->
  <rect width="600" height="800" fill="url(#skyGrad)"/>

  <!-- Stars / Ambient Sparks -->
  <circle cx="100" cy="80" r="1.5" fill="#f8f3e7" opacity="0.6"/>
  <circle cx="480" cy="120" r="2" fill="#d4af37" opacity="0.8"/>
  <circle cx="520" cy="60" r="1.2" fill="#ffffff" opacity="0.5"/>
  <circle cx="70" cy="200" r="1" fill="#f8f3e7" opacity="0.4"/>
  <circle cx="420" cy="220" r="1.8" fill="#d4af37" opacity="0.7"/>

  <!-- Background Ambient Glow -->
  <circle cx="300" cy="240" r="260" fill="url(#clockGlow)"/>

  <!-- Spire & Crescent Top -->
  <!-- Crescent -->
  <path d="M 292 20 A 22 22 0 1 0 318 42 A 18 18 0 1 1 292 20 Z" fill="#ffd700" filter="drop-shadow(0px 0px 8px #ffd700)"/>
  <!-- Spire Stem -->
  <polygon points="297,42 303,42 305,110 295,110" fill="url(#towerGold)"/>
  <polygon points="295,110 305,110 312,150 288,150" fill="url(#towerGold)"/>

  <!-- Spire Ornament Spheres -->
  <circle cx="300" cy="80" r="7" fill="#ffd700"/>
  <circle cx="300" cy="100" r="9" fill="#d4af37"/>

  <!-- Top Crown / Spire Structure -->
  <polygon points="275,150 325,150 335,210 265,210" fill="url(#bodyGrad)" stroke="#d4af37" stroke-width="2"/>
  
  <!-- Clock Tower Section Background -->
  <rect x="230" y="210" width="140" height="190" fill="url(#bodyGrad)" stroke="#c5a059" stroke-width="3"/>

  <!-- Decorative Columns beside Clock -->
  <rect x="210" y="220" width="20" height="170" fill="url(#towerGold)"/>
  <rect x="370" y="220" width="20" height="170" fill="url(#towerGold)"/>

  <!-- Massive Illuminated Clock Face -->
  <circle cx="300" cy="295" r="62" fill="url(#clockFace)" stroke="#d4af37" stroke-width="6"/>
  <circle cx="300" cy="295" r="56" fill="#102e24" stroke="#d4af37" stroke-width="2"/>
  <circle cx="300" cy="295" r="52" fill="#ffffff" opacity="0.95"/>

  <!-- Clock Markings -->
  <circle cx="300" cy="295" r="3" fill="#031b14"/>
  <!-- Clock Hands -->
  <line x1="300" y1="295" x2="300" y2="260" stroke="#031b14" stroke-width="4" stroke-linecap="round"/>
  <line x1="300" y1="295" x2="325" y2="295" stroke="#031b14" stroke-width="3" stroke-linecap="round"/>

  <!-- Roman / Arabic Clock Dial Accents -->
  <text x="300" y="255" font-family="sans-serif" font-size="10" font-weight="bold" fill="#031b14" text-anchor="middle">١٢</text>
  <text x="338" y="299" font-family="sans-serif" font-size="10" font-weight="bold" fill="#031b14" text-anchor="middle">٣</text>
  <text x="300" y="340" font-family="sans-serif" font-size="10" font-weight="bold" fill="#031b14" text-anchor="middle">٦</text>
  <text x="262" y="299" font-family="sans-serif" font-size="10" font-weight="bold" fill="#031b14" text-anchor="middle">٩</text>

  <!-- Arabic Calligraphy Inscription Banner above clock -->
  <rect x="240" y="218" width="120" height="18" rx="4" fill="#031b14" stroke="#d4af37" stroke-width="1"/>
  <text x="300" y="231" font-family="'Tajawal', 'Noto Sans Arabic', sans-serif" font-size="11" font-weight="bold" fill="#ffd700" text-anchor="middle">اللهُ أَكْبَرُ</text>

  <!-- Main Tower Body Below Clock -->
  <polygon points="210,400 390,400 420,800 180,800" fill="url(#bodyGrad)" stroke="#c5a059" stroke-width="2"/>

  <!-- Vertical Light Strips & Windows -->
  <line x1="250" y1="410" x2="240" y2="800" stroke="#ffd700" stroke-width="2" opacity="0.8"/>
  <line x1="280" y1="410" x2="275" y2="800" stroke="#ffd700" stroke-width="2" opacity="0.9"/>
  <line x1="320" y1="410" x2="325" y2="800" stroke="#ffd700" stroke-width="2" opacity="0.9"/>
  <line x1="350" y1="410" x2="360" y2="800" stroke="#ffd700" stroke-width="2" opacity="0.8"/>

  <!-- Architectural Arches & Bands -->
  <path d="M 220 450 Q 300 430 380 450" fill="none" stroke="#d4af37" stroke-width="4"/>
  <path d="M 210 520 Q 300 500 390 520" fill="none" stroke="#d4af37" stroke-width="4"/>
  <path d="M 200 600 Q 300 580 400 600" fill="none" stroke="#d4af37" stroke-width="4"/>

  <!-- Foreground Atmospheric Glow & Floor Lighting -->
  <rect x="0" y="680" width="600" height="120" fill="url(#clockGlow)" opacity="0.3"/>
</svg>
`;

// 2. Madinah Green Dome SVG
const madinahSvg = `
<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Night Sky Gradient -->
    <linearGradient id="madinahSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#02140e"/>
      <stop offset="45%" stop-color="#052e23"/>
      <stop offset="85%" stop-color="#084234"/>
      <stop offset="100%" stop-color="#031b14"/>
    </linearGradient>

    <!-- Green Dome Gradient -->
    <radialGradient id="greenDomeGrad" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#4ae3ab"/>
      <stop offset="30%" stop-color="#22a878"/>
      <stop offset="70%" stop-color="#0e6b4a"/>
      <stop offset="100%" stop-color="#043624"/>
    </radialGradient>

    <!-- Golden Finial Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#ffd700"/>
      <stop offset="70%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#8a6d3b"/>
    </linearGradient>

    <!-- Minaret Marble Gradient -->
    <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e2d8be"/>
      <stop offset="30%" stop-color="#f8f3e7"/>
      <stop offset="70%" stop-color="#e8dfc8"/>
      <stop offset="100%" stop-color="#b8a886"/>
    </linearGradient>

    <!-- Soft Glow -->
    <radialGradient id="domeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22a878" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#c5a059" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Sky -->
  <rect width="600" height="800" fill="url(#madinahSky)"/>

  <!-- Ambient Glow behind Dome -->
  <circle cx="300" cy="420" r="250" fill="url(#domeGlow)"/>

  <!-- Stars -->
  <circle cx="80" cy="100" r="1.5" fill="#ffffff" opacity="0.7"/>
  <circle cx="500" cy="90" r="2" fill="#ffd700" opacity="0.9"/>
  <circle cx="440" cy="160" r="1.2" fill="#ffffff" opacity="0.6"/>
  <circle cx="150" cy="180" r="1.8" fill="#d4af37" opacity="0.8"/>

  <!-- Left Minaret (Tall White/Gold Al-Masjid an-Nabawi Minaret) -->
  <g transform="translate(70, 40)">
    <!-- Minaret Base -->
    <rect x="35" y="420" width="40" height="280" fill="url(#marbleGrad)" stroke="#8a6d3b" stroke-width="1"/>
    <!-- Minaret Balcony 1 -->
    <rect x="25" y="420" width="60" height="18" fill="url(#goldGrad)"/>
    <!-- Minaret Octagonal Shaft -->
    <polygon points="38,220 72,220 76,420 34,420" fill="url(#marbleGrad)"/>
    <!-- Minaret Balcony 2 -->
    <rect x="28" y="220" width="54" height="15" fill="url(#goldGrad)"/>
    <!-- Minaret Upper Pavilion -->
    <polygon points="42,120 68,120 72,220 38,220" fill="url(#marbleGrad)"/>
    <!-- Minaret Small Dome Top -->
    <path d="M 42 120 Q 55 90 68 120 Z" fill="url(#goldGrad)"/>
    <!-- Minaret Crescent -->
    <line x1="55" y1="90" x2="55" y2="50" stroke="#ffd700" stroke-width="3"/>
    <circle cx="55" cy="45" r="5" fill="#ffd700"/>
  </g>

  <!-- Right Minaret -->
  <g transform="translate(420, 40)">
    <!-- Minaret Base -->
    <rect x="35" y="420" width="40" height="280" fill="url(#marbleGrad)" stroke="#8a6d3b" stroke-width="1"/>
    <!-- Minaret Balcony 1 -->
    <rect x="25" y="420" width="60" height="18" fill="url(#goldGrad)"/>
    <!-- Minaret Octagonal Shaft -->
    <polygon points="38,220 72,220 76,420 34,420" fill="url(#marbleGrad)"/>
    <!-- Minaret Balcony 2 -->
    <rect x="28" y="220" width="54" height="15" fill="url(#goldGrad)"/>
    <!-- Minaret Upper Pavilion -->
    <polygon points="42,120 68,120 72,220 38,220" fill="url(#marbleGrad)"/>
    <!-- Minaret Small Dome Top -->
    <path d="M 42 120 Q 55 90 68 120 Z" fill="url(#goldGrad)"/>
    <!-- Minaret Crescent -->
    <line x1="55" y1="90" x2="55" y2="50" stroke="#ffd700" stroke-width="3"/>
    <circle cx="55" cy="45" r="5" fill="#ffd700"/>
  </g>

  <!-- Mosque Roof Structure Base -->
  <rect x="120" y="520" width="360" height="230" fill="#063328" stroke="#d4af37" stroke-width="2"/>
  <rect x="100" y="500" width="400" height="25" fill="url(#marbleGrad)"/>

  <!-- Mosque Windows with Warm Light -->
  <g fill="#ffd700" opacity="0.85">
    <rect x="160" y="560" width="25" height="45" rx="12"/>
    <rect x="210" y="560" width="25" height="45" rx="12"/>
    <rect x="260" y="560" width="25" height="45" rx="12"/>
    <rect x="315" y="560" width="25" height="45" rx="12"/>
    <rect x="365" y="560" width="25" height="45" rx="12"/>
    <rect x="415" y="560" width="25" height="45" rx="12"/>
  </g>

  <!-- The Green Dome Drum (Base Cylinder) -->
  <rect x="210" y="380" width="180" height="120" fill="#094536" stroke="#c5a059" stroke-width="2"/>
  
  <!-- Drum Windows -->
  <g fill="#ffd700" opacity="0.9">
    <path d="M 230 430 A 10 10 0 0 1 250 430 L 250 460 L 230 460 Z"/>
    <path d="M 265 430 A 10 10 0 0 1 285 430 L 285 460 L 265 460 Z"/>
    <path d="M 300 430 A 10 10 0 0 1 320 430 L 320 460 L 300 460 Z"/>
    <path d="M 335 430 A 10 10 0 0 1 355 430 L 355 460 L 335 460 Z"/>
  </g>

  <!-- THE FAMOUS GREEN DOME OF MADINAH -->
  <path d="M 190 380 Q 300 180 410 380 Z" fill="url(#greenDomeGrad)" stroke="#22a878" stroke-width="2"/>

  <!-- Golden Finial & Crescent on Top of Green Dome -->
  <polygon points="296,220 304,220 302,150 298,150" fill="url(#goldGrad)"/>
  <circle cx="300" cy="180" r="8" fill="url(#goldGrad)"/>
  <circle cx="300" cy="162" r="6" fill="url(#goldGrad)"/>
  <path d="M 293 125 A 18 18 0 1 0 315 145 A 14 14 0 1 1 293 125 Z" fill="#ffd700" filter="drop-shadow(0px 0px 8px #ffd700)"/>

  <!-- Foreground Courtyard Lanterns & Soft Warm Lighting -->
  <rect x="0" y="700" width="600" height="100" fill="#031b14"/>
  <line x1="0" y1="700" x2="600" y2="700" stroke="#d4af37" stroke-width="3"/>
</svg>
`;

async function main() {
  console.log('Generating high quality WebP landing images...');

  const makkahPath = path.join(outputDir, 'makkah-clock-tower.webp');
  const madinahPath = path.join(outputDir, 'green-dome-madinah.webp');

  await sharp(Buffer.from(makkahSvg))
    .webp({ quality: 90 })
    .toFile(makkahPath);

  await sharp(Buffer.from(madinahSvg))
    .webp({ quality: 90 })
    .toFile(madinahPath);

  console.log('Successfully generated images:');
  console.log('1.', makkahPath);
  console.log('2.', madinahPath);
}

main().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
