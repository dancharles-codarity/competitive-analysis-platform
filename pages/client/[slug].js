import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

// Very simple client dashboard component to avoid any complex dependencies
const ClientReportDashboard = ({ clientName, clientData }) => {
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
          <p className="text-sm text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">📊 Analysis Overview</h2>
          
          {clientData ? (
            <div className="space-y-6">
              {clientData.companies && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Companies Analyzed:</h3>
                  <div className="flex flex-wrap gap-2">
                    {clientData.companies.map((company, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {clientData.overview && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Company Overview:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(clientData.overview).map(([company, data]) => (
                      <div key={company} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">{company}</h4>
                        {data && typeof data === 'object' ? (
                          Object.entries(data).map(([key, value]) => (
                            <p key={key} className="text-sm text-gray-600 mb-1">
                              <strong>{key}:</strong> {String(value)}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">Data available</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {clientData.swot && (
                <div>
                  <h3 className="text-lg font-medium mb-3">SWOT Analysis Available</h3>
                  <p className="text-gray-600">SWOT analysis data has been processed for all companies.</p>
                </div>
              )}

              {clientData.services && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Services Comparison Available</h3>
                  <p className="text-gray-600">Service comparison data has been processed for analysis.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sample Report for {clientName}
              </h3>
              <p className="text-gray-600 mb-6">
                This is a demonstration report. To view your personalized competitive analysis:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  1. Visit the main dashboard<br/>
                  2. Upload your competitive analysis CSV data<br/>
                  3. Generate a new client report link
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium mb-3 text-center">Report Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">Status</h4>
              <p className="text-green-600">Report Generated</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">Client</h4>
              <p className="text-blue-600">{clientName}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800">Date</h4>
              <p className="text-purple-600">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Main Dashboard
          </button>
        </div>
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
    console.log('ClientReport mounted with slug:', slug);
    
    if (slug) {
      fetchClientData(slug);
    } else {
      setLoading(false);
    }
  }, [slug]);

  const fetchClientData = async (clientSlug) => {
    console.log('Fetching data for slug:', clientSlug);
    
    try {
      setLoading(true);
      
      // Check for stored report data
      let storedData = null;
      if (typeof window !== 'undefined') {
        console.log('Checking localStorage for data...');
        
        // Try multiple storage keys
        const storageKeys = [
          `report-${clientSlug}`,
          `analysis-${clientSlug}`,
          `client-${clientSlug}`,
          'latestReport',
          'currentAnalysis'
        ];
        
        console.log('Trying storage keys:', storageKeys);
        
        for (const key of storageKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              storedData = JSON.parse(stored);
              console.log(`✅ Found data with key: ${key}`, storedData);
              break;
            } catch (e) {
              console.warn(`❌ Invalid JSON in storage key ${key}:`, e);
            }
          }
        }
        
        // Also check for any keys that contain the slug
        const allKeys = Object.keys(localStorage);
        console.log('All localStorage keys:', allKeys);
        
        const matchingKeys = allKeys.filter(key => 
          key.toLowerCase().includes(clientSlug.toLowerCase()) ||
          clientSlug.toLowerCase().includes(key.replace(/[^a-z0-9]/gi, '').toLowerCase())
        );
        
        console.log('Matching keys found:', matchingKeys);
        
        if (matchingKeys.length > 0 && !storedData) {
          for (const key of matchingKeys) {
            try {
              const stored = localStorage.getItem(key);
              if (stored) {
                storedData = JSON.parse(stored);
                console.log(`✅ Found data with matching key: ${key}`, storedData);
                break;
              }
            } catch (e) {
              console.warn(`❌ Invalid JSON in matching key ${key}:`, e);
            }
          }
        }
      }

      // Process the stored data
      if (storedData) {
        console.log('Processing stored data:', storedData);
        
        if (storedData.data) {
          console.log('Using storedData.data');
          setClientData(storedData.data);
        } else if (storedData.companies || storedData.overview) {
          console.log('Using storedData directly');
          setClientData(storedData);
        } else {
          console.warn('Stored data has unexpected structure:', storedData);
          setClientData(null);
        }
      } else {
        console.log('No stored data found, using null');
        setClientData(null);
      }
      
      setError(null);
      console.log('✅ Data fetch completed successfully');
      
    } catch (err) {
      console.error('❌ Error fetching client data:', err);
      setError(`Failed to load report: ${err.message}`);
      setClientData(null);
    } finally {
      setLoading(false);
    }
  };

  // Generate proper client name from slug
  const clientName = slug ? 
    slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    'Client Report';

  console.log('Render state:', { loading, error, clientData: !!clientData, slug, clientName });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading competitive analysis report...</p>
          <p className="text-sm text-gray-500 mt-2">Client: {clientName}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Loading Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setError(null);
                fetchClientData(slug);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Retry Loading
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full"
            >
              View Main Dashboard
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>Debug info: slug = <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code></p>
          </div>
        </div>
      </div>
    );
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
        <ClientReportDashboard 
          clientData={clientData} 
          clientName={clientName}
        />
      </main>
    </>
  );
}
