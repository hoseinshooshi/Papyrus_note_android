import React from 'react';
import { UserProfile } from '../types';
import { getAvatarById } from '../data/pixelAvatars';
import { PixelSceneIllustration } from './PixelSceneIllustration';

interface PixelAvatarProps {
  character?: UserProfile;
  avatarId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  animated?: boolean;
  isWorking?: boolean;
  className?: string;
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({
  character,
  avatarId,
  size = 'md',
  animated = false,
  isWorking = false,
  className = '',
}) => {
  const targetId = avatarId || character?.avatarId || 'cat-tabby';
  const item = getAvatarById(targetId);

  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    hero: 'w-48 h-48',
  };

  // If this item is a featured full scene illustration
  if (item.isScene) {
    return (
      <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${sizeMap[size]} ${className}`}>
        {isWorking && (
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse blur-md opacity-60 pointer-events-none"
            style={{ background: item.borderHex }}
          />
        )}
        <div 
          className={`w-full h-full rounded-xl overflow-hidden border-2 shadow-xs relative flex items-center justify-center transition-transform duration-300 ${
            isWorking ? 'animate-bounce-subtle' : animated ? 'animate-float-gentle' : ''
          }`}
          style={{ borderColor: item.borderHex }}
        >
          <PixelSceneIllustration sceneId={item.id} animated={animated || isWorking} />
        </div>
      </div>
    );
  }

  // Render pixel art based on avatar id
  const renderPixelArt = (id: string) => {
    switch (id) {
      // 1. Orange Tabby Cat
      case 'cat-tabby':
        return (
          <g>
            {/* Ears */}
            <rect x="5" y="4" width="3" height="4" fill="#D97706" />
            <rect x="6" y="5" width="2" height="2" fill="#F472B6" />
            <rect x="16" y="4" width="3" height="4" fill="#D97706" />
            <rect x="16" y="5" width="2" height="2" fill="#F472B6" />
            {/* Head */}
            <rect x="5" y="7" width="14" height="9" fill="#F59E0B" />
            {/* Tabby forehead stripes */}
            <rect x="11" y="6" width="2" height="3" fill="#B45309" />
            <rect x="9" y="7" width="1" height="2" fill="#B45309" />
            <rect x="14" y="7" width="1" height="2" fill="#B45309" />
            {/* Cheeks / Muzzle */}
            <rect x="8" y="12" width="8" height="4" fill="#FEF3C7" />
            {/* Eyes */}
            <rect x="7" y="9" width="3" height="3" fill="#10B981" />
            <rect x="8" y="9" width="1" height="2" fill="#047857" />
            <rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="3" height="3" fill="#10B981" />
            <rect x="15" y="9" width="1" height="2" fill="#047857" />
            <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <rect x="11" y="12" width="2" height="1" fill="#F43F5E" />
            <rect x="10" y="13" width="4" height="1" fill="#78350F" />
            {/* Whiskers */}
            <rect x="3" y="11" width="2" height="1" fill="#78350F" />
            <rect x="3" y="13" width="2" height="1" fill="#78350F" />
            <rect x="19" y="11" width="2" height="1" fill="#78350F" />
            <rect x="19" y="13" width="2" height="1" fill="#78350F" />
            {/* Body */}
            <rect x="7" y="16" width="10" height="5" fill="#F59E0B" />
            <rect x="9" y="16" width="6" height="4" fill="#FEF3C7" />
            {/* Paws */}
            <rect x="8" y="19" width="3" height="2" fill="#FEF3C7" />
            <rect x="13" y="19" width="3" height="2" fill="#FEF3C7" />
          </g>
        );

      // 2. Midnight Black Cat
      case 'cat-black':
        return (
          <g>
            {/* Ears */}
            <rect x="5" y="4" width="3" height="4" fill="#18181B" />
            <rect x="6" y="5" width="2" height="2" fill="#71717A" />
            <rect x="16" y="4" width="3" height="4" fill="#18181B" />
            <rect x="16" y="5" width="2" height="2" fill="#71717A" />
            {/* Head */}
            <rect x="5" y="7" width="14" height="9" fill="#27272A" />
            {/* Golden Eyes */}
            <rect x="7" y="9" width="3" height="3" fill="#FBBF24" />
            <rect x="8" y="9" width="1" height="2" fill="#18181B" />
            <rect x="7" y="9" width="1" height="1" fill="#FEF08A" />
            <rect x="14" y="9" width="3" height="3" fill="#FBBF24" />
            <rect x="15" y="9" width="1" height="2" fill="#18181B" />
            <rect x="14" y="9" width="1" height="1" fill="#FEF08A" />
            {/* Nose & Mouth */}
            <rect x="11" y="12" width="2" height="1" fill="#F472B6" />
            {/* Red Collar with gold bell */}
            <rect x="7" y="16" width="10" height="1" fill="#EF4444" />
            <rect x="11" y="17" width="2" height="2" fill="#FBBF24" />
            {/* Body */}
            <rect x="6" y="17" width="12" height="4" fill="#18181B" />
            <rect x="9" y="18" width="6" height="3" fill="#FFFFFF" />
          </g>
        );

      // 3. Snowy White Kitten
      case 'cat-white':
        return (
          <g>
            {/* Ears */}
            <rect x="5" y="4" width="3" height="4" fill="#FFFFFF" />
            <rect x="6" y="5" width="2" height="2" fill="#FDA4AF" />
            <rect x="16" y="4" width="3" height="4" fill="#FFFFFF" />
            <rect x="16" y="5" width="2" height="2" fill="#FDA4AF" />
            {/* Head */}
            <rect x="5" y="7" width="14" height="9" fill="#FAFAFA" />
            {/* Blue Eyes */}
            <rect x="7" y="9" width="3" height="3" fill="#38BDF8" />
            <rect x="8" y="9" width="1" height="2" fill="#0284C7" />
            <rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="3" height="3" fill="#38BDF8" />
            <rect x="15" y="9" width="1" height="2" fill="#0284C7" />
            <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Blush */}
            <rect x="5" y="12" width="2" height="1" fill="#FDA4AF" />
            <rect x="17" y="12" width="2" height="1" fill="#FDA4AF" />
            {/* Nose & Mouth */}
            <rect x="11" y="12" width="2" height="1" fill="#FB7185" />
            {/* Body */}
            <rect x="6" y="16" width="12" height="5" fill="#FAFAFA" />
            <rect x="8" y="19" width="3" height="2" fill="#E2E8F0" />
            <rect x="13" y="19" width="3" height="2" fill="#E2E8F0" />
          </g>
        );

      // 4. Calico Cat
      case 'cat-calico':
        return (
          <g>
            <rect x="5" y="4" width="3" height="4" fill="#EA580C" />
            <rect x="16" y="4" width="3" height="4" fill="#27272A" />
            <rect x="5" y="7" width="8" height="9" fill="#EA580C" />
            <rect x="13" y="7" width="6" height="9" fill="#FFFFFF" />
            <rect x="15" y="7" width="4" height="4" fill="#27272A" />
            {/* Eyes */}
            <rect x="7" y="9" width="3" height="3" fill="#34D399" />
            <rect x="14" y="9" width="3" height="3" fill="#34D399" />
            <rect x="11" y="12" width="2" height="1" fill="#FB7185" />
            {/* Body */}
            <rect x="6" y="16" width="6" height="5" fill="#FFFFFF" />
            <rect x="12" y="16" width="6" height="5" fill="#EA580C" />
          </g>
        );

      // 5. Shiba Inu Dog
      case 'dog-shiba':
        return (
          <g>
            {/* Ears */}
            <rect x="4" y="4" width="4" height="4" fill="#D97706" />
            <rect x="5" y="5" width="2" height="2" fill="#FEF3C7" />
            <rect x="16" y="4" width="4" height="4" fill="#D97706" />
            <rect x="17" y="5" width="2" height="2" fill="#FEF3C7" />
            {/* Head */}
            <rect x="5" y="7" width="14" height="9" fill="#D97706" />
            {/* White Brow spots */}
            <rect x="7" y="7" width="2" height="1" fill="#FFFBEB" />
            <rect x="15" y="7" width="2" height="1" fill="#FFFBEB" />
            {/* Eyes */}
            <rect x="7" y="9" width="2" height="2" fill="#18181B" />
            <rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="15" y="9" width="2" height="2" fill="#18181B" />
            <rect x="15" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* White Muzzle */}
            <rect x="7" y="11" width="10" height="5" fill="#FFFBEB" />
            {/* Nose & Tongue */}
            <rect x="11" y="12" width="2" height="2" fill="#18181B" />
            <rect x="11" y="14" width="2" height="2" fill="#FB7185" />
            {/* Body */}
            <rect x="6" y="16" width="12" height="5" fill="#D97706" />
            <rect x="8" y="16" width="8" height="5" fill="#FFFBEB" />
          </g>
        );

      // 6. Corgi Pup
      case 'dog-corgi':
        return (
          <g>
            {/* Huge Corgi Ears */}
            <rect x="3" y="3" width="5" height="5" fill="#EA580C" />
            <rect x="4" y="4" width="3" height="3" fill="#FED7AA" />
            <rect x="16" y="3" width="5" height="5" fill="#EA580C" />
            <rect x="17" y="4" width="3" height="3" fill="#FED7AA" />
            {/* Head */}
            <rect x="5" y="7" width="14" height="9" fill="#F97316" />
            {/* White blaze in middle */}
            <rect x="11" y="7" width="2" height="9" fill="#FFFFFF" />
            {/* Eyes */}
            <rect x="7" y="9" width="2" height="2" fill="#18181B" />
            <rect x="15" y="9" width="2" height="2" fill="#18181B" />
            {/* White Muzzle */}
            <rect x="8" y="12" width="8" height="4" fill="#FFFFFF" />
            <rect x="11" y="12" width="2" height="2" fill="#18181B" />
            <rect x="11" y="14" width="2" height="2" fill="#FB7185" />
            {/* Body */}
            <rect x="6" y="16" width="12" height="5" fill="#F97316" />
            <rect x="9" y="16" width="6" height="5" fill="#FFFFFF" />
          </g>
        );

      // 7. Fluffy Bunny
      case 'bunny':
        return (
          <g>
            {/* Tall Ears */}
            <rect x="6" y="2" width="3" height="7" fill="#FDFBF7" />
            <rect x="7" y="3" width="1" height="5" fill="#FBCFE8" />
            <rect x="15" y="2" width="3" height="7" fill="#FDFBF7" />
            <rect x="16" y="3" width="1" height="5" fill="#FBCFE8" />
            {/* Head */}
            <rect x="5" y="8" width="14" height="8" fill="#FDFBF7" />
            {/* Cheeks */}
            <rect x="5" y="12" width="2" height="2" fill="#FCE7F3" />
            <rect x="17" y="12" width="2" height="2" fill="#FCE7F3" />
            {/* Eyes */}
            <rect x="8" y="10" width="2" height="2" fill="#374151" />
            <rect x="8" y="10" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="10" width="2" height="2" fill="#374151" />
            <rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <rect x="11" y="12" width="2" height="1" fill="#F472B6" />
            {/* Body */}
            <rect x="6" y="16" width="12" height="5" fill="#FDFBF7" />
            <rect x="9" y="18" width="2" height="2" fill="#F3F4F6" />
            <rect x="13" y="18" width="2" height="2" fill="#F3F4F6" />
          </g>
        );

      // 8. Hamster
      case 'hamster':
        return (
          <g>
            {/* Small Ears */}
            <rect x="6" y="5" width="3" height="3" fill="#F59E0B" />
            <rect x="7" y="6" width="1" height="1" fill="#FBCFE8" />
            <rect x="15" y="5" width="3" height="3" fill="#F59E0B" />
            <rect x="16" y="6" width="1" height="1" fill="#FBCFE8" />
            {/* Head */}
            <rect x="6" y="7" width="12" height="8" fill="#F59E0B" />
            {/* Chubby Cheeks */}
            <rect x="4" y="10" width="4" height="5" fill="#FEF3C7" />
            <rect x="16" y="10" width="4" height="5" fill="#FEF3C7" />
            {/* Eyes */}
            <rect x="8" y="9" width="2" height="2" fill="#18181B" />
            <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="2" height="2" fill="#18181B" />
            <rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Nose & Sunflower seed */}
            <rect x="11" y="11" width="2" height="1" fill="#FB7185" />
            <rect x="11" y="13" width="2" height="3" fill="#451A03" />
            {/* Body */}
            <rect x="6" y="15" width="12" height="6" fill="#F59E0B" />
            <rect x="8" y="15" width="8" height="5" fill="#FEF3C7" />
          </g>
        );

      // 9. Green Tree Frog
      case 'frog':
        return (
          <g>
            {/* Big Bulbous Frog Eyes */}
            <rect x="5" y="5" width="4" height="4" fill="#22C55E" />
            <rect x="6" y="6" width="2" height="2" fill="#0F172A" />
            <rect x="6" y="6" width="1" height="1" fill="#FFFFFF" />
            <rect x="15" y="5" width="4" height="4" fill="#22C55E" />
            <rect x="16" y="6" width="2" height="2" fill="#0F172A" />
            <rect x="16" y="6" width="1" height="1" fill="#FFFFFF" />
            {/* Head */}
            <rect x="5" y="8" width="14" height="7" fill="#22C55E" />
            {/* Pink Cheeks */}
            <rect x="5" y="11" width="2" height="2" fill="#F472B6" />
            <rect x="17" y="11" width="2" height="2" fill="#F472B6" />
            {/* Wide Happy Smile */}
            <rect x="8" y="12" width="8" height="1" fill="#15803D" />
            {/* Belly & Body */}
            <rect x="6" y="15" width="12" height="6" fill="#22C55E" />
            <rect x="8" y="15" width="8" height="5" fill="#BBF7D0" />
            {/* Webbed hands */}
            <rect x="4" y="17" width="2" height="3" fill="#16A34A" />
            <rect x="18" y="17" width="2" height="3" fill="#16A34A" />
          </g>
        );

      // 10. Cozy Panda
      case 'panda':
        return (
          <g>
            {/* Black Round Ears */}
            <rect x="4" y="4" width="4" height="4" fill="#18181B" />
            <rect x="16" y="4" width="4" height="4" fill="#18181B" />
            {/* White Face */}
            <rect x="5" y="7" width="14" height="9" fill="#FFFFFF" />
            {/* Black Eye Patches */}
            <rect x="6" y="9" width="4" height="4" fill="#18181B" />
            <rect x="7" y="10" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="9" width="4" height="4" fill="#18181B" />
            <rect x="15" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Nose */}
            <rect x="11" y="12" width="2" height="2" fill="#18181B" />
            {/* Body */}
            <rect x="6" y="16" width="12" height="5" fill="#18181B" />
            <rect x="9" y="16" width="6" height="5" fill="#FFFFFF" />
          </g>
        );

      // 11. Honey Brown Bear
      case 'bear':
        return (
          <g>
            {/* Ears */}
            <rect x="4" y="4" width="4" height="4" fill="#92400E" />
            <rect x="5" y="5" width="2" height="2" fill="#FDE68A" />
            <rect x="16" y="4" width="4" height="4" fill="#92400E" />
            <rect x="17" y="5" width="2" height="2" fill="#FDE68A" />
            {/* Head */}
            <rect x="5" y="7" width="14" height="9" fill="#92400E" />
            {/* Eyes */}
            <rect x="7" y="9" width="2" height="2" fill="#18181B" />
            <rect x="15" y="9" width="2" height="2" fill="#18181B" />
            {/* Light Snout */}
            <rect x="8" y="11" width="8" height="5" fill="#FDE68A" />
            <rect x="11" y="11" width="2" height="2" fill="#451A03" />
            {/* Body */}
            <rect x="6" y="16" width="12" height="5" fill="#92400E" />
            <rect x="9" y="16" width="6" height="5" fill="#B45309" />
          </g>
        );

      // 12. Polar Bear with Scarf
      case 'polar-bear':
        return (
          <g>
            {/* Ears */}
            <rect x="5" y="4" width="3" height="3" fill="#F1F5F9" />
            <rect x="16" y="4" width="3" height="3" fill="#F1F5F9" />
            {/* Head */}
            <rect x="5" y="7" width="14" height="8" fill="#F8FAFC" />
            {/* Eyes & Nose */}
            <rect x="8" y="9" width="2" height="2" fill="#0F172A" />
            <rect x="14" y="9" width="2" height="2" fill="#0F172A" />
            <rect x="11" y="11" width="2" height="2" fill="#0F172A" />
            {/* Sky Blue Scarf */}
            <rect x="5" y="15" width="14" height="3" fill="#38BDF8" />
            <rect x="14" y="18" width="3" height="3" fill="#0284C7" />
            {/* Body */}
            <rect x="6" y="18" width="12" height="3" fill="#F8FAFC" />
          </g>
        );

      // 13. Little Penguin
      case 'penguin':
        return (
          <g>
            {/* Head */}
            <rect x="6" y="5" width="12" height="7" fill="#18181B" />
            {/* White Face Mask */}
            <rect x="7" y="7" width="4" height="4" fill="#FFFFFF" />
            <rect x="13" y="7" width="4" height="4" fill="#FFFFFF" />
            {/* Eyes */}
            <rect x="9" y="8" width="2" height="2" fill="#18181B" />
            <rect x="13" y="8" width="2" height="2" fill="#18181B" />
            {/* Orange Beak */}
            <rect x="10" y="10" width="4" height="2" fill="#F97316" />
            {/* Red Winter Scarf */}
            <rect x="6" y="12" width="12" height="3" fill="#DC2626" />
            <rect x="8" y="15" width="3" height="3" fill="#DC2626" />
            {/* Body & Belly */}
            <rect x="5" y="15" width="14" height="5" fill="#18181B" />
            <rect x="9" y="15" width="6" height="5" fill="#FFFFFF" />
            {/* Feet */}
            <rect x="8" y="20" width="3" height="2" fill="#F97316" />
            <rect x="13" y="20" width="3" height="2" fill="#F97316" />
          </g>
        );

      // 14. Wise Barn Owl
      case 'owl':
        return (
          <g>
            {/* Feather Tuft Ears */}
            <rect x="5" y="3" width="3" height="4" fill="#78350F" />
            <rect x="16" y="3" width="3" height="4" fill="#78350F" />
            {/* Head */}
            <rect x="5" y="6" width="14" height="9" fill="#92400E" />
            {/* Giant Yellow Eyes */}
            <rect x="6" y="7" width="5" height="5" fill="#FDE047" />
            <rect x="8" y="8" width="2" height="3" fill="#18181B" />
            <rect x="8" y="8" width="1" height="1" fill="#FFFFFF" />
            <rect x="13" y="7" width="5" height="5" fill="#FDE047" />
            <rect x="14" y="8" width="2" height="3" fill="#18181B" />
            <rect x="14" y="8" width="1" height="1" fill="#FFFFFF" />
            {/* Beak */}
            <rect x="11" y="11" width="2" height="2" fill="#F97316" />
            {/* Body */}
            <rect x="6" y="15" width="12" height="6" fill="#78350F" />
            <rect x="9" y="15" width="6" height="5" fill="#FEF3C7" />
          </g>
        );

      // 15. Rust Fox
      case 'fox':
        return (
          <g>
            {/* Tall Ears with black tips */}
            <rect x="4" y="3" width="4" height="2" fill="#18181B" />
            <rect x="4" y="5" width="4" height="3" fill="#EA580C" />
            <rect x="5" y="5" width="2" height="2" fill="#FFF7ED" />
            <rect x="16" y="3" width="4" height="2" fill="#18181B" />
            <rect x="16" y="5" width="4" height="3" fill="#EA580C" />
            <rect x="17" y="5" width="2" height="2" fill="#FFF7ED" />
            {/* Head */}
            <rect x="5" y="8" width="14" height="8" fill="#EA580C" />
            {/* Eyes */}
            <rect x="7" y="10" width="2" height="2" fill="#18181B" />
            <rect x="15" y="10" width="2" height="2" fill="#18181B" />
            {/* White Cheek Fluffs */}
            <rect x="5" y="12" width="4" height="4" fill="#FFF7ED" />
            <rect x="15" y="12" width="4" height="4" fill="#FFF7ED" />
            <rect x="9" y="13" width="6" height="3" fill="#FFF7ED" />
            <rect x="11" y="13" width="2" height="2" fill="#18181B" />
            {/* Body */}
            <rect x="6" y="16" width="12" height="5" fill="#EA580C" />
            <rect x="9" y="16" width="6" height="5" fill="#FFF7ED" />
          </g>
        );

      // 16. Yellow Rubber Duckling
      case 'duck':
        return (
          <g>
            {/* Head */}
            <rect x="7" y="5" width="10" height="8" fill="#FACC15" />
            {/* Eye */}
            <rect x="12" y="7" width="2" height="2" fill="#18181B" />
            <rect x="12" y="7" width="1" height="1" fill="#FFFFFF" />
            {/* Big Orange Bill */}
            <rect x="15" y="9" width="5" height="3" fill="#F97316" />
            {/* Body */}
            <rect x="5" y="13" width="14" height="7" fill="#FACC15" />
            <rect x="4" y="14" width="2" height="3" fill="#EAB308" />
            <rect x="5" y="20" width="14" height="1" fill="#38BDF8" />
          </g>
        );

      // 17. Lo-Fi Listener with Headphones
      case 'human-headphones':
        return (
          <g>
            {/* Cyan Headphone Band */}
            <rect x="6" y="4" width="12" height="2" fill="#06B6D4" />
            <rect x="4" y="6" width="3" height="6" fill="#0891B2" />
            <rect x="17" y="6" width="3" height="6" fill="#0891B2" />
            {/* Hair */}
            <rect x="7" y="6" width="10" height="3" fill="#292524" />
            {/* Face */}
            <rect x="7" y="9" width="10" height="6" fill="#FCD34D" />
            {/* Eyes (Smiling / Focused) */}
            <rect x="9" y="11" width="2" height="1" fill="#451A03" />
            <rect x="13" y="11" width="2" height="1" fill="#451A03" />
            <rect x="11" y="13" width="2" height="1" fill="#E11D48" />
            {/* Hoodie */}
            <rect x="5" y="15" width="14" height="6" fill="#3B82F6" />
            <rect x="9" y="15" width="6" height="6" fill="#1D4ED8" />
          </g>
        );

      // 18. Bookish Scholar with Glasses
      case 'human-glasses':
        return (
          <g>
            {/* Wavy Hair */}
            <rect x="6" y="4" width="12" height="4" fill="#78350F" />
            <rect x="5" y="7" width="2" height="5" fill="#78350F" />
            <rect x="17" y="7" width="2" height="5" fill="#78350F" />
            {/* Face */}
            <rect x="7" y="7" width="10" height="8" fill="#FED7AA" />
            {/* Teal Glasses */}
            <rect x="7" y="9" width="4" height="3" fill="none" stroke="#0D9488" strokeWidth="1" />
            <rect x="13" y="9" width="4" height="3" fill="none" stroke="#0D9488" strokeWidth="1" />
            <rect x="11" y="10" width="2" height="1" fill="#0D9488" />
            {/* Eyes behind glasses */}
            <rect x="8" y="10" width="2" height="1" fill="#18181B" />
            <rect x="14" y="10" width="2" height="1" fill="#18181B" />
            {/* Mouth */}
            <rect x="11" y="13" width="2" height="1" fill="#9A3412" />
            {/* Sweater */}
            <rect x="5" y="15" width="14" height="6" fill="#047857" />
            <rect x="10" y="15" width="4" height="6" fill="#FEF3C7" />
          </g>
        );

      // 19. Cozy Beanie Nomad
      case 'human-beanie':
        return (
          <g>
            {/* Mustard Beanie */}
            <rect x="7" y="3" width="10" height="4" fill="#EAB308" />
            <rect x="6" y="6" width="12" height="3" fill="#CA8A04" />
            <rect x="11" y="2" width="2" height="2" fill="#EAB308" />
            {/* Hair peeking */}
            <rect x="6" y="9" width="2" height="3" fill="#18181B" />
            <rect x="16" y="9" width="2" height="3" fill="#18181B" />
            {/* Face */}
            <rect x="7" y="9" width="10" height="6" fill="#FED7AA" />
            {/* Eyes */}
            <rect x="9" y="11" width="2" height="2" fill="#18181B" />
            <rect x="13" y="11" width="2" height="2" fill="#18181B" />
            <rect x="11" y="13" width="2" height="1" fill="#B45309" />
            {/* Knit Scarf */}
            <rect x="5" y="15" width="14" height="3" fill="#DC2626" />
            <rect x="7" y="18" width="3" height="3" fill="#B91C1C" />
            {/* Jacket */}
            <rect x="5" y="18" width="14" height="3" fill="#374151" />
          </g>
        );

      // 20. Starry Pixie Girl
      case 'human-girl-pink':
        return (
          <g>
            {/* Double Purple/Pink Buns */}
            <rect x="4" y="3" width="4" height="4" fill="#A855F7" />
            <rect x="16" y="3" width="4" height="4" fill="#A855F7" />
            {/* Gold Star Clip */}
            <rect x="7" y="5" width="2" height="2" fill="#FDE047" />
            {/* Hair */}
            <rect x="6" y="5" width="12" height="4" fill="#C084FC" />
            {/* Face */}
            <rect x="7" y="8" width="10" height="7" fill="#FED7AA" />
            {/* Cute Eyes with lashes */}
            <rect x="8" y="10" width="2" height="2" fill="#7E22CE" />
            <rect x="8" y="10" width="1" height="1" fill="#FFFFFF" />
            <rect x="14" y="10" width="2" height="2" fill="#7E22CE" />
            <rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Cheeks */}
            <rect x="7" y="12" width="2" height="1" fill="#F472B6" />
            <rect x="15" y="12" width="2" height="1" fill="#F472B6" />
            {/* Outfit */}
            <rect x="6" y="15" width="12" height="6" fill="#EC4899" />
            <rect x="9" y="15" width="6" height="6" fill="#FDF2F8" />
          </g>
        );

      // 21. Coffee Artist with Beret
      case 'human-artist':
        return (
          <g>
            {/* Red Beret */}
            <rect x="7" y="3" width="11" height="4" fill="#DC2626" />
            <rect x="5" y="6" width="14" height="2" fill="#B91C1C" />
            <rect x="12" y="2" width="1" height="2" fill="#DC2626" />
            {/* Dark Hair */}
            <rect x="6" y="8" width="2" height="4" fill="#292524" />
            <rect x="16" y="8" width="2" height="4" fill="#292524" />
            {/* Face */}
            <rect x="7" y="8" width="10" height="7" fill="#FED7AA" />
            {/* Eyes */}
            <rect x="9" y="10" width="2" height="2" fill="#18181B" />
            <rect x="13" y="10" width="2" height="2" fill="#18181B" />
            <rect x="11" y="13" width="2" height="1" fill="#991B1B" />
            {/* Striped Shirt */}
            <rect x="5" y="15" width="14" height="6" fill="#FFFFFF" />
            <rect x="5" y="16" width="14" height="1" fill="#1E293B" />
            <rect x="5" y="18" width="14" height="1" fill="#1E293B" />
          </g>
        );

      // 22. Night Coder Hoodie
      case 'human-hoodie':
        return (
          <g>
            {/* Dark Hoodie Cap */}
            <rect x="6" y="4" width="12" height="5" fill="#312E81" />
            <rect x="5" y="7" width="14" height="8" fill="#312E81" />
            {/* Face opening */}
            <rect x="8" y="8" width="8" height="6" fill="#FCD34D" />
            {/* Glow Glasses */}
            <rect x="8" y="9" width="3" height="2" fill="#38BDF8" />
            <rect x="13" y="9" width="3" height="2" fill="#38BDF8" />
            {/* Hoodie strings & Torso */}
            <rect x="5" y="15" width="14" height="6" fill="#1E1B4B" />
            <rect x="10" y="15" width="1" height="4" fill="#E2E8F0" />
            <rect x="13" y="15" width="1" height="4" fill="#E2E8F0" />
          </g>
        );

      // 23. Friendly Floating Ghost
      case 'ghost':
        return (
          <g>
            {/* Ghost Head & Rounded Top */}
            <rect x="7" y="4" width="10" height="3" fill="#F8FAFC" />
            <rect x="5" y="7" width="14" height="10" fill="#F8FAFC" />
            {/* Big Curious Eyes */}
            <rect x="8" y="8" width="3" height="4" fill="#1E1B4B" />
            <rect x="8" y="8" width="1" height="1" fill="#FFFFFF" />
            <rect x="13" y="8" width="3" height="4" fill="#1E1B4B" />
            <rect x="13" y="8" width="1" height="1" fill="#FFFFFF" />
            {/* Cute Pink Cheeks */}
            <rect x="6" y="11" width="2" height="2" fill="#F472B6" />
            <rect x="16" y="11" width="2" height="2" fill="#F472B6" />
            {/* Floating Wavy Tail Bottom */}
            <rect x="5" y="17" width="2" height="3" fill="#F8FAFC" />
            <rect x="8" y="17" width="2" height="4" fill="#F8FAFC" />
            <rect x="11" y="17" width="2" height="3" fill="#F8FAFC" />
            <rect x="14" y="17" width="2" height="4" fill="#F8FAFC" />
            <rect x="17" y="17" width="2" height="3" fill="#F8FAFC" />
          </g>
        );

      // 24. Retro Pixel Robot
      case 'robot':
        return (
          <g>
            {/* Antenna with Red Light */}
            <rect x="11" y="2" width="2" height="2" fill="#EF4444" />
            <rect x="11" y="4" width="2" height="2" fill="#94A3B8" />
            {/* Boxy Robot Head */}
            <rect x="5" y="6" width="14" height="9" fill="#94A3B8" />
            {/* Ear Bolts */}
            <rect x="3" y="8" width="2" height="4" fill="#64748B" />
            <rect x="19" y="8" width="2" height="4" fill="#64748B" />
            {/* Cyan Digital Eyes Screen */}
            <rect x="7" y="8" width="10" height="4" fill="#0F172A" />
            <rect x="8" y="9" width="3" height="2" fill="#22D3EE" />
            <rect x="13" y="9" width="3" height="2" fill="#22D3EE" />
            {/* Pixel Grin */}
            <rect x="9" y="13" width="6" height="1" fill="#475569" />
            {/* Body */}
            <rect x="6" y="15" width="12" height="6" fill="#64748B" />
            <rect x="9" y="16" width="6" height="4" fill="#CBD5E1" />
            <rect x="10" y="17" width="2" height="2" fill="#F59E0B" />
          </g>
        );

      // 25. Emerald Mini Dragon
      case 'dragon':
        return (
          <g>
            {/* Orange Horns */}
            <rect x="6" y="3" width="2" height="3" fill="#F97316" />
            <rect x="16" y="3" width="2" height="3" fill="#F97316" />
            {/* Head */}
            <rect x="6" y="6" width="12" height="8" fill="#10B981" />
            {/* Snout */}
            <rect x="7" y="11" width="10" height="4" fill="#059669" />
            <rect x="8" y="12" width="2" height="1" fill="#047857" />
            <rect x="14" y="12" width="2" height="1" fill="#047857" />
            {/* Golden Eyes */}
            <rect x="8" y="8" width="2" height="3" fill="#FDE047" />
            <rect x="9" y="8" width="1" height="2" fill="#047857" />
            <rect x="14" y="8" width="2" height="3" fill="#FDE047" />
            <rect x="14" y="8" width="1" height="2" fill="#047857" />
            {/* Belly & Tiny Wings */}
            <rect x="4" y="14" width="2" height="4" fill="#34D399" />
            <rect x="18" y="14" width="2" height="4" fill="#34D399" />
            <rect x="6" y="15" width="12" height="6" fill="#10B981" />
            <rect x="9" y="15" width="6" height="5" fill="#FDE047" />
          </g>
        );

      // 26. Space Explorer Astronaut
      case 'astronaut':
        return (
          <g>
            {/* Rounded Helmet */}
            <rect x="6" y="4" width="12" height="11" fill="#F8FAFC" />
            {/* Golden Reflective Visor */}
            <rect x="7" y="7" width="10" height="6" fill="#F59E0B" />
            <rect x="8" y="7" width="2" height="4" fill="#FEF3C7" />
            {/* Helmet Collar & Pack */}
            <rect x="5" y="15" width="14" height="6" fill="#E2E8F0" />
            <rect x="10" y="16" width="4" height="3" fill="#3B82F6" />
          </g>
        );

      // 27. Green Martian Alien
      case 'alien':
        return (
          <g>
            {/* Wobbly Antenna */}
            <rect x="11" y="2" width="2" height="2" fill="#A855F7" />
            <rect x="11" y="4" width="2" height="3" fill="#84CC16" />
            {/* Alien Head */}
            <rect x="5" y="7" width="14" height="8" fill="#84CC16" />
            {/* Three Purple Eyes */}
            <rect x="6" y="9" width="3" height="3" fill="#A855F7" />
            <rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <rect x="10" y="8" width="4" height="3" fill="#A855F7" />
            <rect x="11" y="8" width="1" height="1" fill="#FFFFFF" />
            <rect x="15" y="9" width="3" height="3" fill="#A855F7" />
            <rect x="16" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Smile */}
            <rect x="10" y="13" width="4" height="1" fill="#4D7C0F" />
            {/* Cosmic Suit */}
            <rect x="6" y="15" width="12" height="6" fill="#65A30D" />
            <rect x="9" y="16" width="6" height="4" fill="#D9F99D" />
          </g>
        );

      // 28. Star Wizard
      case 'wizard':
        return (
          <g>
            {/* Pointy Purple Hat */}
            <rect x="11" y="2" width="2" height="3" fill="#7C3AED" />
            <rect x="9" y="5" width="6" height="3" fill="#7C3AED" />
            <rect x="11" y="5" width="2" height="2" fill="#FDE047" />
            <rect x="5" y="8" width="14" height="2" fill="#5B21B6" />
            {/* Eyes */}
            <rect x="7" y="10" width="10" height="3" fill="#FED7AA" />
            <rect x="8" y="10" width="2" height="2" fill="#38BDF8" />
            <rect x="14" y="10" width="2" height="2" fill="#38BDF8" />
            {/* Fluffy Beard */}
            <rect x="6" y="13" width="12" height="5" fill="#E2E8F0" />
            <rect x="8" y="18" width="8" height="3" fill="#E2E8F0" />
            {/* Robe */}
            <rect x="5" y="17" width="14" height="4" fill="#7C3AED" />
          </g>
        );

      // 29. Shadow Ninja
      case 'ninja':
        return (
          <g>
            {/* Hood */}
            <rect x="6" y="4" width="12" height="11" fill="#18181B" />
            {/* Crimson Headband */}
            <rect x="5" y="7" width="14" height="2" fill="#DC2626" />
            <rect x="17" y="7" width="3" height="5" fill="#DC2626" />
            {/* Eye Slit */}
            <rect x="8" y="9" width="8" height="3" fill="#FED7AA" />
            <rect x="9" y="10" width="2" height="1" fill="#18181B" />
            <rect x="13" y="10" width="2" height="1" fill="#18181B" />
            {/* Body */}
            <rect x="5" y="15" width="14" height="6" fill="#27272A" />
            <rect x="11" y="15" width="2" height="6" fill="#DC2626" />
          </g>
        );

      // 30. Little Plant / Cactus in Pot
      case 'plant-pot':
        return (
          <g>
            {/* Pink Blossom on top */}
            <rect x="11" y="3" width="2" height="2" fill="#F43F5E" />
            {/* Main Cactus Body */}
            <rect x="9" y="5" width="6" height="9" fill="#16A34A" />
            {/* Left Arm */}
            <rect x="6" y="7" width="3" height="2" fill="#16A34A" />
            <rect x="6" y="6" width="2" height="2" fill="#16A34A" />
            {/* Right Arm */}
            <rect x="15" y="8" width="3" height="2" fill="#16A34A" />
            <rect x="16" y="7" width="2" height="2" fill="#16A34A" />
            {/* Cute Face on Cactus */}
            <rect x="10" y="9" width="1" height="1" fill="#052E16" />
            <rect x="13" y="9" width="1" height="1" fill="#052E16" />
            <rect x="11" y="11" width="2" height="1" fill="#FB7185" />
            {/* Terracotta Pot */}
            <rect x="7" y="14" width="10" height="2" fill="#C2410C" />
            <rect x="8" y="16" width="8" height="5" fill="#EA580C" />
          </g>
        );

      // 31. Steaming Coffee Cup
      case 'coffee-cup':
        return (
          <g>
            {/* Steam Pixels */}
            <rect x="9" y="3" width="1" height="2" fill="#94A3B8" opacity="0.8" />
            <rect x="12" y="2" width="1" height="3" fill="#94A3B8" opacity="0.8" />
            <rect x="14" y="4" width="1" height="2" fill="#94A3B8" opacity="0.8" />
            {/* Cup Rim & Body */}
            <rect x="6" y="7" width="11" height="11" fill="#FAF5FF" />
            <rect x="7" y="8" width="9" height="2" fill="#78350F" />
            {/* Cute Kawaii Face */}
            <rect x="8" y="12" width="2" height="1" fill="#18181B" />
            <rect x="13" y="12" width="2" height="1" fill="#18181B" />
            <rect x="10" y="14" width="3" height="1" fill="#F43F5E" />
            {/* Cup Handle */}
            <rect x="17" y="9" width="3" height="6" fill="#E9D5FF" />
            <rect x="17" y="11" width="1" height="2" fill="#FEF3C7" />
            {/* Saucer */}
            <rect x="4" y="18" width="15" height="2" fill="#DDD6FE" />
          </g>
        );

      // 32. Smiling Cosmic Star
      case 'star':
        return (
          <g>
            {/* Star Points */}
            <rect x="11" y="3" width="2" height="3" fill="#FACC15" />
            <rect x="4" y="9" width="16" height="6" fill="#FACC15" />
            <rect x="8" y="6" width="8" height="12" fill="#FACC15" />
            <rect x="6" y="15" width="4" height="4" fill="#FACC15" />
            <rect x="14" y="15" width="4" height="4" fill="#FACC15" />
            {/* Sparkle Highlights */}
            <rect x="9" y="7" width="2" height="2" fill="#FEF08A" />
            {/* Cute Eyes & Blushing Cheeks */}
            <rect x="9" y="10" width="2" height="2" fill="#713F12" />
            <rect x="13" y="10" width="2" height="2" fill="#713F12" />
            <rect x="8" y="12" width="2" height="1" fill="#FB7185" />
            <rect x="14" y="12" width="2" height="1" fill="#FB7185" />
            <rect x="11" y="13" width="2" height="1" fill="#9A3412" />
          </g>
        );

      // Fallback
      default:
        return (
          <g>
            <rect x="5" y="7" width="14" height="10" fill="#F59E0B" />
            <rect x="8" y="10" width="2" height="2" fill="#18181B" />
            <rect x="14" y="10" width="2" height="2" fill="#18181B" />
            <rect x="11" y="13" width="2" height="1" fill="#FB7185" />
          </g>
        );
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      title={item.name}
    >
      {/* Dynamic animated glow background when working */}
      {isWorking && (
        <div 
          className="absolute inset-0 rounded-2xl animate-pulse blur-md opacity-60 pointer-events-none"
          style={{ background: item.borderHex }}
        />
      )}

      {/* Main Pixel Canvas SVG with crisp pixel borders */}
      <svg
        viewBox="0 0 24 24"
        className={`w-full h-full drop-shadow-xs transition-transform duration-300 ${
          isWorking ? 'animate-bounce-subtle' : animated ? 'animate-float-gentle' : ''
        }`}
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Background rounded frame */}
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#1C1814" />
        <rect x="3" y="3" width="18" height="18" rx="2" fill={item.bgHex} />

        {/* Ambient Sparkles when active */}
        {isWorking && (
          <>
            <rect x="4" y="4" width="1" height="1" fill="#FEF08A" className="animate-ping" />
            <rect x="19" y="5" width="1" height="1" fill="#67E8F9" className="animate-ping" style={{ animationDelay: '300ms' }} />
            <rect x="4" y="18" width="1" height="1" fill="#F472B6" className="animate-ping" style={{ animationDelay: '600ms' }} />
            <rect x="19" y="18" width="1" height="1" fill="#A7F3D0" className="animate-ping" style={{ animationDelay: '900ms' }} />
          </>
        )}

        {/* The Drawn Character */}
        {renderPixelArt(item.id)}

        {/* Crisp Border Frame */}
        <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#2D251D" strokeWidth="0.8" />
      </svg>
    </div>
  );
};
