# Competitive Analysis Platform

Professional competitive intelligence platform for service-based event companies.

## Features

- **Interactive Dashboard** - Comprehensive competitive analysis with scoring system
- **Client Management** - Multi-client reports with personalized branding
- **CSV Upload** - Process competitive analysis data from research tools
- **Shareable Reports** - Client-specific URLs for easy sharing
- **Real-time Insights** - Contextual analysis for each business area

## Quick Start

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

### 2. Deploy to Vercel

#### Option A: Connect GitHub to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import `competitive-analysis-platform` repository
5. Click "Deploy" (no configuration needed)

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow prompts to deploy
```

### 3. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Update DNS settings as instructed

## Usage

### For Agency Teams

1. **Upload CSV Data**: Use research tools like Competely to generate competitive analysis
2. **Select Client**: Choose which company is your client vs. competitors
3. **Pick Top Competitors**: Select 2-3 most relevant competitors for analysis
4. **Generate Report**: Review insights across all business areas
5. **Share with Client**: Use the shareable URL for client presentations

### Client Report URLs

- Main dashboard: `https://yourapp.com/`
- Client-specific: `https://yourapp.com/client/client-name`
- Example: `https://yourapp.com/client/e3-webcasting`

### CSV Upload Format

The platform processes CSV files from competitive analysis tools with these sections:
- OVERVIEW (company profiles)
- SWOT (strengths, weaknesses, opportunities, threats)
- SERVICES (service offerings)
- AUDIENCE (target markets)
- SENTIMENT (brand perception)
- MARKET (positioning and share)
- MARKETING (strategies and channels)

## API Endpoints

- `POST /api/upload` - Process CSV files
- `GET /client/[slug]` - Client-specific reports

## Customization

### Client Branding

1. Update client logo in dashboard header
2. Customize color schemes per client
3. Add client-specific messaging

### Scoring Algorithm

Modify `calculateCompetitorScores()` function to adjust:
- Market position weighting
- Brand strength calculation
- Service portfolio scoring
- Geographic presence impact

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Icons**: Lucide React
- **CSV Processing**: PapaParse
- **File Upload**: Formidable
- **Hosting**: Vercel
- **Domain**: Custom domain support

## Environment Variables

Create `.env.local` for any configuration:

```env
# Add any API keys or configuration here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Support

For technical issues or feature requests:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include error messages and screenshots

## License

Proprietary - For agency use only.

---

Built for professional service agencies delivering strategic competitive intelligence.
