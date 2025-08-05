import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

// Simple fallback dashboard component in case the main one fails
const SimpleClientDashboard = ({ clientName, clientData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Competitive Analysis Report
          </h1>
          <p className="text-xl text-gray-600">
            {clientName}
          </p>
        </div>

        {clientData ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Analysis Overview</h2>
            
            {clientData.companies && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Companies Analyzed:</h3>
                <div className="flex flex-wrap gap-2">
                  {clientData.companies.map((company, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {clientData.overview && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Company Overview:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(clientData.overview).map(([company, data]) => (
                    <div key={company} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{company}</h4>
                      {Object.entries(data || {}).map(([key, value]) => (
                        <p key={key} className="text-sm text-gray-600">
                          <strong>{key}:</strong> {value}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                Report generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sample Competitive Analysis Report
            </h2>
            <p className="text-gray-600 mb-6">
              This is a sample report for {clientName}. Upload your competitive analysis data to see a personalized report.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                To create your personalized report, visit the main dashboard and upload your CSV data from tools like Competely.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ClientReport() {
  const router = useRouter();
  const { slug } = router.query;
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchClientData(slug);
    }
  }, [slug]);

  const fetchClientData = async (clientSlug) => {
    try {
      setLoading(true);
      
      // Check for stored report data first
      let storedData = null;
      if (typeof window !== 'undefined') {
        // Try multiple storage keys
        const storageKeys = [
          `report-${clientSlug}`,
          `analysis-${clientSlug}`,
          `client-${clientSlug}`,
          'latestReport',
          'currentAnalysis'
        ];
        
        for (const key of storageKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              storedData = JSON.parse(stored);
              console.log(`Found data with key: ${key}`, storedData);
              break;
            } catch (e) {
              console.warn(`Invalid JSON in storage key ${key}`);
            }
          }
        }
        
        // Also check for any keys that contain the slug
        const allKeys = Object.keys(localStorage);
        const matchingKeys = allKeys.filter(key => 
          key.toLowerCase().includes(clientSlug.toLowerCase()) ||
          clientSlug.toLowerCase().includes(key.toLowerCase())
        );
        
        if (matchingKeys.length > 0 && !storedData) {
          for (const key of matchingKeys) {
            try {
              const stored = localStorage.getItem(key);
              if (stored) {
                storedData = JSON.parse(stored);
                console.log(`Found data with matching key: ${key}`, storedData);
                break;
              }
            } catch (e) {
              console.warn(`Invalid JSON in matching key ${key}`);
            }
          }
        }
      }

      if (storedData) {
        // Use stored data - check if it has the expected structure
        if (storedData.data) {
          setClientData(storedData.data);
        } else if (storedData.companies || storedData.overview) {
          setClientData(storedData);
        } else {
          console.warn('Stored data has unexpected structure:', storedData);
          setClientData(null); // Will use default data
        }
      } else {
        // No data found, use null for default behavior
        console.warn(`No data found for client slug: ${clientSlug}`);
        setClientData(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching client data:', err);
      // Fallback to default data instead of showing error for better UX
      setClientData(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading competitive analysis report...</p>
          <p className="text-sm text-gray-500 mt-2">Client: {slug?.replace(/-/g, ' ')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Access Issue</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchClientData(slug);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-3"
            >
              Retry Loading
            </button>
            <button 
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Main Dashboard
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>Looking for data with slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Generate proper client name from slug
  const clientName = slug ? 
    slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    'Client';

  // Try to load the main dashboard component, but fall back to simple version if it fails
  let DashboardComponent;
  try {
    const CompetitiveAnalysisDashboard = require('../../components/CompetitiveAnalysisDashboard').default;
    DashboardComponent = CompetitiveAnalysisDashboard;
  } catch (err) {
    console.warn('Failed to load main dashboard component, using fallback:', err);
    DashboardComponent = SimpleClientDashboard;
  }

  return (
    <>
      <Head>
        <title>{clientName} - Competitive Analysis Report</title>
        <meta name="description" content={`Competitive intelligence report for ${clientName}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <DashboardComponent 
          clientData={clientData} 
          isClientView={true}
          clientSlug={slug}
          clientName={clientName}
        />
      </main>
    </>
  );
}
