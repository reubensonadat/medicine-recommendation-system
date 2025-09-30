# Smart Medicine Recommendation System - Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Key Components](#key-components)
6. [Data Structure](#data-structure)
7. [Recommendation Algorithm](#recommendation-algorithm)
8. [Development Workflow](#development-workflow)
9. [Customization Guide](#customization-guide)
10. [Deployment](#deployment)
11. [Contributing Guidelines](#contributing-guidelines)

## Project Overview

The Smart Medicine Recommendation System is a **purely front-end** Next.js application that provides intelligent medicine recommendations based on user symptoms. The application uses local JSON data for all medicine information and performs all calculations in the browser.

### Key Features
- **Symptom-based filtering**: Select from 27 common symptoms with severity levels
- **Intelligent recommendations**: AI-powered scoring based on effectiveness, coverage, and severity
- **Multi-symptom support**: Handle multiple symptoms simultaneously
- **Severity-aware pricing**: Adjust recommendations based on symptom severity
- **Responsive design**: Mobile-first approach with Tailwind CSS

## Architecture

### Frontend-Only Architecture
```
┌─────────────────────────────────────────────┐
│          Next.js 15 (Client-Side)           │
├─────────────────────────────────────────────┤
│  Components:                                │
│  - MedicineGrid.tsx                         │
│  - MedicineFilter.tsx                       │
│  - UI Components (shadcn/ui)                │
├─────────────────────────────────────────────┤
│  Data Processing:                           │
│  - Local JSON (/public/medicines.json)      │
│  - Browser-based calculations               │
│  - No API calls or backend services         │
├─────────────────────────────────────────────┤
│  Recommendation Logic:                      │
│  - Severity multipliers                     │
│  - Coverage percentage calculations          │
│  - Price scoring                            │
│  - Effectiveness weighting                  │
└─────────────────────────────────────────────┘
```

### Data Flow
1. **User Input**: Symptoms selected with severity levels
2. **Local Processing**: All calculations done in browser
3. **JSON Loading**: Medicine data loaded from local file
4. **Recommendation Generation**: Real-time scoring and sorting
5. **UI Update**: Immediate display of results

## Technology Stack

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React

### Frontend Dependencies
```json
{
  "next": "15.3.5",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "lucide-react": "^0.525.0",
  "@radix-ui/react-*": "Various UI primitives"
}
```

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Development Server**: Next.js dev server

## Project Structure

```
/home/z/my-project/
├── public/
│   ├── medicines.json          # Medicine database
│   ├── logo.svg                # Application logo
│   └── robots.txt             # SEO configuration
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── medicine/[id]/     # Medicine details page
│   ├── components/
│   │   ├── MedicineGrid.tsx   # Medicine display grid
│   │   ├── MedicineFilter.tsx # Symptom selection filter
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts      # Mobile detection hook
│   │   └── use-toast.ts       # Toast notification hook
│   └── lib/
│       └── utils.ts           # Utility functions
├── components.json           # shadcn/ui configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## Key Components

### 1. Main Page Component (`src/app/page.tsx`)
The heart of the application containing:
- Symptom selection interface
- Recommendation algorithm
- State management
- UI rendering

### 2. MedicineGrid Component (`src/components/MedicineGrid.tsx`)
Displays medicine recommendations with:
- Coverage percentage badges
- Severity-adjusted scores
- Price information
- Interactive cards

### 3. MedicineFilter Component (`src/components/MedicineFilter.tsx`)
Handles symptom selection with:
- Multi-select checkboxes
- Severity level adjustment
- Custom symptom input
- Category filtering

### 4. UI Components (`src/components/ui/`)
Pre-built shadcn/ui components including:
- Cards, badges, buttons
- Modals, dialogs, alerts
- Form controls, inputs
- Navigation elements

## Data Structure

### Medicine Data Format
```typescript
interface MedicineData {
  id: string
  brandName: string
  genericName: string
  description: string
  usage: string
  dosageAdult?: string
  dosageChild?: string
  dosageElderly?: string
  sideEffects?: string
  warnings?: string
  priceRange?: string
  category?: string
  drugClass?: string
  prescription: boolean
  controlled: boolean
  symptomMappings: Array<{
    symptomId: string
    effectivenessScore: number
    isPrimary: boolean
    evidenceLevel?: string
    notes?: string
  }>
}
```

### Symptom Data Structure
```typescript
interface SymptomData {
  id: string
  name: string
  description: string
  category: string
  severity: "Mild" | "Moderate" | "Severe"
}
```

### Recommendation Output
```typescript
interface MedicineRecommendation {
  id: string
  brandName: string
  genericName: string
  averageEffectiveness: number
  coveragePercentage: number
  severityAdjustedScore: number
  priceScore: number
  symptomMatches: Array<{
    symptom: SymptomData
    effectivenessScore: number
    isPrimary: boolean
  }>
}
```

## Recommendation Algorithm

### Scoring System

#### 1. Coverage Percentage
```typescript
const calculateCoveragePercentage = (medicineSymptoms: string[], selectedSymptoms: string[]): number => {
  if (selectedSymptoms.length === 0) return 0
  const coveredSymptoms = medicineSymptoms.filter(symptom => 
    selectedSymptoms.includes(symptom)
  )
  return Math.round((coveredSymptoms.length / selectedSymptoms.length) * 100)
}
```

#### 2. Severity Multiplier
```typescript
const getSeverityMultiplier = (severity: string): number => {
  switch (severity) {
    case 'Mild': return 0.7   // Prefer cheaper medicines
    case 'Moderate': return 1.0 // Balanced approach
    case 'Severe': return 1.3  // Prefer stronger medicines
    default: return 1.0
  }
}
```

#### 3. Price Scoring
```typescript
const getPriceScore = (priceRange: string | undefined): number => {
  if (!priceRange) return 5
  
  const price = extractPrice(priceRange)
  
  // Lower price = higher score (1-10 scale)
  if (price <= 10) return 10
  if (price <= 20) return 8
  if (price <= 30) return 6
  if (price <= 50) return 4
  return 2
}
```

#### 4. Final Sorting Logic
```typescript
matchingMedicines.sort((a, b) => {
  // Primary: Coverage percentage
  if (b.coveragePercentage !== a.coveragePercentage) {
    return b.coveragePercentage - a.coveragePercentage
  }
  
  // Secondary: Severity-adjusted effectiveness
  if (b.severityAdjustedScore !== a.severityAdjustedScore) {
    return b.severityAdjustedScore - a.severityAdjustedScore
  }
  
  // Tertiary: Price score
  return b.priceScore - a.priceScore
})
```

## Development Workflow

### 1. Setup Development Environment
```bash
# Clone the repository
git clone <repository-url>
cd my-project

# Install dependencies
npm install

# Start development server
npm run dev

# Access application at http://localhost:3000
```

### 2. Adding New Medicines

#### Step 1: Update medicines.json
```json
{
  "medicines": [
    {
      "id": "med050",
      "brandName": "New Medicine",
      "genericName": "Generic Name",
      "description": "Medicine description",
      "usage": "How to use",
      "dosageAdult": "Adult dosage",
      "dosageChild": "Child dosage",
      "dosageElderly": "Elderly dosage",
      "sideEffects": "Side effects",
      "warnings": "Warnings",
      "priceRange": "GHS 10-25",
      "category": "Category",
      "drugClass": "Drug Class",
      "prescription": false,
      "controlled": false,
      "symptomMappings": [
        {
          "symptomId": "headache",
          "effectivenessScore": 8,
          "isPrimary": true,
          "evidenceLevel": "Strong",
          "notes": "Effectiveness notes"
        }
      ]
    }
  ]
}
```

#### Step 2: Add New Symptoms (if needed)
Update the `commonSymptoms` array in `src/app/page.tsx`:
```typescript
const commonSymptoms = [
  {
    id: "new-symptom",
    name: "New Symptom",
    description: "Symptom description",
    category: "Category",
    severity: "Moderate"
  }
]
```

### 3. Testing the Application
```bash
# Run linting
npm run lint

# Test locally
npm run dev

# Build for production
npm run build
```

### 4. Code Quality
- Use TypeScript strict mode
- Follow ESLint configuration
- Use existing shadcn/ui components
- Maintain consistent naming conventions
- Add appropriate comments for complex logic

## Customization Guide

### 1. Changing the Color Scheme
Update `tailwind.config.ts`:
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    }
  }
}
```

### 2. Modifying the Recommendation Algorithm
Update the scoring functions in `src/app/page.tsx`:
```typescript
// Change severity multipliers
const getSeverityMultiplier = (severity: string): number => {
  switch (severity) {
    case 'Mild': return 0.5   // Custom multiplier
    case 'Moderate': return 1.2
    case 'Severe': return 1.5
    default: return 1.0
  }
}
```

### 3. Adding New UI Components
```bash
# Add new shadcn/ui component
npx shadcn-ui@latest add [component-name]

# Or manually create in src/components/ui/
```

### 4. Customizing the Layout
Modify `src/app/layout.tsx` for global changes:
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

## Deployment

### Static Deployment (Recommended)
Since this is a frontend-only application, it can be deployed as static files:

#### 1. Build for Production
```bash
npm run build
```

#### 2. Deploy to Various Platforms
- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop build folder
- **GitHub Pages**: Use `gh-pages` branch
- **Cloudflare Pages**: Connect Git repository

### Hostinger Deployment
1. **Upload Files**: Use Hostinger File Manager or FTP
2. **Configure Domain**: Point domain to public folder
3. **Set Permissions**: Ensure files are readable (644)
4. **Test Access**: Verify application works at domain

## Contributing Guidelines

### 1. Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use shadcn/ui components when possible
- Add appropriate comments

### 2. Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### 3. Issue Reporting
- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce
- Add screenshots if applicable

## Troubleshooting

### Common Issues

#### 1. Medicine Data Not Loading
- Check `/public/medicines.json` exists
- Verify JSON syntax is correct
- Check browser console for errors

#### 2. Recommendations Not Working
- Verify symptom mappings in JSON
- Check scoring function logic
- Ensure severity levels are correct

#### 3. Styling Issues
- Verify Tailwind CSS is properly configured
- Check shadcn/ui components are installed
- Ensure proper class names are used

### Performance Optimization
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize image sizes
- Minimize re-renders

## Future Enhancements

### Potential Features
- User accounts and history
- Advanced filtering options
- Integration with real pharmacies
- Mobile app version
- Multi-language support
- Advanced analytics

### Technical Improvements
- Implement Web Workers for heavy calculations
- Add offline support with Service Workers
- Implement progressive web app (PWA) features
- Add accessibility improvements
- Optimize bundle size

---

**Note**: This is a frontend-only application. All data processing happens in the browser using local JSON files. No backend services or APIs are required.