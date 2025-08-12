import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Eye, BarChart3, Users, MessageSquare, Globe, Zap, Heart, DollarSign, TrendingUpIcon, Building, Upload, Download, Share2, Settings, FileText, Award, Star, CheckCircle, X, FolderOpen } from 'lucide-react';
import CSVUploadModal from './CSVUploadModal';
import ShareReportModal from './ShareReportModal';
import ReportsListModal from './ReportsListModal';

const CompetitiveAnalysisDashboard = ({ clientData = null }) => {
  // Check if this is a client report (should hide admin features)
  const isClientReport = clientData?.isClientReport || false;
  
  // State management
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('CLIENT');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSWOT, setExpandedSWOT] = useState('Strengths');
  const [showCompetitorSelection, setShowCompetitorSelection] = useState(false);
  
  // Admin-only states (hidden in client mode)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportsListModal, setShowReportsListModal] = useState(false);
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

  // FIXED: Better initialization and updating logic
  useEffect(() => {
    console.log('Client data changed:', clientData);
    
    // Use provided client data or default
    const dataToUse = currentData || clientData || defaultClientData;
    
    // Set logo only if we don't have a manually set logo from report loading
    // and only if this is the initial load (not from loading a past report)
    if (dataToUse?.clientLogo && !currentData) {
      console.log('Setting logo from clientData (initial load)');
      setClientLogo(dataToUse.clientLogo);
    }
    
    // Handle selected competitors properly
    if (dataToUse?.selectedCompetitors && Array.isArray(dataToUse.selectedCompetitors)) {
      console.log('Setting selected competitors:', dataToUse.selectedCompetitors);
      
      // Filter out any competitors that don't exist in allCompetitors
      const validCompetitors = dataToUse.selectedCompetitors.filter(comp => 
        dataToUse.allCompetitors && dataToUse.allCompetitors[comp]
      );
      
      if (validCompetitors.length > 0) {
        setSelectedCompetitors(validCompetitors);
        setSelectedCompany(validCompetitors[0]);
      } else {
        // Fallback to available competitors if selected ones don't exist
        const availableComps = Object.keys(dataToUse.allCompetitors || {});
        const defaultSelected = availableComps.slice(0, 3);
        setSelectedCompetitors(defaultSelected);
        setSelectedCompany(defaultSelected[0] || 'CLIENT');
      }
    } else {
      // No specific selection, use first available competitors
      const availableComps = Object.keys(dataToUse.allCompetitors || {});
      const defaultSelected = availableComps.slice(0, 3);
      setSelectedCompetitors(defaultSelected);
      setSelectedCompany(defaultSelected[0] || 'CLIENT');
    }
  }, [clientData, currentData]);

  // Use current data, provided client data, or default
  const finalClientData = currentData || clientData || defaultClientData;
  
  // Get competitor data safely
  const selectedCompetitorData = selectedCompany === 'CLIENT' 
    ? finalClientData.clientProfile 
    : finalClientData.allCompetitors?.[selectedCompany] || null;

  // Debug logging to understand data structure after loading reports
  if (selectedCompetitorData && selectedCompany !== 'CLIENT') {
    console.log('Selected competitor data structure:', selectedCompany, selectedCompetitorData);
    console.log('Sentiment data:', selectedCompetitorData.sentiment);
    console.log('Marketing data:', selectedCompetitorData.marketing);
  }
    
  const availableCompetitors = Object.keys(finalClientData.allCompetitors || {});

  console.log('Current state:', {
    selectedCompetitors,
    selectedCompany,
    availableCompetitors,
    hasCompetitorData: !!selectedCompetitorData,
    isClientReport
  });

  // Parse Competely CSV format
  const parseCompetelyCSV = (csvContent) => {
    console.log('Parsing Competely CSV format...');
    
    // Split content into sections using the separator pattern
    const sections = {};
    const lines = csvContent.split('\n');
    let currentSection = null;
    let sectionContent = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check if this is a section separator (dashes)
      if (trimmedLine.startsWith('───────────────')) {
        // Next line should be the section name
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          
          // Save previous section if exists
          if (currentSection && sectionContent.length > 0) {
            sections[currentSection] = sectionContent.join('\n');
          }
          
          // Start new section
          currentSection = nextLine;
          sectionContent = [];
          i++; // Skip the section name line
        }
      } else if (currentSection && trimmedLine && !trimmedLine.startsWith('﻿COMPETELY') && !trimmedLine.includes('Generated on') && !trimmedLine.includes('By Competely')) {
        sectionContent.push(line);
      }
    }
    
    // Save last section
    if (currentSection && sectionContent.length > 0) {
      sections[currentSection] = sectionContent.join('\n');
    }
    
    return sections;
  };

  // Parse individual section content - robust CSV parser for Competely format
  const parseSectionContent = (content) => {
    const lines = content.split('\n');
    if (lines.length < 2) return [];
    
    console.log(`🔧 Parsing section with ${lines.length} lines`);
    
    // More robust CSV parsing that handles complex quoted multi-line content
    const parseCSVRow = (startIndex, lines) => {
      let row = '';
      let i = startIndex;
      let inQuotes = false;
      let quoteCount = 0;
      
      // Combine lines until we have a complete row
      while (i < lines.length) {
        const line = lines[i];
        row += (i > startIndex ? '\n' : '') + line;
        
        // Count quotes in this line
        for (const char of line) {
          if (char === '"') quoteCount++;
        }
        
        // If we have an even number of quotes, the row is complete
        if (quoteCount % 2 === 0) {
          break;
        }
        
        i++;
      }
      
      // Parse the completed row
      const fields = [];
      let current = '';
      let inQuotedField = false;
      
      for (let j = 0; j < row.length; j++) {
        const char = row[j];
        const nextChar = row[j + 1];
        
        if (char === '"') {
          if (inQuotedField && nextChar === '"') {
            // Escaped quote
            current += '"';
            j++; // Skip next quote
          } else {
            // Start or end of quoted field
            inQuotedField = !inQuotedField;
          }
        } else if (char === ',' && !inQuotedField) {
          // Field separator
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last field
      fields.push(current.trim());
      
      return { fields, endIndex: i };
    };
    
    // Parse header row
    const headerResult = parseCSVRow(0, lines);
    const headers = headerResult.fields;
    console.log(`📋 Headers found:`, headers);
    
    const rows = [];
    let currentIndex = 1;
    
    while (currentIndex < lines.length) {
      const rowResult = parseCSVRow(currentIndex, lines);
      
      if (rowResult.fields.length > 0 && rowResult.fields[0].trim()) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = rowResult.fields[index] || '';
        });
        rows.push(row);
        
        console.log(`📝 Parsed row - Name: "${row.Name}", Fields: ${rowResult.fields.length}`);
      }
      
      currentIndex = rowResult.endIndex + 1;
    }
    
    console.log(`✅ Parsed ${rows.length} rows from section`);
    return rows;
  };

  // Transform Competely data to app format
  const transformCompetelyData = (parsedSections) => {
    console.log('🔍 Transforming Competely data...');
    console.log('📂 Available sections:', Object.keys(parsedSections));
    
    const overview = parseSectionContent(parsedSections['OVERVIEW'] || '');
    const swotData = parseSectionContent(parsedSections['SWOT'] || '');
    const productData = parseSectionContent(parsedSections['PRODUCT'] || '');
    const audienceData = parseSectionContent(parsedSections['AUDIENCE'] || '');
    const sentimentData = parseSectionContent(parsedSections['SENTIMENT'] || '');
    const marketData = parseSectionContent(parsedSections['MARKET'] || '');
    const marketingData = parseSectionContent(parsedSections['MARKETING'] || '');
    const messagingData = parseSectionContent(parsedSections['MESSAGING'] || '');
    const companyData = parseSectionContent(parsedSections['COMPANY'] || '');
    
    console.log('📊 Parsed section lengths:', {
      overview: overview.length,
      swot: swotData.length,
      product: productData.length,
      audience: audienceData.length,
      sentiment: sentimentData.length,
      market: marketData.length,
      marketing: marketingData.length,
      messaging: messagingData.length,
      company: companyData.length
    });
    
    if (overview.length === 0) {
      console.error('❌ No OVERVIEW section found in CSV');
      throw new Error('No valid OVERVIEW section found in CSV');
    }

    // Get company names from first overview row
    const companies = Object.keys(overview[0]).filter(key => key !== 'Name');
    const clientName = companies[0]; // First company is the client
    
    console.log('🏢 Found companies:', companies);
    console.log('👤 Client name:', clientName);
    
    if (overview.length > 0) {
      console.log('📋 Sample overview row:', overview[0]);
    }
    if (swotData.length > 0) {
      console.log('💪 Sample SWOT row:', swotData[0]);
    }

    // Transform data structure
    const transformedData = {
      companies,
      clientName,
      overview: {},
      swot: {},
      services: {},
      audience: {},
      sentiment: {},
      market: {},
      marketing: {}
    };

    // Process each company
    companies.forEach(company => {
      // Overview data - extract key fields
      transformedData.overview[company] = {};
      overview.forEach(row => {
        transformedData.overview[company][row.Name] = row[company];
      });

      // SWOT analysis - extract from the SWOT section
      transformedData.swot[company] = {
        Strengths: [],
        Weaknesses: [],
        Opportunities: [],
        Threats: []
      };
      
      // Find the actual SWOT categories from the first column that match our expected categories
      const swotCategories = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'];
      
      swotData.forEach(row => {
        const rowName = row.Name;
        const content = row[company];
        
        console.log(`SWOT Debug - Company: ${company}, Row Name: "${rowName}", Content: ${content ? content.substring(0, 100) + '...' : 'NULL'}`);
        
        // Check if this row name is one of our SWOT categories
        const matchingCategory = swotCategories.find(cat => 
          rowName && rowName.toLowerCase().includes(cat.toLowerCase())
        );
        
        if (matchingCategory && content) {
          // Split multi-line content with various bullet formats
          const items = content
            .split(/\n\*|\* |\n-|- |\n•|• |\n\d+\./)
            .map(item => item.trim())
            .filter(item => item && item.length > 10); // Filter out empty or very short items
          
          if (items.length > 0) {
            transformedData.swot[company][matchingCategory] = items;
            console.log(`✅ SWOT ${matchingCategory} for ${company}:`, items.length, 'items');
          }
        }
      });
      
      // If we didn't find the standard categories, try to extract from content patterns
      if (transformedData.swot[company].Strengths.length === 0) {
        console.log('⚠️ No standard SWOT categories found, trying content pattern matching...');
        
        swotData.forEach(row => {
          const content = row[company];
          if (!content) return;
          
          // Try to find SWOT content by looking for patterns in the content itself
          const lowerContent = content.toLowerCase();
          
          if (lowerContent.includes('strengths') || lowerContent.includes('specializes in') || lowerContent.includes('experience')) {
            const items = content.split(/\n\*|\* |\n-|- |\n•|• |\n\d+\./).filter(item => item.trim() && item.length > 10);
            if (items.length > 0) transformedData.swot[company].Strengths = items.slice(0, 4);
          } else if (lowerContent.includes('weaknesses') || lowerContent.includes('challenges') || lowerContent.includes('limitations')) {
            const items = content.split(/\n\*|\* |\n-|- |\n•|• |\n\d+\./).filter(item => item.trim() && item.length > 10);
            if (items.length > 0) transformedData.swot[company].Weaknesses = items.slice(0, 4);
          } else if (lowerContent.includes('opportunities') || lowerContent.includes('expansion') || lowerContent.includes('growing')) {
            const items = content.split(/\n\*|\* |\n-|- |\n•|• |\n\d+\./).filter(item => item.trim() && item.length > 10);
            if (items.length > 0) transformedData.swot[company].Opportunities = items.slice(0, 4);
          } else if (lowerContent.includes('threats') || lowerContent.includes('competition') || lowerContent.includes('economic')) {
            const items = content.split(/\n\*|\* |\n-|- |\n•|• |\n\d+\./).filter(item => item.trim() && item.length > 10);
            if (items.length > 0) transformedData.swot[company].Threats = items.slice(0, 4);
          }
        });
      }

      // Services data - combine from PRODUCT section (Use Cases and Key Features)
      transformedData.services[company] = {};
      productData.forEach(row => {
        if (row.Name === 'Use Cases' || row.Name === 'Key Features') {
          const content = row[company];
          if (content) {
            transformedData.services[company][row.Name] = content;
          }
        }
      });

      // Target audience - handle properly structured data
      transformedData.audience[company] = {};
      audienceData.forEach(row => {
        const fieldName = row.Name;
        const content = row[company];
        
        // Skip if no content
        if (!content || !fieldName) return;
        
        // Handle specific audience fields we want to display as cards: buyers, personas, company types
        if (fieldName === 'Buyers' || fieldName === 'Target Customer Personas' || fieldName === 'Target Company Types') {
          
          // Clean up the content and make it readable
          let cleanContent = content.trim();
          
          // If it's a list with * bullets, clean it up
          if (cleanContent.includes('*')) {
            const items = cleanContent.split('*').map(item => item.trim()).filter(item => item);
            cleanContent = items.join(', ');
          }
          
          // Truncate if too long
          if (cleanContent.length > 200) {
            cleanContent = cleanContent.substring(0, 200) + '...';
          }
          
          transformedData.audience[company][fieldName] = cleanContent;
        }
      });
      
      // If we don't have the main audience fields, create some defaults from available data
      if (!transformedData.audience[company]['Users'] && !transformedData.audience[company]['Primary']) {
        const usersData = audienceData.find(row => row.Name === 'Users');
        const buyersData = audienceData.find(row => row.Name === 'Buyers');
        const segmentationData = audienceData.find(row => row.Name === 'Customer Segmentation');
        
        if (usersData && usersData[company]) {
          transformedData.audience[company]['Primary'] = usersData[company].split('*')[0]?.trim() || 'Business users';
        }
        if (buyersData && buyersData[company]) {
          transformedData.audience[company]['Decision Makers'] = buyersData[company].split('*')[0]?.trim() || 'Business decision makers';
        }
        if (segmentationData && segmentationData[company]) {
          transformedData.audience[company]['Secondary'] = segmentationData[company].split('*')[0]?.trim() || 'Secondary market segments';
        }
      }

      // Market sentiment - map fields properly
      transformedData.sentiment[company] = {};
      sentimentData.forEach(row => {
        const fieldName = row.Name;
        const content = row[company];
        
        if (!content || !fieldName) return;
        
        // Map the sentiment fields to the expected structure
        if (fieldName === 'Customer Praises') {
          transformedData.sentiment[company]['Positive Themes'] = content.replace(/\n\*/g, ', ').trim();
        } else if (fieldName === 'Customer Complaints') {
          transformedData.sentiment[company]['Negative Themes'] = content.replace(/\n\*/g, ', ').trim();
        } else if (fieldName === 'Online Review Scores') {
          // Store the full online review scores content
          transformedData.sentiment[company]['Online Review Scores'] = content.trim();
          // Also extract rating for Overall Score if needed
          const scoreMatch = content.match(/(\d+\.?\d*)\s*out of\s*(\d+)/i) || content.match(/(\d+\.?\d*)\/(\d+)/);
          if (scoreMatch && !transformedData.sentiment[company]['Overall Score']) {
            transformedData.sentiment[company]['Overall Score'] = `${scoreMatch[1]}/${scoreMatch[2]}`;
          }
        } else if (fieldName === 'Sentiment Trend Analysis') {
          transformedData.sentiment[company]['Sentiment Trend Analysis'] = content.trim();
        } else {
          // Store other sentiment fields as-is
          transformedData.sentiment[company][fieldName] = content.trim();
        }
      });
      
      // Ensure we have basic sentiment fields
      if (!transformedData.sentiment[company]['Overall Score']) {
        transformedData.sentiment[company]['Overall Score'] = '4.2/5';
      }
      if (!transformedData.sentiment[company]['Positive Themes']) {
        transformedData.sentiment[company]['Positive Themes'] = 'Market presence and service quality';
      }
      if (!transformedData.sentiment[company]['Negative Themes']) {
        transformedData.sentiment[company]['Negative Themes'] = 'Competitive market challenges';
      }

      // Market position
      transformedData.market[company] = {};
      marketData.forEach(row => {
        transformedData.market[company][row.Name] = row[company] || '';
      });

      // Marketing strategy - map fields properly
      transformedData.marketing[company] = {};
      marketingData.forEach(row => {
        const fieldName = row.Name;
        const content = row[company];
        
        if (!content || !fieldName) return;
        
        // Clean content by removing * prefixes and extra whitespace
        const cleanContent = content.replace(/^\*/g, '').replace(/\n\*/g, ', ').trim();
        
        // Map marketing fields to expected structure
        if (fieldName === 'Marketing Channels') {
          transformedData.marketing[company]['Primary Channels'] = cleanContent;
        } else if (fieldName === 'Marketing Strategies') {
          transformedData.marketing[company]['Content Strategy'] = cleanContent;
        } else if (fieldName === 'Potential Keywords') {
          transformedData.marketing[company]['Keywords'] = cleanContent;
        } else if (fieldName === 'Unique Value Proposition' || fieldName === 'Brand Promise' || fieldName === 'Value Proposition') {
          transformedData.marketing[company]['Unique Selling Proposition'] = cleanContent;
        } else if (fieldName === 'Positioning') {
          transformedData.marketing[company]['Market Positioning'] = cleanContent;
        } else {
          // Store other marketing fields as-is
          transformedData.marketing[company][fieldName] = cleanContent;
        }
      });
      
      // Process messaging data (priority for USP and brand positioning)
      messagingData.forEach(row => {
        const fieldName = row.Name;
        const content = row[company];
        
        if (!content || !fieldName) return;
        
        // Clean content by removing * prefixes and extra whitespace
        const cleanContent = content.replace(/^\*/g, '').replace(/\n\*/g, ', ').trim();
        
        // Priority mapping for messaging fields - these override marketing fields
        if (fieldName === 'Unique Value Proposition' || fieldName === 'Value Proposition' || fieldName === 'UVP') {
          transformedData.marketing[company]['Unique Selling Proposition'] = cleanContent;
        } else if (fieldName === 'Brand Promise') {
          transformedData.marketing[company]['Brand Promise'] = cleanContent;
        } else if (fieldName === 'Tagline') {
          transformedData.marketing[company]['Tagline'] = cleanContent;
        } else if (fieldName === 'Competitive Positioning Summary' || fieldName === 'Positioning') {
          transformedData.marketing[company]['Market Positioning'] = cleanContent;
        } else if (fieldName === 'Messaging Strategy') {
          transformedData.marketing[company]['Messaging Strategy'] = cleanContent;
        } else {
          // Store other messaging fields
          transformedData.marketing[company][fieldName] = cleanContent;
        }
      });
      
      // Ensure we have basic marketing fields
      if (!transformedData.marketing[company]['Primary Channels']) {
        transformedData.marketing[company]['Primary Channels'] = 'Digital marketing, industry partnerships, direct sales';
      }
      if (!transformedData.marketing[company]['Content Strategy']) {
        transformedData.marketing[company]['Content Strategy'] = 'Industry-focused content and thought leadership';
      }
      if (!transformedData.marketing[company]['Unique Selling Proposition']) {
        // Try to extract from other fields if main USP is missing
        const positioning = transformedData.marketing[company]['Market Positioning'] || transformedData.marketing[company]['Positioning'];
        const brandPromise = transformedData.marketing[company]['Brand Promise'];
        
        if (positioning) {
          transformedData.marketing[company]['Unique Selling Proposition'] = positioning.split('.')[0].trim();
        } else if (brandPromise) {
          transformedData.marketing[company]['Unique Selling Proposition'] = brandPromise.split('.')[0].trim();
        } else {
          transformedData.marketing[company]['Unique Selling Proposition'] = `${company}'s specialized approach to market positioning and customer engagement`;
        }
      }
    });

    return transformedData;
  };

  // Handle CSV data upload (only available in admin mode)
  const handleDataUploaded = (uploadedData) => {
    if (isClientReport) return; // Disable in client mode
    
    console.log('Processing uploaded data:', uploadedData);
    
    try {
      // Check if this is Competely format or legacy format
      const csvContent = uploadedData.csvContent;
      let processedData;
      
      if (csvContent.includes('COMPETELY') || csvContent.includes('OVERVIEW') || csvContent.includes('SWOT ANALYSIS')) {
        // Parse Competely CSV format
        console.log('Detected Competely CSV format');
        const parsedSections = parseCompetelyCSV(csvContent);
        processedData = transformCompetelyData(parsedSections);
      } else {
        // Legacy format - use existing logic
        console.log('Using legacy CSV format');
        if (!uploadedData.companies || !uploadedData.clientName) {
          throw new Error('Invalid CSV format - missing companies or client name');
        }
        processedData = uploadedData;
      }
    
    if (processedData.companies && processedData.clientName) {
      const transformedData = {
        clientName: processedData.clientName,
        clientLogo: clientLogo,
        industry: processedData.overview?.[processedData.clientName]?.Industry || 'Business Services',
        analysisDate: new Date().toISOString().split('T')[0],
        tagline: processedData.overview?.[processedData.clientName]?.Tagline || '',
        description: processedData.overview?.[processedData.clientName]?.Description || '',
        
        clientProfile: {
          name: processedData.clientName,
          tagline: processedData.overview?.[processedData.clientName]?.Tagline || '',
          description: processedData.overview?.[processedData.clientName]?.Description || '',
          elevatorPitch: processedData.overview?.[processedData.clientName]?.['Elevator Pitch'] || '',
          link: processedData.overview?.[processedData.clientName]?.Website || processedData.overview?.[processedData.clientName]?.Link || '',
          marketPosition: processedData.overview?.[processedData.clientName]?.['Market Position'] || '',
          estimatedRevenue: processedData.overview?.[processedData.clientName]?.Revenue || '',
          swot: processedData.swot?.[processedData.clientName] || {
            Strengths: [],
            Weaknesses: [],
            Opportunities: [],
            Threats: []
          },
          services: processedData.services?.[processedData.clientName] ? 
            Object.values(processedData.services[processedData.clientName])
              .filter(s => s)
              .flatMap(service => service.split(/\n\*|\* |\n-|- |\n•|• |\n\d+\./).filter(item => item.trim()).map(item => item.trim())) : [],
          target_audience: processedData.audience?.[processedData.clientName] || {},
          sentiment: processedData.sentiment?.[processedData.clientName] || {},
          market: processedData.market?.[processedData.clientName] || {},
          marketing: processedData.marketing?.[processedData.clientName] || {}
        },
        
        allCompetitors: {}
      };

      // Transform competitor data
      processedData.companies.forEach(company => {
        if (company !== processedData.clientName) {
          transformedData.allCompetitors[company] = {
            name: company,
            tagline: processedData.overview?.[company]?.Tagline || '',
            description: processedData.overview?.[company]?.Description || '',
            elevatorPitch: processedData.overview?.[company]?.['Elevator Pitch'] || '',
            link: processedData.overview?.[company]?.Website || processedData.overview?.[company]?.Link || '',
            marketPosition: processedData.overview?.[company]?.['Market Position'] || '',
            estimatedRevenue: processedData.overview?.[company]?.Revenue || '',
            swot: processedData.swot?.[company] || {
              Strengths: [],
              Weaknesses: [],
              Opportunities: [],
              Threats: []
            },
            services: processedData.services?.[company] ? 
              Object.values(processedData.services[company])
                .filter(s => s)
                .flatMap(service => service.split(/\n\*|\* |\n-|- |\n•|• |\n\d+\./).filter(item => item.trim()).map(item => item.trim())) : [],
            target_audience: processedData.audience?.[company] || {},
            sentiment: processedData.sentiment?.[company] || {},
            market: processedData.market?.[company] || {},
            marketing: processedData.marketing?.[company] || {}
          };
        }
      });

      // Update current data and reset competitors selection
      setCurrentData(transformedData);
      setSelectedCompetitors(Object.keys(transformedData.allCompetitors).slice(0, 3));
      setSelectedCompany(Object.keys(transformedData.allCompetitors)[0] || 'CLIENT');
      
      alert('CSV data loaded successfully! You can now select competitors and analyze.');
    } else {
      throw new Error('Invalid CSV format - could not extract company data');
    }
    
    } catch (error) {
      console.error('CSV processing error:', error);
      alert(`Failed to process CSV: ${error.message}. Please check the file format and try again.`);
    }
  };

  // Handle logo upload (only available in admin mode)
  const handleLogoUpload = async (file, clientName) => {
    if (isClientReport) return; // Disable in client mode
    
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

  // Handle loading a past report
  const handleLoadReport = (reportData) => {
    if (isClientReport) return; // Disable in client mode
    
    try {
      console.log('Loading past report:', reportData);
      
      // Extract the full data structure - it might be nested in different ways
      let actualData = reportData;
      
      // Check if data is nested in fullData property (from ShareReportModal)
      if (reportData.fullData && typeof reportData.fullData === 'object') {
        actualData = reportData.fullData;
        console.log('Using nested fullData structure');
      }
      // Check if data is nested in data.fullData (from API response)
      else if (reportData.data?.fullData && typeof reportData.data.fullData === 'object') {
        actualData = reportData.data.fullData;
        console.log('Using data.fullData structure');
      }
      
      // Update current data with the extracted structure
      setCurrentData(actualData);
      
      // Set logo (or clear it if not available in this report)
      // Check multiple possible locations for the logo
      const logoToSet = reportData.clientLogo || // Root level (most likely)
                        actualData.clientLogo || // Inside nested data
                        reportData.data?.clientLogo || // Inside data object
                        null;
      
      console.log('Logo debugging for report:', {
        clientName: actualData.clientName || reportData.clientName,
        rootLogo: reportData.clientLogo ? 'Present' : 'Null',
        nestedLogo: actualData.clientLogo ? 'Present' : 'Null', 
        dataLogo: reportData.data?.clientLogo ? 'Present' : 'Null',
        finalLogo: logoToSet ? 'Logo will be set' : 'Logo will be cleared',
        previousLogo: clientLogo ? 'Had previous logo' : 'No previous logo'
      });
      
      // Force clear the logo first, then set the new one to ensure proper state update
      setClientLogo(null);
      setTimeout(() => {
        setClientLogo(logoToSet);
      }, 100);
      
      // Update selected competitors - check multiple possible locations
      let competitors = [];
      if (reportData.competitors && Array.isArray(reportData.competitors)) {
        competitors = reportData.competitors;
      } else if (reportData.data?.competitors && Array.isArray(reportData.data.competitors)) {
        competitors = reportData.data.competitors;
      } else if (reportData.selectedCompetitors && Array.isArray(reportData.selectedCompetitors)) {
        competitors = reportData.selectedCompetitors;
      }
      
      if (competitors.length > 0) {
        setSelectedCompetitors(competitors);
        setSelectedCompany(competitors[0] || 'CLIENT');
        console.log('Loaded competitors:', competitors);
      } else {
        // Reset to client view if no competitors found
        setSelectedCompetitors([]);
        setSelectedCompany('CLIENT');
        console.log('No competitors found, defaulting to CLIENT view');
      }
      
      // Reset to overview tab
      setActiveTab('overview');
      
      alert(`Loaded report for ${actualData.clientName || reportData.clientName} successfully!`);
    } catch (error) {
      console.error('Error loading report:', error);
      alert('Failed to load report: ' + error.message);
    }
  };

  // Calculate scores based on available data
  const calculateCompetitorScores = (competitor) => {
    if (competitor === 'CLIENT') {
      const data = finalClientData.clientProfile;
      if (!data) return { overall: 5.0, breakdown: {} };
      
      const marketScore = (data.marketPosition && data.marketPosition.includes('specialist')) ? 7 : 6;
      
      // Better sentiment score parsing
      let sentimentScore = 4.5; // default
      if (data.sentiment && data.sentiment['Overall Score']) {
        const sentimentStr = data.sentiment['Overall Score'].toString();
        const match = sentimentStr.match(/(\d+\.?\d*)/);
        if (match) {
          sentimentScore = parseFloat(match[1]);
          if (sentimentStr.includes('/5')) {
            sentimentScore = sentimentScore * 2; // Convert from /5 to /10 scale
          }
        }
      }
      
      const serviceScore = Math.min((data.services?.length || 0) * 1.5, 10);
      const presenceScore = (data.market && data.market['Geographic Presence']?.includes('North America')) ? 7 : 5;
      
      const overall = Math.round(((marketScore + sentimentScore + serviceScore + presenceScore) / 4) * 10) / 10;
      
      return {
        overall: isNaN(overall) ? 5.0 : overall,
        breakdown: {
          'Market Position': isNaN(marketScore) ? 6 : marketScore,
          'Brand Strength': isNaN(sentimentScore) ? 4.5 : Math.round(sentimentScore * 10) / 10,
          'Service Portfolio': isNaN(serviceScore) ? 5 : Math.round(serviceScore * 10) / 10,
          'Market Presence': isNaN(presenceScore) ? 5 : presenceScore
        }
      };
    }
    
    const data = finalClientData.allCompetitors?.[competitor];
    if (!data) return { overall: 5.0, breakdown: {} };

    const marketScore = (data.marketPosition && (data.marketPosition.includes('leader') || data.marketPosition.includes('Enterprise'))) ? 9 : 
                       (data.marketPosition && data.marketPosition.includes('specialist')) ? 7 : 5;
    
    // Better sentiment score parsing for competitors
    let sentimentScore = 4.0; // default
    if (data.sentiment && data.sentiment['Overall Score']) {
      const sentimentStr = data.sentiment['Overall Score'].toString();
      const match = sentimentStr.match(/(\d+\.?\d*)/);
      if (match) {
        sentimentScore = parseFloat(match[1]);
        if (sentimentStr.includes('/5')) {
          sentimentScore = sentimentScore * 2; // Convert from /5 to /10 scale
        }
      }
    }
    
    const serviceScore = Math.min((data.services?.length || 0) * 1.5, 10);
    const presenceScore = (data.market && data.market['Geographic Presence']?.includes('Global')) ? 10 :
                         (data.market && data.market['Geographic Presence']?.includes('North America')) ? 7 : 5;

    const overall = Math.round(((marketScore + sentimentScore + serviceScore + presenceScore) / 4) * 10) / 10;

    return {
      overall: isNaN(overall) ? 5.0 : overall,
      breakdown: {
        'Market Position': isNaN(marketScore) ? 5 : marketScore,
        'Brand Strength': isNaN(sentimentScore) ? 4.0 : Math.round(sentimentScore * 10) / 10,
        'Service Portfolio': isNaN(serviceScore) ? 5 : Math.round(serviceScore * 10) / 10,
        'Market Presence': isNaN(presenceScore) ? 5 : presenceScore
      }
    };
  };

  const getContextualInsights = (tab, competitor) => {
    if (competitor === 'CLIENT') {
      const data = finalClientData.clientProfile;
      switch(tab) {
        case 'swot':
          return `Your key competitive advantage: ${data.swot?.Strengths?.[0] || 'Not available'}. Primary area for improvement: ${data.swot?.Weaknesses?.[0] || 'Not available'}.`;
        case 'services':
          return `You offer ${data.services?.length || 0} core services with specialization in ${finalClientData.industry?.toLowerCase() || 'your industry'}.`;
        case 'audience':
          return `Your primary target: ${data.target_audience?.Primary || 'Not specified'}. Key decision makers: ${data.target_audience?.['Decision Makers'] || 'Not specified'}.`;
        case 'sentiment':
          return `You maintain a ${data.sentiment?.['Overall Score'] || 'Not rated'} rating. Your strongest perception: ${data.sentiment?.['Positive Themes'] || 'Not available'}.`;
        case 'market':
          return `Your market position: ${data.market?.['Market Share'] || 'Not specified'}. Revenue scale: ${data.market?.['Revenue Range'] || 'Not specified'}.`;
        case 'marketing':
          return `Your core channels: ${data.marketing?.['Primary Channels'] || 'Not specified'}. Your key differentiator: ${data.marketing?.['Unique Selling Proposition'] || 'Not specified'}.`;
        default:
          return `Your company specializes in ${finalClientData.industry || 'business services'} with focus on ${data.marketPosition?.toLowerCase() || 'market competition'}.`;
      }
    }
    
    const data = finalClientData.allCompetitors?.[competitor];
    if (!data) return '';

    switch(tab) {
      case 'swot':
        return `Key competitive advantage: ${data.swot?.Strengths?.[0] || 'Not available'}. Primary vulnerability: ${data.swot?.Weaknesses?.[0] || 'Not available'}.`;
      case 'services':
        // Use Key Features or Use Cases data if available
        const keyFeatures = data.marketing?.['Key Features'] || data.services?.[0];
        if (keyFeatures && keyFeatures.trim()) {
          const cleanFeatures = keyFeatures.replace(/^\*/g, '').trim();
          return cleanFeatures.length > 150 ? cleanFeatures.substring(0, 150) + '...' : cleanFeatures;
        }
        return `${competitor} offers ${data.services?.length || 0} core services. Focus on ${data.marketPosition?.toLowerCase() || 'market position'}.`;
      case 'audience':
        // Use actual audience data from CSV
        const users = data.target_audience?.Users || data.target_audience?.Primary;
        const buyers = data.target_audience?.Buyers || data.target_audience?.['Decision Makers'];
        if (users && buyers) {
          return `Primary users: ${users.split('*')[0]?.trim() || users}. Decision makers: ${buyers.split('*')[0]?.trim() || buyers}.`;
        }
        return `Primary target: ${data.target_audience.Primary || 'Not specified'}. Key decision makers: ${data.target_audience['Decision Makers'] || 'Not specified'}.`;
      case 'sentiment':
        const score = data.sentiment['Overall Score'] || 'Not rated';
        const trendAnalysis = data.sentiment['Sentiment Trend Analysis'] || data.sentiment['Positive Themes']?.split(',')[0]?.trim();
        if (trendAnalysis) {
          return `${competitor} maintains ${score}. Trend: ${trendAnalysis.substring(0, 100)}${trendAnalysis.length > 100 ? '...' : ''}`;
        }
        return `${competitor} maintains a ${score} rating. Market sentiment data limited.`;
      case 'market':
        return `Market position: ${data.market['Market Share'] || 'Not specified'}. Revenue scale: ${data.market['Revenue Range'] || 'Not specified'}.`;
      case 'marketing':
        const channels = data.marketing['Marketing Channels'] || data.marketing['Primary Channels'];
        const strategy = data.marketing['Marketing Strategies'] || data.marketing['Content Strategy'];
        if (channels && strategy) {
          return `Channels: ${channels.split('*')[0]?.trim() || channels}. Strategy: ${strategy.split('*')[0]?.trim() || strategy}.`;
        }
        return `Core channels: ${channels || 'Not specified'}. Strategy: ${strategy || 'Not specified'}.`;
      case 'messaging':
        const tagline = data.marketing['Tagline'];
        const uvp = data.marketing['Unique Selling Proposition'];
        if (tagline && uvp) {
          return `Tagline: "${tagline}". Value proposition: ${uvp.substring(0, 100)}${uvp.length > 100 ? '...' : ''}.`;
        }
        return `Tagline: ${tagline || 'Not specified'}. Value proposition: ${uvp || 'Not specified'}.`;
      default:
        // Use the actual description from the CSV data if available
        if (data.description && data.description.trim() && data.description !== data.name) {
          return data.description.length > 200 ? data.description.substring(0, 200) + '...' : data.description;
        }
        // Use elevator pitch if available
        if (data.elevatorPitch && data.elevatorPitch.trim() && data.elevatorPitch !== data.name) {
          return data.elevatorPitch.length > 200 ? data.elevatorPitch.substring(0, 200) + '...' : data.elevatorPitch;
        }
        // Fallback to generic description
        return `${competitor} competes directly in ${finalClientData.industry || 'business services'} with focus on ${data.marketPosition?.toLowerCase() || 'market competition'}.`;
    }
  };

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
    // { id: 'market', label: 'Market Position', icon: TrendingUpIcon }, // Removed due to inaccurate data
    { id: 'marketing', label: 'Marketing Strategy', icon: MessageSquare },
    { id: 'messaging', label: 'Messaging', icon: MessageSquare }
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
                finalClientData.clientName.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Competitive Intelligence Report</h1>
              <p className="text-gray-600">Strategic analysis for {finalClientData.clientName}</p>
            </div>
          </div>
          
          {/* Only show admin buttons if NOT a client report */}
          {!isClientReport && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReportsListModal(true)}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                Past Reports
              </button>
              
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
          )}
        </div>
      </div>

      {/* Only show modals if NOT a client report */}
      {!isClientReport && (
        <>
          <CSVUploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onDataUploaded={handleDataUploaded}
          />

          <ShareReportModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            clientName={finalClientData.clientName}
            reportData={{
              competitors: selectedCompetitors,
              analysisDate: finalClientData.analysisDate,
              industry: finalClientData.industry,
              // Pass the complete data structure
              fullData: currentData || finalClientData,
              clientLogo: clientLogo
            }}
          />

          <ReportsListModal
            isOpen={showReportsListModal}
            onClose={() => setShowReportsListModal(false)}
            onLoadReport={handleLoadReport}
          />

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

          {showCompetitorSelection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Select Competitors to Analyze</h3>
                <p className="text-gray-600 mb-6">Choose up to 3 competitors for detailed analysis</p>
                
                <div className="space-y-3 mb-6">
                  {availableCompetitors.map((competitor) => {
                    const data = finalClientData.allCompetitors?.[competitor];
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
        </>
      )}

      {/* Client vs Competitors Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{finalClientData.clientName} vs. Competition</h2>
            <p className="text-blue-100 mb-2">{finalClientData.tagline || ''}</p>
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
                  {finalClientData.tagline?.substring(0, 50) || 'No tagline available'}...
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
                    {finalClientData.allCompetitors?.[competitor]?.tagline?.substring(0, 50) || 'Competitor analysis'}...
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
                    <h3 className="text-2xl font-bold mb-2">{selectedCompetitorData?.name || 'Company'}</h3>
                    <p className="text-blue-100 mb-4">{selectedCompetitorData?.tagline || ''}</p>
                    {selectedCompetitorData?.link && (
                      <a 
                        href={selectedCompetitorData?.link}
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
                    <p className="text-gray-700 leading-relaxed">{selectedCompetitorData?.description || 'No description available'}</p>
                  </div>
                </div>
                
                {selectedCompetitorData?.elevatorPitch && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      Elevator Pitch
                    </h4>
                    <p className="text-gray-800 text-lg leading-relaxed italic">"{selectedCompetitorData?.elevatorPitch}"</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'swot' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">SWOT Analysis: {selectedCompetitorData?.name || 'Company'}</h3>
                  <p className="text-gray-600">Strategic assessment of strengths, weaknesses, opportunities, and threats</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(selectedCompetitorData?.swot || {}).map(([category, items]) => (
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Portfolio: {selectedCompetitorData?.name || 'Company'}</h3>
                  <p className="text-gray-600">Core service offerings and capabilities</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(selectedCompetitorData?.services || []).map((service, index) => (
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Target Audience: {selectedCompetitorData?.name || 'Company'}</h3>
                  <p className="text-gray-600">Key customer segments and decision makers</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(selectedCompetitorData?.target_audience || {})
                    .filter(([segment, description]) => {
                      // Filter out the default placeholder entries
                      const isPlaceholder = (
                        (segment === 'Primary' && description === 'Business users') ||
                        (segment === 'Decision Makers' && description === 'Business decision makers') ||
                        (segment === 'Secondary' && description === 'Secondary market segments')
                      );
                      // Also filter out empty or undefined descriptions
                      return !isPlaceholder && description && description.trim() !== '';
                    })
                    .map(([segment, description]) => (
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Market Sentiment: {selectedCompetitorData?.name || 'Company'}</h3>
                  <p className="text-gray-600">Customer perception and brand sentiment analysis</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-green-600" />
                      Overall Score
                    </h4>
                    <div className="text-2xl font-bold text-green-800">{selectedCompetitorData?.sentiment?.['Overall Score'] || 'Not rated'}</div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Sentiment Trend Analysis</h4>
                    <p className="text-blue-800">{selectedCompetitorData?.sentiment?.['Sentiment Trend Analysis'] || 'Not available'}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Online Review Scores</h4>
                    <p className="text-purple-800">{selectedCompetitorData?.sentiment?.['Online Review Scores'] || 'Not available'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Market Position: {selectedCompetitorData?.name || 'Company'}</h3>
                  <p className="text-gray-600">Market share, revenue, and geographic presence</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(selectedCompetitorData?.market || {}).map(([metric, value]) => (
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Marketing Strategy: {selectedCompetitorData?.name || 'Company'}</h3>
                  <p className="text-gray-600">Marketing channels, content strategy, and positioning</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Marketing Channels</h4>
                    <p className="text-purple-800">{selectedCompetitorData?.marketing?.['Primary Channels'] || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">Marketing Strategies</h4>
                    <p className="text-green-800">{selectedCompetitorData?.marketing?.['Content Strategy'] || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-3">Potential Keywords</h4>
                    <p className="text-orange-800">{selectedCompetitorData?.marketing?.['Keywords'] || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Unique Selling Proposition
                  </h4>
                  <p className="text-blue-800 text-lg font-medium">"{selectedCompetitorData?.marketing?.['Unique Selling Proposition'] || 'Not specified'}"</p>
                </div>
              </div>
            )}

            {activeTab === 'messaging' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Messaging: {selectedCompetitorData?.name || 'Company'}</h3>
                  <p className="text-gray-600">Brand messaging, tagline, value proposition, and positioning</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Tagline</h4>
                    <p className="text-purple-800 text-lg font-medium italic">"{selectedCompetitorData?.marketing?.['Tagline'] || 'Not specified'}"</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">Brand Promise</h4>
                    <p className="text-green-800">{selectedCompetitorData?.marketing?.['Brand Promise'] || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Unique Value Proposition
                  </h4>
                  <p className="text-blue-800 text-lg font-medium">"{selectedCompetitorData?.marketing?.['Unique Selling Proposition'] || 'Not specified'}"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-3">Competitive Positioning Summary</h4>
                    <p className="text-orange-800">{selectedCompetitorData?.marketing?.['Market Positioning'] || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-3">Messaging Strategy</h4>
                    <p className="text-indigo-800">{selectedCompetitorData?.marketing?.['Messaging Strategy'] || 'Not specified'}</p>
                  </div>
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