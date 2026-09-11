import React, { useState } from 'react';
import { FileImage, ScanSearch, Upload } from 'lucide-react';
import { evaluateAltTextWithBackend } from '../services/accessibilityApi';

export default function AltTextEvaluator() {
  const [imageFile, setImageFile] = useState(null);
  const [existingAltText, setExistingAltText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      setError('Choose an image first.');
      return;
    }

    setIsEvaluating(true);
    setError('');
    setResult(null);
    try {
      setResult(await evaluateAltTextWithBackend(imageFile, existingAltText));
    } catch (evaluationError) {
      setError(evaluationError.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <ScanSearch className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">AI Accessibility Review</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">Alt-Text Context Evaluator</h2>
          </div>
        </div>
        <p className="text-stone-600 text-sm mb-7">Upload an image and check whether its existing alt-text is meaningful for screen-reader users.</p>

        <form onSubmit={handleEvaluate} className="grid gap-5">
          <label className="border-2 border-dashed border-stone-300 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:border-cyan-500 transition-colors">
            <FileImage className="w-7 h-7 text-cyan-700" />
            <span className="text-sm font-bold text-stone-800">{imageFile?.name || 'Choose an image'}</span>
            <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} className="hidden" />
          </label>

          <label className="grid gap-2 text-sm font-bold text-stone-800">
            Existing alt-text
            <input
              value={existingAltText}
              onChange={(event) => setExistingAltText(event.target.value)}
              placeholder="Example: image.jpg"
              className="rounded-xl border border-stone-300 px-4 py-3 font-normal focus:border-cyan-600 focus:outline-none"
            />
          </label>

          <button type="submit" disabled={isEvaluating} className="w-fit rounded-xl bg-stone-900 text-white px-5 py-3 text-sm font-bold flex items-center gap-2 disabled:opacity-50">
            <Upload className="w-4 h-4" />
            {isEvaluating ? 'Evaluating...' : 'Evaluate Alt-Text'}
          </button>
        </form>

        {error && <p className="mt-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 p-4 text-sm font-semibold">{error}</p>}
        {result && (
          <div className="mt-7 grid gap-3 rounded-2xl bg-stone-50 border border-stone-200 p-5">
            <div className="flex flex-wrap gap-3 text-sm font-bold">
              <span>Quality: {result.quality}</span>
              <span>Score: {result.score}/100</span>
            </div>
            <p className="text-sm text-stone-700">{result.reason}</p>
            <div className="rounded-xl bg-white border border-stone-200 p-4">
              <p className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-1">Suggested alt-text</p>
              <p className="text-sm text-stone-900 font-semibold">{result.suggested_alt_text}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}