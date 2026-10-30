import React from "react";
import { View } from "react-native";
import Svg, { G, Rect } from "react-native-svg";
import { getAvatarById } from "../../src/data/pixelAvatars";
import { PixelSceneIllustrationNative } from "./pixelScenesNative";

  const renderPixelArt = (id: string) => {
    switch (id) {
      // 1. Orange Tabby Cat
      case 'cat-tabby':
        return (
          <G>
            {/* Ears */}
            <Rect x="5" y="4" width="3" height="4" fill="#D97706" />
            <Rect x="6" y="5" width="2" height="2" fill="#F472B6" />
            <Rect x="16" y="4" width="3" height="4" fill="#D97706" />
            <Rect x="16" y="5" width="2" height="2" fill="#F472B6" />
            {/* Head */}
            <Rect x="5" y="7" width="14" height="9" fill="#F59E0B" />
            {/* Tabby forehead stripes */}
            <Rect x="11" y="6" width="2" height="3" fill="#B45309" />
            <Rect x="9" y="7" width="1" height="2" fill="#B45309" />
            <Rect x="14" y="7" width="1" height="2" fill="#B45309" />
            {/* Cheeks / Muzzle */}
            <Rect x="8" y="12" width="8" height="4" fill="#FEF3C7" />
            {/* Eyes */}
            <Rect x="7" y="9" width="3" height="3" fill="#10B981" />
            <Rect x="8" y="9" width="1" height="2" fill="#047857" />
            <Rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <Rect x="14" y="9" width="3" height="3" fill="#10B981" />
            <Rect x="15" y="9" width="1" height="2" fill="#047857" />
            <Rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <Rect x="11" y="12" width="2" height="1" fill="#F43F5E" />
            <Rect x="10" y="13" width="4" height="1" fill="#78350F" />
            {/* Whiskers */}
            <Rect x="3" y="11" width="2" height="1" fill="#78350F" />
            <Rect x="3" y="13" width="2" height="1" fill="#78350F" />
            <Rect x="19" y="11" width="2" height="1" fill="#78350F" />
            <Rect x="19" y="13" width="2" height="1" fill="#78350F" />
            {/* Body */}
            <Rect x="7" y="16" width="10" height="5" fill="#F59E0B" />
            <Rect x="9" y="16" width="6" height="4" fill="#FEF3C7" />
            {/* Paws */}
            <Rect x="8" y="19" width="3" height="2" fill="#FEF3C7" />
            <Rect x="13" y="19" width="3" height="2" fill="#FEF3C7" />
          </G>
        );

      // 2. Midnight Black Cat
      case 'cat-black':
        return (
          <G>
            {/* Ears */}
            <Rect x="5" y="4" width="3" height="4" fill="#18181B" />
            <Rect x="6" y="5" width="2" height="2" fill="#71717A" />
            <Rect x="16" y="4" width="3" height="4" fill="#18181B" />
            <Rect x="16" y="5" width="2" height="2" fill="#71717A" />
            {/* Head */}
            <Rect x="5" y="7" width="14" height="9" fill="#27272A" />
            {/* Golden Eyes */}
            <Rect x="7" y="9" width="3" height="3" fill="#FBBF24" />
            <Rect x="8" y="9" width="1" height="2" fill="#18181B" />
            <Rect x="7" y="9" width="1" height="1" fill="#FEF08A" />
            <Rect x="14" y="9" width="3" height="3" fill="#FBBF24" />
            <Rect x="15" y="9" width="1" height="2" fill="#18181B" />
            <Rect x="14" y="9" width="1" height="1" fill="#FEF08A" />
            {/* Nose & Mouth */}
            <Rect x="11" y="12" width="2" height="1" fill="#F472B6" />
            {/* Red Collar with gold bell */}
            <Rect x="7" y="16" width="10" height="1" fill="#EF4444" />
            <Rect x="11" y="17" width="2" height="2" fill="#FBBF24" />
            {/* Body */}
            <Rect x="6" y="17" width="12" height="4" fill="#18181B" />
            <Rect x="9" y="18" width="6" height="3" fill="#FFFFFF" />
          </G>
        );

      // 3. Snowy White Kitten
      case 'cat-white':
        return (
          <G>
            {/* Ears */}
            <Rect x="5" y="4" width="3" height="4" fill="#FFFFFF" />
            <Rect x="6" y="5" width="2" height="2" fill="#FDA4AF" />
            <Rect x="16" y="4" width="3" height="4" fill="#FFFFFF" />
            <Rect x="16" y="5" width="2" height="2" fill="#FDA4AF" />
            {/* Head */}
            <Rect x="5" y="7" width="14" height="9" fill="#FAFAFA" />
            {/* Blue Eyes */}
            <Rect x="7" y="9" width="3" height="3" fill="#38BDF8" />
            <Rect x="8" y="9" width="1" height="2" fill="#0284C7" />
            <Rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <Rect x="14" y="9" width="3" height="3" fill="#38BDF8" />
            <Rect x="15" y="9" width="1" height="2" fill="#0284C7" />
            <Rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Blush */}
            <Rect x="5" y="12" width="2" height="1" fill="#FDA4AF" />
            <Rect x="17" y="12" width="2" height="1" fill="#FDA4AF" />
            {/* Nose & Mouth */}
            <Rect x="11" y="12" width="2" height="1" fill="#FB7185" />
            {/* Body */}
            <Rect x="6" y="16" width="12" height="5" fill="#FAFAFA" />
            <Rect x="8" y="19" width="3" height="2" fill="#E2E8F0" />
            <Rect x="13" y="19" width="3" height="2" fill="#E2E8F0" />
          </G>
        );

      // 4. Calico Cat
      case 'cat-calico':
        return (
          <G>
            <Rect x="5" y="4" width="3" height="4" fill="#EA580C" />
            <Rect x="16" y="4" width="3" height="4" fill="#27272A" />
            <Rect x="5" y="7" width="8" height="9" fill="#EA580C" />
            <Rect x="13" y="7" width="6" height="9" fill="#FFFFFF" />
            <Rect x="15" y="7" width="4" height="4" fill="#27272A" />
            {/* Eyes */}
            <Rect x="7" y="9" width="3" height="3" fill="#34D399" />
            <Rect x="14" y="9" width="3" height="3" fill="#34D399" />
            <Rect x="11" y="12" width="2" height="1" fill="#FB7185" />
            {/* Body */}
            <Rect x="6" y="16" width="6" height="5" fill="#FFFFFF" />
            <Rect x="12" y="16" width="6" height="5" fill="#EA580C" />
          </G>
        );

      // 5. Shiba Inu Dog
      case 'dog-shiba':
        return (
          <G>
            {/* Ears */}
            <Rect x="4" y="4" width="4" height="4" fill="#D97706" />
            <Rect x="5" y="5" width="2" height="2" fill="#FEF3C7" />
            <Rect x="16" y="4" width="4" height="4" fill="#D97706" />
            <Rect x="17" y="5" width="2" height="2" fill="#FEF3C7" />
            {/* Head */}
            <Rect x="5" y="7" width="14" height="9" fill="#D97706" />
            {/* White Brow spots */}
            <Rect x="7" y="7" width="2" height="1" fill="#FFFBEB" />
            <Rect x="15" y="7" width="2" height="1" fill="#FFFBEB" />
            {/* Eyes */}
            <Rect x="7" y="9" width="2" height="2" fill="#18181B" />
            <Rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <Rect x="15" y="9" width="2" height="2" fill="#18181B" />
            <Rect x="15" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* White Muzzle */}
            <Rect x="7" y="11" width="10" height="5" fill="#FFFBEB" />
            {/* Nose & Tongue */}
            <Rect x="11" y="12" width="2" height="2" fill="#18181B" />
            <Rect x="11" y="14" width="2" height="2" fill="#FB7185" />
            {/* Body */}
            <Rect x="6" y="16" width="12" height="5" fill="#D97706" />
            <Rect x="8" y="16" width="8" height="5" fill="#FFFBEB" />
          </G>
        );

      // 6. Corgi Pup
      case 'dog-corgi':
        return (
          <G>
            {/* Huge Corgi Ears */}
            <Rect x="3" y="3" width="5" height="5" fill="#EA580C" />
            <Rect x="4" y="4" width="3" height="3" fill="#FED7AA" />
            <Rect x="16" y="3" width="5" height="5" fill="#EA580C" />
            <Rect x="17" y="4" width="3" height="3" fill="#FED7AA" />
            {/* Head */}
            <Rect x="5" y="7" width="14" height="9" fill="#F97316" />
            {/* White blaze in middle */}
            <Rect x="11" y="7" width="2" height="9" fill="#FFFFFF" />
            {/* Eyes */}
            <Rect x="7" y="9" width="2" height="2" fill="#18181B" />
            <Rect x="15" y="9" width="2" height="2" fill="#18181B" />
            {/* White Muzzle */}
            <Rect x="8" y="12" width="8" height="4" fill="#FFFFFF" />
            <Rect x="11" y="12" width="2" height="2" fill="#18181B" />
            <Rect x="11" y="14" width="2" height="2" fill="#FB7185" />
            {/* Body */}
            <Rect x="6" y="16" width="12" height="5" fill="#F97316" />
            <Rect x="9" y="16" width="6" height="5" fill="#FFFFFF" />
          </G>
        );

      // 7. Fluffy Bunny
      case 'bunny':
        return (
          <G>
            {/* Tall Ears */}
            <Rect x="6" y="2" width="3" height="7" fill="#FDFBF7" />
            <Rect x="7" y="3" width="1" height="5" fill="#FBCFE8" />
            <Rect x="15" y="2" width="3" height="7" fill="#FDFBF7" />
            <Rect x="16" y="3" width="1" height="5" fill="#FBCFE8" />
            {/* Head */}
            <Rect x="5" y="8" width="14" height="8" fill="#FDFBF7" />
            {/* Cheeks */}
            <Rect x="5" y="12" width="2" height="2" fill="#FCE7F3" />
            <Rect x="17" y="12" width="2" height="2" fill="#FCE7F3" />
            {/* Eyes */}
            <Rect x="8" y="10" width="2" height="2" fill="#374151" />
            <Rect x="8" y="10" width="1" height="1" fill="#FFFFFF" />
            <Rect x="14" y="10" width="2" height="2" fill="#374151" />
            <Rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <Rect x="11" y="12" width="2" height="1" fill="#F472B6" />
            {/* Body */}
            <Rect x="6" y="16" width="12" height="5" fill="#FDFBF7" />
            <Rect x="9" y="18" width="2" height="2" fill="#F3F4F6" />
            <Rect x="13" y="18" width="2" height="2" fill="#F3F4F6" />
          </G>
        );

      // 8. Hamster
      case 'hamster':
        return (
          <G>
            {/* Small Ears */}
            <Rect x="6" y="5" width="3" height="3" fill="#F59E0B" />
            <Rect x="7" y="6" width="1" height="1" fill="#FBCFE8" />
            <Rect x="15" y="5" width="3" height="3" fill="#F59E0B" />
            <Rect x="16" y="6" width="1" height="1" fill="#FBCFE8" />
            {/* Head */}
            <Rect x="6" y="7" width="12" height="8" fill="#F59E0B" />
            {/* Chubby Cheeks */}
            <Rect x="4" y="10" width="4" height="5" fill="#FEF3C7" />
            <Rect x="16" y="10" width="4" height="5" fill="#FEF3C7" />
            {/* Eyes */}
            <Rect x="8" y="9" width="2" height="2" fill="#18181B" />
            <Rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
            <Rect x="14" y="9" width="2" height="2" fill="#18181B" />
            <Rect x="14" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Nose & Sunflower seed */}
            <Rect x="11" y="11" width="2" height="1" fill="#FB7185" />
            <Rect x="11" y="13" width="2" height="3" fill="#451A03" />
            {/* Body */}
            <Rect x="6" y="15" width="12" height="6" fill="#F59E0B" />
            <Rect x="8" y="15" width="8" height="5" fill="#FEF3C7" />
          </G>
        );

      // 9. Green Tree Frog
      case 'frog':
        return (
          <G>
            {/* Big Bulbous Frog Eyes */}
            <Rect x="5" y="5" width="4" height="4" fill="#22C55E" />
            <Rect x="6" y="6" width="2" height="2" fill="#0F172A" />
            <Rect x="6" y="6" width="1" height="1" fill="#FFFFFF" />
            <Rect x="15" y="5" width="4" height="4" fill="#22C55E" />
            <Rect x="16" y="6" width="2" height="2" fill="#0F172A" />
            <Rect x="16" y="6" width="1" height="1" fill="#FFFFFF" />
            {/* Head */}
            <Rect x="5" y="8" width="14" height="7" fill="#22C55E" />
            {/* Pink Cheeks */}
            <Rect x="5" y="11" width="2" height="2" fill="#F472B6" />
            <Rect x="17" y="11" width="2" height="2" fill="#F472B6" />
            {/* Wide Happy Smile */}
            <Rect x="8" y="12" width="8" height="1" fill="#15803D" />
            {/* Belly & Body */}
            <Rect x="6" y="15" width="12" height="6" fill="#22C55E" />
            <Rect x="8" y="15" width="8" height="5" fill="#BBF7D0" />
            {/* Webbed hands */}
            <Rect x="4" y="17" width="2" height="3" fill="#16A34A" />
            <Rect x="18" y="17" width="2" height="3" fill="#16A34A" />
          </G>
        );

      // 10. Cozy Panda
      case 'panda':
        return (
          <G>
            {/* Black Round Ears */}
            <Rect x="4" y="4" width="4" height="4" fill="#18181B" />
            <Rect x="16" y="4" width="4" height="4" fill="#18181B" />
            {/* White Face */}
            <Rect x="5" y="7" width="14" height="9" fill="#FFFFFF" />
            {/* Black Eye Patches */}
            <Rect x="6" y="9" width="4" height="4" fill="#18181B" />
            <Rect x="7" y="10" width="1" height="1" fill="#FFFFFF" />
            <Rect x="14" y="9" width="4" height="4" fill="#18181B" />
            <Rect x="15" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Nose */}
            <Rect x="11" y="12" width="2" height="2" fill="#18181B" />
            {/* Body */}
            <Rect x="6" y="16" width="12" height="5" fill="#18181B" />
            <Rect x="9" y="16" width="6" height="5" fill="#FFFFFF" />
          </G>
        );

      // 11. Honey Brown Bear
      case 'bear':
        return (
          <G>
            {/* Ears */}
            <Rect x="4" y="4" width="4" height="4" fill="#92400E" />
            <Rect x="5" y="5" width="2" height="2" fill="#FDE68A" />
            <Rect x="16" y="4" width="4" height="4" fill="#92400E" />
            <Rect x="17" y="5" width="2" height="2" fill="#FDE68A" />
            {/* Head */}
            <Rect x="5" y="7" width="14" height="9" fill="#92400E" />
            {/* Eyes */}
            <Rect x="7" y="9" width="2" height="2" fill="#18181B" />
            <Rect x="15" y="9" width="2" height="2" fill="#18181B" />
            {/* Light Snout */}
            <Rect x="8" y="11" width="8" height="5" fill="#FDE68A" />
            <Rect x="11" y="11" width="2" height="2" fill="#451A03" />
            {/* Body */}
            <Rect x="6" y="16" width="12" height="5" fill="#92400E" />
            <Rect x="9" y="16" width="6" height="5" fill="#B45309" />
          </G>
        );

      // 12. Polar Bear with Scarf
      case 'polar-bear':
        return (
          <G>
            {/* Ears */}
            <Rect x="5" y="4" width="3" height="3" fill="#F1F5F9" />
            <Rect x="16" y="4" width="3" height="3" fill="#F1F5F9" />
            {/* Head */}
            <Rect x="5" y="7" width="14" height="8" fill="#F8FAFC" />
            {/* Eyes & Nose */}
            <Rect x="8" y="9" width="2" height="2" fill="#0F172A" />
            <Rect x="14" y="9" width="2" height="2" fill="#0F172A" />
            <Rect x="11" y="11" width="2" height="2" fill="#0F172A" />
            {/* Sky Blue Scarf */}
            <Rect x="5" y="15" width="14" height="3" fill="#38BDF8" />
            <Rect x="14" y="18" width="3" height="3" fill="#0284C7" />
            {/* Body */}
            <Rect x="6" y="18" width="12" height="3" fill="#F8FAFC" />
          </G>
        );

      // 13. Little Penguin
      case 'penguin':
        return (
          <G>
            {/* Head */}
            <Rect x="6" y="5" width="12" height="7" fill="#18181B" />
            {/* White Face Mask */}
            <Rect x="7" y="7" width="4" height="4" fill="#FFFFFF" />
            <Rect x="13" y="7" width="4" height="4" fill="#FFFFFF" />
            {/* Eyes */}
            <Rect x="9" y="8" width="2" height="2" fill="#18181B" />
            <Rect x="13" y="8" width="2" height="2" fill="#18181B" />
            {/* Orange Beak */}
            <Rect x="10" y="10" width="4" height="2" fill="#F97316" />
            {/* Red Winter Scarf */}
            <Rect x="6" y="12" width="12" height="3" fill="#DC2626" />
            <Rect x="8" y="15" width="3" height="3" fill="#DC2626" />
            {/* Body & Belly */}
            <Rect x="5" y="15" width="14" height="5" fill="#18181B" />
            <Rect x="9" y="15" width="6" height="5" fill="#FFFFFF" />
            {/* Feet */}
            <Rect x="8" y="20" width="3" height="2" fill="#F97316" />
            <Rect x="13" y="20" width="3" height="2" fill="#F97316" />
          </G>
        );

      // 14. Wise Barn Owl
      case 'owl':
        return (
          <G>
            {/* Feather Tuft Ears */}
            <Rect x="5" y="3" width="3" height="4" fill="#78350F" />
            <Rect x="16" y="3" width="3" height="4" fill="#78350F" />
            {/* Head */}
            <Rect x="5" y="6" width="14" height="9" fill="#92400E" />
            {/* Giant Yellow Eyes */}
            <Rect x="6" y="7" width="5" height="5" fill="#FDE047" />
            <Rect x="8" y="8" width="2" height="3" fill="#18181B" />
            <Rect x="8" y="8" width="1" height="1" fill="#FFFFFF" />
            <Rect x="13" y="7" width="5" height="5" fill="#FDE047" />
            <Rect x="14" y="8" width="2" height="3" fill="#18181B" />
            <Rect x="14" y="8" width="1" height="1" fill="#FFFFFF" />
            {/* Beak */}
            <Rect x="11" y="11" width="2" height="2" fill="#F97316" />
            {/* Body */}
            <Rect x="6" y="15" width="12" height="6" fill="#78350F" />
            <Rect x="9" y="15" width="6" height="5" fill="#FEF3C7" />
          </G>
        );

      // 15. Rust Fox
      case 'fox':
        return (
          <G>
            {/* Tall Ears with black tips */}
            <Rect x="4" y="3" width="4" height="2" fill="#18181B" />
            <Rect x="4" y="5" width="4" height="3" fill="#EA580C" />
            <Rect x="5" y="5" width="2" height="2" fill="#FFF7ED" />
            <Rect x="16" y="3" width="4" height="2" fill="#18181B" />
            <Rect x="16" y="5" width="4" height="3" fill="#EA580C" />
            <Rect x="17" y="5" width="2" height="2" fill="#FFF7ED" />
            {/* Head */}
            <Rect x="5" y="8" width="14" height="8" fill="#EA580C" />
            {/* Eyes */}
            <Rect x="7" y="10" width="2" height="2" fill="#18181B" />
            <Rect x="15" y="10" width="2" height="2" fill="#18181B" />
            {/* White Cheek Fluffs */}
            <Rect x="5" y="12" width="4" height="4" fill="#FFF7ED" />
            <Rect x="15" y="12" width="4" height="4" fill="#FFF7ED" />
            <Rect x="9" y="13" width="6" height="3" fill="#FFF7ED" />
            <Rect x="11" y="13" width="2" height="2" fill="#18181B" />
            {/* Body */}
            <Rect x="6" y="16" width="12" height="5" fill="#EA580C" />
            <Rect x="9" y="16" width="6" height="5" fill="#FFF7ED" />
          </G>
        );

      // 16. Yellow Rubber Duckling
      case 'duck':
        return (
          <G>
            {/* Head */}
            <Rect x="7" y="5" width="10" height="8" fill="#FACC15" />
            {/* Eye */}
            <Rect x="12" y="7" width="2" height="2" fill="#18181B" />
            <Rect x="12" y="7" width="1" height="1" fill="#FFFFFF" />
            {/* Big Orange Bill */}
            <Rect x="15" y="9" width="5" height="3" fill="#F97316" />
            {/* Body */}
            <Rect x="5" y="13" width="14" height="7" fill="#FACC15" />
            <Rect x="4" y="14" width="2" height="3" fill="#EAB308" />
            <Rect x="5" y="20" width="14" height="1" fill="#38BDF8" />
          </G>
        );

      // 17. Lo-Fi Listener with Headphones
      case 'human-headphones':
        return (
          <G>
            {/* Cyan Headphone Band */}
            <Rect x="6" y="4" width="12" height="2" fill="#06B6D4" />
            <Rect x="4" y="6" width="3" height="6" fill="#0891B2" />
            <Rect x="17" y="6" width="3" height="6" fill="#0891B2" />
            {/* Hair */}
            <Rect x="7" y="6" width="10" height="3" fill="#292524" />
            {/* Face */}
            <Rect x="7" y="9" width="10" height="6" fill="#FCD34D" />
            {/* Eyes (Smiling / Focused) */}
            <Rect x="9" y="11" width="2" height="1" fill="#451A03" />
            <Rect x="13" y="11" width="2" height="1" fill="#451A03" />
            <Rect x="11" y="13" width="2" height="1" fill="#E11D48" />
            {/* Hoodie */}
            <Rect x="5" y="15" width="14" height="6" fill="#3B82F6" />
            <Rect x="9" y="15" width="6" height="6" fill="#1D4ED8" />
          </G>
        );

      // 18. Bookish Scholar with Glasses
      case 'human-glasses':
        return (
          <G>
            {/* Wavy Hair */}
            <Rect x="6" y="4" width="12" height="4" fill="#78350F" />
            <Rect x="5" y="7" width="2" height="5" fill="#78350F" />
            <Rect x="17" y="7" width="2" height="5" fill="#78350F" />
            {/* Face */}
            <Rect x="7" y="7" width="10" height="8" fill="#FED7AA" />
            {/* Teal Glasses */}
            <Rect x="7" y="9" width="4" height="3" fill="none" stroke="#0D9488" strokeWidth="1" />
            <Rect x="13" y="9" width="4" height="3" fill="none" stroke="#0D9488" strokeWidth="1" />
            <Rect x="11" y="10" width="2" height="1" fill="#0D9488" />
            {/* Eyes behind glasses */}
            <Rect x="8" y="10" width="2" height="1" fill="#18181B" />
            <Rect x="14" y="10" width="2" height="1" fill="#18181B" />
            {/* Mouth */}
            <Rect x="11" y="13" width="2" height="1" fill="#9A3412" />
            {/* Sweater */}
            <Rect x="5" y="15" width="14" height="6" fill="#047857" />
            <Rect x="10" y="15" width="4" height="6" fill="#FEF3C7" />
          </G>
        );

      // 19. Cozy Beanie Nomad
      case 'human-beanie':
        return (
          <G>
            {/* Mustard Beanie */}
            <Rect x="7" y="3" width="10" height="4" fill="#EAB308" />
            <Rect x="6" y="6" width="12" height="3" fill="#CA8A04" />
            <Rect x="11" y="2" width="2" height="2" fill="#EAB308" />
            {/* Hair peeking */}
            <Rect x="6" y="9" width="2" height="3" fill="#18181B" />
            <Rect x="16" y="9" width="2" height="3" fill="#18181B" />
            {/* Face */}
            <Rect x="7" y="9" width="10" height="6" fill="#FED7AA" />
            {/* Eyes */}
            <Rect x="9" y="11" width="2" height="2" fill="#18181B" />
            <Rect x="13" y="11" width="2" height="2" fill="#18181B" />
            <Rect x="11" y="13" width="2" height="1" fill="#B45309" />
            {/* Knit Scarf */}
            <Rect x="5" y="15" width="14" height="3" fill="#DC2626" />
            <Rect x="7" y="18" width="3" height="3" fill="#B91C1C" />
            {/* Jacket */}
            <Rect x="5" y="18" width="14" height="3" fill="#374151" />
          </G>
        );

      // 20. Starry Pixie Girl
      case 'human-girl-pink':
        return (
          <G>
            {/* Double Purple/Pink Buns */}
            <Rect x="4" y="3" width="4" height="4" fill="#A855F7" />
            <Rect x="16" y="3" width="4" height="4" fill="#A855F7" />
            {/* Gold Star Clip */}
            <Rect x="7" y="5" width="2" height="2" fill="#FDE047" />
            {/* Hair */}
            <Rect x="6" y="5" width="12" height="4" fill="#C084FC" />
            {/* Face */}
            <Rect x="7" y="8" width="10" height="7" fill="#FED7AA" />
            {/* Cute Eyes with lashes */}
            <Rect x="8" y="10" width="2" height="2" fill="#7E22CE" />
            <Rect x="8" y="10" width="1" height="1" fill="#FFFFFF" />
            <Rect x="14" y="10" width="2" height="2" fill="#7E22CE" />
            <Rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
            {/* Cheeks */}
            <Rect x="7" y="12" width="2" height="1" fill="#F472B6" />
            <Rect x="15" y="12" width="2" height="1" fill="#F472B6" />
            {/* Outfit */}
            <Rect x="6" y="15" width="12" height="6" fill="#EC4899" />
            <Rect x="9" y="15" width="6" height="6" fill="#FDF2F8" />
          </G>
        );

      // 21. Coffee Artist with Beret
      case 'human-artist':
        return (
          <G>
            {/* Red Beret */}
            <Rect x="7" y="3" width="11" height="4" fill="#DC2626" />
            <Rect x="5" y="6" width="14" height="2" fill="#B91C1C" />
            <Rect x="12" y="2" width="1" height="2" fill="#DC2626" />
            {/* Dark Hair */}
            <Rect x="6" y="8" width="2" height="4" fill="#292524" />
            <Rect x="16" y="8" width="2" height="4" fill="#292524" />
            {/* Face */}
            <Rect x="7" y="8" width="10" height="7" fill="#FED7AA" />
            {/* Eyes */}
            <Rect x="9" y="10" width="2" height="2" fill="#18181B" />
            <Rect x="13" y="10" width="2" height="2" fill="#18181B" />
            <Rect x="11" y="13" width="2" height="1" fill="#991B1B" />
            {/* Striped Shirt */}
            <Rect x="5" y="15" width="14" height="6" fill="#FFFFFF" />
            <Rect x="5" y="16" width="14" height="1" fill="#1E293B" />
            <Rect x="5" y="18" width="14" height="1" fill="#1E293B" />
          </G>
        );

      // 22. Night Coder Hoodie
      case 'human-hoodie':
        return (
          <G>
            {/* Dark Hoodie Cap */}
            <Rect x="6" y="4" width="12" height="5" fill="#312E81" />
            <Rect x="5" y="7" width="14" height="8" fill="#312E81" />
            {/* Face opening */}
            <Rect x="8" y="8" width="8" height="6" fill="#FCD34D" />
            {/* Glow Glasses */}
            <Rect x="8" y="9" width="3" height="2" fill="#38BDF8" />
            <Rect x="13" y="9" width="3" height="2" fill="#38BDF8" />
            {/* Hoodie strings & Torso */}
            <Rect x="5" y="15" width="14" height="6" fill="#1E1B4B" />
            <Rect x="10" y="15" width="1" height="4" fill="#E2E8F0" />
            <Rect x="13" y="15" width="1" height="4" fill="#E2E8F0" />
          </G>
        );

      // 23. Friendly Floating Ghost
      case 'ghost':
        return (
          <G>
            {/* Ghost Head & Rounded Top */}
            <Rect x="7" y="4" width="10" height="3" fill="#F8FAFC" />
            <Rect x="5" y="7" width="14" height="10" fill="#F8FAFC" />
            {/* Big Curious Eyes */}
            <Rect x="8" y="8" width="3" height="4" fill="#1E1B4B" />
            <Rect x="8" y="8" width="1" height="1" fill="#FFFFFF" />
            <Rect x="13" y="8" width="3" height="4" fill="#1E1B4B" />
            <Rect x="13" y="8" width="1" height="1" fill="#FFFFFF" />
            {/* Cute Pink Cheeks */}
            <Rect x="6" y="11" width="2" height="2" fill="#F472B6" />
            <Rect x="16" y="11" width="2" height="2" fill="#F472B6" />
            {/* Floating Wavy Tail Bottom */}
            <Rect x="5" y="17" width="2" height="3" fill="#F8FAFC" />
            <Rect x="8" y="17" width="2" height="4" fill="#F8FAFC" />
            <Rect x="11" y="17" width="2" height="3" fill="#F8FAFC" />
            <Rect x="14" y="17" width="2" height="4" fill="#F8FAFC" />
            <Rect x="17" y="17" width="2" height="3" fill="#F8FAFC" />
          </G>
        );

      // 24. Retro Pixel Robot
      case 'robot':
        return (
          <G>
            {/* Antenna with Red Light */}
            <Rect x="11" y="2" width="2" height="2" fill="#EF4444" />
            <Rect x="11" y="4" width="2" height="2" fill="#94A3B8" />
            {/* Boxy Robot Head */}
            <Rect x="5" y="6" width="14" height="9" fill="#94A3B8" />
            {/* Ear Bolts */}
            <Rect x="3" y="8" width="2" height="4" fill="#64748B" />
            <Rect x="19" y="8" width="2" height="4" fill="#64748B" />
            {/* Cyan Digital Eyes Screen */}
            <Rect x="7" y="8" width="10" height="4" fill="#0F172A" />
            <Rect x="8" y="9" width="3" height="2" fill="#22D3EE" />
            <Rect x="13" y="9" width="3" height="2" fill="#22D3EE" />
            {/* Pixel Grin */}
            <Rect x="9" y="13" width="6" height="1" fill="#475569" />
            {/* Body */}
            <Rect x="6" y="15" width="12" height="6" fill="#64748B" />
            <Rect x="9" y="16" width="6" height="4" fill="#CBD5E1" />
            <Rect x="10" y="17" width="2" height="2" fill="#F59E0B" />
          </G>
        );

      // 25. Emerald Mini Dragon
      case 'dragon':
        return (
          <G>
            {/* Orange Horns */}
            <Rect x="6" y="3" width="2" height="3" fill="#F97316" />
            <Rect x="16" y="3" width="2" height="3" fill="#F97316" />
            {/* Head */}
            <Rect x="6" y="6" width="12" height="8" fill="#10B981" />
            {/* Snout */}
            <Rect x="7" y="11" width="10" height="4" fill="#059669" />
            <Rect x="8" y="12" width="2" height="1" fill="#047857" />
            <Rect x="14" y="12" width="2" height="1" fill="#047857" />
            {/* Golden Eyes */}
            <Rect x="8" y="8" width="2" height="3" fill="#FDE047" />
            <Rect x="9" y="8" width="1" height="2" fill="#047857" />
            <Rect x="14" y="8" width="2" height="3" fill="#FDE047" />
            <Rect x="14" y="8" width="1" height="2" fill="#047857" />
            {/* Belly & Tiny Wings */}
            <Rect x="4" y="14" width="2" height="4" fill="#34D399" />
            <Rect x="18" y="14" width="2" height="4" fill="#34D399" />
            <Rect x="6" y="15" width="12" height="6" fill="#10B981" />
            <Rect x="9" y="15" width="6" height="5" fill="#FDE047" />
          </G>
        );

      // 26. Space Explorer Astronaut
      case 'astronaut':
        return (
          <G>
            {/* Rounded Helmet */}
            <Rect x="6" y="4" width="12" height="11" fill="#F8FAFC" />
            {/* Golden Reflective Visor */}
            <Rect x="7" y="7" width="10" height="6" fill="#F59E0B" />
            <Rect x="8" y="7" width="2" height="4" fill="#FEF3C7" />
            {/* Helmet Collar & Pack */}
            <Rect x="5" y="15" width="14" height="6" fill="#E2E8F0" />
            <Rect x="10" y="16" width="4" height="3" fill="#3B82F6" />
          </G>
        );

      // 27. Green Martian Alien
      case 'alien':
        return (
          <G>
            {/* Wobbly Antenna */}
            <Rect x="11" y="2" width="2" height="2" fill="#A855F7" />
            <Rect x="11" y="4" width="2" height="3" fill="#84CC16" />
            {/* Alien Head */}
            <Rect x="5" y="7" width="14" height="8" fill="#84CC16" />
            {/* Three Purple Eyes */}
            <Rect x="6" y="9" width="3" height="3" fill="#A855F7" />
            <Rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
            <Rect x="10" y="8" width="4" height="3" fill="#A855F7" />
            <Rect x="11" y="8" width="1" height="1" fill="#FFFFFF" />
            <Rect x="15" y="9" width="3" height="3" fill="#A855F7" />
            <Rect x="16" y="9" width="1" height="1" fill="#FFFFFF" />
            {/* Smile */}
            <Rect x="10" y="13" width="4" height="1" fill="#4D7C0F" />
            {/* Cosmic Suit */}
            <Rect x="6" y="15" width="12" height="6" fill="#65A30D" />
            <Rect x="9" y="16" width="6" height="4" fill="#D9F99D" />
          </G>
        );

      // 28. Star Wizard
      case 'wizard':
        return (
          <G>
            {/* Pointy Purple Hat */}
            <Rect x="11" y="2" width="2" height="3" fill="#7C3AED" />
            <Rect x="9" y="5" width="6" height="3" fill="#7C3AED" />
            <Rect x="11" y="5" width="2" height="2" fill="#FDE047" />
            <Rect x="5" y="8" width="14" height="2" fill="#5B21B6" />
            {/* Eyes */}
            <Rect x="7" y="10" width="10" height="3" fill="#FED7AA" />
            <Rect x="8" y="10" width="2" height="2" fill="#38BDF8" />
            <Rect x="14" y="10" width="2" height="2" fill="#38BDF8" />
            {/* Fluffy Beard */}
            <Rect x="6" y="13" width="12" height="5" fill="#E2E8F0" />
            <Rect x="8" y="18" width="8" height="3" fill="#E2E8F0" />
            {/* Robe */}
            <Rect x="5" y="17" width="14" height="4" fill="#7C3AED" />
          </G>
        );

      // 29. Shadow Ninja
      case 'ninja':
        return (
          <G>
            {/* Hood */}
            <Rect x="6" y="4" width="12" height="11" fill="#18181B" />
            {/* Crimson Headband */}
            <Rect x="5" y="7" width="14" height="2" fill="#DC2626" />
            <Rect x="17" y="7" width="3" height="5" fill="#DC2626" />
            {/* Eye Slit */}
            <Rect x="8" y="9" width="8" height="3" fill="#FED7AA" />
            <Rect x="9" y="10" width="2" height="1" fill="#18181B" />
            <Rect x="13" y="10" width="2" height="1" fill="#18181B" />
            {/* Body */}
            <Rect x="5" y="15" width="14" height="6" fill="#27272A" />
            <Rect x="11" y="15" width="2" height="6" fill="#DC2626" />
          </G>
        );

      // 30. Little Plant / Cactus in Pot
      case 'plant-pot':
        return (
          <G>
            {/* Pink Blossom on top */}
            <Rect x="11" y="3" width="2" height="2" fill="#F43F5E" />
            {/* Main Cactus Body */}
            <Rect x="9" y="5" width="6" height="9" fill="#16A34A" />
            {/* Left Arm */}
            <Rect x="6" y="7" width="3" height="2" fill="#16A34A" />
            <Rect x="6" y="6" width="2" height="2" fill="#16A34A" />
            {/* Right Arm */}
            <Rect x="15" y="8" width="3" height="2" fill="#16A34A" />
            <Rect x="16" y="7" width="2" height="2" fill="#16A34A" />
            {/* Cute Face on Cactus */}
            <Rect x="10" y="9" width="1" height="1" fill="#052E16" />
            <Rect x="13" y="9" width="1" height="1" fill="#052E16" />
            <Rect x="11" y="11" width="2" height="1" fill="#FB7185" />
            {/* Terracotta Pot */}
            <Rect x="7" y="14" width="10" height="2" fill="#C2410C" />
            <Rect x="8" y="16" width="8" height="5" fill="#EA580C" />
          </G>
        );

      // 31. Steaming Coffee Cup
      case 'coffee-cup':
        return (
          <G>
            {/* Steam Pixels */}
            <Rect x="9" y="3" width="1" height="2" fill="#94A3B8" opacity="0.8" />
            <Rect x="12" y="2" width="1" height="3" fill="#94A3B8" opacity="0.8" />
            <Rect x="14" y="4" width="1" height="2" fill="#94A3B8" opacity="0.8" />
            {/* Cup Rim & Body */}
            <Rect x="6" y="7" width="11" height="11" fill="#FAF5FF" />
            <Rect x="7" y="8" width="9" height="2" fill="#78350F" />
            {/* Cute Kawaii Face */}
            <Rect x="8" y="12" width="2" height="1" fill="#18181B" />
            <Rect x="13" y="12" width="2" height="1" fill="#18181B" />
            <Rect x="10" y="14" width="3" height="1" fill="#F43F5E" />
            {/* Cup Handle */}
            <Rect x="17" y="9" width="3" height="6" fill="#E9D5FF" />
            <Rect x="17" y="11" width="1" height="2" fill="#FEF3C7" />
            {/* Saucer */}
            <Rect x="4" y="18" width="15" height="2" fill="#DDD6FE" />
          </G>
        );

      // 32. Smiling Cosmic Star
      case 'star':
        return (
          <G>
            {/* Star Points */}
            <Rect x="11" y="3" width="2" height="3" fill="#FACC15" />
            <Rect x="4" y="9" width="16" height="6" fill="#FACC15" />
            <Rect x="8" y="6" width="8" height="12" fill="#FACC15" />
            <Rect x="6" y="15" width="4" height="4" fill="#FACC15" />
            <Rect x="14" y="15" width="4" height="4" fill="#FACC15" />
            {/* Sparkle Highlights */}
            <Rect x="9" y="7" width="2" height="2" fill="#FEF08A" />
            {/* Cute Eyes & Blushing Cheeks */}
            <Rect x="9" y="10" width="2" height="2" fill="#713F12" />
            <Rect x="13" y="10" width="2" height="2" fill="#713F12" />
            <Rect x="8" y="12" width="2" height="1" fill="#FB7185" />
            <Rect x="14" y="12" width="2" height="1" fill="#FB7185" />
            <Rect x="11" y="13" width="2" height="1" fill="#9A3412" />
          </G>
        );

      // Fallback
      default:
        return (
          <G>
            <Rect x="5" y="7" width="14" height="10" fill="#F59E0B" />
            <Rect x="8" y="10" width="2" height="2" fill="#18181B" />
            <Rect x="14" y="10" width="2" height="2" fill="#18181B" />
            <Rect x="11" y="13" width="2" height="1" fill="#FB7185" />
          </G>
        );
    }
  };

