import React, { useState } from 'react';
import { 
  Scan, 
  Upload, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Receipt, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { ReceiptScanResult } from '../types';

interface SmartReceiptOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReceiptExtracted: (result: ReceiptScanResult) => void;
  primaryCurrency: string;
}

export const SmartReceiptOcrModal: React.FC<SmartReceiptOcrModalProps> = ({
  isOpen,
  onClose,
  onReceiptExtracted,
  primaryCurrency
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('carrefour');
  const [extractedData, setExtractedData] = useState<ReceiptScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScanPreset = async (presetKey: string) => {
    setSelectedPreset(presetKey);
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/receipt-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samplePreset: presetKey })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExtractedData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to scan receipt via Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/receipt-ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setExtractedData(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error processing receipt file');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAdd = () => {
    if (!extractedData) return;
    onReceiptExtracted(extractedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B333F]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[rgba(43,79,96,0.15)] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-3">
          <div className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-[#845460]" />
            <h3 className="text-lg font-serif font-medium text-[#1B333F]">Smart Receipt Scanner (Gemini AI)</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#5B6E75] hover:text-[#1B333F] rounded-lg bg-[#FAF6F2] hover:bg-[#EAD3CB]/50 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Sample Receipts */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#5B6E75] block">
            Select Sample Receipt Preset or Upload Custom Receipt Photo:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleScanPreset('carrefour')}
              className={`p-3 rounded-xl border text-left transition text-xs space-y-1 cursor-pointer ${
                selectedPreset === 'carrefour' ? 'bg-[#EAD3CB] border-[#845460] text-[#6A414B]' : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#22323A] hover:border-[#845460]'
              }`}
            >
              <div className="font-semibold">Carrefour Hyper</div>
              <div className="text-[10px] text-[#5B6E75] font-mono">1,845.50 EGP</div>
            </button>

            <button
              onClick={() => handleScanPreset('talabat')}
              className={`p-3 rounded-xl border text-left transition text-xs space-y-1 cursor-pointer ${
                selectedPreset === 'talabat' ? 'bg-[#EAD3CB] border-[#845460] text-[#6A414B]' : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#22323A] hover:border-[#845460]'
              }`}
            >
              <div className="font-semibold">Talabat / TBS</div>
              <div className="text-[10px] text-[#5B6E75] font-mono">420.00 EGP</div>
            </button>

            <button
              onClick={() => handleScanPreset('fawry')}
              className={`p-3 rounded-xl border text-left transition text-xs space-y-1 cursor-pointer ${
                selectedPreset === 'fawry' ? 'bg-[#EAD3CB] border-[#845460] text-[#6A414B]' : 'bg-[#FAF6F2] border-[rgba(43,79,96,0.12)] text-[#22323A] hover:border-[#845460]'
              }`}
            >
              <div className="font-semibold">Fawry EEHC</div>
              <div className="text-[10px] text-[#5B6E75] font-mono">1,250.00 EGP</div>
            </button>
          </div>
        </div>

        {/* Custom Upload Button */}
        <div className="border-2 border-dashed border-[rgba(43,79,96,0.18)] hover:border-[#845460] rounded-xl p-4 text-center bg-[#FAF6F2] transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            id="receipt-file-input"
            className="hidden"
          />
          <label htmlFor="receipt-file-input" className="cursor-pointer flex flex-col items-center space-y-1">
            <Upload className="w-6 h-6 text-[#845460]" />
            <span className="text-xs font-semibold text-[#1B333F]">Click to Upload Receipt Photo</span>
            <span className="text-[10px] text-[#5B6E75]">Supports JPG, PNG, WEBP</span>
          </label>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center space-x-2 py-6 text-[#845460] text-xs font-semibold">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Gemini AI analyzing receipt details & OCR items...</span>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-[#EAD3CB] border border-[#D98B6F] text-[#6A414B] text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Extracted Receipt Preview */}
        {extractedData && !loading && (
          <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.13)] rounded-xl p-4 space-y-3 text-xs">
            <div className="flex justify-between items-start border-b border-[rgba(43,79,96,0.12)] pb-2">
              <div>
                <span className="text-[10px] text-[#5B6E75] uppercase block font-bold tracking-wider">Extracted Merchant</span>
                <h4 className="font-serif font-medium text-[#1B333F] text-sm">{extractedData.merchant}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#5B6E75] uppercase block font-bold tracking-wider">Total Amount</span>
                <div className="text-base font-bold text-[#4F8683] font-mono">
                  {extractedData.total.toLocaleString()} {extractedData.currency || primaryCurrency}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#22323A]">
              <div>
                <span className="text-[10px] text-[#5B6E75] block font-semibold">Category</span>
                <span className="font-semibold capitalize text-[#1B333F]">{extractedData.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5B6E75] block font-semibold">Date</span>
                <span className="font-mono text-[#1B333F]">{extractedData.date}</span>
              </div>
            </div>

            {/* Extracted Line Items */}
            {extractedData.items && extractedData.items.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-[rgba(43,79,96,0.12)]">
                <span className="text-[10px] text-[#5B6E75] uppercase font-bold tracking-wider block">Line Items</span>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {extractedData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[#22323A] text-[11px]">
                      <span>• {item.name}</span>
                      <span className="font-mono text-[#5B6E75]">{item.price} EGP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmAdd}
              className="w-full bg-[#2B4F60] hover:bg-[#1B333F] text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 mt-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D98B6F]" />
              <span>Confirm & Log to Ledger</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
