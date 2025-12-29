
import React, { useState } from 'react';
import { seoAudit } from '../services/gemini';
import { SEOAuditResult } from '../types';

interface Props {
  onUse: () => boolean;
  credits: number;
}

const SEOAnalyzer: React.FC<Props> = ({ onUse, credits }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SEOAuditResult | null>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    if (credits <= 0) { alert("Out of credits!"); return; }

    setLoading(true);
    try {
      if (onUse()) {
        const result = await seoAudit(url);
        setReport(result);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to audit the site. Check URL format.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text('SEO Audit Report', 20, 20);
    doc.setFontSize(14);
    doc.text(`URL: ${url}`, 20, 30);
    doc.text(`Score: ${report.score}/100`, 20, 40);
    
    doc.text('Key Keywords:', 20, 60);
    report.keywords.forEach((k, i) => doc.text(`- ${k}`, 25, 70 + (i * 10)));
    
    doc.addPage();
    doc.text('Recommendations:', 20, 20);
    report.recommendations.forEach((r, i) => {
      const splitR = doc.splitTextToSize(r, 160);
      doc.text(splitR, 20, 30 + (i * 20));
    });
    
    doc.save('SEO-Audit-Report.pdf');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-2">SEO Analysis Tool</h2>
        <p className="text-gray-500 mb-8">Get expert level audit of any website in seconds.</p>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all disabled:bg-indigo-400"
          >
            {loading ? 'Analyzing...' : 'Audit Site (2 Credits)'}
          </button>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center justify-center space-y-4">
            <h4 className="text-gray-400 font-bold uppercase text-xs">Overall Score</h4>
            <div className={`text-6xl font-black ${report.score > 80 ? 'text-green-500' : report.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {report.score}
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${report.score > 80 ? 'bg-green-500' : report.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${report.score}%` }}></div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold">Key Recommendations</h4>
              <button onClick={downloadPDF} className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center hover:underline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Save as PDF
              </button>
            </div>
            <ul className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold mr-3 shrink-0">{i+1}</span>
                  <span className="text-gray-600 dark:text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h4 className="font-bold">Detected Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {report.keywords.map(kw => <span key={kw} className="px-3 py-1 bg-gray-50 dark:bg-gray-900 text-gray-500 rounded-full text-sm font-medium border border-gray-100 dark:border-gray-700">#{kw}</span>)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h4 className="font-bold">On-Page Issues</h4>
            <div className="space-y-2">
              {report.onPage.map((issue, i) => (
                <div key={i} className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                  {issue}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOAnalyzer;
