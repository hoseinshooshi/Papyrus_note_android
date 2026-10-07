import React, { useState } from 'react';
import { PapyrusBrandLogo } from './FullSvg';
import { PixelSceneIllustration } from './PixelSceneIllustration';
import { 
  Cloud, 
  ShieldCheck, 

  AlertCircle
} from 'lucide-react';
import { geometricAsArray } from '../assets/images';
import { signInWithGoogle } from '../services/firebase';

interface LoginScreenProps {
  onSignedIn?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setErrorMsg(err?.message || 'Unable to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  const randomIndex = Math.floor(Math.random() * geometricAsArray.length);
  const image = geometricAsArray[randomIndex]
  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle warm background radial grain */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D8CEBC_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Centerpiece Auth Card */}
      <div className="w-full max-w-md relative z-10 bg-[#FAF7F0] border-2 border-[#E2D8C3] rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex-shrink-0">
            <PapyrusBrandLogo />
          </div>

          {/* Featured Pixel Art Showcase Vignette */}
          <div className="w-full max-w-[280px] h-36 rounded-2xl overflow-hidden border-2 border-[#D4B37D] shadow-md relative group">
            <img src={image} alt="" />
            <div className="absolute inset-x-0 bottom-0  p-2 text-center">
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-serif-display text-2xl font-bold text-[#2A231C]">
              Welcome to Papyrus
            </h1>
            <p className="text-xs text-[#7A6D5E] max-w-xs leading-relaxed">
              Write Notes & Journals; Organize Your Tasks
            </p>
          </div>
        </div>

        {/* Feature Highlights List */}
        <div className="mt-6 mb-6 p-3.5 rounded-2xl bg-[#F2EDE1] border border-[#E3D9C4] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#554737]">
            <Cloud className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
            <span>Automatic cloud backup & real-time sync</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#554737]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
            <span>Private & isolated user storage vault</span>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Sign-in Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            id="google-signin-btn"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2E251C] hover:bg-[#45372A] active:scale-[0.99] text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <>
                {/* Official Google G SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-[#8C7D6D] leading-normal">
            Sign in with your Google account to access and store your notes, tasks, and avatar securely in the cloud.
          </p>
        </div>
      </div>
    </div>
  );
};
