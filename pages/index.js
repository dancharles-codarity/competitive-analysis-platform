import CompetitiveAnalysisDashboard from '../components/CompetitiveAnalysisDashboard';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Competitive Analysis Platform</title>
        <meta name="description" content="Professional competitive intelligence platform for service-based event companies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <CompetitiveAnalysisDashboard />
      </main>
    </>
  );
}
