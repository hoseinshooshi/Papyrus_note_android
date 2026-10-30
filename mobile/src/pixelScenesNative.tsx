import React from "react";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

interface PixelSceneIllustrationProps {
  sceneId: string;
  animated?: boolean;
}

export const PixelSceneIllustrationNative: React.FC<PixelSceneIllustrationProps> = ({
  sceneId,
  animated = false,
}) => {
  switch (sceneId) {
    case 'wanderer':
      return (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 200 240"
        >
          {/* Background parchment scanline texture */}
          <Rect width="200" height="240" fill="#E8DEC9" />
          <G opacity="0.15">
            {Array.from({ length: 48 }).map((_, i) => (
              <Line key={i} x1="0" y1={i * 5} x2="200" y2={i * 5} stroke="#3D2E1E" strokeWidth="1" />
            ))}
          </G>

          {/* Crescent Moon Spear in Background */}
          <G>
            {/* Wooden Staff shaft */}
            <Line x1="60" y1="30" x2="160" y2="185" stroke="#251C17" strokeWidth="4" strokeLinecap="square" />
            
            {/* Crescent Spear Blade (Pixelated steps) */}
            <Path
              d="M 50 15 C 65 15, 75 25, 75 40 C 70 32, 60 27, 45 28 C 43 23, 46 17, 50 15 Z"
              fill="#E0F2FE"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            {/* Spear Tip */}
            <Polygon points="38,25 58,12 48,32" fill="#BAE6FD" />
            
            {/* Red Ribbons on Staff */}
            <Path
              d="M 68 40 Q 60 52 50 50 Q 56 46 66 43 Z"
              fill="#E11D48"
            />
            <Path
              d="M 72 45 Q 85 58 78 68 Q 72 60 70 48 Z"
              fill="#BE123C"
            />
            <Circle cx="72" cy="42" r="3.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />

            {/* Behind Sword/Rod */}
            <Line x1="55" y1="55" x2="170" y2="165" stroke="#18181B" strokeWidth="3" />

            {/* Shadow under feet */}
            <Ellipse cx="102" cy="216" rx="26" ry="4" fill="#3D2E1E" opacity="0.3" />

            {/* Main Wanderer Body */}
            {/* Antler / Feather Mask */}
            {/* Left ear/horn */}
            <Rect x="91" y="60" width="4" height="18" fill="#C2A67D" />
            <Rect x="92" y="62" width="2" height="14" fill="#4B3B28" />
            {/* Right ear/horn */}
            <Rect x="109" y="60" width="4" height="18" fill="#2E243D" />
            <Rect x="110" y="62" width="2" height="14" fill="#1C1526" />

            {/* Head/Mask */}
            <Rect x="88" y="74" width="28" height="24" rx="2" fill="#3C2A3E" />
            <Rect x="92" y="78" width="8" height="12" fill="#E2C799" />
            {/* Eye sockets */}
            <Rect x="95" y="83" width="3" height="4" fill="#1C1526" />
            <Rect x="106" y="83" width="3" height="4" fill="#1C1526" />
            {/* Golden glowing pupil */}
            <Rect x="96" y="84" width="1.5" height="1.5" fill="#FDE047" />
            <Rect x="107" y="84" width="1.5" height="1.5" fill="#FDE047" />

            {/* Patterned Turquoise Neck Scarf */}
            <Rect x="84" y="96" width="36" height="12" fill="#0D9488" />
            <Rect x="86" y="98" width="32" height="4" fill="#14B8A6" />
            {/* Geometric scarf tribal pattern */}
            <Polygon points="88,98 92,102 96,98" fill="#FEF3C7" />
            <Polygon points="98,98 102,102 106,98" fill="#FEF3C7" />
            <Polygon points="108,98 112,102 116,98" fill="#FEF3C7" />

            {/* White & Red Patterned Shoulder Wrap (Poncho) */}
            <Path d="M 76 106 L 86 98 L 86 142 L 74 136 Z" fill="#F8FAFC" />
            <Path d="M 74 136 L 86 142 L 86 148 L 74 144 Z" fill="#0D9488" />
            <Line x1="77" y1="112" x2="84" y2="114" stroke="#DC2626" strokeWidth="2" />
            <Line x1="77" y1="120" x2="84" y2="124" stroke="#DC2626" strokeWidth="2" />

            {/* Diagonal Turquoise Sash */}
            <Polygon points="86,108 126,132 122,140 86,118" fill="#0F766E" />
            {/* Chevron notches */}
            <Line x1="94" y1="114" x2="98" y2="119" stroke="#99F6E4" strokeWidth="2" />
            <Line x1="104" y1="120" x2="108" y2="125" stroke="#99F6E4" strokeWidth="2" />
            <Line x1="114" y1="126" x2="118" y2="131" stroke="#99F6E4" strokeWidth="2" />

            {/* Main Tattered Nomad Robes & Pouches */}
            <Rect x="86" y="112" width="44" height="65" fill="#2E243A" />
            {/* Travel Satchel / Ribs details */}
            <Rect x="92" y="128" width="22" height="18" fill="#1C1426" stroke="#4C3A5E" strokeWidth="1" />
            <Rect x="95" y="132" width="16" height="2" fill="#E2C799" />
            <Rect x="95" y="138" width="16" height="2" fill="#E2C799" />
            
            {/* Small pouches */}
            <Circle cx="118" cy="136" r="3.5" fill="#581C87" />
            <Circle cx="122" cy="144" r="3" fill="#701A75" />

            {/* Tattered lower robe fringes */}
            <Polygon points="86,177 92,205 96,177 101,212 106,177 114,208 120,177 124,202 128,177" fill="#1E1627" />

            {/* Nomad Staff & Legs */}
            <Rect x="98" y="202" width="4" height="14" fill="#18181B" />
            <Rect x="114" y="200" width="4" height="16" fill="#18181B" />
            <Rect x="96" y="214" width="7" height="3" fill="#3F3F46" />
            <Rect x="112" y="214" width="7" height="3" fill="#3F3F46" />
          </G>
        </Svg>
      );

    case 'ramen-shop':
      return (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 240 240"
        >
          {/* Crisp sky blue background */}
          <Rect width="240" height="240" fill="#7DD3FC" />

          {/* Street Ground */}
          <Line x1="0" y1="210" x2="240" y2="210" stroke="#0369A1" strokeWidth="3" />

          {/* Left Street Lamp & Stacked Signpost */}
          <G>
            <Rect x="25" y="90" width="4" height="120" fill="#1E293B" />
            {/* Top crossbar */}
            <Rect x="15" y="90" width="24" height="4" fill="#0F172A" />
            <Rect x="17" y="94" width="4" height="8" fill="#38BDF8" />
            <Rect x="31" y="94" width="4" height="8" fill="#38BDF8" />
            {/* Street signs stacked on pole */}
            <Rect x="20" y="130" width="14" height="12" fill="#F472B6" />
            <Rect x="20" y="146" width="14" height="14" fill="#38BDF8" />
            <Rect x="20" y="164" width="14" height="12" fill="#FDE047" />
            {/* Base */}
            <Polygon points="21,210 27,198 33,210" fill="#0F172A" />
          </G>

          {/* Ramen Shop Main Building */}
          <Rect x="52" y="55" width="140" height="155" fill="#3B82F6" />
          {/* Top Awning Roof - Pink/Magenta & Cream stripes */}
          <G>
            <Rect x="50" y="55" width="105" height="24" fill="#EC4899" />
            <Rect x="50" y="55" width="15" height="24" fill="#FBCFE8" />
            <Rect x="80" y="55" width="15" height="24" fill="#FBCFE8" />
            <Rect x="110" y="55" width="15" height="24" fill="#FBCFE8" />
            <Rect x="140" y="55" width="15" height="24" fill="#FBCFE8" />
          </G>

          {/* Upper Rooftop AC Unit */}
          <Rect x="160" y="58" width="30" height="20" fill="#0284C7" stroke="#1E293B" strokeWidth="2" />
          <Circle cx="175" cy="68" r="6" fill="#0369A1" />
          <Line x1="169" y1="68" x2="181" y2="68" stroke="#38BDF8" strokeWidth="1.5" />
          <Line x1="175" y1="62" x2="175" y2="74" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Upper Signboards (Yellow & Neon) */}
          <Rect x="56" y="82" width="88" height="24" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
          {/* Fictional pixel glyphs */}
          <G fill="#EA580C">
            <Rect x="62" y="87" width="8" height="4" />
            <Rect x="66" y="91" width="4" height="10" />
            <Rect x="76" y="87" width="10" height="3" />
            <Rect x="80" y="90" width="3" height="11" />
            <Rect x="92" y="87" width="10" height="14" rx="1" />
            <Rect x="108" y="87" width="12" height="3" />
            <Rect x="112" y="90" width="4" height="11" />
            <Rect x="126" y="89" width="10" height="10" />
          </G>

          {/* Right Small Neon Board */}
          <Rect x="148" y="82" width="48" height="24" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
          <Rect x="154" y="88" width="12" height="12" fill="#FB923C" />
          <Rect x="172" y="88" width="18" height="12" fill="#38BDF8" />

          {/* Middle Turquoise Slanted Canopy Awning */}
          <Polygon points="38,138 148,138 148,110 50,110" fill="#06B6D4" />
          {/* Slanted stripes */}
          <Polygon points="56,138 72,138 78,110 62,110" fill="#CFFAFE" />
          <Polygon points="88,138 104,138 110,110 94,110" fill="#CFFAFE" />
          <Polygon points="120,138 136,138 142,110 126,110" fill="#CFFAFE" />

          {/* Open Shop Interior (Dark Cozy Depth) */}
          <Rect x="60" y="138" width="84" height="72" fill="#172554" />
          {/* Hanging cozy lanterns */}
          <Circle cx="78" cy="150" r="3" fill="#FDE047" />
          <Line x1="78" y1="138" x2="78" y2="147" stroke="#94A3B8" />
          <Circle cx="124" cy="148" r="3" fill="#FDE047" />
          <Line x1="124" y1="138" x2="124" y2="145" stroke="#94A3B8" />

          {/* Ramen Cook Silhouette inside */}
          <Rect x="94" y="154" width="16" height="18" rx="2" fill="#F472B6" />
          <Circle cx="102" cy="150" r="6" fill="#FBCFE8" />

          {/* Bar Counter and Striped Wooden Panels */}
          <Rect x="60" y="180" width="84" height="30" fill="#38BDF8" />
          {/* Vertical wood ribs */}
          {Array.from({ length: 9 }).map((_, i) => (
            <Rect key={i} x={66 + i * 9} y="184" width="4" height="24" fill="#FEF08A" />
          ))}

          {/* Right Side Wall Pipes, Fusebox & AC Outdoor Unit */}
          <G>
            <Rect x="154" y="112" width="28" height="30" fill="#1E40AF" />
            {/* Silver Pipes */}
            <Path d="M 158 126 H 188 V 172 H 180" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
            <Path d="M 164 136 H 176 V 162 H 164" fill="none" stroke="#93C5FD" strokeWidth="2" />
            
            {/* Big AC Compressor Fan Unit */}
            <Rect x="174" y="174" width="42" height="36" fill="#1E3A8A" stroke="#0F172A" strokeWidth="2" />
            <Circle cx="195" cy="192" r="12" fill="#0284C7" />
            {/* Spinning fan blades */}
            <Line x1="187" y1="192" x2="203" y2="192" stroke="#BAE6FD" strokeWidth="2" />
            <Line x1="195" y1="184" x2="195" y2="200" stroke="#BAE6FD" strokeWidth="2" />

            {/* Pink Trash Bin */}
            <Rect x="154" y="180" width="15" height="30" rx="1" fill="#EC4899" />
            <Rect x="152" y="178" width="19" height="3" fill="#F472B6" />
          </G>
        </Svg>
      );

    case 'cyberpunk-rain':
      return (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 240 240"
        >
          {/* Deep moody purple night */}
          <Rect width="240" height="240" fill="#1F1538" />

          {/* Distant Cyber City Skyscraper with Golden Windows */}
          <Rect x="170" y="10" width="60" height="120" fill="#160E29" />
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 3 }).map((_, c) => (
              <Rect
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
          <Rect x="24" y="42" width="102" height="138" fill="#2E214E" />
          <Rect x="28" y="112" width="94" height="68" fill="#1B1230" />

          {/* Top Neon Sign "PARIS" / Cyber */}
          <Rect x="0" y="15" width="65" height="16" fill="#4A044E" stroke="#EC4899" strokeWidth="1" />
          <SvgText x="6" y="27" fill="#F472B6" fontSize="10" fontFamily="monospace" fontWeight="bold">PARIS</SvgText>

          {/* Glowing Yellow Street Lantern */}
          <G>
            <Circle cx="56" cy="65" r="9" fill="#F59E0B" />
            <Line x1="30" y1="70" x2="56" y2="65" stroke="#94A3B8" strokeWidth="2" />
            <Rect x="52" y="60" width="8" height="10" fill="#FDE68A" />
            {/* Light aura */}
            <Circle cx="56" cy="65" r="16" fill="#FBBF24" opacity="0.25" />
          </G>

          {/* Shop Windows with Neon Glow */}
          <Rect x="36" y="130" width="40" height="46" fill="#3B2660" stroke="#8B5CF6" strokeWidth="2" />
          {/* Shadow of dancing patron */}
          <Path d="M 52 144 L 56 140 L 60 144 L 58 156 L 64 168 L 56 160 L 48 168 Z" fill="#180D2B" />

          {/* Yellow Door / Vending */}
          <Rect x="84" y="132" width="18" height="44" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <Line x1="88" y1="140" x2="98" y2="140" stroke="#78350F" strokeWidth="2" />
          <Line x1="88" y1="148" x2="98" y2="148" stroke="#78350F" strokeWidth="2" />
          <Line x1="88" y1="156" x2="98" y2="156" stroke="#78350F" strokeWidth="2" />

          {/* Middle Vertical Neon "VAN" */}
          <Rect x="120" y="46" width="24" height="84" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
          <SvgText x="125" y="70" fill="#22D3EE" fontSize="12" fontFamily="monospace" fontWeight="900">V</SvgText>
          <SvgText x="125" y="94" fill="#22D3EE" fontSize="12" fontFamily="monospace" fontWeight="900">A</SvgText>
          <SvgText x="125" y="118" fill="#22D3EE" fontSize="12" fontFamily="monospace" fontWeight="900">N</SvgText>

          {/* Red Building with Staircase */}
          <Rect x="144" y="60" width="50" height="120" fill="#7F1D1D" />
          <Rect x="160" y="128" width="16" height="52" fill="#450A0A" />

          {/* Wet Street Ground & Reflections (The Masterpiece) */}
          <Rect x="0" y="174" width="240" height="66" fill="#180B2B" />
          
          {/* Puddle reflections */}
          <Ellipse cx="60" cy="205" rx="42" ry="12" fill="#581C87" opacity="0.6" />
          <Ellipse cx="120" cy="216" rx="55" ry="14" fill="#3B0764" opacity="0.7" />
          {/* Neon water ripples */}
          <Rect x="30" y="200" width="24" height="2" fill="#F472B6" opacity="0.7" />
          <Rect x="80" y="212" width="30" height="3" fill="#38BDF8" opacity="0.7" />
          <Rect x="45" y="218" width="40" height="2" fill="#FDE047" opacity="0.6" />
          <Rect x="140" y="222" width="35" height="2" fill="#F43F5E" opacity="0.6" />

          {/* Red Compact City Car on right */}
          <G>
            <Rect x="188" y="148" width="50" height="42" rx="4" fill="#DC2626" />
            <Rect x="194" y="154" width="38" height="20" rx="3" fill="#450A0A" />
            {/* Rear Window reflection */}
            <Rect x="198" y="158" width="30" height="14" rx="2" fill="#60A5FA" opacity="0.5" />
            <Circle cx="198" cy="192" r="7" fill="#18181B" />
            <Circle cx="230" cy="192" r="7" fill="#18181B" />
            {/* Tail Light Glow */}
            <Rect x="188" y="174" width="6" height="6" fill="#F87171" />
          </G>

          {/* Street Planter box */}
          <Rect x="74" y="170" width="46" height="22" fill="#71717A" stroke="#3F3F46" strokeWidth="2" />
          <Circle cx="86" cy="168" r="7" fill="#15803D" />
          <Circle cx="98" cy="166" r="8" fill="#16A34A" />
          <Circle cx="110" cy="168" r="6" fill="#15803D" />
        </Svg>
      );

    case 'sakura-cliff':
      return (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 240 240"
        >
          {/* Sunset Dusk Sky Gradient */}
          <Defs>
            <LinearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#2E1B4E" />
              <Stop offset="40%" stopColor="#582963" />
              <Stop offset="70%" stopColor="#9C4465" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </LinearGradient>
          </Defs>
          <Rect width="240" height="240" fill="url(#sunsetGrad)" />

          {/* Distant Mountain Range */}
          <Polygon points="120,180 160,150 190,175 240,160 240,240 120,240" fill="#581C87" opacity="0.4" />

          {/* Sun Glow on Sea Horizon */}
          <Rect x="140" y="176" width="100" height="64" fill="#311042" />
          <Ellipse cx="200" cy="178" rx="35" ry="4" fill="#FDE68A" opacity="0.6" />

          {/* Left Dramatic Precipice / Cliff */}
          <Path
            d="M 0 115 Q 60 118 100 135 L 120 148 L 98 175 L 80 240 L 0 240 Z"
            fill="#1E142B"
          />
          {/* Cliff rock facets */}
          <Polygon points="20,135 65,140 50,175 10,165" fill="#2D2140" />
          <Polygon points="50,175 90,160 82,210 38,205" fill="#2D2140" />

          {/* Glowing Sunset Waterfalls from Cliff */}
          <Rect x="70" y="172" width="6" height="68" fill="#F43F5E" />
          <Rect x="72" y="172" width="3" height="68" fill="#FDE047" />

          <Rect x="85" y="175" width="5" height="65" fill="#FB7185" />
          <Rect x="86" y="175" width="2.5" height="65" fill="#FEF08A" />

          {/* The Ancient Cherry Blossom Tree */}
          <G>
            {/* Twisted Trunk */}
            <Path
              d="M 98 140 Q 120 130 130 115 Q 122 100 135 90"
              fill="none"
              stroke="#180F24"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <Path
              d="M 125 110 Q 145 105 152 92"
              fill="none"
              stroke="#180F24"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <Path
              d="M 115 115 Q 98 108 92 98"
              fill="none"
              stroke="#180F24"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Lush Pink Pixel Blossom Canopy */}
            {/* Back darker pink clumps */}
            <Ellipse cx="135" cy="85" rx="42" ry="24" fill="#9D174D" />
            <Ellipse cx="108" cy="95" rx="26" ry="18" fill="#9D174D" />
            <Ellipse cx="162" cy="92" rx="28" ry="18" fill="#9D174D" />

            {/* Mid vibrant rose blossom pixels */}
            <Ellipse cx="132" cy="80" rx="38" ry="22" fill="#E11D48" />
            <Ellipse cx="105" cy="90" rx="24" ry="16" fill="#F43F5E" />
            <Ellipse cx="160" cy="88" rx="25" ry="16" fill="#F43F5E" />

            {/* Front soft light cherry blossom highlights */}
            <Ellipse cx="130" cy="74" rx="32" ry="16" fill="#FBCFE8" />
            <Ellipse cx="110" cy="82" rx="18" ry="12" fill="#FDE8EF" />
            <Ellipse cx="155" cy="82" rx="20" ry="12" fill="#FDE8EF" />

            {/* Falling sakura petals */}
            <Circle cx="118" cy="115" r="2" fill="#FBCFE8" />
            <Circle cx="145" cy="120" r="2.5" fill="#FBCFE8" />
            <Circle cx="135" cy="140" r="2" fill="#FDE8EF" />
            <Circle cx="160" cy="148" r="2" fill="#FBCFE8" />
            <Circle cx="172" cy="165" r="2.5" fill="#FDE8EF" />
          </G>
        </Svg>
      );

    case 'ghibli-meadow':
      return (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 240 240"
        >
          {/* Vibrant Ghibli Sky Blue */}
          <Rect width="240" height="240" fill="#1E3A8A" />

          {/* Majestic Billowing Anime Cumulus Clouds */}
          <G>
            {/* Top dark cloud shading */}
            <Ellipse cx="80" cy="70" rx="55" ry="40" fill="#1E40AF" />
            <Ellipse cx="145" cy="65" rx="60" ry="42" fill="#1E40AF" />
            <Ellipse cx="205" cy="80" rx="45" ry="32" fill="#1E40AF" />

            {/* Mid fluffy cloud body */}
            <Ellipse cx="80" cy="60" rx="50" ry="34" fill="#60A5FA" />
            <Ellipse cx="140" cy="55" rx="54" ry="36" fill="#93C5FD" />
            <Ellipse cx="195" cy="70" rx="40" ry="26" fill="#60A5FA" />

            {/* Creamy white cloud peaks */}
            <Ellipse cx="75" cy="48" rx="42" ry="26" fill="#F8FAFC" />
            <Ellipse cx="132" cy="42" rx="48" ry="28" fill="#FFFFFF" />
            <Ellipse cx="185" cy="58" rx="34" ry="20" fill="#F8FAFC" />

            {/* Sun Rim Glow */}
            <Circle cx="35" cy="45" r="8" fill="#FDE047" opacity="0.8" />
          </G>

          {/* Distant Rolling Mountains */}
          <Polygon points="0,115 50,95 110,118 160,98 220,115 240,110 240,150 0,150" fill="#155E75" />

          {/* Rolling Midground Green Fields */}
          <Ellipse cx="60" cy="150" rx="110" ry="35" fill="#15803D" />
          <Ellipse cx="180" cy="142" rx="90" ry="28" fill="#16A34A" />

          {/* Calm Blue Lake in the valley */}
          <Ellipse cx="100" cy="150" rx="60" ry="12" fill="#0284C7" />
          <Ellipse cx="98" cy="150" rx="45" ry="7" fill="#38BDF8" />

          {/* Foreground Lush Grassland with Wind Motion */}
          <Path
            d="M 0 170 Q 70 155 130 178 Q 190 162 240 185 L 240 240 L 0 240 Z"
            fill="#166534"
          />
          {/* Bright yellow-green sunlit grass slope */}
          <Path
            d="M 80 182 Q 150 170 240 188 L 240 240 L 100 240 Z"
            fill="#65A30D"
          />

          {/* Foreground Wildflowers and Grass Stalks */}
          <G>
            {/* Big foreground bush on bottom left */}
            <Ellipse cx="40" cy="205" rx="32" ry="26" fill="#14532D" />
            <Ellipse cx="38" cy="198" rx="25" ry="18" fill="#166534" />

            {/* Pink and Blue wildflowers */}
            <Circle cx="120" cy="210" r="3.5" fill="#F43F5E" />
            <Circle cx="124" cy="218" r="3" fill="#FB7185" />
            <Circle cx="178" cy="222" r="3.5" fill="#EC4899" />
            
            {/* Blue lupines / wild spikes */}
            <Rect x="22" y="195" width="4" height="18" fill="#38BDF8" rx="1" />
            <Rect x="24" y="185" width="2" height="10" fill="#93C5FD" />
            <Rect x="200" y="205" width="4" height="22" fill="#38BDF8" rx="1" />
          </G>
        </Svg>
      );

    case 'spacewalker':
      return (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 240 240"
        >
          {/* Vast deep space void */}
          <Rect width="240" height="240" fill="#0B0F19" />

          {/* Distant Starfield and colorful nebulae */}
          <Circle cx="35" cy="28" r="1.5" fill="#FDE047" />
          <Circle cx="78" cy="62" r="1" fill="#F472B6" />
          <Circle cx="115" cy="18" r="2" fill="#38BDF8" />
          <Circle cx="28" cy="145" r="2" fill="#A78BFA" />
          <Circle cx="152" cy="148" r="1.5" fill="#FDE047" />
          <Circle cx="188" cy="185" r="2" fill="#F43F5E" />
          <Circle cx="218" cy="205" r="1" fill="#38BDF8" />
          <Circle cx="118" cy="225" r="1.5" fill="#F472B6" />

          {/* Large Swirling Teal & White Planet Horizon (Top Right) */}
          <G>
            <Circle cx="230" cy="25" r="115" fill="#0D9488" />
            <Circle cx="230" cy="25" r="105" fill="#14B8A6" />
            <Circle cx="230" cy="25" r="90" fill="#5EEAD4" />
            {/* Atmospheric storm clouds swirl */}
            <Path
              d="M 160 40 Q 200 10 240 50 Q 210 70 170 55 Z"
              fill="#FFFFFF"
              opacity="0.8"
            />
            <Path
              d="M 140 10 Q 180 -15 220 20 Q 180 30 140 15 Z"
              fill="#CCFBF1"
              opacity="0.7"
            />
          </G>

          {/* Orbital Shuttle Craft in distance */}
          <G transform="translate(42, 50) rotate(-25)">
            <Polygon points="0,12 18,0 36,12 28,28 8,28" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
            <Rect x="8" y="10" width="20" height="8" rx="2" fill="#0284C7" />
            {/* Thruster exhaust spark */}
            <Polygon points="36,14 48,18 36,22" fill="#F97316" />
            <Polygon points="36,16 44,18 36,20" fill="#FEF08A" />
          </G>

          {/* Curving Life-Support Tether line */}
          <Path
            d="M 68 85 Q 35 125 78 140 Q 95 145 92 158"
            fill="none"
            stroke="#F472B6"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* The Astronaut (Retro Orange Spacesuit) */}
          <G transform="translate(68, 120) rotate(15)">
            {/* Backpack / Life Support Unit */}
            <Rect x="-10" y="8" width="16" height="34" rx="3" fill="#94A3B8" stroke="#475569" strokeWidth="2" />

            {/* Astronaut Torso (Orange) */}
            <Rect x="0" y="12" width="28" height="32" rx="4" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
            {/* Chest harness / chest pack */}
            <Line x1="2" y1="12" x2="26" y2="36" stroke="#18181B" strokeWidth="2.5" />
            <Line x1="26" y1="12" x2="2" y2="36" stroke="#18181B" strokeWidth="2.5" />
            <Rect x="10" y="20" width="8" height="8" fill="#F8FAFC" />

            {/* Helmet & Visor */}
            <Circle cx="14" cy="2" r="17" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
            <Ellipse cx="15" cy="2" rx="12" ry="11" fill="#0F172A" />
            <Ellipse cx="14" cy="2" rx="10" ry="9" fill="#06B6D4" />
            {/* Visor Glare Reflection */}
            <Ellipse cx="11" cy="-2" rx="4" ry="3" fill="#E0F2FE" />

            {/* Left Arm and Glove */}
            <Path d="M 0 16 L -14 22 L -18 32" fill="none" stroke="#C2410C" strokeWidth="7" strokeLinecap="round" />
            <Circle cx="-18" cy="32" r="4.5" fill="#7C2D12" />

            {/* Right Arm and Glove */}
            <Path d="M 28 16 L 36 26 L 38 38" fill="none" stroke="#EA580C" strokeWidth="7" strokeLinecap="round" />
            <Circle cx="38" cy="38" r="4.5" fill="#7C2D12" />

            {/* Left Leg and Boot */}
            <Path d="M 6 44 L 2 64 L -4 74" fill="none" stroke="#EA580C" strokeWidth="8" strokeLinecap="round" />
            <Rect x="-8" y="72" width="10" height="7" rx="2" fill="#7C2D12" />

            {/* Right Leg and Boot */}
            <Path d="M 22 44 L 20 62 L 18 72" fill="none" stroke="#C2410C" strokeWidth="8" strokeLinecap="round" />
            <Rect x="14" y="70" width="10" height="7" rx="2" fill="#7C2D12" />
          </G>
        </Svg>
      );

    case 'cozy-desk-cat':
      return (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 240 240"
        >
          {/* Desk surface light lavender / warm paper hue */}
          <Rect width="240" height="240" fill="#E2E8F0" />
          {/* Soft angled studio lamp light beam */}
          <Polygon points="60,0 240,0 240,240 100,240" fill="#FDF4FF" opacity="0.65" />

          {/* Top Edge Desk Items (Monitor / Keyboard / Drink) */}
          <Rect x="0" y="0" width="80" height="30" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
          {/* Drink Tumbler / Mug */}
          <Rect x="105" y="6" width="28" height="36" rx="6" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
          <Circle cx="119" cy="24" r="8" fill="#0369A1" />
          {/* Sticky Notes Box */}
          <Rect x="148" y="0" width="42" height="24" fill="#047857" rx="2" />
          <SvgText x="154" y="15" fill="#A7F3D0" fontSize="8" fontFamily="monospace">TEMPO</SvgText>

          {/* Digital Drawing Tablet (Wacom style) on bottom left */}
          <G>
            <Rect x="-10" y="45" width="145" height="175" rx="8" fill="#1E1B4B" stroke="#0F172A" strokeWidth="3" />
            {/* Active Drawing Screen (Glowing Pastel Blue) */}
            <Rect x="0" y="58" width="125" height="148" fill="#818CF8" />
            
            {/* Drawn sketch of a tiny cat on screen */}
            <Path
              d="M 25 110 Q 30 100 35 110 Q 40 100 45 110 L 45 125 L 25 125 Z"
              fill="none"
              stroke="#312E81"
              strokeWidth="2"
            />

            {/* Wacom Brand Logo at bottom */}
            <SvgText x="10" y="195" fill="#E0E7FF" fontSize="11" fontFamily="monospace" fontWeight="bold">wacom</SvgText>
          </G>

          {/* Artist Hand holding digital stylus pen */}
          <G>
            {/* Dark green sleeve cuff */}
            <Path d="M 85 240 L 145 240 L 125 190 L 80 200 Z" fill="#064E3B" />
            {/* Arm / Wrist skin */}
            <Path d="M 90 200 L 125 190 L 75 105 L 45 115 Z" fill="#FBCFE8" opacity="0.9" />

            {/* Stylus Pen */}
            <Line x1="12" y1="116" x2="68" y2="70" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
            {/* Pen tip nib */}
            <Polygon points="12,116 8,118 10,113" fill="#F8FAFC" />

            {/* Fingers gripping stylus */}
            <Circle cx="38" cy="98" r="8" fill="#F472B6" />
            <Circle cx="48" cy="92" r="7" fill="#F472B6" />
            <Circle cx="30" cy="106" r="6" fill="#FBCFE8" />
          </G>

          {/* The Star: Chubby Striped Sleeping Tabby Cat */}
          <G>
            {/* Cat Body (Curled up Oval) */}
            <Ellipse cx="180" cy="95" rx="55" ry="42" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            {/* Dark Brown Tabby Stripes across back */}
            <Path d="M 160 62 Q 170 82 165 96" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
            <Path d="M 178 58 Q 188 80 185 98" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
            <Path d="M 198 62 Q 206 82 202 96" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
            <Path d="M 216 72 Q 222 90 215 106" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />

            {/* Cat Head */}
            <Circle cx="126" cy="115" r="28" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            {/* Head Stripes */}
            <Path d="M 118 92 L 122 104" stroke="#9A3412" strokeWidth="2.5" />
            <Path d="M 126 90 L 126 104" stroke="#9A3412" strokeWidth="2.5" />
            <Path d="M 134 92 L 130 104" stroke="#9A3412" strokeWidth="2.5" />

            {/* Cute Pointy Ears */}
            <Polygon points="102,96 112,80 120,95" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            <Polygon points="106,94 112,85 116,94" fill="#F472B6" />
            <Polygon points="138,98 150,84 154,100" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            <Polygon points="142,97 148,89 150,97" fill="#F472B6" />

            {/* White Muzzle & Sleeping Eyes */}
            <Ellipse cx="120" cy="126" rx="14" ry="10" fill="#FFFFFF" />
            {/* Pink Nose */}
            <Polygon points="117,126 123,126 120,130" fill="#EC4899" />
            {/* Sleeping closed slit eyes (Happy ^_^) */}
            <Path d="M 104 114 Q 108 118 112 114" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
            <Path d="M 130 114 Q 134 118 138 114" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />

            {/* White Paws tucked underneath */}
            <Ellipse cx="138" cy="140" rx="14" ry="8" fill="#FFFFFF" stroke="#C2410C" strokeWidth="1.5" />
            
            {/* Cozy breathing indicator "z z z" */}
            <SvgText x="148" y="105" fill="#818CF8" fontSize="10" fontFamily="monospace" fontWeight="bold">z</SvgText>
            <SvgText x="156" y="98" fill="#818CF8" fontSize="12" fontFamily="monospace" fontWeight="bold">z</SvgText>
          </G>
        </Svg>
      );

    default:
      return null;
  }
};
