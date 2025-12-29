
import React, { useState, useRef, useEffect } from 'react';
import { hindiTutorChat } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  onUse: () => boolean;
  credits: number;
}

const HindiTutor: React.FC<Props> = ({ onUse, credits }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Namaste! I am your Hindi Tutor. How can I help you today? We can practice conversation, learn grammar, or translate phrases.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (credits <= 0) { alert("Out of credits!"); return; }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      if (onUse()) {
        const responseText = await hindiTutorChat([], userMessage);
        setMessages(prev => [...prev, { role: 'model', text: responseText || "I'm having trouble thinking in Hindi right now." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I hit a snag. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-2xl shadow-sm border-x border-t border-gray-100 dark:border-gray-700 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none'}`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-tl-none text-gray-500 animate-pulse">AI is typing...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-b-2xl shadow-sm border-x border-b border-gray-100 dark:border-gray-700">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white w-12 h-12 flex items-center justify-center rounded-xl shadow-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-bold">1 Credit per session update</p>
      </div>
    </div>
  );
};

export default HindiTutor;
