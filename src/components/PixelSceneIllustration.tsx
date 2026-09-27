import React from 'react';

interface PixelSceneIllustrationProps {
  sceneId: string;
  className?: string;
  animated?: boolean;
}

export const PixelSceneIllustration: React.FC<PixelSceneIllustrationProps> = ({
  sceneId,
  className = 'w-full h-full',
  animated = true,
}) => {
  switch (sceneId) {
    case 'wanderer':
      return (
        <svg
          viewBox="0 0 200 240"
          className={`${className} image-render-pixel`}
          style={{ imageRendering: 'pixelated' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background parchment scanline texture */}
          <rect width="200" height="240" fill="#E8DEC9" />
          <g opacity="0.15">
            {Array.from({ length: 48 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 5} x2="200" y2={i * 5} stroke="#3D2E1E" strokeWidth="1" />
            ))}
          </g>

          {/* Crescent Moon Spear in Background */}
          <g className={animated ? 'animate-float-gentle' : ''}>
            {/* Wooden Staff shaft */}
            <line x1="60" y1="30" x2="160" y2="185" stroke="#251C17" strokeWidth="4" strokeLinecap="square" />
            
            {/* Crescent Spear Blade (Pixelated steps) */}
            <path
              d="M 50 15 C 65 15, 75 25, 75 40 C 70 32, 60 27, 45 28 C 43 23, 46 17, 50 15 Z"
              fill="#E0F2FE"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Spear Tip */}
            <polygon points="38,25 58,12 48,32" fill="#BAE6FD" />
            
            {/* Red Ribbons on Staff */}
            <path
              d="M 68 40 Q 60 52 50 50 Q 56 46 66 43 Z"
              fill="#E11D48"
            />
            <path
              d="M 72 45 Q 85 58 78 68 Q 72 60 70 48 Z"
              fill="#BE123C"
            />
            <circle cx="72" cy="42" r="3.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />

            {/* Behind Sword/Rod */}
            <line x1="55" y1="55" x2="170" y2="165" stroke="#18181B" strokeWidth="3" />

            {/* Shadow under feet */}
            <ellipse cx="102" cy="216" rx="26" ry="4" fill="#3D2E1E" opacity="0.3" />

            {/* Main Wanderer Body */}
            {/* Antler / Feather Mask */}
            {/* Left ear/horn */}
            <rect x="91" y="60" width="4" height="18" fill="#C2A67D" />
            <rect x="92" y="62" width="2" height="14" fill="#4B3B28" />
            {/* Right ear/horn */}
            <rect x="109" y="60" width="4" height="18" fill="#2E243D" />
            <rect x="110" y="62" width="2" height="14" fill="#1C1526" />

            {/* Head/Mask */}
            <rect x="88" y="74" width="28" height="24" rx="2" fill="#3C2A3E" />
            <rect x="92" y="78" width="8" height="12" fill="#E2C799" />
            {/* Eye sockets */}
            <rect x="95" y="83" width="3" height="4" fill="#1C1526" />
            <rect x="106" y="83" width="3" height="4" fill="#1C1526" />
            {/* Golden glowing pupil */}
            <rect x="96" y="84" width="1.5" height="1.5" fill="#FDE047" />
            <rect x="107" y="84" width="1.5" height="1.5" fill="#FDE047" />

            {/* Patterned Turquoise Neck Scarf */}
            <rect x="84" y="96" width="36" height="12" fill="#0D9488" />
            <rect x="86" y="98" width="32" height="4" fill="#14B8A6" />
            {/* Geometric scarf tribal pattern */}
            <polygon points="88,98 92,102 96,98" fill="#FEF3C7" />
            <polygon points="98,98 102,102 106,98" fill="#FEF3C7" />
            <polygon points="108,98 112,102 116,98" fill="#FEF3C7" />

            {/* White & Red Patterned Shoulder Wrap (Poncho) */}
            <path d="M 76 106 L 86 98 L 86 142 L 74 136 Z" fill="#F8FAFC" />
            <path d="M 74 136 L 86 142 L 86 148 L 74 144 Z" fill="#0D9488" />
            <line x1="77" y1="112" x2="84" y2="114" stroke="#DC2626" strokeWidth="2" />
            <line x1="77" y1="120" x2="84" y2="124" stroke="#DC2626" strokeWidth="2" />

            {/* Diagonal Turquoise Sash */}
            <polygon points="86,108 126,132 122,140 86,118" fill="#0F766E" />
            {/* Chevron notches */}
            <line x1="94" y1="114" x2="98" y2="119" stroke="#99F6E4" strokeWidth="2" />
            <line x1="104" y1="120" x2="108" y2="125" stroke="#99F6E4" strokeWidth="2" />
            <line x1="114" y1="126" x2="118" y2="131" stroke="#99F6E4" strokeWidth="2" />

            {/* Main Tattered Nomad Robes & Pouches */}
            <rect x="86" y="112" width="44" height="65" fill="#2E243A" />
            {/* Travel Satchel / Ribs details */}
            <rect x="92" y="128" width="22" height="18" fill="#1C1426" stroke="#4C3A5E" strokeWidth="1" />
            <rect x="95" y="132" width="16" height="2" fill="#E2C799" />
            <rect x="95" y="138" width="16" height="2" fill="#E2C799" />
            
            {/* Small pouches */}
            <circle cx="118" cy="136" r="3.5" fill="#581C87" />
            <circle cx="122" cy="144" r="3" fill="#701A75" />

            {/* Tattered lower robe fringes */}
            <polygon points="86,177 92,205 96,177 101,212 106,177 114,208 120,177 124,202 128,177" fill="#1E1627" />

            {/* Nomad Staff & Legs */}
            <rect x="98" y="202" width="4" height="14" fill="#18181B" />
            <rect x="114" y="200" width="4" height="16" fill="#18181B" />
            <rect x="96" y="214" width="7" height="3" fill="#3F3F46" />
            <rect x="112" y="214" width="7" height="3" fill="#3F3F46" />
          </g>
        </svg>
      );

    case 'ramen-shop':
      return (
        <svg
          viewBox="0 0 240 240"
          className={`${className} image-render-pixel`}
          style={{ imageRendering: 'pixelated' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crisp sky blue background */}
          <rect width="240" height="240" fill="#7DD3FC" />

          {/* Street Ground */}
          <line x1="0" y1="210" x2="240" y2="210" stroke="#0369A1" strokeWidth="3" />

          {/* Left Street Lamp & Stacked Signpost */}
          <g>
            <rect x="25" y="90" width="4" height="120" fill="#1E293B" />
            {/* Top crossbar */}
            <rect x="15" y="90" width="24" height="4" fill="#0F172A" />
            <rect x="17" y="94" width="4" height="8" fill="#38BDF8" />
            <rect x="31" y="94" width="4" height="8" fill="#38BDF8" />
            {/* Street signs stacked on pole */}
            <rect x="20" y="130" width="14" height="12" fill="#F472B6" />
            <rect x="20" y="146" width="14" height="14" fill="#38BDF8" />
            <rect x="20" y="164" width="14" height="12" fill="#FDE047" />
            {/* Base */}
            <polygon points="21,210 27,198 33,210" fill="#0F172A" />
          </g>

          {/* Ramen Shop Main Building */}
          <rect x="52" y="55" width="140" height="155" fill="#3B82F6" />
          {/* Top Awning Roof - Pink/Magenta & Cream stripes */}
          <g>
            <rect x="50" y="55" width="105" height="24" fill="#EC4899" />
            <rect x="50" y="55" width="15" height="24" fill="#FBCFE8" />
            <rect x="80" y="55" width="15" height="24" fill="#FBCFE8" />
            <rect x="110" y="55" width="15" height="24" fill="#FBCFE8" />
            <rect x="140" y="55" width="15" height="24" fill="#FBCFE8" />
          </g>

          {/* Upper Rooftop AC Unit */}
          <rect x="160" y="58" width="30" height="20" fill="#0284C7" stroke="#1E293B" strokeWidth="2" />
          <circle cx="175" cy="68" r="6" fill="#0369A1" />
          <line x1="169" y1="68" x2="181" y2="68" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="175" y1="62" x2="175" y2="74" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Upper Signboards (Yellow & Neon) */}
          <rect x="56" y="82" width="88" height="24" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
          {/* Fictional pixel glyphs */}
          <g fill="#EA580C">
            <rect x="62" y="87" width="8" height="4" />
            <rect x="66" y="91" width="4" height="10" />
            <rect x="76" y="87" width="10" height="3" />
            <rect x="80" y="90" width="3" height="11" />
            <rect x="92" y="87" width="10" height="14" rx="1" />
            <rect x="108" y="87" width="12" height="3" />
            <rect x="112" y="90" width="4" height="11" />
            <rect x="126" y="89" width="10" height="10" />
          </g>

          {/* Right Small Neon Board */}
          <rect x="148" y="82" width="48" height="24" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
          <rect x="154" y="88" width="12" height="12" fill="#FB923C" />
          <rect x="172" y="88" width="18" height="12" fill="#38BDF8" />

          {/* Middle Turquoise Slanted Canopy Awning */}
          <polygon points="38,138 148,138 148,110 50,110" fill="#06B6D4" />
          {/* Slanted stripes */}
          <polygon points="56,138 72,138 78,110 62,110" fill="#CFFAFE" />
          <polygon points="88,138 104,138 110,110 94,110" fill="#CFFAFE" />
          <polygon points="120,138 136,138 142,110 126,110" fill="#CFFAFE" />

          {/* Open Shop Interior (Dark Cozy Depth) */}
          <rect x="60" y="138" width="84" height="72" fill="#172554" />
          {/* Hanging cozy lanterns */}
          <circle cx="78" cy="150" r="3" fill="#FDE047" />
          <line x1="78" y1="138" x2="78" y2="147" stroke="#94A3B8" />
          <circle cx="124" cy="148" r="3" fill="#FDE047" />
          <line x1="124" y1="138" x2="124" y2="145" stroke="#94A3B8" />

          {/* Ramen Cook Silhouette inside */}
          <rect x="94" y="154" width="16" height="18" rx="2" fill="#F472B6" />
          <circle cx="102" cy="150" r="6" fill="#FBCFE8" />

          {/* Bar Counter and Striped Wooden Panels */}
          <rect x="60" y="180" width="84" height="30" fill="#38BDF8" />
          {/* Vertical wood ribs */}
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={66 + i * 9} y="184" width="4" height="24" fill="#FEF08A" />
          ))}

          {/* Right Side Wall Pipes, Fusebox & AC Outdoor Unit */}
          <g>
            <rect x="154" y="112" width="28" height="30" fill="#1E40AF" />
            {/* Silver Pipes */}
            <path d="M 158 126 H 188 V 172 H 180" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
            <path d="M 164 136 H 176 V 162 H 164" fill="none" stroke="#93C5FD" strokeWidth="2" />
            
            {/* Big AC Compressor Fan Unit */}
            <rect x="174" y="174" width="42" height="36" fill="#1E3A8A" stroke="#0F172A" strokeWidth="2" />
            <circle cx="195" cy="192" r="12" fill="#0284C7" />
            {/* Spinning fan blades */}
            <line x1="187" y1="192" x2="203" y2="192" stroke="#BAE6FD" strokeWidth="2" />
            <line x1="195" y1="184" x2="195" y2="200" stroke="#BAE6FD" strokeWidth="2" />

            {/* Pink Trash Bin */}
            <rect x="154" y="180" width="15" height="30" rx="1" fill="#EC4899" />
            <rect x="152" y="178" width="19" height="3" fill="#F472B6" />
          </g>
        </svg>
      );

    case 'cyberpunk-rain':
      return (
        <svg
          viewBox="0 0 240 240"
          className={`${className} image-render-pixel`}
          style={{ imageRendering: 'pixelated' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep moody purple night */}
          <rect width="240" height="240" fill="#1F1538" />

          {/* Distant Cyber City Skyscraper with Golden Windows */}
          <rect x="170" y="10" width="60" height="120" fill="#160E29" />
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 3 }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={178 + c * 16}
                y={18 + r * 13}
                width="6"
                height="5"
                fill={((r + c) % 2 === 0) ? '#FBBF24' : '#473663'}
              />
            ))
          )}

          {/* Left Storefront Building */}
          <rect x="24" y="42" width="102" height="138" fill="#2E214E" />
          <rect x="28" y="112" width="94" height="68" fill="#1B1230" />

          {/* Top Neon Sign "PARIS" / Cyber */}
          <rect x="0" y="15" width="65" height="16" fill="#4A044E" stroke="#EC4899" strokeWidth="1" />
          <text x="6" y="27" fill="#F472B6" fontSize="10" fontFamily="monospace" fontWeight="bold">PARIS</text>

          {/* Glowing Yellow Street Lantern */}
          <g>
            <circle cx="56" cy="65" r="9" fill="#F59E0B" />
            <line x1="30" y1="70" x2="56" y2="65" stroke="#94A3B8" strokeWidth="2" />
            <rect x="52" y="60" width="8" height="10" fill="#FDE68A" />
            {/* Light aura */}
            <circle cx="56" cy="65" r="16" fill="#FBBF24" opacity="0.25" />
          </g>

          {/* Shop Windows with Neon Glow */}
          <rect x="36" y="130" width="40" height="46" fill="#3B2660" stroke="#8B5CF6" strokeWidth="2" />
          {/* Shadow of dancing patron */}
          <path d="M 52 144 L 56 140 L 60 144 L 58 156 L 64 168 L 56 160 L 48 168 Z" fill="#180D2B" />

          {/* Yellow Door / Vending */}
          <rect x="84" y="132" width="18" height="44" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <line x1="88" y1="140" x2="98" y2="140" stroke="#78350F" strokeWidth="2" />
          <line x1="88" y1="148" x2="98" y2="148" stroke="#78350F" strokeWidth="2" />
          <line x1="88" y1="156" x2="98" y2="156" stroke="#78350F" strokeWidth="2" />

          {/* Middle Vertical Neon "VAN" */}
          <rect x="120" y="46" width="24" height="84" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
          <text x="125" y="70" fill="#22D3EE" fontSize="12" fontFamily="monospace" fontWeight="900">V</text>
          <text x="125" y="94" fill="#22D3EE" fontSize="12" fontFamily="monospace" fontWeight="900">A</text>
          <text x="125" y="118" fill="#22D3EE" fontSize="12" fontFamily="monospace" fontWeight="900">N</text>

          {/* Red Building with Staircase */}
          <rect x="144" y="60" width="50" height="120" fill="#7F1D1D" />
          <rect x="160" y="128" width="16" height="52" fill="#450A0A" />

          {/* Wet Street Ground & Reflections (The Masterpiece) */}
          <rect x="0" y="174" width="240" height="66" fill="#180B2B" />
          
          {/* Puddle reflections */}
          <ellipse cx="60" cy="205" rx="42" ry="12" fill="#581C87" opacity="0.6" />
          <ellipse cx="120" cy="216" rx="55" ry="14" fill="#3B0764" opacity="0.7" />
          {/* Neon water ripples */}
          <rect x="30" y="200" width="24" height="2" fill="#F472B6" opacity="0.7" />
          <rect x="80" y="212" width="30" height="3" fill="#38BDF8" opacity="0.7" />
          <rect x="45" y="218" width="40" height="2" fill="#FDE047" opacity="0.6" />
          <rect x="140" y="222" width="35" height="2" fill="#F43F5E" opacity="0.6" />

          {/* Red Compact City Car on right */}
          <g>
            <rect x="188" y="148" width="50" height="42" rx="4" fill="#DC2626" />
            <rect x="194" y="154" width="38" height="20" rx="3" fill="#450A0A" />
            {/* Rear Window reflection */}
            <rect x="198" y="158" width="30" height="14" rx="2" fill="#60A5FA" opacity="0.5" />
            <circle cx="198" cy="192" r="7" fill="#18181B" />
            <circle cx="230" cy="192" r="7" fill="#18181B" />
            {/* Tail Light Glow */}
            <rect x="188" y="174" width="6" height="6" fill="#F87171" />
          </g>

          {/* Street Planter box */}
          <rect x="74" y="170" width="46" height="22" fill="#71717A" stroke="#3F3F46" strokeWidth="2" />
          <circle cx="86" cy="168" r="7" fill="#15803D" />
          <circle cx="98" cy="166" r="8" fill="#16A34A" />
          <circle cx="110" cy="168" r="6" fill="#15803D" />
        </svg>
      );

    case 'sakura-cliff':
      return (
        <svg
          viewBox="0 0 240 240"
          className={`${className} image-render-pixel`}
          style={{ imageRendering: 'pixelated' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sunset Dusk Sky Gradient */}
          <defs>
            <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E1B4E" />
              <stop offset="40%" stopColor="#582963" />
              <stop offset="70%" stopColor="#9C4465" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect width="240" height="240" fill="url(#sunsetGrad)" />

          {/* Distant Mountain Range */}
          <polygon points="120,180 160,150 190,175 240,160 240,240 120,240" fill="#581C87" opacity="0.4" />

          {/* Sun Glow on Sea Horizon */}
          <rect x="140" y="176" width="100" height="64" fill="#311042" />
          <ellipse cx="200" cy="178" rx="35" ry="4" fill="#FDE68A" opacity="0.6" />

          {/* Left Dramatic Precipice / Cliff */}
          <path
            d="M 0 115 Q 60 118 100 135 L 120 148 L 98 175 L 80 240 L 0 240 Z"
            fill="#1E142B"
          />
          {/* Cliff rock facets */}
          <polygon points="20,135 65,140 50,175 10,165" fill="#2D2140" />
          <polygon points="50,175 90,160 82,210 38,205" fill="#2D2140" />

          {/* Glowing Sunset Waterfalls from Cliff */}
          <rect x="70" y="172" width="6" height="68" fill="#F43F5E" />
          <rect x="72" y="172" width="3" height="68" fill="#FDE047" />

          <rect x="85" y="175" width="5" height="65" fill="#FB7185" />
          <rect x="86" y="175" width="2.5" height="65" fill="#FEF08A" />

          {/* The Ancient Cherry Blossom Tree */}
          <g className={animated ? 'animate-float-gentle' : ''}>
            {/* Twisted Trunk */}
            <path
              d="M 98 140 Q 120 130 130 115 Q 122 100 135 90"
              fill="none"
              stroke="#180F24"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 125 110 Q 145 105 152 92"
              fill="none"
              stroke="#180F24"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 115 115 Q 98 108 92 98"
              fill="none"
              stroke="#180F24"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Lush Pink Pixel Blossom Canopy */}
            {/* Back darker pink clumps */}
            <ellipse cx="135" cy="85" rx="42" ry="24" fill="#9D174D" />
            <ellipse cx="108" cy="95" rx="26" ry="18" fill="#9D174D" />
            <ellipse cx="162" cy="92" rx="28" ry="18" fill="#9D174D" />

            {/* Mid vibrant rose blossom pixels */}
            <ellipse cx="132" cy="80" rx="38" ry="22" fill="#E11D48" />
            <ellipse cx="105" cy="90" rx="24" ry="16" fill="#F43F5E" />
            <ellipse cx="160" cy="88" rx="25" ry="16" fill="#F43F5E" />

            {/* Front soft light cherry blossom highlights */}
            <ellipse cx="130" cy="74" rx="32" ry="16" fill="#FBCFE8" />
            <ellipse cx="110" cy="82" rx="18" ry="12" fill="#FDE8EF" />
            <ellipse cx="155" cy="82" rx="20" ry="12" fill="#FDE8EF" />

            {/* Falling sakura petals */}
            <circle cx="118" cy="115" r="2" fill="#FBCFE8" />
            <circle cx="145" cy="120" r="2.5" fill="#FBCFE8" />
            <circle cx="135" cy="140" r="2" fill="#FDE8EF" />
            <circle cx="160" cy="148" r="2" fill="#FBCFE8" />
            <circle cx="172" cy="165" r="2.5" fill="#FDE8EF" />
          </g>
        </svg>
      );

    case 'ghibli-meadow':
      return (
        <svg
          viewBox="0 0 240 240"
          className={`${className} image-render-pixel`}
          style={{ imageRendering: 'pixelated' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vibrant Ghibli Sky Blue */}
          <rect width="240" height="240" fill="#1E3A8A" />

          {/* Majestic Billowing Anime Cumulus Clouds */}
          <g>
            {/* Top dark cloud shading */}
            <ellipse cx="80" cy="70" rx="55" ry="40" fill="#1E40AF" />
            <ellipse cx="145" cy="65" rx="60" ry="42" fill="#1E40AF" />
            <ellipse cx="205" cy="80" rx="45" ry="32" fill="#1E40AF" />

            {/* Mid fluffy cloud body */}
            <ellipse cx="80" cy="60" rx="50" ry="34" fill="#60A5FA" />
            <ellipse cx="140" cy="55" rx="54" ry="36" fill="#93C5FD" />
            <ellipse cx="195" cy="70" rx="40" ry="26" fill="#60A5FA" />

            {/* Creamy white cloud peaks */}
            <ellipse cx="75" cy="48" rx="42" ry="26" fill="#F8FAFC" />
            <ellipse cx="132" cy="42" rx="48" ry="28" fill="#FFFFFF" />
            <ellipse cx="185" cy="58" rx="34" ry="20" fill="#F8FAFC" />

            {/* Sun Rim Glow */}
            <circle cx="35" cy="45" r="8" fill="#FDE047" opacity="0.8" />
          </g>

          {/* Distant Rolling Mountains */}
          <polygon points="0,115 50,95 110,118 160,98 220,115 240,110 240,150 0,150" fill="#155E75" />

          {/* Rolling Midground Green Fields */}
          <ellipse cx="60" cy="150" rx="110" ry="35" fill="#15803D" />
          <ellipse cx="180" cy="142" rx="90" ry="28" fill="#16A34A" />

          {/* Calm Blue Lake in the valley */}
          <ellipse cx="100" cy="150" rx="60" ry="12" fill="#0284C7" />
          <ellipse cx="98" cy="150" rx="45" ry="7" fill="#38BDF8" />

          {/* Foreground Lush Grassland with Wind Motion */}
          <path
            d="M 0 170 Q 70 155 130 178 Q 190 162 240 185 L 240 240 L 0 240 Z"
            fill="#166534"
          />
          {/* Bright yellow-green sunlit grass slope */}
          <path
            d="M 80 182 Q 150 170 240 188 L 240 240 L 100 240 Z"
            fill="#65A30D"
          />

          {/* Foreground Wildflowers and Grass Stalks */}
          <g>
            {/* Big foreground bush on bottom left */}
            <ellipse cx="40" cy="205" rx="32" ry="26" fill="#14532D" />
            <ellipse cx="38" cy="198" rx="25" ry="18" fill="#166534" />

            {/* Pink and Blue wildflowers */}
            <circle cx="120" cy="210" r="3.5" fill="#F43F5E" />
            <circle cx="124" cy="218" r="3" fill="#FB7185" />
            <circle cx="178" cy="222" r="3.5" fill="#EC4899" />
            
            {/* Blue lupines / wild spikes */}
            <rect x="22" y="195" width="4" height="18" fill="#38BDF8" rx="1" />
            <rect x="24" y="185" width="2" height="10" fill="#93C5FD" />
            <rect x="200" y="205" width="4" height="22" fill="#38BDF8" rx="1" />
          </g>
        </svg>
      );

    case 'spacewalker':
      return (
        <svg
          viewBox="0 0 240 240"
          className={`${className} image-render-pixel`}
          style={{ imageRendering: 'pixelated' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vast deep space void */}
          <rect width="240" height="240" fill="#0B0F19" />

          {/* Distant Starfield and colorful nebulae */}
          <circle cx="35" cy="28" r="1.5" fill="#FDE047" />
          <circle cx="78" cy="62" r="1" fill="#F472B6" />
          <circle cx="115" cy="18" r="2" fill="#38BDF8" />
          <circle cx="28" cy="145" r="2" fill="#A78BFA" />
          <circle cx="152" cy="148" r="1.5" fill="#FDE047" />
          <circle cx="188" cy="185" r="2" fill="#F43F5E" />
          <circle cx="218" cy="205" r="1" fill="#38BDF8" />
          <circle cx="118" cy="225" r="1.5" fill="#F472B6" />

          {/* Large Swirling Teal & White Planet Horizon (Top Right) */}
          <g>
            <circle cx="230" cy="25" r="115" fill="#0D9488" />
            <circle cx="230" cy="25" r="105" fill="#14B8A6" />
            <circle cx="230" cy="25" r="90" fill="#5EEAD4" />
            {/* Atmospheric storm clouds swirl */}
            <path
              d="M 160 40 Q 200 10 240 50 Q 210 70 170 55 Z"
              fill="#FFFFFF"
              opacity="0.8"
            />
            <path
              d="M 140 10 Q 180 -15 220 20 Q 180 30 140 15 Z"
              fill="#CCFBF1"
              opacity="0.7"
            />
          </g>

          {/* Orbital Shuttle Craft in distance */}
          <g transform="translate(42, 50) rotate(-25)">
            <polygon points="0,12 18,0 36,12 28,28 8,28" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
            <rect x="8" y="10" width="20" height="8" rx="2" fill="#0284C7" />
            {/* Thruster exhaust spark */}
            <polygon points="36,14 48,18 36,22" fill="#F97316" />
            <polygon points="36,16 44,18 36,20" fill="#FEF08A" />
          </g>

          {/* Curving Life-Support Tether line */}
          <path
            d="M 68 85 Q 35 125 78 140 Q 95 145 92 158"
            fill="none"
            stroke="#F472B6"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* The Astronaut (Retro Orange Spacesuit) */}
          <g className={animated ? 'animate-float-gentle' : ''} transform="translate(68, 120) rotate(15)">
            {/* Backpack / Life Support Unit */}
            <rect x="-10" y="8" width="16" height="34" rx="3" fill="#94A3B8" stroke="#475569" strokeWidth="2" />

            {/* Astronaut Torso (Orange) */}
            <rect x="0" y="12" width="28" height="32" rx="4" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
            {/* Chest harness / chest pack */}
            <line x1="2" y1="12" x2="26" y2="36" stroke="#18181B" strokeWidth="2.5" />
            <line x1="26" y1="12" x2="2" y2="36" stroke="#18181B" strokeWidth="2.5" />
            <rect x="10" y="20" width="8" height="8" fill="#F8FAFC" />

            {/* Helmet & Visor */}
            <circle cx="14" cy="2" r="17" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
            <ellipse cx="15" cy="2" rx="12" ry="11" fill="#0F172A" />
            <ellipse cx="14" cy="2" rx="10" ry="9" fill="#06B6D4" />
            {/* Visor Glare Reflection */}
            <ellipse cx="11" cy="-2" rx="4" ry="3" fill="#E0F2FE" />

            {/* Left Arm and Glove */}
            <path d="M 0 16 L -14 22 L -18 32" fill="none" stroke="#C2410C" strokeWidth="7" strokeLinecap="round" />
            <circle cx="-18" cy="32" r="4.5" fill="#7C2D12" />

            {/* Right Arm and Glove */}
            <path d="M 28 16 L 36 26 L 38 38" fill="none" stroke="#EA580C" strokeWidth="7" strokeLinecap="round" />
            <circle cx="38" cy="38" r="4.5" fill="#7C2D12" />

            {/* Left Leg and Boot */}
            <path d="M 6 44 L 2 64 L -4 74" fill="none" stroke="#EA580C" strokeWidth="8" strokeLinecap="round" />
            <rect x="-8" y="72" width="10" height="7" rx="2" fill="#7C2D12" />

            {/* Right Leg and Boot */}
            <path d="M 22 44 L 20 62 L 18 72" fill="none" stroke="#C2410C" strokeWidth="8" strokeLinecap="round" />
            <rect x="14" y="70" width="10" height="7" rx="2" fill="#7C2D12" />
          </g>
        </svg>
      );

    case 'cozy-desk-cat':
      return (
        <svg
          viewBox="0 0 240 240"
          className={`${className} image-render-pixel`}
          style={{ imageRendering: 'pixelated' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Desk surface light lavender / warm paper hue */}
          <rect width="240" height="240" fill="#E2E8F0" />
          {/* Soft angled studio lamp light beam */}
          <polygon points="60,0 240,0 240,240 100,240" fill="#FDF4FF" opacity="0.65" />

          {/* Top Edge Desk Items (Monitor / Keyboard / Drink) */}
          <rect x="0" y="0" width="80" height="30" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
          {/* Drink Tumbler / Mug */}
          <rect x="105" y="6" width="28" height="36" rx="6" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
          <circle cx="119" cy="24" r="8" fill="#0369A1" />
          {/* Sticky Notes Box */}
          <rect x="148" y="0" width="42" height="24" fill="#047857" rx="2" />
          <text x="154" y="15" fill="#A7F3D0" fontSize="8" fontFamily="monospace">TEMPO</text>

          {/* Digital Drawing Tablet (Wacom style) on bottom left */}
          <g>
            <rect x="-10" y="45" width="145" height="175" rx="8" fill="#1E1B4B" stroke="#0F172A" strokeWidth="3" />
            {/* Active Drawing Screen (Glowing Pastel Blue) */}
            <rect x="0" y="58" width="125" height="148" fill="#818CF8" />
            
            {/* Drawn sketch of a tiny cat on screen */}
            <path
              d="M 25 110 Q 30 100 35 110 Q 40 100 45 110 L 45 125 L 25 125 Z"
              fill="none"
              stroke="#312E81"
              strokeWidth="2"
            />

            {/* Wacom Brand Logo at bottom */}
            <text x="10" y="195" fill="#E0E7FF" fontSize="11" fontFamily="monospace" fontWeight="bold">wacom</text>
          </g>

          {/* Artist Hand holding digital stylus pen */}
          <g>
            {/* Dark green sleeve cuff */}
            <path d="M 85 240 L 145 240 L 125 190 L 80 200 Z" fill="#064E3B" />
            {/* Arm / Wrist skin */}
            <path d="M 90 200 L 125 190 L 75 105 L 45 115 Z" fill="#FBCFE8" opacity="0.9" />

            {/* Stylus Pen */}
            <line x1="12" y1="116" x2="68" y2="70" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
            {/* Pen tip nib */}
            <polygon points="12,116 8,118 10,113" fill="#F8FAFC" />

            {/* Fingers gripping stylus */}
            <circle cx="38" cy="98" r="8" fill="#F472B6" />
            <circle cx="48" cy="92" r="7" fill="#F472B6" />
            <circle cx="30" cy="106" r="6" fill="#FBCFE8" />
          </g>

          {/* The Star: Chubby Striped Sleeping Tabby Cat */}
          <g className={animated ? 'animate-float-gentle' : ''}>
            {/* Cat Body (Curled up Oval) */}
            <ellipse cx="180" cy="95" rx="55" ry="42" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            {/* Dark Brown Tabby Stripes across back */}
            <path d="M 160 62 Q 170 82 165 96" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
            <path d="M 178 58 Q 188 80 185 98" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
            <path d="M 198 62 Q 206 82 202 96" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
            <path d="M 216 72 Q 222 90 215 106" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />

            {/* Cat Head */}
            <circle cx="126" cy="115" r="28" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            {/* Head Stripes */}
            <path d="M 118 92 L 122 104" stroke="#9A3412" strokeWidth="2.5" />
            <path d="M 126 90 L 126 104" stroke="#9A3412" strokeWidth="2.5" />
            <path d="M 134 92 L 130 104" stroke="#9A3412" strokeWidth="2.5" />

            {/* Cute Pointy Ears */}
            <polygon points="102,96 112,80 120,95" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            <polygon points="106,94 112,85 116,94" fill="#F472B6" />
            <polygon points="138,98 150,84 154,100" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            <polygon points="142,97 148,89 150,97" fill="#F472B6" />

            {/* White Muzzle & Sleeping Eyes */}
            <ellipse cx="120" cy="126" rx="14" ry="10" fill="#FFFFFF" />
            {/* Pink Nose */}
            <polygon points="117,126 123,126 120,130" fill="#EC4899" />
            {/* Sleeping closed slit eyes (Happy ^_^) */}
            <path d="M 104 114 Q 108 118 112 114" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
            <path d="M 130 114 Q 134 118 138 114" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />

            {/* White Paws tucked underneath */}
            <ellipse cx="138" cy="140" rx="14" ry="8" fill="#FFFFFF" stroke="#C2410C" strokeWidth="1.5" />
            
            {/* Cozy breathing indicator "z z z" */}
            <text x="148" y="105" fill="#818CF8" fontSize="10" fontFamily="monospace" fontWeight="bold">z</text>
            <text x="156" y="98" fill="#818CF8" fontSize="12" fontFamily="monospace" fontWeight="bold">z</text>
          </g>
        </svg>
      );

    default:
      return null;
  }
};
