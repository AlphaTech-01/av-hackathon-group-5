import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { uploadDatasetFiles } from '../api/financialApi';

export const UploadDatasetModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [txnsFile, setTxnsFile] = useState(null);
  const [assetsFile, setAssetsFile] = useState(null);
  const [liabilitiesFile, setLiabilitiesFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!txnsFile) {
      setError('Please select a Transactions CSV file.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await uploadDatasetFiles(txnsFile, assetsFile, liabilitiesFile);
      setSuccessMsg(res.message || 'Dataset ingested non-destructively!');
      setTimeout(() => {
        onUploadSuccess(res);
        onClose();
        setSuccessMsg(null);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Upload failed. Ensure backend FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Financial Dataset</h2>
              <p className="text-xs text-slate-400">Non-destructive CSV Ingestion Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* File input 1: Transactions (Required) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Transactions CSV (Required) *</span>
              {txnsFile && <span className="text-emerald-400 font-mono text-[10px]">{txnsFile.name}</span>}
            </label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all bg-slate-900/50 flex flex-col items-center justify-center text-center cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setTxnsFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileText className="h-6 w-6 text-slate-500 mb-1" />
              <span className="text-xs text-slate-300 font-medium">
                {txnsFile ? txnsFile.name : 'Click or drag transactions.csv here'}
              </span>
              <span className="text-[10px] text-slate-500">Supports raw 817-row schema or custom transactions</span>
            </div>
          </div>

          {/* File input 2: Assets (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Assets CSV (Optional)</span>
              {assetsFile && <span className="text-emerald-400 font-mono text-[10px]">{assetsFile.name}</span>}
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setAssetsFile(e.target.files[0])}
              className="w-full text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30"
            />
          </div>

          {/* File input 3: Liabilities (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Liabilities CSV (Optional)</span>
              {liabilitiesFile && <span className="text-emerald-400 font-mono text-[10px]">{liabilitiesFile.name}</span>}
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setLiabilitiesFile(e.target.files[0])}
              className="w-full text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Ingesting Data...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Process Dataset</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
