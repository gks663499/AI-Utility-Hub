
import React, { useState, useEffect } from 'react';
import { generateLogoAnimation } from '../services/gemini';
import { TOOL_COSTS, ToolType } from '../types';

interface Props {
  onUse: () => boolean;
  credits: number;
}

const LogoAnimation: React.FC<Props> = ({ onUse, credits }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const ok = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(ok);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target?.result as string);
        setVideoUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnimate = async () => {
    if (!logo) return;
    const cost = TOOL_COSTS[ToolType.LOGO_ANIMATION];
    if (credits < cost) { alert("Out of credits!"); return; }

    setLoading(true);
    try {
      if (onUse()) {
        const base64 = logo.split(',')[1];
        const video = await generateLogoAnimation(base64);
        setVideoUrl(video);
      }
    } catch (err) {
      console.error(err);
      alert("Video generation failed. Ensure your API Key has billing enabled.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto text-4xl mb-4">🔑</div>
        <h2 className="text-2xl font-bold">API Key Required</h2>
        <p className="text-gray-500">Logo animation uses Gemini Veo models which require a dedicated billing-enabled API key.</p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800 text-xs text-yellow-700 dark:text-yellow-400 text-left">
          <strong>Notice:</strong> Please follow <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline font-bold">Billing Docs</a> to set up your project.
        </div>
        <button onClick={handleSelectKey} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700">Select API Key</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <h2 className="text-3xl font-bold mb-4">Logo Motion Engine</h2>
        <p className="text-gray-500 mb-10">Compare your static logo with the animated AI version.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Static Original</h4>
            <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
              {logo ? (
                <img src={logo} className="max-w-full max-h-full object-contain p-8" />
              ) : (
                <label className="cursor-pointer group flex flex-col items-center">
                  <input type="file" hidden accept="image/*" onChange={handleUpload} />
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                  <span className="text-sm font-bold text-gray-400">Click to upload</span>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Veo Animation Preview</h4>
            <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden relative">
              {videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-indigo-600 font-bold animate-pulse">Generating Motion...</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl opacity-10">🎬</div>
                      <p className="text-sm font-bold text-gray-300">Animation output will appear here</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleAnimate}
            disabled={!logo || loading}
            className="px-16 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? 'Veo is processing...' : `Generate Animation (${TOOL_COSTS[ToolType.LOGO_ANIMATION]} Credits)`}
          </button>
          {videoUrl && <a href={videoUrl} download="logo-animation.mp4" className="text-sm text-indigo-600 font-bold hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Save Result to Device
          </a>}
        </div>
      </div>
    </div>
  );
};

export default LogoAnimation;
