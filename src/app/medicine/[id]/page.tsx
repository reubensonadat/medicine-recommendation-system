"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Pill, AlertTriangle, Star, Package, DollarSign, Shield, Info } from "lucide-react"

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

interface Symptom {
  id: string
  name: string
  description?: string
  category?: string
  severity?: string
}

export default function MedicineDetails() {
  const params = useParams()
  const router = useRouter()
  const medicineId = params.id as string
  const [medicine, setMedicine] = useState<MedicineData | null>(null)
  const [symptoms, setSymptoms] = useState<Record<string, Symptom>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMedicineData = async () => {
      try {
        // Load medicines data
        const medicinesResponse = await fetch('/medicines.json')
        const medicinesData = await medicinesResponse.json()
        
        // Find the medicine with the matching ID
        const foundMedicine = medicinesData.medicines.find((m: MedicineData) => m.id === medicineId)
        
        if (!foundMedicine) {
          setError("Medicine not found")
          setIsLoading(false)
          return
        }
        
        setMedicine(foundMedicine)
        
        // Load symptoms data
        try {
          // We need to extract symptoms from the main page or create a separate endpoint
          // For now, let's create a basic mapping from the symptom IDs
          const commonSymptoms: Record<string, Symptom> = {
            "cough": { id: "cough", name: "Cough", description: "Dry or productive cough", category: "Respiratory", severity: "Moderate" },
            "fever": { id: "fever", name: "Fever", description: "Elevated body temperature above 38°C", category: "Systemic", severity: "Moderate" },
            "headache": { id: "headache", name: "Headache", description: "Pain in head or neck region", category: "Neurological", severity: "Mild" },
            "sore-throat": { id: "sore-throat", name: "Sore Throat", description: "Pain or irritation in throat", category: "Respiratory", severity: "Mild" },
            "runny-nose": { id: "runny-nose", name: "Runny Nose", description: "Nasal discharge or congestion", category: "Respiratory", severity: "Mild" },
            "body-aches": { id: "body-aches", name: "Body Aches", description: "Muscle or joint pain", category: "Musculoskeletal", severity: "Moderate" },
            "shortness-breath": { id: "shortness-breath", name: "Shortness of Breath", description: "Difficulty breathing or breathlessness", category: "Respiratory", severity: "Severe" },
            "wheezing": { id: "wheezing", name: "Wheezing", description: "High-pitched whistling sound when breathing", category: "Respiratory", severity: "Moderate" },
            "chest-pain": { id: "chest-pain", name: "Chest Pain", description: "Pain or discomfort in chest area", category: "Cardiovascular", severity: "Severe" },
            "nausea": { id: "nausea", name: "Nausea", description: "Feeling sick to stomach", category: "Gastrointestinal", severity: "Mild" },
            "vomiting": { id: "vomiting", name: "Vomiting", description: "Forceful expulsion of stomach contents", category: "Gastrointestinal", severity: "Moderate" },
            "diarrhea": { id: "diarrhea", name: "Diarrhea", description: "Frequent loose or liquid bowel movements", category: "Gastrointestinal", severity: "Moderate" },
            "abdominal-pain": { id: "abdominal-pain", name: "Abdominal Pain", description: "Pain in stomach area", category: "Gastrointestinal", severity: "Moderate" },
            "fatigue": { id: "fatigue", name: "Fatigue", description: "Feeling tired or exhausted", category: "Systemic", severity: "Mild" },
            "chills": { id: "chills", name: "Chills", description: "Feeling cold with shivering", category: "Systemic", severity: "Moderate" },
            "sneezing": { id: "sneezing", name: "Sneezing", description: "Involuntary expulsion of air from nose", category: "Respiratory", severity: "Mild" },
            "itchy-eyes": { id: "itchy-eyes", name: "Itchy Eyes", description: "Itching sensation in eyes", category: "Ocular", severity: "Mild" },
            "skin-rash": { id: "skin-rash", name: "Skin Rash", description: "Redness or irritation of skin", category: "Dermatological", severity: "Mild" },
            "dizziness": { id: "dizziness", name: "Dizziness", description: "Feeling lightheaded or unsteady", category: "Neurological", severity: "Moderate" },
            "joint-pain": { id: "joint-pain", name: "Joint Pain", description: "Pain in joints", category: "Musculoskeletal", severity: "Moderate" },
            "muscle-pain": { id: "muscle-pain", name: "Muscle Pain", description: "Pain in muscles", category: "Musculoskeletal", severity: "Moderate" },
            "back-pain": { id: "back-pain", name: "Back Pain", description: "Pain in back area", category: "Musculoskeletal", severity: "Moderate" },
            "difficulty-sleeping": { id: "difficulty-sleeping", name: "Difficulty Sleeping", description: "Trouble falling or staying asleep", category: "Neurological", severity: "Mild" },
            "anxiety": { id: "anxiety", name: "Anxiety", description: "Feeling of worry or nervousness", category: "Psychological", severity: "Moderate" },
            "high-blood-pressure": { id: "high-blood-pressure", name: "High Blood Pressure", description: "Elevated blood pressure readings", category: "Cardiovascular", severity: "Severe" },
            "frequent-urination": { id: "frequent-urination", name: "Frequent Urination", description: "Needing to urinate more often than usual", category: "Renal", severity: "Mild" },
            "excessive-thirst": { id: "excessive-thirst", name: "Excessive Thirst", description: "Increased thirst and fluid intake", category: "Systemic", severity: "Moderate" },
            "weight-loss": { id: "weight-loss", name: "Unexplained Weight Loss", description: "Losing weight without trying", category: "Systemic", severity: "Moderate" },
            "blurred-vision": { id: "blurred-vision", name: "Blurred Vision", description: "Unclear or fuzzy vision", category: "Ocular", severity: "Moderate" }
          }
          
          setSymptoms(commonSymptoms)
        } catch (error) {
          console.error('Error loading symptoms:', error)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading medicine data:', error)
        setError("Failed to load medicine data")
        setIsLoading(false)
      }
    }

    loadMedicineData()
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading medicine details...</p>
        </div>
      </div>
    )
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Medicine not found"}</p>
          <Button onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Pill className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SymptomMed Ghana</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Sign In</Button>
              <Button size="sm" className="text-xs sm:text-sm">Create Account</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medicine Overview */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-2xl">{medicine.brandName}</CardTitle>
                    <CardDescription className="text-lg">{medicine.genericName}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    {medicine.prescription && (
                      <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                        Prescription
                      </Badge>
                    )}
                    {medicine.controlled && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                        Controlled
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{medicine.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                    <Badge variant="secondary" className="mr-2">
                      {medicine.category || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Drug Class</h4>
                    <Badge variant="secondary" className="mr-2">
                      {medicine.drugClass || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Price Range</h4>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      <span>{medicine.priceRange || "Not specified"}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Primary Use</h4>
                  <p className="text-blue-800">{medicine.usage}</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="dosage" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dosage">Dosage</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="info">More Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dosage" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Dosage Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {medicine.dosageAdult && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Adult Dosage</h4>
                        <p className="text-gray-700">{medicine.dosageAdult}</p>
                      </div>
                    )}
                    {medicine.dosageChild && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Child Dosage</h4>
                        <p className="text-gray-700">{medicine.dosageChild}</p>
                      </div>
                    )}
                    {medicine.dosageElderly && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Elderly Dosage</h4>
                        <p className="text-gray-700">{medicine.dosageElderly}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="symptoms" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Treated Symptoms</CardTitle>
                    <CardDescription>
                      This medicine is effective for the following symptoms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {medicine.symptomMappings.map((mapping, index) => {
                        const symptom = symptoms[mapping.symptomId]
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {symptom?.name || mapping.symptomId}
                              </h4>
                              <div className="flex items-center space-x-2">
                                {mapping.isPrimary && (
                                  <Badge variant="default" className="text-xs">
                                    Primary
                                  </Badge>
                                )}
                                {getEffectivenessStars(mapping.effectivenessScore)}
                              </div>
                            </div>
                            {symptom?.description && (
                              <p className="text-sm text-gray-600 mb-2">{symptom.description}</p>
                            )}
                            {mapping.evidenceLevel && (
                              <div className="flex items-center mb-2">
                                <Badge variant="outline" className="text-xs mr-2">
                                  Evidence: {mapping.evidenceLevel}
                                </Badge>
                                {symptom?.category && (
                                  <Badge variant="outline" className={`text-xs ${getCategoryColor(symptom.category)}`}>
                                    {symptom.category}
                                  </Badge>
                                )}
                              </div>
                            )}
                            {mapping.notes && (
                              <p className="text-sm text-gray-700 italic">{mapping.notes}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="safety" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Safety Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {medicine.sideEffects && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Side Effects</h4>
                        <p className="text-gray-700">{medicine.sideEffects}</p>
                      </div>
                    )}
                    {medicine.warnings && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Warnings</h4>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-red-800">{medicine.warnings}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Medicine ID</h4>
                        <p className="text-gray-700">{medicine.id}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Prescription Required</h4>
                        <p className="text-gray-700">{medicine.prescription ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Controlled Substance</h4>
                        <p className="text-gray-700">{medicine.controlled ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  Find Similar Medicines
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Favorites
                </Button>
                <Button variant="outline" className="w-full">
                  Print Information
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before taking any medication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
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