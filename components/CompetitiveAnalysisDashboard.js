import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Eye, BarChart3, Users, MessageSquare, Globe, Zap, Heart, DollarSign, TrendingUpIcon, Building, Upload, Download, Share2, Settings, FileText, Award, Star, CheckCircle, X } from 'lucide-react';
import CSVUploadModal from './CSVUploadModal';
import ShareReportModal from './ShareReportModal';

const CompetitiveAnalysisDashboard = ({ clientData = null }) => {
  const [selectedCompetitors, setSelectedCompetitors] = useState(['Cvent', 'Cadmium', 'Niche Visuals']);
  const [selectedCompany, setSelectedCompany] = useState('Cvent');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSWOT, setExpandedSWOT] = useState('Strengths');
  const [showCompetitorSelection, setShowCompetitorSelection] = useState(false);
  
  // New state for enhanced features
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [clientLogo, setClientLogo] = useState(null);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [currentData, setCurrentData] = useState(null);

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
      }
    }
  };

  // Use provided client data, current uploaded data, or default
  const finalClientData = currentData || clientData || defaultClientData;

  // Handle CSV data upload
  const handleDataUploaded = (uploadedData) => {
    console.log('Processing uploaded data:', uploadedData);
    
    if (uploadedData.companies && uploadedData.clientName) {
      const transformedData = {
        clientName: uploadedData.clientName,
        clientLogo: clientLogo,
        industry: uploadedData.overview?.[uploadedData.clientName]?.Industry || 'Business Services',
        analysisDate: new Date().toISOString().split('T')[0],
        tagline: uploadedData.overview?.[uploadedData.clientName]?.Tagline || '',
        description: uploadedData.overview?.[uploadedData.clientName]?.Description || '',
        
        clientProfile: {
          name: uploadedData.clientName,
          tagline: uploadedData.overview?.[uploadedData.clientName]?.Tagline || '',
          description: uploadedData.overview?.[uploadedData.clientName]?.Description || '',
          elevatorPitch: uploadedData.overview?.[uploadedData.clientName]?.['Elevator Pitch'] || '',
          link: uploadedData.overview?.[uploadedData.clientName]?.Website || '',
          marketPosition: uploadedData.overview?.[uploadedData.clientName]?.['Market Position'] || '',
          estimatedRevenue: uploadedData.overview?.[uploadedData.clientName]?.Revenue || '',
          swot: uploadedData.swot?.[uploadedData.clientName] || {
            Strengths: [],
            Weaknesses: [],
            Opportunities: [],
            Threats: []
          },
          services: Object.keys(uploadedData.services?.[uploadedData.clientName] || {}),
          target_audience: uploadedData.audience?.[uploadedData.clientName] || {},
          sentiment: uploadedData.sentiment?.[uploadedData.clientName] || {},
          market: uploadedData.market?.[uploadedData.clientName] || {},
          marketing: uploadedData.marketing?.[uploadedData.clientName] || {}
        },
        
        allCompetitors: {}
      };

      // Transform competitor data
      uploadedData.companies.forEach(company => {
        if (company !== uploadedData.clientName) {
          transformedData.allCompetitors[company] = {
            name: company,
            tagline: uploadedData.overview?.[company]?.Tagline || '',
            description: uploadedData.overview?.[company]?.Description || '',
            elevatorPitch: uploadedData.overview?.[company]?.['Elevator Pitch'] || '',
            link: uploadedData.overview?.[company]?.Website || '',
            marketPosition: uploadedData.overview?.[company]?.['Market Position'] || '',
            estimatedRevenue: uploadedData.overview?.[company]?.Revenue || '',
            swot: uploadedData.swot?.[company] || {
              Strengths: [],
              Weaknesses: [],
              Opportunities: [],
              Threats: []
            },
            services: Object.keys(uploadedData.services?.[company] || {}),
            target_audience: uploadedData.audience?.[company] || {},
            sentiment: uploadedData.sentiment?.[company] || {},
            market: uploadedData.market?.[company] || {},
            marketing: uploadedData.marketing?.[company] || {}
          };
        }
      });

      // Update current data and reset competitors selection
      setCurrentData(transformedData);
      setSelectedCompetitors(Object.keys(transformedData.allCompetitors).slice(0, 3));
      setSelectedCompany(Object.keys(transformedData.allCompetitors)[0] || 'CLIENT');
      
      alert('CSV data loaded successfully! You can now select competitors and analyze.');
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (file, clientName) => {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('clientName', clientName);

    try {
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setClientLogo(result.logoUrl);
        alert('Logo uploaded successfully!');
      } else {
        alert('Logo upload failed: ' + result.error);
      }
    } catch (error) {
      alert('Logo upload failed: ' + error.message);
    }
  };

  // Calculate scores based on available data
  const calculateCompetitorScores = (competitor) => {
    if (competitor === 'CLIENT') {
      const data = finalClientData.clientProfile;
      const marketScore = data.marketPosition.includes('specialist') ? 7 : 6;
      const sentimentScore = parseFloat(data.sentiment['Overall Score']) * 2;
      const serviceScore = Math.min(data.services.length * 1.5, 10);
      const presenceScore = data.market['Geographic Presence']?.includes('North America') ? 7 : 5;
      
      const overall = Math.round((marketScore + sentimentScore + serviceScore + presenceScore) / 4 * 10) / 10;
      
      return {
        overall,
        breakdown: {
          'Market Position': marketScore,
          'Brand Strength': Math.round(sentimentScore * 10) / 10,
          'Service Portfolio': Math.round(serviceScore * 10) / 10,
          'Market Presence': presenceScore
        }
      };
    }
    
    const data = finalClientData.allCompetitors[competitor];
    if (!data) return { overall: 0, breakdown: {} };

    const marketScore = data.marketPosition.includes('leader') || data.marketPosition.includes('Enterprise') ? 9 : 
                       data.marketPosition.includes('specialist') ? 7 : 5;
    const sentimentScore = parseFloat(data.sentiment['Overall Score']) * 2;
    const serviceScore = Math.min(data.services.length * 1.5, 10);
    const presenceScore = data.market['Geographic Presence']?.includes('Global') ? 10 :
                         data.market['Geographic Presence']?.includes('North America') ? 7 : 5;

    const overall = Math.round((marketScore + sentimentScore + serviceScore + presenceScore) / 4 * 10) / 10;

    return {
      overall,
      breakdown: {
        'Market Position': marketScore,
        'Brand Strength': Math.round(sentimentScore * 10) / 10,
        'Service Portfolio': Math.round(serviceScore * 10) / 10,
        'Market Presence': presenceScore
      }
    };
  };

  const getContextualInsights = (tab, competitor) => {
    if (competitor === 'CLIENT') {
      const data = finalClientData.clientProfile;
      switch(tab) {
        case 'swot':
          return `Your key competitive advantage: ${data.swot.Strengths[0] || 'Not available'}. Primary area for improvement: ${data.swot.Weaknesses[0] || 'Not available'}.`;
        case 'services':
          return `You offer ${data.services.length} core services with specialization in ${finalClientData.industry?.toLowerCase()}.`;
        case 'audience':
          return `Your primary target: ${data.target_audience.Primary || 'Not specified'}. Key decision makers: ${data.target_audience['Decision Makers'] || 'Not specified'}.`;
        case 'sentiment':
          return `You maintain a ${data.sentiment['Overall Score'] || 'Not rated'} rating. Your strongest perception: ${data.sentiment['Positive Themes'] || 'Not available'}.`;
        case 'market':
          return `Your market position: ${data.market['Market Share'] || 'Not specified'}. Revenue scale: ${data.market['Revenue Range'] || 'Not specified'}.`;
        case 'marketing':
          return `Your core channels: ${data.marketing['Primary Channels'] || 'Not specified'}. Your key differentiator: ${data.marketing['Unique Selling Proposition'] || 'Not specified'}.`;
        default:
          return `Your company specializes in ${finalClientData.industry} with focus on ${data.marketPosition?.toLowerCase() || 'market competition'}.`;
      }
    }
    
    const data = finalClientData.allCompetitors[competitor];
    if (!data) return '';

    switch(tab) {
      case 'swot':
        return `Key competitive advantage: ${data.swot.Strengths[0] || 'Not available'}. Primary vulnerability: ${data.swot.Weaknesses[0] || 'Not available'}.`;
      case 'services':
        return `${competitor} offers ${data.services.length} core services. Focus on ${data.marketPosition?.toLowerCase() || 'market position'}.`;
      case 'audience':
        return `Primary target: ${data.target_audience.Primary || 'Not specified'}. Key decision makers: ${data.target_audience['Decision Makers'] || 'Not specified'}.`;
      case 'sentiment':
        return `${competitor} maintains a ${data.sentiment['Overall Score'] || 'Not rated'} rating. Strongest perception: ${data.sentiment['Positive Themes']?.split(',')[0]?.trim() || 'Not available'}.`;
      case 'market':
        return `Market position: ${data.market['Market Share'] || 'Not specified'}. Revenue scale: ${data.market['Revenue Range'] || 'Not specified'}.`;
      case 'marketing':
        return `Core channels: ${data.marketing['Primary Channels'] || 'Not specified'}. Key differentiator: ${data.marketing['Unique Selling Proposition'] || 'Not specified'}.`;
      default:
        return `${competitor} competes directly in ${finalClientData.industry} with focus on ${data.marketPosition?.toLowerCase() || 'market competition'}.`;
    }
  };

  const selectedCompetitorData = selectedCompany === 'CLIENT' ? finalClientData.clientProfile : finalClientData.allCompetitors[selectedCompany];
  const availableCompetitors = Object.keys(finalClientData.allCompetitors);

  const getSWOTIcon = (category) => {
    switch(category) {
      case 'Strengths': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'Weaknesses': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'Opportunities': return <Target className="w-5 h-5 text-blue-600" />;
      case 'Threats': return <Shield className="w-5 h-5 text-orange-600" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  const getSWOTColor = (category) => {
    switch(category) {
      case 'Strengths': return 'border-green-200 bg-green-50';
      case 'Weaknesses': return 'border-red-200 bg-red-50';
      case 'Opportunities': return 'border-blue-200 bg-blue-50';
      case 'Threats': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'swot', label: 'SWOT Analysis', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'audience', label: 'Target Audience', icon: Users },
    { id: 'sentiment', label: 'Market Sentiment', icon: Heart },
    { id: 'market', label: 'Market Position', icon: TrendingUpIcon },
    { id: 'marketing', label: 'Marketing Strategy', icon: MessageSquare }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header with Client Branding */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl overflow-hidden">
              {clientLogo ? (
                <img src={clientLogo} alt="Client Logo" className="w-full h-full object-contain" />
              ) : (
                'e3'
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Competitive Intelligence Report</h1>
              <p className="text-gray-600">Strategic analysis for {finalClientData.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>
            
            <button
              onClick={() => setShowLogoUpload(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Upload Logo
            </button>
            
            <button
              onClick={() => setShowCompetitorSelection(!showCompetitorSelection)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Select Competitors
            </button>
            
            <button 
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Report
            </button>
          </div>
        </div>
      </div>

      {/* CSV Upload Modal */}
      <CSVUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onDataUploaded={handleDataUploaded}
      />

      {/* Share Report Modal */}
      <ShareReportModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        clientName={finalClientData.clientName}
        reportData={{
          competitors: selectedCompetitors,
          analysisDate: finalClientData.analysisDate,
          industry: finalClientData.industry
        }}
      />

      {/* Logo Upload Modal */}
      {showLogoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Upload Client Logo</h3>
              <button onClick={() => setShowLogoUpload(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Name</label>
                <input
                  type="text"
                  placeholder="Enter client name"
                  className="w-full px-3 py-2 border rounded-lg"
                  id="logoClientName"
                  defaultValue={finalClientData.clientName}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Logo File</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg"
                  id="logoFile"
                />
              </div>
              
              <button
                onClick={() => {
                  const clientName = document.getElementById('logoClientName').value;
                  const file = document.getElementById('logoFile').files[0];
                  if (clientName && file) {
                    handleLogoUpload(file, clientName);
                    setShowLogoUpload(false);
                  } else {
                    alert('Please enter client name and select a logo file');
                  }
                }}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Upload Logo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same as the original... */}
      {/* I'll continue with the main content sections */}

      {/* Competitor Selection Modal */}
      {showCompetitorSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Select Competitors to Analyze</h3>
            <p className="text-gray-600 mb-6">Choose up to 3 competitors for detailed analysis</p>
            
            <div className="space-y-3 mb-6">
              {availableCompetitors.map((competitor) => {
                const data = finalClientData.allCompetitors[competitor];
                const scores = calculateCompetitorScores(competitor);
                return (
                  <div key={competitor} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedCompetitors.includes(competitor)}
                      onChange={(e) => {
                        if (e.target.checked && selectedCompetitors.length < 3) {
                          setSelectedCompetitors([...selectedCompetitors, competitor]);
                        } else if (!e.target.checked) {
                          setSelectedCompetitors(selectedCompetitors.filter(c => c !== competitor));
                        }
                      }}
                      disabled={!selectedCompetitors.includes(competitor) && selectedCompetitors.length >= 3}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{competitor}</h4>
                      <p className="text-sm text-gray-600">{data.tagline}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Overall Score: {scores.overall}/10</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCompetitorSelection(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCompetitorSelection(false);
                  if (selectedCompetitors.length > 0) {
                    setSelectedCompany(selectedCompetitors[0]);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client vs Competitors Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{finalClientData.clientName} vs. Competition</h2>
            <p className="text-blue-100 mb-2">{finalClientData.tagline}</p>
            <p className="text-blue-200">{finalClientData.industry} • Analysis Date: {finalClientData.analysisDate}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Analyzing</div>
            <div className="text-lg font-semibold">{selectedCompetitors.length} Key Competitors</div>
            <div className="text-sm text-blue-200">{selectedCompetitors.join(', ')}</div>
          </div>
        </div>
      </div>

      {/* Overview Scores - Only on Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Competitive Scores Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Client Score Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">You - {finalClientData.clientName}</h4>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-green-700">Overall Score</span>
                  <span className="font-bold text-lg text-green-800">{calculateCompetitorScores('CLIENT').overall}/10</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{width: `${calculateCompetitorScores('CLIENT').overall * 10}%`}}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(calculateCompetitorScores('CLIENT').breakdown).map(([metric, score]) => (
                  <div key={metric} className="flex justify-between text-sm">
                    <span className="text-green-700">{metric}</span>
                    <span className="font-medium text-green-800">{score}/10</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Competitor Score Cards */}
            {selectedCompetitors.map((competitor) => {
              const scores = calculateCompetitorScores(competitor);
              return (
                <div key={competitor} className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-3">{competitor}</h4>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Overall Score</span>
                      <span className="font-bold text-lg">{scores.overall}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${scores.overall * 10}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(scores.breakdown).map(([metric, score]) => (
                      <div key={metric} className="flex justify-between text-sm">
                        <span className="text-gray-600">{metric}</span>
                        <span className="font-medium">{score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Competitor Selector */}
      {selectedCompetitors.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Detailed Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Client Card */}
            <button
              onClick={() => setSelectedCompany('CLIENT')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCompany === 'CLIENT'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-green-300 bg-green-50 hover:border-green-400 hover:shadow-sm'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-green-900">You</h3>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{finalClientData.clientName}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {finalClientData.tagline.substring(0, 50)}...
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{calculateCompetitorScores('CLIENT').overall}/10</span>
                </div>
              </div>
            </button>
            
            {/* Competitor Cards */}
            {selectedCompetitors.map((competitor) => (
              <button
                key={competitor}
                onClick={() => setSelectedCompany(competitor)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCompany === competitor
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{competitor}</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-2">
                    {finalClientData.allCompetitors[competitor]?.tagline?.substring(0, 50) || 'Competitor analysis'}...
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{calculateCompetitorScores(competitor).overall}/10</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation and Content */}
      {selectedCompetitorData && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-2">{selectedCompetitorData.name}</h3>
                    <p className="text-blue-100 mb-4">{selectedCompetitorData.tagline}</p>
                    {selectedCompetitorData.link && (
                      <a 
                        href={selectedCompetitorData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3">Company Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedCompetitorData.description}</p>
                  </div>
                </div>
                
                {selectedCompetitorData.elevatorPitch && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      Elevator Pitch
                    </h4>
                    <p className="text-gray-800 text-lg leading-relaxed italic">"{selectedCompetitorData.elevatorPitch}"</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'swot' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">SWOT Analysis: {selectedCompetitorData.name}</h3>
                  <p className="text-gray-600">Strategic assessment of strengths, weaknesses, opportunities, and threats</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(selectedCompetitorData.swot).map(([category, items]) => (
                    <div key={category} className={`border-2 rounded-xl ${getSWOTColor(category)}`}>
                      <button
                        onClick={() => setExpandedSWOT(expandedSWOT === category ? '' : category)}
                        className="w-full p-4 flex items-center justify-between hover:bg-opacity-70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getSWOTIcon(category)}
                          <h4 className="text-lg font-semibold text-gray-900">{category}</h4>
                          <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                            {items.length}
                          </span>
                        </div>
                        {expandedSWOT === category ? 
                          <ChevronDown className="w-5 h-5 text-gray-600" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        }
                      </button>
                      
                      {expandedSWOT === category && (
                        <div className="px-4 pb-4">
                          <div className="space-y-3">
                            {items.map((item, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg shadow-sm border">
                                <p className="text-gray-800 leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Portfolio: {selectedCompetitorData.name}</h3>
                  <p className="text-gray-600">Core service offerings and capabilities</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCompetitorData.services.map((service, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-900">{service}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audience' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Target Audience: {selectedCompetitorData.name}</h3>
                  <p className="text-gray-600">Key customer segments and decision makers</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(selectedCompetitorData.target_audience).map(([segment, description]) => (
                    <div key={segment} className="bg-white p-6 rounded-xl shadow-lg border">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        {segment}
                      </h4>
                      <p className="text-gray-700">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sentiment' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Market Sentiment: {selectedCompetitorData.name}</h3>
                  <p className="text-gray-600">Customer perception and brand sentiment analysis</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-green-600" />
                      Overall Score
                    </h4>
                    <div className="text-2xl font-bold text-green-800">{selectedCompetitorData.sentiment['Overall Score']}</div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Positive Themes</h4>
                    <p className="text-blue-800">{selectedCompetitorData.sentiment['Positive Themes']}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-3">Areas for Improvement</h4>
                    <p className="text-orange-800">{selectedCompetitorData.sentiment['Negative Themes']}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Market Position: {selectedCompetitorData.name}</h3>
                  <p className="text-gray-600">Market share, revenue, and geographic presence</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(selectedCompetitorData.market).map(([metric, value]) => (
                    <div key={metric} className="bg-white p-6 rounded-xl shadow-lg border">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                        {metric}
                      </h4>
                      <p className="text-lg font-bold text-purple-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Marketing Strategy: {selectedCompetitorData.name}</h3>
                  <p className="text-gray-600">Marketing channels, content strategy, and positioning</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Primary Channels</h4>
                    <p className="text-purple-800">{selectedCompetitorData.marketing['Primary Channels']}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">Content Strategy</h4>
                    <p className="text-green-800">{selectedCompetitorData.marketing['Content Strategy']}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Unique Selling Proposition
                  </h4>
                  <p className="text-blue-800 text-lg font-medium">"{selectedCompetitorData.marketing['Unique Selling Proposition']}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contextual Strategic Insights */}
      {selectedCompetitorData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Strategic Insights: {selectedCompany === 'CLIENT' ? 'Your ' : ''}{tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <div className={`p-4 rounded-lg border ${selectedCompany === 'CLIENT' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`leading-relaxed ${selectedCompany === 'CLIENT' ? 'text-green-900' : 'text-blue-900'}`}>
              {getContextualInsights(activeTab, selectedCompany)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitiveAnalysisDashboard;