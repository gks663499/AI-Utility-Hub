
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const tools = [
    { name: 'Blog Commenter', description: 'AI-generated contextual comments.', path: '/blog-commenter', color: 'bg-blue-500', icon: '💬' },
    { name: 'Hindi Tutor', description: 'Master Hindi with your AI friend.', path: '/hindi-tutor', color: 'bg-red-500', icon: '🇮🇳' },
    { name: 'Image Tools', description: 'Enhance and edit your visuals.', path: '/image-tools', color: 'bg-green-500', icon: '🖼️' },
    { name: 'SEO Analyzer', description: 'On-page audit and recommendations.', path: '/seo-analyzer', color: 'bg-purple-500', icon: '🔍' },
    { name: 'Logo Animation', description: 'Bring your static logos to life.', path: '/logo-animation', color: 'bg-orange-500', icon: '🎬' },
    { name: 'Transcription', description: 'Audio/Video to text accurately.', path: '/transcription', color: 'bg-yellow-500', icon: '🎙️' },
    { name: 'User Testing', description: 'Get professional UX feedback.', path: '/user-testing', color: 'bg-pink-500', icon: '👩‍💻' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Welcome back, John!</h2>
        <p className="text-gray-500 dark:text-gray-400">What would you like to build today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.path} to={tool.path} className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
            <div className={`w-12 h-12 ${tool.color} text-white rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{tool.description}</p>
            <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              Launch Tool
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-500/20">
        <div className="space-y-4 max-w-lg">
          <h3 className="text-2xl font-bold">Try our new AI Logo Animator</h3>
          <p className="text-indigo-100">Upload your brand logo and generate a 1080p high-quality animation in seconds. Powered by Gemini Veo.</p>
          <Link to="/logo-animation" className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Start Animating</Link>
        </div>
        <div className="hidden md:block text-8xl opacity-20 transform -rotate-12">🎬</div>
      </div>
    </div>
  );
};

export default Dashboard;
