import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CompetitiveAnalysisDashboard from '../../components/CompetitiveAnalysisDashboard';
import Head from 'next/head';

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
      // Check for stored report data first
      let storedData = null;
      if (typeof window !== 'undefined') {
        const reportKey = `report-${clientSlug}`;
        const stored = localStorage.getItem(reportKey);
        if (stored) {
          storedData = JSON.parse(stored);
        }
      }

      // Handle different slug patterns
      const slugVariants = [
        clientSlug,
        clientSlug.replace(/-/g, ' '),
        'e3 Webcasting LLC', // Default fallback
        'e3-webcasting',
        'e3-webcasting-llc'
      ];

      // Check if this matches known clients
      const isE3Webcasting = slugVariants.some(variant => 
        variant.toLowerCase().includes('e3') || 
        variant.toLowerCase().includes('webcasting') ||
        clientSlug === 'e3-webcasting-llc'
      );

      if (isE3Webcasting || !storedData) {
        // Use default e3 Webcasting data
        setClientData(null); // null will use default data in dashboard
      } else {
        // Use stored client data
        setClientData(storedData.data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching client data:', err);
      // Fallback to default data instead of showing error
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
          <p className="text-gray-600">Loading competitive analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Main Dashboard
          </button>
        </div>
      </div>
    );
  }

  const clientName = slug ? 
    slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    'Client';

  return (
    <>
      <Head>
        <title>{clientName} - Competitive Analysis Report</title>
        <meta name="description" content={`Competitive intelligence report for ${clientName}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <CompetitiveAnalysisDashboard clientData={clientData} />
      </main>
    </>
  );
}

// This enables dynamic routing for any client slug
export async function getServerSideProps({ params }) {
  const { slug } = params;
  
  return {
    props: {
      slug,
    },
  };
}