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
      // In a real implementation, this would fetch from your database/API
      // For now, we'll simulate different client data based on the slug
      
      if (clientSlug === 'e3-webcasting') {
        // Use the default e3 Webcasting data
        setClientData(null); // null will use default data
      } else {
        // You could fetch other client data here
        setError('Client not found');
      }
    } catch (err) {
      setError('Failed to load client data');
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
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const clientName = slug ? slug.replace('-', ' ').replace(/\\b\\w/g, l => l.toUpperCase()) : 'Client';

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

// Optional: Add static generation for better performance
export async function getStaticPaths() {
  // Define known client slugs
  const paths = [
    { params: { slug: 'e3-webcasting' } },
    // Add more client slugs as needed
  ];

  return {
    paths,
    fallback: 'blocking', // Enable ISR for new clients
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  
  // In a real app, you'd fetch client data here
  // For now, we'll pass through the slug
  
  return {
    props: {
      slug,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
