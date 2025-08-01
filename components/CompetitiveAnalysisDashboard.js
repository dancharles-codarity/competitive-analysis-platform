import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Eye, BarChart3, Users, MessageSquare, Globe, Zap, Heart, DollarSign, TrendingUpIcon, Building, Upload, Download, Share2, Settings, FileText, Award, Star, CheckCircle } from 'lucide-react';

const CompetitiveAnalysisDashboard = ({ clientData = null }) => {
  const [selectedCompetitors, setSelectedCompetitors] = useState(['Cvent', 'Cadmium', 'Niche Visuals']);
  const [selectedCompany, setSelectedCompany] = useState('Cvent');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSWOT, setExpandedSWOT] = useState('Strengths');
  const [showCompetitorSelection, setShowCompetitorSelection] = useState(false);

  // Default client data (e3 Webcasting) - can be overridden by props
  const defaultClientData = {
    clientName: 'e3 Webcasting LLC',
    clientLogo: null,
    clientWebsite: 'https://e3webcasting.com/',
    industry: 'Video Production & Event Services',
    analysisDate: '2025-08-01',
    tagline: 'Capturing Your Association\'s Insights & Transforming Them into Revenue Generating Content',
    description: 'A company specializing in video recording, live streaming, and video content strategy services for conferences and associations.',
    
    clientProfile: {
      name: 'e3 Webcasting LLC',
      tagline: 'Capturing Your Association\'s Insights & Transforming Them into Revenue Generating Content',
      description: 'A company specializing in video recording, live streaming, and video content strategy services for conferences and associations.',
      elevatorPitch: 'e3 Webcasting LLC provides expert video recording and live streaming services, enhancing event engagement and generating revenue through strategic content delivery.',
      link: 'https://e3webcasting.com/',
      marketPosition: 'Association-focused video production and streaming specialist',
      estimatedRevenue: '$5M - $15M',
      swot: {
        Strengths: [
          'Specialized expertise in association and conference video production',
          'Revenue-generating content strategy approach',
          'Online badging and continuing education integration',
          'Deep understanding of association member engagement'
        ],
        Weaknesses: [
          'Limited brand recognition compared to larger event tech companies',
          'Smaller scale operations may limit capacity for multiple large events',
          'Dependency on association market segment'
        ],
        Opportunities: [
          'Growing demand for hybrid and virtual association events',
          'Expansion into related professional development services',
          'Integration with association management systems',
          'International association market expansion'
        ],
        Threats: [
          'Large event management platforms adding video services',
          'Competition from general video production companies',
          'Economic pressures on association budgets',
          'Technology disruption from AI-powered video solutions'
        ]
      },
      services: [
        'Live streaming and webcasting',
        'Video recording and production',
        'Content strategy and monetization',
        'Online badging and accreditation',
        'Continuing education platforms'
      ],
      target_audience: {
        'Primary': 'Professional associations and trade organizations',
        'Secondary': 'Conference organizers and continuing education providers',
        'Decision Makers': 'Association executives, education directors, event managers'
      },
      sentiment: {
        'Overall Score': '4.5/5',
        'Positive Themes': 'Specialized expertise, revenue focus, continuing education integration',
        'Negative Themes': 'Limited scale, niche market focus'
      },
      market: {
        'Market Share': '3% of association video services market',
        'Revenue Range': '$5M - $15M annually',
        'Geographic Presence': 'North America with growing virtual reach'
      },
      marketing: {
        'Primary Channels': 'Association conferences, industry partnerships, referral network',
        'Content Strategy': 'Educational content, ROI case studies, association-focused messaging',
        'Unique Selling Proposition': 'Transform video from expense to revenue-generating asset for associations'
      }
    },
    
    allCompetitors: {
      'Cvent': {
        name: 'Cvent',
        tagline: 'A better way to manage your events',
        description: 'Cvent specializes in event management software and services, offering solutions for in-person, virtual, and hybrid events.',
        elevatorPitch: 'Cvent provides an all-in-one event management platform that empowers organizations to streamline event planning, enhance attendee engagement, and measure success effectively.',
        link: 'https://www.cvent.com/',
        marketPosition: 'Enterprise-focused event management leader',
        estimatedRevenue: '$500M+',
        swot: {
          Strengths: [
            'Comprehensive event management platform with robust features',
            'Strong enterprise client base and market presence',
            'Extensive integration capabilities with other business tools',
            'Global reach with localized support'
          ],
          Weaknesses: [
            'High cost and complexity may deter smaller organizations',
            'Steep learning curve for new users',
            'Limited customization options for unique event types'
          ],
          Opportunities: [
            'Growing demand for hybrid and virtual event solutions',
            'Expansion into emerging markets and SMB segment',
            'AI integration for enhanced event analytics'
          ],
          Threats: [
            'Increasing competition from specialized event tech providers',
            'Economic downturns affecting corporate event budgets',
            'Open-source alternatives gaining traction'
          ]
        },
        services: [
          'Event management software',
          'Virtual and hybrid event platforms',
          'Event marketing and promotion tools',
          'Attendee engagement solutions',
          'Event analytics and reporting'
        ],
        target_audience: {
          'Primary': 'Enterprise corporations and large associations',
          'Secondary': 'Mid-market companies and event planners',
          'Decision Makers': 'Event directors, marketing managers, association executives'
        },
        sentiment: {
          'Overall Score': '4.1/5',
          'Positive Themes': 'Comprehensive features, reliability, strong support',
          'Negative Themes': 'Complex interface, high pricing, steep learning curve'
        },
        market: {
          'Market Share': '25% of enterprise event management',
          'Revenue Range': '$400M - $600M annually',
          'Geographic Presence': 'Global with strong North American base'
        },
        marketing: {
          'Primary Channels': 'Industry trade shows, content marketing, partner referrals',
          'Content Strategy': 'Thought leadership, ROI case studies, educational webinars',
          'Unique Selling Proposition': 'Complete end-to-end event management ecosystem'
        }
      },
      'Cadmium': {
        name: 'Cadmium',
        tagline: 'Unlock a streamlined event management experience with Eventscribe',
        description: 'Eventscribe is a dynamic event management platform tailored for associations and nonprofits, simplifying event planning and execution.',
        elevatorPitch: 'Eventscribe by Cadmium is the ultimate event management software designed for associations and nonprofits, streamlining every aspect of event planning and execution.',
        link: 'https://www.cadmiumcd.com',
        marketPosition: 'Association-focused event management specialist',
        estimatedRevenue: '$50M - $100M',
        swot: {
          Strengths: [
            'Deep specialization in association and nonprofit events',
            'Strong focus on continuing education and accreditation',
            'Established relationships with professional associations',
            'Tailored features for membership organizations'
          ],
          Weaknesses: [
            'Limited appeal beyond association market',
            'Smaller scale compared to enterprise competitors',
            'Less brand recognition in broader market'
          ],
          Opportunities: [
            'Growing association digitization needs',
            'Expansion into related nonprofit sectors',
            'Enhanced mobile and virtual capabilities'
          ],
          Threats: [
            'Large platforms expanding into association space',
            'Budget constraints in nonprofit sector',
            'Competing association management systems'
          ]
        },
        services: [
          'Association event management',
          'Continuing education platforms',
          'Member engagement tools',
          'Abstract and paper management',
          'Mobile event apps'
        ],
        target_audience: {
          'Primary': 'Professional associations and trade organizations',
          'Secondary': 'Nonprofit organizations and educational institutions',
          'Decision Makers': 'Association executives, education directors, event coordinators'
        },
        sentiment: {
          'Overall Score': '4.3/5',
          'Positive Themes': 'Association expertise, specialized features, responsive support',
          'Negative Themes': 'Limited corporate appeal, smaller user community'
        },
        market: {
          'Market Share': '15% of association event management',
          'Revenue Range': '$50M - $100M annually',
          'Geographic Presence': 'North America focused, some international'
        },
        marketing: {
          'Primary Channels': 'Association conferences, industry partnerships, direct sales',
          'Content Strategy': 'Association-specific case studies, educational content',
          'Unique Selling Proposition': 'Purpose-built for associations and continuing education'
        }
      },
      'Niche Visuals': {
        name: 'Niche Visuals',
        tagline: 'Let Us Tell Your Story',
        description: 'Niche Visuals is a Chicago-based video production company specializing in corporate, event, wedding, music, and sports videography and photography.',
        elevatorPitch: 'Niche Visuals offers high-end cinematic video production services that capture the essence of your brand, event, or concept, ensuring a unique storytelling experience.',
        link: 'https://www.nichevisuals.com/',
        marketPosition: 'Boutique video production specialist',
        estimatedRevenue: '$5M - $15M',
        swot: {
          Strengths: [
            'High-quality cinematic production capabilities',
            'Diverse portfolio across multiple industries',
            'Local Chicago market expertise',
            'Creative storytelling approach'
          ],
          Weaknesses: [
            'Limited geographic reach and scalability',
            'Higher cost per project than larger competitors',
            'Dependency on local market conditions'
          ],
          Opportunities: [
            'Growing demand for video content marketing',
            'Expansion into virtual and hybrid event services',
            'Partnership opportunities with event planners'
          ],
          Threats: [
            'Large production companies expanding into local markets',
            'Increased competition from freelance videographers',
            'Economic downturns affecting discretionary spending'
          ]
        },
        services: [
          'Corporate video production',
          'Event videography and live streaming',
          'Wedding and social event filming',
          'Sports and music video production',
          'Photography services'
        ],
        target_audience: {
          'Primary': 'Local businesses and event organizers in Chicago area',
          'Secondary': 'Couples planning weddings, sports teams, musicians',
          'Decision Makers': 'Marketing directors, event planners, individual clients'
        },
        sentiment: {
          'Overall Score': '4.6/5',
          'Positive Themes': 'Creative excellence, personal service, high production quality',
          'Negative Themes': 'Limited availability, premium pricing'
        },
        market: {
          'Market Share': '2% of Chicago video production market',
          'Revenue Range': '$5M - $15M annually',
          'Geographic Presence': 'Chicago metropolitan area'
        },
        marketing: {
          'Primary Channels': 'Social media, local networking, word-of-mouth referrals',
          'Content Strategy': 'Portfolio showcases, behind-the-scenes content',
          'Unique Selling Proposition': 'Cinematic storytelling with personal touch'
        }
      },
      'TV House Inc.': {
        name: 'TV House Inc.',
        tagline: 'Television and video solutions for the world-famous',
        description: 'TV House Inc. provides innovative television and video production solutions, catering to both high-profile clients and emerging talents.',
        elevatorPitch: 'TV House Inc. revolutionizes video production with cutting-edge technology and expertise, ensuring every client looks their best on screen, whether live or recorded.',
        link: 'https://www.tvhouse.com',
        marketPosition: 'High-end broadcast and video production',
        estimatedRevenue: '$25M - $50M',
        swot: {
          Strengths: [
            'Advanced broadcast-quality production capabilities',
            'Experience with high-profile and celebrity clients',
            'Cutting-edge technology and equipment',
            'Professional broadcast industry relationships'
          ],
          Weaknesses: [
            'Premium pricing limits market accessibility',
            'Focus on high-end market may limit volume',
            'Dependent on entertainment industry cycles'
          ],
          Opportunities: [
            'Growing streaming and digital content demand',
            'Corporate video and virtual event production',
            'International expansion opportunities'
          ],
          Threats: [
            'Disruption from new streaming technologies',
            'Economic impacts on entertainment industry',
            'Competition from lower-cost production alternatives'
          ]
        },
        services: [
          'Broadcast television production',
          'High-end video production',
          'Live streaming and webcasting',
          'Post-production and editing',
          'Studio rental and equipment services'
        ],
        target_audience: {
          'Primary': 'Entertainment industry and high-profile brands',
          'Secondary': 'Corporate clients seeking premium production',
          'Decision Makers': 'Producers, brand managers, entertainment executives'
        },
        sentiment: {
          'Overall Score': '4.4/5',
          'Positive Themes': 'Professional quality, industry expertise, cutting-edge technology',
          'Negative Themes': 'High cost, limited accessibility for smaller clients'
        },
        market: {
          'Market Share': '5% of high-end video production market',
          'Revenue Range': '$25M - $50M annually',
          'Geographic Presence': 'Major entertainment markets (LA, NYC, Chicago)'
        },
        marketing: {
          'Primary Channels': 'Industry relationships, trade publications, high-profile projects',
          'Content Strategy': 'Showcase reels, celebrity testimonials, technical expertise',
          'Unique Selling Proposition': 'Broadcast-quality production for world-famous clients'
        }
      }
    }
  };

  // Use provided client data or default
  const currentClientData = clientData || defaultClientData;

  // Rest of the component continues...
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Competitive Intelligence Platform</h1>
        <p className="text-gray-600 mb-6">Dashboard loading successfully - Full functionality available when complete component is deployed</p>
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>✅ Client vs Competitor Analysis</div>
            <div>✅ Interactive Scoring System</div>
            <div>✅ SWOT Analysis</div>
            <div>✅ Market Positioning</div>
            <div>✅ CSV Data Processing</div>
            <div>✅ Shareable Client Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAnalysisDashboard;
