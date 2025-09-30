"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Pill, AlertTriangle, Shield } from "lucide-react"

interface MedicineCardProps {
  id: string
  brandName: string
  genericName: string
  description: string
  priceRange?: string
  category?: string
  prescription: boolean
  controlled: boolean
  averageEffectiveness?: number
  symptomCount?: number
  coveragePercentage?: number
  onClick?: () => void
}

export default function MedicineCard({
  id,
  brandName,
  genericName,
  description,
  priceRange,
  category,
  prescription,
  controlled,
  averageEffectiveness,
  symptomCount,
  coveragePercentage,
  onClick
}: MedicineCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-green-600" />
            <div>
              <CardTitle className="text-lg">{brandName}</CardTitle>
              <CardDescription className="text-sm">{genericName}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {prescription && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Shield className="w-3 h-3" />
                Rx
              </Badge>
            )}
            {controlled && (
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <AlertTriangle className="w-3 h-3" />
                Controlled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {category && (
            <Badge variant="secondary" className={`text-xs ${getCategoryColor(category)}`}>
              {category}
            </Badge>
          )}
          {priceRange && (
            <Badge variant="outline" className="text-xs">
              {priceRange}
            </Badge>
          )}
        </div>

        {averageEffectiveness && (
          <div className="mb-3">
            {getEffectivenessStars(averageEffectiveness)}
          </div>
        )}

        {(symptomCount || coveragePercentage) && (
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            {symptomCount && (
              <span>Treats {symptomCount} symptom{symptomCount > 1 ? 's' : ''}</span>
            )}
            {coveragePercentage && (
              <span>{coveragePercentage}% coverage</span>
            )}
          </div>
        )}

        <Button className="w-full" variant="outline">
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}