import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const CSVUploadModal = ({ isOpen, onClose, onDataUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setUploadStatus({ type: 'error', message: 'Please select a valid CSV file' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({ 
          type: 'success', 
          message: 'CSV processed successfully!' 
        });
        
        // Store the data in localStorage for persistence
        if (result.data && typeof window !== 'undefined') {
          const storageKey = result.dataKey || `analysis-${Date.now()}`;
          localStorage.setItem(storageKey, JSON.stringify({
            data: result.data,
            filename: result.filename,
            uploadedAt: new Date().toISOString(),
            key: storageKey
          }));
          
          // Also store as 'currentAnalysis' for easy access
          localStorage.setItem('currentAnalysis', JSON.stringify({
            data: result.data,
            filename: result.filename,
            uploadedAt: new Date().toISOString(),
            key: storageKey
          }));
          
          console.log('Data stored successfully:', result.data);
        }
        
        // Pass the processed data back to parent component
        if (onDataUploaded) {
          onDataUploaded(result.data);
        }

        // Auto-close after success
        setTimeout(() => {
          onClose();
          setUploadStatus(null);
        }, 2000);
      } else {
        setUploadStatus({ 
          type: 'error', 
          message: result.error || 'Failed to process CSV file' 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: 'Upload failed. Please check your connection and try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Upload Competitive Analysis Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEvents}
          onDragLeave={handleDragEvents}
          onDragOver={handleDragEvents}
          onDrop={handleDrop}
        >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop your CSV file here, or click to browse
          </h3>
          <p className="text-gray-600 mb-4">
            Upload your competitive analysis CSV from tools like Competely
          </p>
          
          <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" />
            Choose CSV File
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleInputChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Status Messages */}
        {uploadStatus && (
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
        )}

        {/* Loading State */}
        {uploading && (
          <div className="mt-6 flex items-center justify-center gap-3 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            Processing CSV file...
          </div>
        )}

        {/* Expected CSV Format */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <h4 className="font-semibold text-gray-900">Expected CSV Format:</h4>
          </div>
          <ul className="text-sm text-gray-600 space-y-1 ml-7">
            <li>• <strong>OVERVIEW</strong> section with company profiles and basic info</li>
            <li>• <strong>SWOT ANALYSIS</strong> section with strengths, weaknesses, opportunities, threats</li>
            <li>• <strong>SERVICES</strong> section with service offerings and features</li>
            <li>• <strong>AUDIENCE</strong>, <strong>SENTIMENT</strong>, <strong>MARKET</strong>, <strong>MARKETING</strong> sections</li>
            <li>• Sections separated by <code className="bg-gray-200 px-1 rounded">───────────────</code></li>
            <li>• First column should be "Name" with row labels</li>
            <li>• Subsequent columns should be company names</li>
          </ul>
          
          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Make sure your CSV export from Competely includes all sections and maintains the original formatting with section separators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUploadModal;
