import React, { useState } from 'react';
import { Code, Play, Copy, Check, Terminal, Send, Sparkles } from 'lucide-react';
import { apiEndpoints } from '../../data/apiExamples';

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
  const [activeLang, setActiveLang] = useState('curl');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExecuteApi = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 700);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/20">
        <div>
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Developer API & Integration Sandbox
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
            AccessAI REST & Real-Time WebSocket API
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Embed AI accessibility scanning, vision text reading, and live captions into your web & mobile applications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Endpoint List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Endpoints</h3>
          {apiEndpoints.map((ep) => (
            <div
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep)}
              className={`glass-card p-4 cursor-pointer border transition-all ${
                selectedEndpoint.id === ep.id
                  ? 'border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-500/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {ep.method}
                </span>
                <span className="text-xs font-mono text-slate-300">{ep.path}</span>
              </div>
              <h4 className="font-bold text-sm text-white">{ep.name}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ep.description}</p>
            </div>
          ))}
        </div>

        {/* Code & Response Inspector */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 bg-slate-950 border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedEndpoint.method} {selectedEndpoint.path}</span>
                <h3 className="text-xl font-bold text-white">{selectedEndpoint.name}</h3>
              </div>

              <button
                onClick={handleExecuteApi}
                disabled={isExecuting}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2"
              >
                {isExecuting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isExecuting ? 'Sending Request...' : 'Test Endpoint'}</span>
              </button>
            </div>

            {/* Code Snippet Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['curl', 'node'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`text-xs px-3 py-1 rounded-lg font-mono font-semibold uppercase ${
                        activeLang === lang ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleCopyCode(activeLang === 'curl' ? selectedEndpoint.curlSnippet : selectedEndpoint.nodeSnippet)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                {activeLang === 'curl' ? selectedEndpoint.curlSnippet : selectedEndpoint.nodeSnippet}
              </pre>
            </div>

            {/* Simulated Response JSON */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Response Payload (200 OK)</span>
              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-60 overflow-y-auto">
                {JSON.stringify(selectedEndpoint.responsePayload, null, 2)}
              </pre>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
