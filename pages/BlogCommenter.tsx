
import React, { useState } from 'react';
import { blogCommenter } from '../services/gemini';

interface Props {
  onUse: () => boolean;
  credits: number;
}

const BlogCommenter: React.FC<Props> = ({ onUse, credits }) => {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'url' | 'text'>('url');
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    if (credits <= 0) {
      alert("Out of credits!");
      return;
    }

    setLoading(true);
    try {
      if (onUse()) {
        const commentText = await blogCommenter(input, type);
        setResults(commentText || "No comments generated.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate comments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2">Blog Commenting Assistant</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Generate thoughtful, contextual comments to boost your networking game.</p>
        
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setType('url')} className={`px-4 py-2 rounded-lg font-medium transition-all ${type === 'url' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Use URL</button>
          <button onClick={() => setType('text')} className={`px-4 py-2 rounded-lg font-medium transition-all ${type === 'text' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Use Content</button>
        </div>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={type === 'url' ? 'Paste blog post URL here...' : 'Paste blog post content here...'}
            className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}
          >
            {loading ? 'Generating...' : 'Generate Comments (1 Credit)'}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold mb-4">Generated Comments</h3>
          <div className="space-y-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {results}
          </div>
          <button 
            onClick={() => { navigator.clipboard.writeText(results); alert("Copied to clipboard!"); }}
            className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            Copy all results
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogCommenter;
