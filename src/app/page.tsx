"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Pill, Stethoscope, AlertTriangle, Star, ArrowRight, Search, Plus, Filter, Grid, Share2, Menu, X } from "lucide-react"
import MedicineFilter from "@/components/MedicineFilter"
import MedicineGrid from "@/components/MedicineGrid"
import { useRouter } from "next/navigation"

// Frontend-only medicine data will be loaded from JSON
// Symptoms will be loaded from symptoms.json

interface SymptomData {
  id: string
  name: string
  description: string
  category: string
  severity: string
}

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

interface MedicineRecommendation {
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
  averageEffectiveness: number
  matchCount: number
  symptoms: string[]
  symptomMatches: Array<{
    symptom: {
      id: string
      name: string
      description?: string
      category?: string
      severity?: string
    }
    effectivenessScore: number
    isPrimary: boolean
    evidenceLevel?: string
    notes?: string
  }>
  coveragePercentage: number
  severityAdjustedScore: number
  priceScore: number
}

interface MedicineFilters {
  category?: string
  drugClass?: string
  prescriptionOnly?: boolean
  controlledOnly?: boolean
  search?: string
  minEffectiveness?: number
  maxPrice?: string
  symptoms?: string[]
}

interface SelectedSymptomWithSeverity {
  id: string
  severity: string
}

