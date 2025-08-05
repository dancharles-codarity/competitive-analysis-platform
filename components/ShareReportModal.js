import React, { useState, useEffect } from 'react';
import { Share2, Copy, Mail, Link2, X, CheckCircle, Save, ExternalLink } from 'lucide-react';

const ShareReportModal = ({ isOpen, onClose, clientName, reportData }) => {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportUrl, setReportUrl] = useState('');

  // Generate client slug from name
  const generateSlug = (name) => {
    if (!name) return 'client-report';
    return name.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars except spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const clientSlug = generateSlug(clientName);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReportUrl(`${window.location.origin}/client/${clientSlug}`);
    }
  }, [clientSlug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = reportUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
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

The report is interactive and optimized for both desktop and mobile viewing.

Best regards`);

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const saveReportData = async () => {
    try {
      if (typeof window !== 'undefined') {
        const reportPayload = {
          clientName,
          slug: clientSlug,
          data: reportData,
          createdAt: new Date().toISOString(),
          url: reportUrl,
          version: '1.0'
        };

        // Save with multiple keys for better retrieval
        localStorage.setItem(`report-${clientSlug}`, JSON.stringify(reportPayload));
        localStorage.setItem(`client-${clientSlug}`, JSON.stringify(reportPayload));
        localStorage.setItem('latestReport', JSON.stringify(reportPayload));
        
        // Save a mapping of client names to slugs
        const clientMapping = JSON.parse(localStorage.getItem('clientMapping') || '{}');
        clientMapping[clientName] = clientSlug;
        clientMapping[clientSlug] = clientName;
        localStorage.setItem('clientMapping', JSON.stringify(clientMapping));

        console.log('Report saved successfully:', reportPayload);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save report:', error);
      alert('Failed to save report data. Please try again.');
    }
  };

  const previewReport = () => {
    // Save the data first, then open the report
    saveReportData();
    setTimeout(() => {
      window.open(reportUrl, '_blank');
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Share Report</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Client Report URL */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Client Report URL
          </h3>
          <p className="text-gray-600 mb-3">
            Share this personalized link with <strong>{clientName}</strong>
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
            className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
              saved ? 'border-green-300 bg-green-50' : 'border-gray-200'
            }`}
          >
            <Save className={`w-5 h-5 ${saved ? 'text-green-600' : 'text-purple-600'}`} />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">
                {saved ? 'Report Saved!' : 'Save Report Data'}
              </h4>
              <p className="text-sm text-gray-600">
                {saved ? 'Data stored successfully' : 'Store report for client access'}
              </p>
            </div>
          </button>
        </div>

        {/* Report Preview */}
        <div className="bg-gray-50 p-4 rounded-lg border mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Report Summary</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">📊 Client:</span> 
              <span>{clientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">🎯 Companies:</span> 
              <span>{reportData?.companies?.join(', ') || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">📅 Generated:</span> 
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">🔗 Slug:</span> 
              <code className="bg-white px-2 py-1 rounded border">{clientSlug}</code>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button
              onClick={previewReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Preview Report
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Make sure to save the report data before sharing the URL with your client. 
            The client will be able to access their personalized report at the generated URL.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;