export function PixelAvatarNative({
  avatarId,
  size = 64,
  isWorking = false,
}: {
  avatarId?: string;
  size?: number;
  isWorking?: boolean;
}) {
  const item = getAvatarById(avatarId || "cat-tabby");
  return (
    <View
      accessibilityLabel={item.name}
      style={{
        width: size,
        height: size,
        borderWidth: 2,
        borderColor: item.borderHex,
        borderRadius: Math.max(9, size * 0.14),
        backgroundColor: item.bgHex,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {item.isScene ? (
        <PixelSceneIllustrationNative sceneId={item.id} />
      ) : (
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          <Rect x="2" y="2" width="20" height="20" rx="3" fill="#1C1814" />
          <Rect x="3" y="3" width="18" height="18" rx="2" fill={item.bgHex} />
          {isWorking ? (
            <>
              <Rect x="4" y="4" width="1" height="1" fill="#FEF08A" />
              <Rect x="19" y="5" width="1" height="1" fill="#67E8F9" />
              <Rect x="4" y="18" width="1" height="1" fill="#F472B6" />
              <Rect x="19" y="18" width="1" height="1" fill="#A7F3D0" />
            </>
          ) : null}
          {renderPixelArt(item.id)}
          <Rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#2D251D" strokeWidth="0.8" />
        </Svg>
      )}
    </View>
  );
}
