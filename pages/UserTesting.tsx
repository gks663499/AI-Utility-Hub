
import React, { useState } from 'react';
import { userTestingFeedback } from '../services/gemini';

interface Props {
  onUse: () => boolean;
  credits: number;
}

const UserTesting: React.FC<Props> = ({ onUse, credits }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleTest = async () => {
    if (!url) return;
    if (credits <= 0) { alert("Out of credits!"); return; }

    setLoading(true);
    try {
      if (onUse()) {
        const result = await userTestingFeedback(url);
        setFeedback(result);
      }
    } catch (err) {
      console.error(err);
      alert("Could not analyze the site. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">👩‍💻</div>
          <h2 className="text-3xl font-bold">User Testing Simulator</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Upload your app link and let our AI personas simulate real-world usability challenges and offer expert UX improvements.</p>
        </div>

        <div className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your prototype or website URL here..."
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pink-500 transition-all text-lg"
          />
          <button
            onClick={handleTest}
            disabled={loading || !url}
            className="w-full py-5 bg-pink-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/30 hover:bg-pink-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Simulating User Journeys...' : 'Get UX Feedback (2 Credits)'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            AI Feedback Report
          </h3>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTesting;
