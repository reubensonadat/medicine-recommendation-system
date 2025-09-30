"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, AlertTriangle, Search, Pill, Package, Clock } from "lucide-react"

interface Medicine {
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
  symptomCount: number
  symptoms: string[]
  coveragePercentage?: number
  severityAdjustedScore?: number
  priceScore?: number
}

interface MedicineGridProps {
  medicines: Medicine[]
  isLoading?: boolean
  onMedicineClick?: (medicine: Medicine) => void
}

export default function MedicineGrid({ 
  medicines, 
  isLoading = false, 
  onMedicineClick 
}: MedicineGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedicines = medicines.filter(medicine =>
    medicine.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const getCoverageBadge = (coveragePercentage?: number) => {
    if (!coveragePercentage) return null
    
    let color = ""
    if (coveragePercentage >= 80) color = "bg-green-100 text-green-800 border-green-200"
    else if (coveragePercentage >= 60) color = "bg-yellow-100 text-yellow-800 border-yellow-200"
    else color = "bg-red-100 text-red-800 border-red-200"
    
    return (
      <Badge variant="outline" className={`text-xs ${color}`}>
        {coveragePercentage}% coverage
      </Badge>
    )
  }

  const getPriceValue = (priceRange?: string) => {
    if (!priceRange) return 5
    const match = priceRange.match(/(\d+)/)
    return match ? parseInt(match[1]) : 50
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Antibiotic': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pain Relief': return 'bg-green-100 text-green-800 border-green-200'
      case 'Antimalarial': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Antihistamine': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Anti-inflammatory': return 'bg-red-100 text-red-800 border-red-200'
      case 'Antifungal': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Antiviral': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Antidiabetic': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Antihypertensive': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Digestive': return 'bg-teal-100 text-teal-800 border-teal-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (medicines.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No medicines found matching your criteria. Try adjusting your filters.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-4 border-b">
        <p className="text-sm text-gray-600">
          Showing {filteredMedicines.length} of {medicines.length} medicines
        </p>
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {medicines.length} total medicines
          </span>
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
        {filteredMedicines.map((medicine) => (
          <Card 
            key={medicine.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onMedicineClick?.(medicine)}
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg font-semibold mb-1 truncate">
                    {medicine.brandName}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {medicine.genericName}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-1 justify-end sm:justify-start sm:flex-col sm:items-end">
                  {medicine.prescription && (
                    <Badge variant="destructive" className="text-xs">
                      Rx
                    </Badge>
                  )}
                  {medicine.controlled && (
                    <Badge variant="outline" className="text-xs border-red-200 text-red-800">
                      Controlled
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Category and Effectiveness */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2">
                <div className="flex flex-wrap gap-1">
                  {medicine.category && (
                    <Badge variant="secondary" className={`text-xs ${getCategoryColor(medicine.category)} self-start`}>
                      {medicine.category}
                    </Badge>
                  )}
                  {getCoverageBadge(medicine.coveragePercentage)}
                </div>
                <div className="text-xs">
                  {getEffectivenessStars(medicine.averageEffectiveness)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                {medicine.description}
              </p>
              
              {/* Key Info */}
              <div className="space-y-1 md:space-y-2 mb-3">
                <div className="flex items-center text-xs text-gray-500">
                  <Pill className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{medicine.symptomCount} symptom{medicine.symptomCount !== 1 ? 's' : ''} covered</span>
                </div>
                
                {medicine.coveragePercentage && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="font-medium flex-shrink-0">Coverage:</span>
                    <span className="ml-1 truncate">{medicine.coveragePercentage}% of your symptoms</span>
                  </div>
                )}
                
                {medicine.priceRange && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="font-medium flex-shrink-0">Price:</span>
                    <span className="ml-1 truncate">{medicine.priceRange}</span>
                  </div>
                )}
                
                {medicine.drugClass && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="font-medium flex-shrink-0">Class:</span>
                    <span className="ml-1 truncate">{medicine.drugClass}</span>
                  </div>
                )}
              </div>
              
              {/* Top Symptoms */}
              {medicine.symptoms.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Common symptoms:</p>
                  <div className="flex flex-wrap gap-1">
                    {medicine.symptoms.slice(0, 2).map((symptom, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                    {medicine.symptoms.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{medicine.symptoms.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Coverage Details */}
              {medicine.coveragePercentage && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-1">Match Quality:</p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Symptom Coverage</span>
                    <span className="font-medium">{medicine.coveragePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${
                        medicine.coveragePercentage >= 80 ? 'bg-green-500' :
                        medicine.coveragePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${medicine.coveragePercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  onMedicineClick?.(medicine)
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}