export default function Home() {
  const router = useRouter()
  
  // Helper functions for recommendation system
  const getPriceScore = (priceRange: string | undefined): number => {
    if (!priceRange) return 5 // Default score
    
    const extractPrice = (priceStr: string): number => {
      const match = priceStr.match(/(\d+)/)
      return match ? parseInt(match[1]) : 50
    }
    
    const price = extractPrice(priceRange)
    
    // Lower price = higher score (1-10 scale)
    if (price <= 10) return 10
    if (price <= 20) return 8
    if (price <= 30) return 6
    if (price <= 50) return 4
    return 2
  }

  const getSeverityMultiplier = (severity: string): number => {
    switch (severity) {
      case 'Mild': return 0.7   // Prefer cheaper medicines for mild symptoms
      case 'Moderate': return 1.0 // Balanced approach
      case 'Severe': return 1.3  // Prefer more expensive (potentially stronger) medicines
      default: return 1.0
    }
  }

  const calculateCoveragePercentage = (medicineSymptoms: string[], selectedSymptoms: string[]): number => {
    if (selectedSymptoms.length === 0) return 0
    const coveredSymptoms = medicineSymptoms.filter(symptom => 
      selectedSymptoms.includes(symptom)
    )
    return Math.round((coveredSymptoms.length / selectedSymptoms.length) * 100)
  }

  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptomWithSeverity[]>([])
  const [symptoms, setSymptoms] = useState<SymptomData[]>([])
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([])
  const [customSymptomInput, setCustomSymptomInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<MedicineRecommendation[]>([])
  const [apiMessage, setApiMessage] = useState<string>("")
  const [allMedicines, setAllMedicines] = useState<MedicineData[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<MedicineData[]>([])
  const [activeTab, setActiveTab] = useState("recommendations")
  const [filters, setFilters] = useState<MedicineFilters>({})
  const [severityFilter, setSeverityFilter] = useState<string>("All")
  const [symptomSearchTerm, setSymptomSearchTerm] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load medicines and symptoms data from JSON files
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Home: Loading data...")
        
        // Load medicines
        const medicinesResponse = await fetch('/medicines.json')
        const medicinesData = await medicinesResponse.json()
        console.log("Home: Loaded", medicinesData.medicines.length, "medicines")
        setAllMedicines(medicinesData.medicines)
        
        // Load symptoms
        const symptomsResponse = await fetch('/symptoms.json')
        const symptomsData = await symptomsResponse.json()
        console.log("Home: Loaded", symptomsData.symptoms.length, "symptoms")
        setSymptoms(symptomsData.symptoms)
        
        setIsMounted(true)
      } catch (error) {
        console.error('Home: Error loading data:', error)
      }
    }
    
    loadData()
  }, [])

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const header = document.querySelector('header')
      if (header && !header.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const handleSymptomToggle = (symptomId: string) => {
    const symptom = symptoms.find(s => s.id === symptomId)
    if (!symptom) return

    setSelectedSymptoms(prev => {
      const existingIndex = prev.findIndex(s => s.id === symptomId)
      if (existingIndex >= 0) {
        // Remove symptom if already selected
        return prev.filter(s => s.id !== symptomId)
      } else {
        // Add symptom with default severity
        return [...prev, { id: symptomId, severity: symptom.severity }]
      }
    })
  }

  const handleSymptomSeverityChange = (symptomId: string, newSeverity: string) => {
    setSelectedSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === symptomId 
          ? { ...symptom, severity: newSeverity }
          : symptom
      )
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800 border-green-200'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Severe': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Mild': return '😊'
      case 'Moderate': return '😐'
      case 'Severe': return '😰'
      default: return '❓'
    }
  }

  const handleAddCustomSymptom = () => {
    if (customSymptomInput.trim() && !customSymptoms.includes(customSymptomInput.trim())) {
      setCustomSymptoms(prev => [...prev, customSymptomInput.trim()])
      setCustomSymptomInput("")
    }
  }

  const handleRemoveCustomSymptom = (symptom: string) => {
    setCustomSymptoms(prev => prev.filter(s => s !== symptom))
  }

  const handleSaveFavorites = () => {
    if (selectedSymptoms.length === 0 && customSymptoms.length === 0) {
      alert('Please select symptoms first to save your favorites')
      return
    }
    
    const favoriteData = {
      symptoms: selectedSymptoms,
      customSymptoms: customSymptoms,
      timestamp: new Date().toISOString()
    }
    
    // Get existing favorites or initialize empty array
    const existingFavorites = JSON.parse(localStorage.getItem('symptommed-favorites') || '[]')
    
    // Add new favorite
    existingFavorites.push(favoriteData)
    
    // Save back to localStorage
    localStorage.setItem('symptommed-favorites', JSON.stringify(existingFavorites))
    
    alert('Symptoms saved to favorites!')
  }

  const handleShare = async () => {
    if (selectedSymptoms.length === 0 && customSymptoms.length === 0) {
      alert('Please select symptoms first to share')
      return
    }
    
    const symptomNames = [
      ...selectedSymptoms.map(s => symptoms.find(sym => sym.id === s.id)?.name),
      ...customSymptoms
    ].filter(Boolean)
    
    const shareText = `I'm checking symptoms on SymptomMed Ghana: ${symptomNames.join(', ')}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SymptomMed Ghana',
          text: shareText,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareText)
        alert('Symptom information copied to clipboard!')
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(shareText)
      alert('Symptom information copied to clipboard!')
    }
  }

  const handleFindMedicines = async () => {
    if (selectedSymptoms.length === 0 && customSymptoms.length === 0) {
      console.log("No symptoms selected, returning early")
      return
    }
    
    console.log("Finding medicines for:", {
      selectedSymptoms,
      customSymptoms
    })
    
    setIsLoading(true)
    setApiMessage("")
    
    try {
      // Get selected symptom IDs and their severities
      const selectedSymptomIds = selectedSymptoms.map(s => s.id)
      
      // Find medicines that match the selected symptoms
      const matchingMedicines: MedicineRecommendation[] = []
      
      for (const medicine of allMedicines) {
        const relevantMappings = medicine.symptomMappings.filter(mapping => 
          selectedSymptomIds.includes(mapping.symptomId)
        )
        
        if (relevantMappings.length > 0) {
          // Create symptom matches with full symptom details
          const symptomMatches = relevantMappings.map(mapping => {
            const symptom = symptoms.find(s => s.id === mapping.symptomId)
            return {
              symptom: {
                id: mapping.symptomId,
                name: symptom?.name || mapping.symptomId,
                description: symptom?.description,
                category: symptom?.category,
                severity: symptom?.severity
              },
              effectivenessScore: mapping.effectivenessScore,
              isPrimary: mapping.isPrimary,
              evidenceLevel: mapping.evidenceLevel,
              notes: mapping.notes
            }
          })
          
          // Calculate average effectiveness
          const totalScore = symptomMatches.reduce((sum, match) => sum + match.effectivenessScore, 0)
          const averageEffectiveness = totalScore / symptomMatches.length
          
          // Calculate coverage percentage
          const coveragePercentage = calculateCoveragePercentage(
            symptomMatches.map(match => match.symptom.id),
            selectedSymptomIds
          )
          
          // Calculate severity-adjusted score
          const severityMultipliers = selectedSymptoms.map(s => getSeverityMultiplier(s.severity))
          const avgSeverityMultiplier = severityMultipliers.reduce((sum, mult) => sum + mult, 0) / severityMultipliers.length
          const severityAdjustedScore = averageEffectiveness * avgSeverityMultiplier
          
          // Calculate price score
          const priceScore = getPriceScore(medicine.priceRange)
          
          matchingMedicines.push({
            id: medicine.id,
            brandName: medicine.brandName,
            genericName: medicine.genericName,
            description: medicine.description,
            usage: medicine.usage,
            dosageAdult: medicine.dosageAdult,
            dosageChild: medicine.dosageChild,
            dosageElderly: medicine.dosageElderly,
            sideEffects: medicine.sideEffects,
            warnings: medicine.warnings,
            priceRange: medicine.priceRange,
            category: medicine.category,
            drugClass: medicine.drugClass,
            prescription: medicine.prescription,
            controlled: medicine.controlled,
            averageEffectiveness,
            matchCount: symptomMatches.length,
            symptoms: symptomMatches.map(match => match.symptom.name),
            symptomMatches,
            coveragePercentage,
            severityAdjustedScore,
            priceScore
          })
        }
      }
      
      // Sort by comprehensive score: coverage percentage first, then severity-adjusted effectiveness
      matchingMedicines.sort((a, b) => {
        // Primary sort: coverage percentage (more symptoms covered = better)
        if (b.coveragePercentage !== a.coveragePercentage) {
          return b.coveragePercentage - a.coveragePercentage
        }
        
        // Secondary sort: severity-adjusted effectiveness
        if (b.severityAdjustedScore !== a.severityAdjustedScore) {
          return b.severityAdjustedScore - a.severityAdjustedScore
        }
        
        // Tertiary sort: price score (for same coverage and effectiveness, prefer cheaper)
        return b.priceScore - a.priceScore
      })
      
      console.log("Found matching medicines:", matchingMedicines.length)
      
      setRecommendations(matchingMedicines.slice(0, 20)) // Limit to top 20
      
      if (customSymptoms.length > 0) {
        setApiMessage('Custom symptoms were noted. Please verify recommendations with a healthcare professional.')
      }
      
      setActiveTab("recommendations")
    } catch (error) {
      console.error('Error processing recommendations:', error)
      setApiMessage('An error occurred while processing recommendations. Please try again.')
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load initial medicines when browse tab is opened
    if (isMounted && activeTab === "browse" && filteredMedicines.length === 0 && allMedicines.length > 0) {
      setFilteredMedicines(allMedicines)
    }
  }, [activeTab, filteredMedicines.length, isMounted, allMedicines])

  // Initialize with empty filters to prevent hydration mismatch
  useEffect(() => {
    if (isMounted && activeTab === "browse" && filteredMedicines.length === 0 && allMedicines.length > 0) {
      setFilteredMedicines(allMedicines)
    }
  }, [activeTab, isMounted, allMedicines])

  const handleFiltersChange = (newFilters: MedicineFilters) => {
    setFilters(newFilters)
    
    // Apply filters locally
    let filtered = [...allMedicines]
    
    if (newFilters.category) {
      filtered = filtered.filter(medicine => 
        medicine.category === newFilters.category
      )
    }
    
    if (newFilters.drugClass) {
      filtered = filtered.filter(medicine => 
        medicine.drugClass === newFilters.drugClass
      )
    }
    
    if (newFilters.prescriptionOnly) {
      filtered = filtered.filter(medicine => 
        medicine.prescription === true
      )
    }
    
    if (newFilters.controlledOnly) {
      filtered = filtered.filter(medicine => 
        medicine.controlled === true
      )
    }
    
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(medicine => 
        medicine.brandName.toLowerCase().includes(searchLower) ||
        medicine.genericName.toLowerCase().includes(searchLower) ||
        medicine.description?.toLowerCase().includes(searchLower)
      )
    }
    
    if (newFilters.minEffectiveness) {
      filtered = filtered.filter(medicine => {
        const avgEffectiveness = medicine.symptomMappings.length > 0 
          ? medicine.symptomMappings.reduce((sum, mapping) => sum + mapping.effectivenessScore, 0) / medicine.symptomMappings.length
          : 0
        return avgEffectiveness >= (newFilters.minEffectiveness || 0)
      })
    }
    
    if (newFilters.symptoms && newFilters.symptoms.length > 0) {
      filtered = filtered.filter(medicine => 
        newFilters.symptoms!.some(symptomId => 
          medicine.symptomMappings.some(mapping => mapping.symptomId === symptomId)
        )
      )
    }
    
    setFilteredMedicines(filtered)
  }

  const handleClearFilters = () => {
    setFilters({})
    setFilteredMedicines(allMedicines)
  }

  const handleMedicineClick = (medicine: any) => {
    router.push(`/medicine/${medicine.id}`)
  }

  const getFilteredSymptoms = () => {
    let filtered = symptoms
    
    // Apply severity filter
    if (severityFilter !== "All") {
      filtered = filtered.filter(symptom => symptom.severity === severityFilter)
    }
    
    // Apply search filter
    if (symptomSearchTerm.trim()) {
      const searchLower = symptomSearchTerm.toLowerCase()
      filtered = filtered.filter(symptom => 
        symptom.name.toLowerCase().includes(searchLower) ||
        symptom.description.toLowerCase().includes(searchLower) ||
        symptom.category.toLowerCase().includes(searchLower)
      )
    }
    
    return filtered
  }

  const getEffectivenessStars = (score: number) => {
    const fullStars = Math.floor(score / 2)
    const halfStar = score % 2 >= 1
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-1">({score.toFixed(1)}/10)</span>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Respiratory': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cardiovascular': return 'bg-red-100 text-red-800 border-red-200'
      case 'Gastrointestinal': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Neurological': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Musculoskeletal': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Systemic': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Ocular': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Dermatological': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Psychological': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Renal': return 'bg-teal-100 text-teal-800 border-teal-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Pill className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">SymptomMed Ghana</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs sm:text-sm"
                onClick={handleSaveFavorites}
              >
                <Heart className="w-4 h-4 mr-1" />
                Save Favorites
              </Button>
              <Button 
                size="sm" 
                className="text-xs sm:text-sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'mt-4 pt-4 border-t border-gray-200 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={() => {
                  handleSaveFavorites()
                  setIsMobileMenuOpen(false)
                }}
              >
                <Heart className="w-4 h-4 mr-2" />
                Save Favorites
              </Button>
              <Button 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={() => {
                  handleShare()
                  setIsMobileMenuOpen(false)
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Symptoms
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
            What symptoms are you experiencing?
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized over-the-counter medicine recommendations based on your symptoms. 
            Always consult a healthcare professional for medical advice.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
          {/* Symptom Selection */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>Select Your Symptoms</span>
                </CardTitle>
                <CardDescription>
                  Choose all symptoms you're experiencing to get accurate recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search Symptoms */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Search Symptoms</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search symptoms by name, description, or category..."
                      value={symptomSearchTerm}
                      onChange={(e) => setSymptomSearchTerm(e.target.value)}
                      className="pl-10 h-10 sm:h-9 text-sm"
                    />
                  </div>
                </div>
                
                {/* Severity Filter */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Filter by Severity</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Mild", "Moderate", "Severe"].map((severity) => (
                      <Button
                        key={severity}
                        variant={severityFilter === severity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSeverityFilter(severity)}
                        className="text-xs h-8 px-3"
                      >
                        {severity}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-6 max-h-96 overflow-y-auto">
                  {getFilteredSymptoms().map((symptom) => {
                    const selectedSymptom = selectedSymptoms.find(s => s.id === symptom.id)
                    const isSelected = !!selectedSymptom
                    return (
                      <div key={symptom.id} className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                        <Checkbox
                          id={symptom.id}
                          checked={isSelected}
                          onCheckedChange={() => handleSymptomToggle(symptom.id)}
                          className="mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                            <label htmlFor={symptom.id} className="text-sm font-medium cursor-pointer">
                              {symptom.name}
                            </label>
                            <Badge variant="outline" className={`text-xs ${getSeverityColor(symptom.severity)} self-start sm:self-auto mt-1 sm:mt-0`}>
                              {symptom.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed">{symptom.description}</p>
                          <Badge variant="secondary" className={`text-xs ${getCategoryColor(symptom.category)}`}>
                            {symptom.category}
                          </Badge>
                          
                          {isSelected && (
                            <div className="mt-3">
                              <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Your severity:
                              </label>
                              <div className="flex flex-wrap gap-1">
                                {["Mild", "Moderate", "Severe"].map((severity) => (
                                  <Button
                                    key={severity}
                                    variant={selectedSymptom.severity === severity ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleSymptomSeverityChange(symptom.id, severity)}
                                    className="text-xs h-7 px-2"
                                  >
                                    {severity}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm font-medium mb-2 block">Add Custom Symptoms</label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
                    <Input
                      placeholder="Enter any other symptom..."
                      value={customSymptomInput}
                      onChange={(e) => setCustomSymptomInput(e.target.value)}
                      className="flex-1 h-10 sm:h-9 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCustomSymptom()
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleAddCustomSymptom}
                      disabled={!customSymptomInput.trim()}
                      className="w-full sm:w-auto h-10 sm:h-9"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {customSymptoms.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Custom Symptoms Added:</p>
                      <div className="flex flex-wrap gap-2">
                        {customSymptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span>{symptom}</span>
                            <button
                              onClick={() => handleRemoveCustomSymptom(symptom)}
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Symptoms & Action */}
          <div className="w-full lg:w-80 space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Selected Symptoms</span>
                </CardTitle>
                <CardDescription>
                  Our intelligent system will find medicines that best match your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSymptoms.length === 0 && customSymptoms.length === 0 ? (
                    <p className="text-gray-500 text-sm">No symptoms selected</p>
                  ) : (
                    <>
                      {selectedSymptoms.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Common Symptoms:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSymptoms.map((selectedSymptom) => {
                              const symptom = symptoms.find(s => s.id === selectedSymptom.id)
                              return (
                                <Badge key={selectedSymptom.id} variant="secondary" className="flex items-center space-x-1">
                                  <span>{getSeverityIcon(selectedSymptom.severity)}</span>
                                  <span>{symptom?.name}</span>
                                  <Badge variant="outline" className={`text-xs ${getSeverityColor(selectedSymptom.severity)}`}>
                                    {selectedSymptom.severity}
                                  </Badge>
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      
                      {customSymptoms.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Custom Symptoms:</p>
                          <div className="flex flex-wrap gap-2">
                            {customSymptoms.map((symptom, index) => (
                              <Badge key={index} variant="outline" className="flex items-center space-x-1">
                                <Search className="w-3 h-3 mr-1" />
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Smart Recommendation Info */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">🧠 Smart Recommendations</p>
                        <div className="space-y-1 text-xs text-blue-700">
                          <p>• <strong>Coverage:</strong> Shows % of your symptoms treated</p>
                          <p>• <strong>Severity-based:</strong> Mild → Affordable, Severe → Stronger</p>
                          <p>• <strong>Multi-symptom:</strong> Prefers medicines covering multiple symptoms</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={handleFindMedicines}
                    disabled={(selectedSymptoms.length === 0 && customSymptoms.length === 0) || isLoading}
                    className="w-full mt-4 h-11 sm:h-10 transition-all duration-200 hover:shadow-md"
                    size="lg"
                  >
                    {isLoading ? "Finding Medicines..." : "Find Medicines"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-xs">1</span>
                  </div>
                  <p>Select your symptoms from the list or add custom ones</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-xs">2</span>
                  </div>
                  <p>Get personalized OTC medicine recommendations</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-xs">3</span>
                  </div>
                  <p>View detailed information including dosage and side effects</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Message */}
        {apiMessage && (
          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{apiMessage}</AlertDescription>
          </Alert>
        )}

        {/* Tabs for Recommendations and Browse All Medicines */}
        <div className="mt-6 lg:mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-auto p-1 bg-gray-100 rounded-lg">
              <TabsTrigger 
                value="recommendations" 
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Recommendations</span>
                {recommendations.length > 0 && (
                  <Badge variant="secondary" className="text-xs">{recommendations.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="browse" 
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Browse All</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="mt-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Medicines</h3>
                <MedicineGrid 
                  medicines={recommendations.map(rec => ({
                    ...rec,
                    symptomCount: rec.symptomMatches.length,
                    coveragePercentage: rec.coveragePercentage,
                    severityAdjustedScore: rec.severityAdjustedScore,
                    priceScore: rec.priceScore
                  }))} 
                  onMedicineClick={handleMedicineClick}
                />
              </div>
            </TabsContent>

            <TabsContent value="browse" className="mt-6">
              <div className="flex flex-col gap-6">
                {/* Filters Sidebar */}
                <div className="w-full">
                  {isMounted ? (
                    <MedicineFilter
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                      symptoms={symptoms}
                      medicines={allMedicines}
                    />
                  ) : (
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  )}
                </div>

                {/* Medicine Grid */}
                <div className="w-full">
                  <MedicineGrid
                    medicines={filteredMedicines.map(med => {
                      // Calculate average effectiveness from symptom mappings
                      const avgEffectiveness = med.symptomMappings.length > 0 
                        ? med.symptomMappings.reduce((sum, mapping) => sum + mapping.effectivenessScore, 0) / med.symptomMappings.length
                        : 0;
                      
                      // Get symptom names from mappings
                      const symptomNames = med.symptomMappings.map(mapping => {
                        const symptom = symptoms.find(s => s.id === mapping.symptomId);
                        return symptom?.name || mapping.symptomId;
                      });
                      
                      return {
                        id: med.id,
                        brandName: med.brandName,
                        genericName: med.genericName,
                        description: med.description,
                        usage: med.usage,
                        dosageAdult: med.dosageAdult,
                        dosageChild: med.dosageChild,
                        dosageElderly: med.dosageElderly,
                        sideEffects: med.sideEffects,
                        warnings: med.warnings,
                        priceRange: med.priceRange,
                        category: med.category,
                        drugClass: med.drugClass,
                        prescription: med.prescription,
                        controlled: med.controlled,
                        averageEffectiveness: avgEffectiveness,
                        symptomCount: med.symptomMappings.length,
                        symptoms: symptomNames
                      };
                    })}
                    isLoading={false}
                    onMedicineClick={handleMedicineClick}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important Disclaimer:</strong> This tool provides informational guidance only and is not a substitute 
            for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider 
            if your symptoms persist, worsen, or if you have concerns about your health. In case of emergency, 
            seek immediate medical attention.
          </AlertDescription>
        </Alert>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">© 2024 SymptomMed Ghana. Providing reliable health information for Ghanaians.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}