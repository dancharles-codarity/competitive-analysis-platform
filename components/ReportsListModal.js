import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, Building, Users, ExternalLink, Loader } from 'lucide-react';

const ReportsListModal = ({ isOpen, onClose, onLoadReport }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports list');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLoadReport = async (slug) => {
    try {
      const response = await fetch(`/api/reports/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to load report');
      }
      
      const data = await response.json();
      onLoadReport(data);
      onClose();
    } catch (error) {
      console.error('Error loading report:', error);
      alert('Failed to load report: ' + error.message);
    }
  };

  const handleViewClientReport = (slug) => {
    const clientUrl = `${window.location.origin}/client/${slug}`;
    window.open(clientUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Past Reports
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading reports...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchReports}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No reports found. Create your first report to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.slug} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                          {report.hasLogo ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            report.clientName.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.clientName}</h3>
                          <p className="text-sm text-gray-600">{report.industry}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Analysis: {formatDate(report.analysisDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{report.competitorsCount} competitors</span>
                        </div>
                        <div>
                          Created: {formatDate(report.createdDate)} at {formatTime(report.createdDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewClientReport(report.slug)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Client View
                      </button>
                      <button
                        onClick={() => handleLoadReport(report.slug)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Building className="w-3 h-3" />
                        Load Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsListModal;