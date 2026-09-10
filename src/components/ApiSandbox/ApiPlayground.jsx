import React, { useState } from 'react';
import { Code, Send, Copy } from 'lucide-react';
import { apiEndpoints } from '../../data/apiExamples';

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
  const [activeLang, setActiveLang] = useState('curl');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExecuteApi = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 600);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="space-y-2.5">
          <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-xs">
            <Code className="w-3.5 h-3.5 text-amber-700" /> Backend REST & WebSocket API Gateway
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Developer Integration Sandbox
          </h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-3xl font-normal">
            Embed AI accessibility scanning, vision text reading, and live caption streaming into external applications. Engineered by <strong className="font-semibold text-stone-900">Diya Poulkar</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Endpoint List */}
        <div className="lg:col-span-4 space-y-3.5">
          <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">Available Backend Endpoints</h3>
          {apiEndpoints.map((ep) => (
            <div
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep)}
              className={`bg-white p-5 cursor-pointer border rounded-2xl transition-all shadow-xs hover:shadow-md ${
                selectedEndpoint.id === ep.id
                  ? 'border-stone-900 bg-stone-50/90 ring-1 ring-stone-900'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                  ep.method === 'POST' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                }`}>
                  {ep.method}
                </span>
                <span className="text-xs font-mono font-bold text-stone-600">{ep.path}</span>
              </div>
              <h4 className="font-bold text-sm text-stone-900">{ep.name}</h4>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2 font-medium">{ep.description}</p>
            </div>
          ))}
        </div>

        {/* Code & Response Inspector */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700">{selectedEndpoint.method} {selectedEndpoint.path}</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-stone-900 mt-0.5">{selectedEndpoint.name}</h3>
              </div>

              <button
                onClick={handleExecuteApi}
                disabled={isExecuting}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                {isExecuting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isExecuting ? 'Sending...' : 'Test Endpoint'}</span>
              </button>
            </div>

            {/* Code Snippets */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {['curl', 'node'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`text-xs px-4 py-1.5 rounded-full font-mono font-bold uppercase transition-all ${
                        activeLang === lang ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleCopyCode(activeLang === 'curl' ? selectedEndpoint.curlSnippet : selectedEndpoint.nodeSnippet)}
                  className="text-xs text-stone-700 hover:text-stone-900 flex items-center gap-1 font-bold"
                >
                  <Copy className="w-3.5 h-3.5 text-stone-600" />
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="bg-stone-900 p-4 rounded-xl border border-stone-800 text-xs font-mono text-amber-200 overflow-x-auto shadow-inner leading-relaxed">
                {activeLang === 'curl' ? selectedEndpoint.curlSnippet : selectedEndpoint.nodeSnippet}
              </pre>
            </div>

            {/* Response JSON */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-stone-900">Response Payload (200 OK)</span>
              <pre className="bg-stone-900 p-4 rounded-xl border border-stone-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-56 overflow-y-auto shadow-inner leading-relaxed">
                {JSON.stringify(selectedEndpoint.responsePayload, null, 2)}
              </pre>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
