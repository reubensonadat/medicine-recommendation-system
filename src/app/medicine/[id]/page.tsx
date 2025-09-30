"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Star, 
  AlertTriangle, 
  ArrowLeft, 
  Pill, 
  Package, 
  Clock, 
  Heart, 
  Shield, 
  Info,
  User,
  Baby,
  Users,
  DollarSign,
  Thermometer,
  Activity,
  Zap
} from "lucide-react"

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

interface SymptomData {
  id: string
  name: string
  description: string
  category: string
  severity: string
}

export default function MedicineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const medicineId = params.id as string
  
  const [medicine, setMedicine] = useState<MedicineData | null>(null)
  const [symptoms, setSymptoms] = useState<SymptomData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load medicines data
        const medicinesResponse = await fetch('/medicines.json')
        if (!medicinesResponse.ok) {
          throw new Error('Failed to load medicines data')
        }
        const medicinesData = await medicinesResponse.json()
        
        // Find the specific medicine
        const foundMedicine = medicinesData.medicines.find((m: MedicineData) => m.id === medicineId)
        
        if (!foundMedicine) {
          setError('Medicine not found')
          return
        }
        
        setMedicine(foundMedicine)
        
        // Load symptoms data
        const symptomsResponse = await fetch('/symptoms.json')
        if (!symptomsResponse.ok) {
          throw new Error('Failed to load symptoms data')
        }
        const symptomsData = await symptomsResponse.json()
        setSymptoms(symptomsData.symptoms)
        
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load medicine details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (medicineId) {
      loadData()
    }
  }, [medicineId])

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
        <span className="text-sm text-gray-600 ml-1">({score}/10)</span>
      </div>
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

  const getSymptomName = (symptomId: string) => {
    const symptom = symptoms.find(s => s.id === symptomId)
    return symptom ? symptom.name : symptomId
  }

  const getSymptomDetails = (symptomId: string) => {
    return symptoms.find(s => s.id === symptomId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error || 'Medicine not found'}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {medicine.brandName}
                  </h1>
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
                
                <p className="text-lg text-gray-600 mb-3">
                  {medicine.genericName}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {medicine.category && (
                    <Badge variant="secondary" className={`${getCategoryColor(medicine.category)}`}>
                      {medicine.category}
                    </Badge>
                  )}
                  {medicine.drugClass && (
                    <Badge variant="outline" className="text-xs">
                      {medicine.drugClass}
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {medicine.description}
                </p>
              </div>
              
              {medicine.priceRange && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-green-800 font-medium">Price Range</p>
                  <p className="text-lg font-bold text-green-900">{medicine.priceRange}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dosage">Dosage</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Primary Use</h4>
                  <p className="text-gray-700">{medicine.usage}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Drug Class</h4>
                  <p className="text-gray-700">{medicine.drugClass || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                  <p className="text-gray-700">{medicine.category || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dosage" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {medicine.dosageAdult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="w-4 h-4" />
                      Adult Dosage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{medicine.dosageAdult}</p>
                  </CardContent>
                </Card>
              )}
              
              {medicine.dosageChild && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Baby className="w-4 h-4" />
                      Child Dosage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{medicine.dosageChild}</p>
                  </CardContent>
                </Card>
              )}
              
              {medicine.dosageElderly && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="w-4 h-4" />
                      Elderly Dosage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{medicine.dosageElderly}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Symptoms This Medicine Treats
                </CardTitle>
                <CardDescription>
                  Based on clinical evidence and effectiveness ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicine.symptomMappings.map((mapping, index) => {
                    const symptomDetails = getSymptomDetails(mapping.symptomId)
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {getSymptomName(mapping.symptomId)}
                              </h4>
                              {mapping.isPrimary && (
                                <Badge variant="default" className="text-xs">
                                  Primary
                                </Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getSeverityColor(symptomDetails?.severity || 'Moderate')}`}
                              >
                                {symptomDetails?.severity || 'Moderate'}
                              </Badge>
                            </div>
                            
                            {symptomDetails?.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {symptomDetails.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-700">
                                <strong>Effectiveness:</strong>
                              </span>
                              {getEffectivenessStars(mapping.effectivenessScore)}
                            </div>
                            
                            {mapping.evidenceLevel && (
                              <p className="text-xs text-gray-500 mt-1">
                                <strong>Evidence Level:</strong> {mapping.evidenceLevel}
                              </p>
                            )}
                            
                            {mapping.notes && (
                              <p className="text-xs text-gray-500 mt-1">
                                <strong>Notes:</strong> {mapping.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-500">
                              {symptomDetails?.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div className="grid gap-6">
              {medicine.sideEffects && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      Side Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{medicine.sideEffects}</p>
                  </CardContent>
                </Card>
              )}
              
              {medicine.warnings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <Shield className="w-5 h-5" />
                      Important Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{medicine.warnings}</p>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    General Safety Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prescription Status</h4>
                    <p className="text-gray-700">
                      {medicine.prescription 
                        ? "This medicine requires a prescription from a healthcare provider."
                        : "This medicine is available over-the-counter without a prescription."
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Controlled Status</h4>
                    <p className="text-gray-700">
                      {medicine.controlled 
                        ? "This is a controlled substance with potential for abuse and dependence."
                        : "This is not a controlled substance."
                      }
                    </p>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Always consult with a healthcare professional before starting any new medication. 
                      This information is for educational purposes only and should not replace medical advice.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}