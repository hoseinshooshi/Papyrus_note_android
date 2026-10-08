import React from 'react'
import {HeartHandshake, X, Copy, Check} from 'lucide-react'
import { useState, useEffect, useRef } from 'react';

const DonationModal = ({onClose, crypto, isOpen}) => {
    const [name, setName] = useState('');
    const [textAddress, seTextAddress] = useState('');
    const [qrCodeSRC, setQrCodeSRC] = useState('');
    const [isCopied, setIsCopied] = useState(false)
    useEffect(() => {
        if (crypto) {
        setName(crypto.name || '');
        seTextAddress(crypto.textAddress || '');
        setQrCodeSRC(crypto.qrCodeSRC || '');
        }
    }, [crypto, isOpen]);

    const handleCopy = async () => {
        try {
            if (!textAddress) return;

            await navigator.clipboard.writeText(textAddress);

            setIsCopied(true);

            setTimeout(() => {
            setIsCopied(false);
            }, 1500);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };
  if (!crypto || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in"
    >
        
        <div 
        className="bg-[#FAF7F0] border overflow-y-auto space-y-4 border-[#E5DECD]  rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            {/* header */}
            <div className="px-5 py-4 border-b border-[#E8DFC9] flex items-center justify-between bg-[#F4ECE0]/70">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EADDCB] text-[#594735] flex items-center justify-center">
                        <HeartHandshake className="w-4 h-4 text-[#ff857e]" />
                    </div>
                    <div>
                        <h2 className="font-serif-display font-bold text-base text-[#2C241C]">
                            Your Donation Will be Appreciated
                        </h2>
                        <p className="text-[11px] text-[#7A6B5B]">
                            Only Use This Wallet Address for <strong className="font-bold text-red-400">{name}</strong> Donations 
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-[#8C7D6C] hover:text-[#2C241C] hover:bg-black/5 transition-colors"
                    title="Close"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            {/* Body */}
            {/* QR CODE */}
            <div>
                <div className=" flex-1 flex items-center justify-between p-3 rounded-xl bg-[#F2ECE0] border border-[#DDD2BC]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex justify-between flex-col">
                            <span className="text-lg font-serif-display font-bold text-base">QR CODE</span>
                            <span className="text-sm justify-start font-serif-display font-bold">Scan With Your Phone Camera</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center p-3 rounded-xl bg-[#F2ECE0] border border-[#DDD2BC]">
                    <div className=" mt-5 mb-5 bg-white p-5 rounded-lg border border-[#DDD2BC]">
                        <img src={qrCodeSRC} alt={`${name} wallet QR Code`} className="w-[200px] h-[200px]"/>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F2ECE0] border border-[#DDD2BC]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex justify-between flex-col">
                            <span className="text-lg font-serif-display font-bold text-base">{name} Wallet Address:</span>
                            <span className="text-sm justify-start font-serif-display font-bold">Copy The {name} the Address</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center p-3 rounded-xl bg-[#F2ECE0] border border-[#DDD2BC]">
                    <input
                    type="text"
                    disabled
                    value={textAddress}
                    className="w-full text-sm px-3 py-2.5 bg-white border border-[#DDD2BC] rounded-l-xl text-[#2C241C] placeholder-[#9E907E] focus:outline-none focus:border-[#8C724B] focus:ring-1 focus:ring-[#8C724B] transition-all font-medium"
                    />
                    <button
                        onClick={handleCopy}
                        className="py-1 cursor-pointer rounded-e-lg text-white bg-white flex justify-center items-center w-10 h-10"
                    >
                        {isCopied ? <Check className="w-4 h-4 text-[#2C241C]"/> : <Copy className="w-4 h-4 text-[#2C241C]"/>}
                    </button>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default DonationModal