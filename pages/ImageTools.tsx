
import React, { useState } from 'react';
import { editImageTask } from '../services/gemini';
import ComparisonSlider from '../components/ComparisonSlider';
import { TOOL_COSTS, ToolType } from '../types';

interface Props {
  onUse: () => boolean;
  credits: number;
}

const ImageTools: React.FC<Props> = ({ onUse, credits }) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<string>('remove background');

  const tasks = [
    { id: 'remove background', label: 'Background Remover' },
    { id: 'colorize the photo', label: 'Colorization' },
    { id: 'upscale this image significantly', label: 'Upscale (AI Refine)' },
    { id: 'remove any watermarks from this image', label: 'Watermark Remover' },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    const cost = TOOL_COSTS[ToolType.IMAGE_TOOLS];
    if (credits < cost) { alert("Out of credits!"); return; }

    setLoading(true);
    try {
      if (onUse()) {
        const base64 = image.split(',')[1];
        const processed = await editImageTask(base64, activeTask);
        setResult(processed);
      }
    } catch (err) {
      console.error(err);
      alert("Processing failed. Try a smaller image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">AI Image Lab</h2>
        <p className="text-gray-500 dark:text-gray-400">Compare results with our interactive slider preview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Select Tool</h3>
            <div className="flex flex-col space-y-2">
              {tasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTask(t.id)}
                  className={`text-left px-4 py-3 rounded-xl transition-all ${activeTask === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <input type="file" id="img-upload" hidden accept="image/*" onChange={handleUpload} />
            <label htmlFor="img-upload" className="block w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
              <span className="block text-3xl mb-2">📸</span>
              <span className="text-sm font-medium text-gray-500">Change Image</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center min-h-[400px]">
            {result && image ? (
              <div className="w-full max-w-xl">
                <ComparisonSlider before={image} after={result} />
                <p className="mt-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">Move slider to compare before and after</p>
              </div>
            ) : (
              <div className="flex-1 max-w-xl space-y-4">
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-800 relative">
                  {image ? (
                    <img src={image} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-gray-300">No Image Uploaded</div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-sm font-black animate-pulse uppercase tracking-widest">Enhancing Image...</p>
                    </div>
                  )}
                </div>
                {!image && !loading && <p className="text-center text-sm text-gray-400">Upload an image to see the comparison</p>}
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={processImage}
              disabled={!image || loading}
              className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              Start {tasks.find(t => t.id === activeTask)?.label} ({TOOL_COSTS[ToolType.IMAGE_TOOLS]} Credits)
            </button>
            {result && (
              <a href={result} download="ai-enhanced-image.png" className="px-8 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-xl hover:bg-green-600 transition-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTools;
