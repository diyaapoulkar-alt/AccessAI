import React, { useState, useEffect } from 'react';
import { Key, Check, X, ShieldAlert } from 'lucide-react';
import { getGroqApiKey, setGroqApiKey } from '../services/groqApi';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [keyInput, setKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getGroqApiKey());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setGroqApiKey(keyInput);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 backdrop-blur-md p-4">
      <div className="bg-white border border-amber-900/15 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-float">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-amber-950 p-2 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-black text-amber-950">Groq AI API Key Settings</h3>
          </div>
          <p className="text-xs text-stone-600 font-medium">
            Enter your Groq API Key to enable live <strong className="text-amber-950">Llama 3.2 11B Vision</strong> image descriptions and <strong className="text-amber-950">Llama 3.3 70B</strong> text simplification.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-amber-950 mb-1.5 block">Groq API Key (`gsk_...`)</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-stone-50 border border-amber-900/15 rounded-2xl px-4 py-3 text-xs font-mono text-stone-900 focus:border-amber-900 focus:outline-none shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>Stored safely in browser `localStorage`</span>
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-amber-900 font-bold hover:underline">
              Get Free Groq Key ↗
            </a>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-amber-900 hover:bg-amber-950 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{isSaved ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
