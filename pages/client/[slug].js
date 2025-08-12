import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import CompetitiveAnalysisDashboard from '../../components/CompetitiveAnalysisDashboard';

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
      
      // Fetch from database via API
      const response = await fetch(`/api/reports/${clientSlug}`);
      
      if (response.ok) {
        const reportData = await response.json();
        console.log('✅ Retrieved report data from database:', reportData);
        
        // Transform the stored data into the format the dashboard expects
        if (reportData.data) {
          const transformedData = transformToCompetitiveData(reportData);
          console.log('✅ Transformed data for dashboard:', transformedData);
          setClientData(transformedData);
        } else {
          console.log('❌ No data field in report');
          setClientData(null);
        }
      } else if (response.status === 404) {
        console.log('❌ No report found in database, showing demo');
        setClientData(null);
      } else {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
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

  // Transform the stored report data into the format expected by CompetitiveAnalysisDashboard
  const transformToCompetitiveData = (reportData) => {
    console.log('Full report data received:', reportData);
    
    // Check if we have the full competitive data from Competely CSV
    if (reportData.fullCompetitiveData) {
      console.log('✅ Using full competitive data from Competely CSV');
      const fullData = reportData.fullCompetitiveData;
      
      return {
        ...fullData,
        // Override the client logo if we have one saved
        clientLogo: reportData.clientLogo || fullData.clientLogo,
        // Ensure selected competitors are set correctly
        selectedCompetitors: reportData.data?.competitors || Object.keys(fullData.allCompetitors || {}),
        // Mark this as a client report so admin features are hidden
        isClientReport: true
      };
    }
    
    // Fallback to basic data structure if full data not available
    const clientName = reportData.clientName;
    const data = reportData.data;
    const selectedCompetitors = data.competitors || [];
    
    console.log('⚠️  Using fallback demo data structure');
    console.log('Selected competitors from data:', selectedCompetitors);
    
    return {
      clientName: clientName,
      clientLogo: reportData.clientLogo || data.clientLogo || null,
      clientWebsite: data.clientWebsite || '',
      industry: data.industry || 'Business Services',
      analysisDate: data.analysisDate || reportData.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      tagline: `Competitive Analysis for ${clientName}`,
      description: `Comprehensive competitive intelligence analysis for ${clientName} in the ${data.industry || 'business services'} sector.`,
      selectedCompetitors: selectedCompetitors,
      
      clientProfile: {
        name: clientName,
        tagline: `${clientName} - Market Analysis`,
        description: `A comprehensive analysis of ${clientName} and its competitive landscape in ${data.industry || 'business services'}.`,
        elevatorPitch: `${clientName} operates in the competitive ${data.industry || 'business services'} market alongside key players including ${selectedCompetitors.join(', ')}.`,
        link: data.clientWebsite || '',
        marketPosition: 'Market participant under analysis',
        estimatedRevenue: 'Analysis in progress',
        swot: {
          Strengths: [
            'Unique market position and specialization',
            'Established customer relationships',
            'Industry expertise and knowledge'
          ],
          Weaknesses: [
            'Competitive market pressures',
            'Need for continued differentiation',
            'Market positioning challenges'
          ],
          Opportunities: [
            'Market expansion possibilities',
            'Service enhancement opportunities',
            'Customer base growth potential'
          ],
          Threats: [
            'Competitive market dynamics',
            'Industry disruption risks',
            'Economic market pressures'
          ]
        },
        services: [
          'Core business services',
          'Customer engagement',
          'Market presence'
        ],
        target_audience: {
          'Primary': 'Core customer segment',
          'Secondary': 'Potential market expansion',
          'Decision Makers': 'Key stakeholders and decision makers'
        },
        sentiment: {
          'Overall Score': '4.2/5',
          'Positive Themes': 'Market presence, customer relationships, service delivery',
          'Negative Themes': 'Competitive pressures, market challenges'
        },
        market: {
          'Market Share': 'Under analysis',
          'Revenue Range': 'Competitive analysis scope',
          'Geographic Presence': 'Market area analysis'
        },
        marketing: {
          'Primary Channels': 'Multi-channel market approach',
          'Content Strategy': 'Industry-focused messaging and positioning',
          'Unique Selling Proposition': 'Specialized market positioning and customer focus'
        }
      },
      
      allCompetitors: selectedCompetitors.reduce((acc, competitor, index) => {
        acc[competitor] = {
          name: competitor,
          tagline: `${competitor} - Competitive Analysis`,
          description: `${competitor} is a key competitor in the ${data.industry || 'business services'} market, providing similar services and targeting comparable customer segments.`,
          elevatorPitch: `${competitor} competes directly with ${clientName} in the ${data.industry || 'business services'} sector, representing a significant market presence.`,
          link: '',
          marketPosition: `Competitive player #${index + 1} in market analysis`,
          estimatedRevenue: 'Competitive analysis data',
          swot: {
            Strengths: [
              'Established market presence',
              'Competitive service offerings',
              'Market recognition and brand awareness',
              'Customer base and relationships'
            ],
            Weaknesses: [
              'Market competition pressures',
              'Service differentiation challenges',
              'Customer retention considerations'
            ],
            Opportunities: [
              'Market expansion potential',
              'Service innovation possibilities',
              'Partnership and collaboration opportunities'
            ],
            Threats: [
              'Increased market competition',
              'Industry disruption risks',
              'Economic and market pressures'
            ]
          },
          services: [
            'Primary service offerings',
            'Customer solutions',
            'Market-focused services',
            'Competitive positioning'
          ],
          target_audience: {
            'Primary': 'Similar customer segments to client',
            'Secondary': 'Overlapping market opportunities',
            'Decision Makers': 'Comparable decision maker profiles'
          },
          sentiment: {
            'Overall Score': `${(4.0 + Math.random() * 0.8).toFixed(1)}/5`,
            'Positive Themes': 'Market reputation, service quality, customer satisfaction',
            'Negative Themes': 'Competitive challenges, market pressures'
          },
          market: {
            'Market Share': `Competitor ${index + 1} market position`,
            'Revenue Range': 'Competitive revenue analysis',
            'Geographic Presence': 'Market territory overlap'
          },
          marketing: {
            'Primary Channels': 'Competitive marketing approach',
            'Content Strategy': 'Industry and customer-focused messaging',
            'Unique Selling Proposition': `${competitor}'s market differentiation strategy`
          }
        };
        return acc;
      }, {}),
      
      isClientReport: true
    };
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
          <p className="text-xs text-gray-400 mt-1">Fetching from database...</p>
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
            <p className="text-xs mt-1">Checking Redis database...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no data found, show demo message
  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Competitive Analysis Report
            </h1>
            <p className="text-xl text-gray-600">{clientName}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Sample Report for {clientName}
            </h3>
            <p className="text-gray-600 mb-6">
              This is a demonstration report. To view your personalized competitive analysis:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-blue-800 text-sm">
                1. Visit the main dashboard<br/>
                2. Upload your competitive analysis CSV data<br/>
                3. Generate a new client report link
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Main Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{clientName} - Competitive Analysis Report</title>
        <meta name="description" content={`Comprehensive competitive intelligence report for ${clientName}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        {/* Render the full CompetitiveAnalysisDashboard with the client's data */}
        <CompetitiveAnalysisDashboard clientData={clientData} />
        
        {/* Add a footer indicating this is a shared report */}
        <div className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-300">
              This is a shared competitive analysis report for <strong>{clientData.clientName}</strong>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Generated on {new Date(clientData.analysisDate).toLocaleDateString()} • 
              Analyzing {Object.keys(clientData.allCompetitors).length} competitors: {Object.keys(clientData.allCompetitors).join(', ')}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}