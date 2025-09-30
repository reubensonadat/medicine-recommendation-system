"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Pill, Package, DollarSign, AlertTriangle, ArrowRight } from "lucide-react"

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
  averageEffectiveness?: number
  symptomCount?: number
  symptoms?: string[]
  coveragePercentage?: number
  severityAdjustedScore?: number
  priceScore?: number
}

interface MedicineGridProps {
  medicines: MedicineData[]
  isLoading?: boolean
  onMedicineClick: (medicine: MedicineData) => void
}

export default function MedicineGrid({ medicines, isLoading = false, onMedicineClick }: MedicineGridProps) {
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
      case 'Pain Relief': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Antimalarial': return 'bg-green-100 text-green-800 border-green-200'
      case 'Vitamins & Supplements': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Antibiotics': return 'bg-red-100 text-red-800 border-red-200'
      case 'Allergy': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Cold & Flu': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Digestive Health': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Antiparasitic': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medicines.map((medicine) => (
        <Card key={medicine.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{medicine.brandName}</CardTitle>
                <CardDescription className="text-sm">{medicine.genericName}</CardDescription>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {medicine.prescription && (
                  <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200 text-xs">
                    Rx
                  </Badge>
                )}
                {medicine.controlled && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200 text-xs">
                    Controlled
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{medicine.description}</p>
            
            <div className="mb-4">
              {medicine.category && (
                <Badge variant="secondary" className={`mr-2 mb-1 ${getCategoryColor(medicine.category)}`}>
                  {medicine.category}
                </Badge>
              )}
              {medicine.drugClass && (
                <Badge variant="outline" className="mr-2 mb-1 text-xs">
                  {medicine.drugClass}
                </Badge>
              )}
            </div>

            {medicine.averageEffectiveness && (
              <div className="mb-4">
                {getEffectivenessStars(medicine.averageEffectiveness)}
              </div>
            )}

            {medicine.symptomCount !== undefined && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Package className="h-4 w-4 mr-1" />
                Treats {medicine.symptomCount} symptom{medicine.symptomCount !== 1 ? 's' : ''}
              </div>
            )}

            {medicine.coveragePercentage !== undefined && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${medicine.coveragePercentage}%` }}
                  ></div>
                </div>
                <span>{medicine.coveragePercentage}% match</span>
              </div>
            )}

            {medicine.priceRange && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <DollarSign className="h-4 w-4 mr-1" />
                {medicine.priceRange}
              </div>
            )}

            <div className="mt-auto pt-4 border-t">
              <Button 
                onClick={() => onMedicineClick(medicine)}
                className="w-full"
              >
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}