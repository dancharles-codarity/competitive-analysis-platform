# Competitive Analysis Platform

Professional competitive intelligence platform for service-based event companies with full CSV upload, logo management, and client report sharing capabilities.

## 🚀 Features

### Core Analytics
- **Interactive Dashboard** - Comprehensive competitive analysis with scoring system
- **SWOT Analysis** - Expandable strengths, weaknesses, opportunities, and threats
- **Service Portfolio Comparison** - Side-by-side service offerings analysis
- **Market Sentiment Analysis** - Brand perception and customer sentiment tracking
- **Competitive Scoring** - Automated scoring based on market position, brand strength, and presence

### Data Management
- **CSV Upload & Processing** - Upload competitive analysis data from research tools like Competely
- **Logo Management** - Upload and manage client logos with automatic integration
- **Data Transformation** - Automatic processing of structured CSV data into dashboard format
- **Multi-client Support** - Handle multiple client analyses with separate data sets

### Client Experience  
- **Shareable Reports** - Client-specific URLs for easy sharing and presentation
- **Professional Branding** - Custom logos and client-specific theming
- **Interactive Navigation** - 7 analysis tabs with contextual insights
- **Real-time Updates** - Dynamic competitor selection and instant analysis updates

### Agency Workflow
- **Upload Interface** - Drag-and-drop CSV upload with validation
- **Competitor Selection** - Choose up to 3 competitors for detailed analysis  
- **Strategic Insights** - Context-aware recommendations per analysis section
- **Report Generation** - Automated client report URLs with sharing capabilities

## 🎯 Quick Start

### 1. Local Development

```bash
# Clone the repository
git clone https://github.com/dancharles-codarity/competitive-analysis-platform.git
cd competitive-analysis-platform

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 2. Using the Platform

#### Upload CSV Data
1. Click **"Upload CSV"** button in dashboard
2. Drag/drop or select your competitive analysis CSV file
3. Data automatically processed and integrated
4. Select competitors and begin analysis

#### Upload Client Logo
1. Click **"Upload Logo"** button  
2. Enter client name and select logo file
3. Logo automatically appears in dashboard header
4. Supports JPG, PNG, SVG up to 5MB

#### Generate Client Reports
1. Click **"Share Report"** button
2. Copy the generated client-specific URL
3. Send via email or save for later access
4. Client accesses personalized report at URL

#### Select Competitors
1. Click **"Select Competitors"** button
2. Choose up to 3 competitors from available options
3. View competitive scores and detailed analysis
4. Navigate through 7 analysis tabs for insights

## 📊 CSV Upload Format

The platform processes CSV files with these sections:
- **OVERVIEW** - Company profiles and basic information
- **SWOT** - Strengths, weaknesses, opportunities, threats  
- **SERVICES** - Service offerings and capabilities
- **AUDIENCE** - Target markets and decision makers
- **SENTIMENT** - Brand perception and ratings
- **MARKET** - Market share and positioning data
- **MARKETING** - Marketing channels and strategies

Sections should be separated by `───────────────` dividers.

## 🔗 Client Report URLs

- Main dashboard: `https://yourapp.com/`
- Client-specific: `https://yourapp.com/client/client-name`
- Example: `https://yourapp.com/client/e3-webcasting`

Client URLs automatically generate based on company names with proper slug formatting.

## 🛠 API Endpoints

- `POST /api/upload` - Process CSV files
- `POST /api/upload-logo` - Upload client logos
- `GET /client/[slug]` - Client-specific reports

## 🎨 Customization

### Client Branding
- Upload logos via dashboard interface
- Logos stored in `/public/logos/` directory
- Automatic integration in headers and reports
- Support for multiple image formats

### Competitive Scoring
Modify scoring algorithm in `calculateCompetitorScores()`:
- Market position weighting (specialist vs enterprise)
- Brand strength calculation (sentiment-based)
- Service portfolio scoring (breadth and depth)
- Geographic presence impact (local vs global)

### Data Processing
CSV parsing logic in `/api/upload.js`:
- Section detection and separation
- Company identification and extraction
- Data transformation and validation
- Error handling and user feedback

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory  
vercel

# Follow prompts for deployment
```

### Environment Setup
Create `.env.local` for configuration:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Custom Domain
1. In Vercel dashboard, go to project Settings → Domains
2. Add your custom domain  
3. Update DNS settings as instructed
4. SSL automatically configured

## 📁 Project Structure

```
competitive-analysis-platform/
├── components/
│   ├── CompetitiveAnalysisDashboard.js  # Main dashboard component
│   ├── CSVUploadModal.js                # CSV upload interface
│   └── ShareReportModal.js              # Report sharing modal
├── pages/
│   ├── api/
│   │   ├── upload.js                    # CSV processing endpoint
│   │   └── upload-logo.js               # Logo upload endpoint
│   ├── client/
│   │   └── [slug].js                    # Dynamic client pages
│   └── index.js                         # Main dashboard page
├── public/
│   └── logos/                           # Client logo storage
├── styles/                              # Tailwind CSS styles
└── README.md                            # This file
```

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Icons**: Lucide React  
- **File Processing**: PapaParse (CSV), Formidable (uploads)
- **Hosting**: Vercel with automatic deployments
- **Storage**: File system for logos, localStorage for reports

## 💡 Usage Examples

### For Agency Teams
1. **Research Phase**: Use tools like Competely to generate competitive analysis CSV
2. **Data Upload**: Upload CSV and client logo to platform
3. **Analysis Phase**: Select key competitors and review insights across all tabs
4. **Client Presentation**: Generate shareable URL and present findings
5. **Follow-up**: Client accesses report independently via shared URL

### Sample Workflow
```bash
# 1. Upload competitive research data
Click "Upload CSV" → Select analysis.csv → Data processed

