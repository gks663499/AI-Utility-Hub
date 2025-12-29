
import React, { useState } from 'react';
import { generateTranscription } from '../services/gemini';
import { TranscriptionSegment } from '../types';

interface Props {
  onUse: () => boolean;
  credits: number;
}

const Transcription: React.FC<Props> = ({ onUse, credits }) => {
  const [file, setFile] = useState<{ data: string; type: string; name: string } | null>(null);
  const [segments, setSegments] = useState<TranscriptionSegment[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFile({
          data: (ev.target?.result as string).split(',')[1],
          type: f.type,
          name: f.name
        });
        setSegments(null);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;
    if (credits <= 0) { alert("Out of credits!"); return; }

    setLoading(true);
    try {
      if (onUse()) {
        const result = await generateTranscription(file.data, file.type);
        setSegments(result);
      }
    } catch (err) {
      console.error(err);
      alert("Transcription failed. Check file size and format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-center">AI Transcription Hub</h2>
        <p className="text-gray-500 mb-8 text-center">Accurate speech-to-text for meetings, podcasts, and video content.</p>

        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-md">
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl cursor-pointer hover:border-indigo-400 transition-all bg-gray-50 dark:bg-gray-900 group">
              <input type="file" className="hidden" accept="audio/*,video/*" onChange={handleUpload} />
              <div className="flex flex-col items-center space-y-2">
                <span className="text-4xl group-hover:scale-110 transition-transform">🎙️</span>
                <span className="font-bold text-gray-400">{file ? file.name : 'Upload Audio or Video'}</span>
                <span className="text-[10px] uppercase text-gray-300 tracking-widest font-black">MP3, WAV, MP4 (Max 20MB)</span>
              </div>
            </label>
          </div>

          <button
            onClick={handleTranscribe}
            disabled={!file || loading}
            className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Transcribing...' : 'Start Transcription (3 Credits)'}
          </button>
        </div>
      </div>

      {segments && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in duration-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Transcription Results</h3>
            <button
              onClick={() => {
                const txt = segments.map(s => `[${s.startTime}] ${s.text}`).join('\n');
                navigator.clipboard.writeText(txt);
                alert("Copied to clipboard!");
              }}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-sm transition-all"
            >
              Copy Text
            </button>
          </div>
          <div className="space-y-6">
            {segments.map((s, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-20 shrink-0 text-xs font-black text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg h-fit text-center mt-1">
                  {s.startTime}
                </div>
                <div className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {s.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transcription;
