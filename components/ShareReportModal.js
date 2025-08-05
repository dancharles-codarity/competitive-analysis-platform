import React, { useState } from 'react';
import { Share2, Copy, Mail, Link2, X, CheckCircle } from 'lucide-react';

const ShareReportModal = ({ isOpen, onClose, clientName, reportData }) => {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Generate client slug from name
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  };

  const clientSlug = generateSlug(clientName);
  const reportUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/client/${clientSlug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = reportUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`Competitive Analysis Report - ${clientName}`);
    const body = encodeURIComponent(`Hi,

I've prepared a comprehensive competitive analysis report for ${clientName}. You can view the interactive report at:

${reportUrl}

This report includes:
• Competitive positioning analysis
• SWOT analysis for your company and key competitors
• Market sentiment and positioning insights
• Service portfolio comparison
• Strategic recommendations

Best regards`);

    window.open(`mailto:?subject=${subject}&body=${body}`);
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const saveReportData = async () => {
    try {
      // Save report data to localStorage or send to API
      if (typeof window !== 'undefined') {
        localStorage.setItem(`report-${clientSlug}`, JSON.stringify({
          clientName,
          slug: clientSlug,
          data: reportData,
          createdAt: new Date().toISOString(),
          url: reportUrl
        }));
      }
      
      alert('Report data saved successfully!');
    } catch (error) {
      alert('Failed to save report data');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Share Report</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Client Report URL */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Client Report URL
          </h3>
          <p className="text-gray-600 mb-3">
            Share this personalized link with {clientName}
          </p>
          
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
            <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={reportUrl}
              readOnly
              className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
            />
            <button
              onClick={copyToClipboard}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {copied ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Copied!
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  Copy
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={sendEmail}
            className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
              emailSent ? 'border-green-300 bg-green-50' : 'border-gray-200'
            }`}
          >
            <Mail className={`w-5 h-5 ${emailSent ? 'text-green-600' : 'text-blue-600'}`} />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">
                {emailSent ? 'Email Prepared!' : 'Send via Email'}
              </h4>
              <p className="text-sm text-gray-600">
                {emailSent ? 'Email client opened' : 'Open email with pre-filled message'}
              </p>
            </div>
          </button>

          <button
            onClick={saveReportData}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Link2 className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Save Report Data</h4>
              <p className="text-sm text-gray-600">Store report for future access</p>
            </div>
          </button>
        </div>

        {/* Report Preview */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Report Preview</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>📊 Client: {clientName}</p>
            <p>🎯 Competitors: {reportData?.competitors?.join(', ') || 'N/A'}</p>
            <p>📅 Generated: {new Date().toLocaleDateString()}</p>
            <p>🔗 URL: <code className="bg-white px-1 rounded">/client/{clientSlug}</code></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={() => window.open(reportUrl, '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;