# 2. Add client branding  
Click "Upload Logo" → Enter "ACME Corp" → Select logo.png

# 3. Configure analysis
Click "Select Competitors" → Choose 3 competitors → Apply

# 4. Generate client report
Click "Share Report" → Copy URL → Send to client

# 5. Client access
Client visits: https://yourapp.com/client/acme-corp
```

## 📈 Analytics Tabs

### 1. Overview
- Company descriptions and elevator pitches
- Website links and key information
- Visual company cards with scoring

### 2. SWOT Analysis  
- Expandable sections for each SWOT category
- Detailed bullet points per category
- Color-coded sections for easy identification

### 3. Services
- Numbered service portfolio listings
- Comparison of service breadth and depth
- Visual service categorization

### 4. Target Audience
- Primary and secondary audience segments
- Decision maker identification
- Market segment analysis

### 5. Market Sentiment
- Overall sentiment scores
- Positive and negative theme analysis
- Brand perception insights

### 6. Market Position
- Market share data
- Revenue range analysis
- Geographic presence mapping

### 7. Marketing Strategy
- Marketing channel analysis
- Content strategy comparison
- Unique selling proposition evaluation

## 🔍 Strategic Insights

Each tab provides contextual strategic insights that change based on:
- Selected competitor (client vs competitor view)
- Current analysis tab focus
- Competitive positioning data
- Market performance metrics

Example insights:
- "Your key competitive advantage: Specialized expertise in association video production"
- "Primary vulnerability: Competition from general video production companies"
- "Market opportunity: Growing demand for hybrid and virtual association events"

## 🎯 Competitive Scoring Algorithm

Scores calculated across 4 key dimensions:

### Market Position (0-10)
- Enterprise leader: 9 points
- Specialist: 7 points  
- General market: 5 points

### Brand Strength (0-10)
- Based on sentiment score × 2
- Calculated from customer ratings
- Includes perception analysis

### Service Portfolio (0-10)
- Service count × 1.5 (capped at 10)
- Breadth and depth consideration
- Specialization bonus points

### Market Presence (0-10)
- Global presence: 10 points
- North America: 7 points
- Regional/local: 5 points

**Overall Score**: Average of all dimensions

## 🔄 Data Flow

```
CSV Upload → API Processing → Data Transformation → Dashboard Update
     ↓              ↓               ↓                 ↓
File Validation → Section Parse → Company Extract → UI Refresh
     ↓              ↓               ↓                 ↓  
Error Handle → Structure Data → Competitor ID → Analysis Ready
```

## 🛡️ Security & Privacy

- **File Validation**: CSV and image file type checking
- **Size Limits**: 10MB CSV, 5MB logos
- **Client Data**: Stored locally, not transmitted externally
- **URL Security**: Slug-based URLs, no sensitive data exposure
- **Upload Safety**: Server-side validation and sanitization

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: ES6+ features required
- **File APIs**: FileReader, FormData support needed
- **LocalStorage**: For report data persistence

## 📞 Support & Troubleshooting

### Common Issues

**CSV Upload Fails**
- Check file format (.csv required)
- Verify section separators (───────────────)
- Ensure file size under 10MB
- Check for proper company columns

**Logo Not Displaying**
- Verify image format (JPG, PNG, SVG)
- Check file size under 5MB
- Ensure client name provided
- Clear browser cache

**Client URL Not Working**
- Verify URL format: `/client/slug-name`
- Check slug generation (lowercase, dashes)
- Ensure report data saved
- Test in private/incognito mode

### Debug Steps
1. Open browser developer tools (F12)
2. Check console for error messages
3. Verify network requests in Network tab
4. Clear localStorage and try again
5. Test with different browser

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ CSV upload and processing
- ✅ Logo management system
- ✅ Client report sharing
- ✅ Interactive dashboard

### Phase 2 (Future)
- [ ] Database integration for persistent storage
- [ ] User authentication and multi-tenant support
- [ ] Advanced analytics and trending
- [ ] PDF report generation
- [ ] Email integration for automated sharing
- [ ] Custom branding themes per client

### Phase 3 (Advanced)
- [ ] AI-powered insights and recommendations
- [ ] Integration with research tools APIs
- [ ] Real-time competitive monitoring
- [ ] Advanced visualization and charts
- [ ] Mobile app for client access
- [ ] White-label solution for agencies

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Proprietary - For agency use only.

---

**Built for professional service agencies delivering strategic competitive intelligence.**

🔴 **LIVE DEMO**: [https://competitive-analysis-platform.vercel.app](https://competitive-analysis-platform.vercel.app)

**Key Features Now Live:**
- ✅ Full CSV upload functionality
- ✅ Logo management system  
- ✅ Client report sharing
- ✅ Interactive competitive analysis
- ✅ 7-tab analytics dashboard
- ✅ Automated scoring system