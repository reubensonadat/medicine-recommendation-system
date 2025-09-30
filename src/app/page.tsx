// src/app/medicine/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Pill, 
  AlertTriangle, 
  Star, 
  CheckCircle, 
  XCircle, 
  Info,
  Heart,
  Share2,
  Download,
  Calendar,
  User,
  Shield,
  Clock
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

// Add this function to generate static params for static export
export async function generateStaticParams() {
  // In a real app, you would fetch this from your API or database
  // For now, we'll return a few common medicine IDs to pre-build
  return [
    { id: 'med001' },
    { id: 'med002' },
    { id: 'med003' },
    { id: 'med004' },
    { id: 'med005' },
    { id: 'med006' },
    { id: 'med007' },
    { id: 'med008' },
    { id: 'med009' },
    { id: 'med010' }
  ]
}

export default function MedicineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [medicine, setMedicine] = useState<MedicineData | null>(null)
  const [symptoms, setSymptoms] = useState<SymptomData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMedicineData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load medicines data
        const medicinesResponse = await fetch('/medicines.json')
        if (!medicinesResponse.ok) {
          throw new Error('Failed to load medicines data')
        }
        const medicinesData = await medicinesResponse.json()
        
        // Find the specific medicine
        const foundMedicine = medicinesData.medicines.find((m: MedicineData) => m.id === params.id)
        
        if (!foundMedicine) {
          setError('Medicine not found')
          return
        }

        setMedicine(foundMedicine)

        // Load symptoms data
        const symptomsData: SymptomData[] = [
          { id: "cough", name: "Cough", description: "Dry or productive cough", category: "Respiratory", severity: "Moderate" },
          { id: "fever", name: "Fever", description: "Elevated body temperature above 38°C", category: "Systemic", severity: "Moderate" },
          { id: "headache", name: "Headache", description: "Pain in head or neck region", category: "Neurological", severity: "Mild" },
          { id: "sore-throat", name: "Sore Throat", description: "Pain or irritation in throat", category: "Respiratory", severity: "Mild" },
          { id: "runny-nose", name: "Runny Nose", description: "Nasal discharge or congestion", category: "Respiratory", severity: "Mild" },
          { id: "body-aches", name: "Body Aches", description: "Muscle or joint pain", category: "Musculoskeletal", severity: "Moderate" },
          { id: "shortness-breath", name: "Shortness of Breath", description: "Difficulty breathing or breathlessness", category: "Respiratory", severity: "Severe" },
          { id: "wheezing", name: "Wheezing", description: "High-pitched whistling sound when breathing", category: "Respiratory", severity: "Moderate" },
          { id: "chest-pain", name: "Chest Pain", description: "Pain or discomfort in chest area", category: "Cardiovascular", severity: "Severe" },
          { id: "nausea", name: "Nausea", description: "Feeling sick to stomach", category: "Gastrointestinal", severity: "Mild" },
          { id: "vomiting", name: "Vomiting", description: "Forceful expulsion of stomach contents", category: "Gastrointestinal", severity: "Moderate" },
          { id: "diarrhea", name: "Diarrhea", description: "Frequent loose or liquid bowel movements", category: "Gastrointestinal", severity: "Moderate" },
          { id: "abdominal-pain", name: "Abdominal Pain", description: "Pain in stomach area", category: "Gastrointestinal", severity: "Moderate" },
          { id: "fatigue", name: "Fatigue", description: "Feeling tired or exhausted", category: "Systemic", severity: "Mild" },
          { id: "chills", name: "Chills", description: "Feeling cold with shivering", category: "Systemic", severity: "Moderate" },
          { id: "sneezing", name: "Sneezing", description: "Involuntary expulsion of air from nose", category: "Respiratory", severity: "Mild" },
          { id: "itchy-eyes", name: "Itchy Eyes", description: "Itching sensation in eyes", category: "Ocular", severity: "Mild" },
          { id: "skin-rash", name: "Skin Rash", description: "Redness or irritation of skin", category: "Dermatological", severity: "Mild" },
          { id: "dizziness", name: "Dizziness", description: "Feeling lightheaded or unsteady", category: "Neurological", severity: "Moderate" },
          { id: "joint-pain", name: "Joint Pain", description: "Pain in joints", category: "Musculoskeletal", severity: "Moderate" },
          { id: "muscle-pain", name: "Muscle Pain", description: "Pain in muscles", category: "Musculoskeletal", severity: "Moderate" },
          { id: "back-pain", name: "Back Pain", description: "Pain in back area", category: "Musculoskeletal", severity: "Moderate" },
          { id: "difficulty-sleeping", name: "Difficulty Sleeping", description: "Trouble falling or staying asleep", category: "Neurological", severity: "Mild" },
          { id: "anxiety", name: "Anxiety", description: "Feeling of worry or nervousness", category: "Psychological", severity: "Moderate" },
          { id: "high-blood-pressure", name: "High Blood Pressure", description: "Elevated blood pressure readings", category: "Cardiovascular", severity: "Severe" },
          { id: "frequent-urination", name: "Frequent Urination", description: "Needing to urinate more often than usual", category: "Renal", severity: "Mild" },
          { id: "excessive-thirst", name: "Excessive Thirst", description: "Increased thirst and fluid intake", category: "Systemic", severity: "Moderate" },
          { id: "weight-loss", name: "Unexplained Weight Loss", description: "Losing weight without trying", category: "Systemic", severity: "Moderate" },
          { id: "blurred-vision", name: "Blurred Vision", description: "Unclear or fuzzy vision", category: "Ocular", severity: "Moderate" }
        ]

        setSymptoms(symptomsData)

      } catch (err) {
        console.error('Error loading medicine data:', err)
        setError('Failed to load medicine information')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadMedicineData()
    }
  }, [params.id])

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

  const getEvidenceColor = (level?: string) => {
    switch (level) {
      case 'Strong': return 'bg-green-100 text-green-800 border-green-200'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Limited': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Theoretical': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Anecdotal': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medicine information...</p>
        </div>
      </div>
    )
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Medicine Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The medicine you are looking for does not exist.'}</p>
          <Button onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Pill className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SymptomMed Ghana</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Medicine Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medicine Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl text-gray-900 mb-2">
                      {medicine.brandName}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      {medicine.genericName}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {medicine.prescription && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Prescription
                      </Badge>
                    )}
                    {medicine.controlled && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Controlled
                      </Badge>
                    )}
                    {medicine.category && (
                      <Badge className={getCategoryColor(medicine.category)}>
                        {medicine.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{medicine.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {medicine.priceRange && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Price Range:</span>
                      <span className="text-sm font-semibold text-green-600">{medicine.priceRange}</span>
                    </div>
                  )}
                  {medicine.drugClass && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Drug Class:</span>
                      <span className="text-sm font-semibold">{medicine.drugClass}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="dosage">Dosage</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Usage Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{medicine.usage}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dosage" className="space-y-4">
                {medicine.dosageAdult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Adult Dosage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{medicine.dosageAdult}</p>
                    </CardContent>
                  </Card>
                )}

                {medicine.dosageChild && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Child Dosage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{medicine.dosageChild}</p>
                    </CardContent>
                  </Card>
                )}

                {medicine.dosageElderly && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Elderly Dosage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{medicine.dosageElderly}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="symptoms" className="space-y-4">
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
                        const symptom = symptoms.find(s => s.id === mapping.symptomId)
                        return (
                          <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{symptom?.name || mapping.symptomId}</h4>
                                {mapping.isPrimary && (
                                  <Badge variant="default" className="text-xs">
                                    Primary
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{symptom?.description}</p>
                              {mapping.notes && (
                                <p className="text-sm text-gray-500 italic">{mapping.notes}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              {getEffectivenessStars(mapping.effectivenessScore)}
                              {mapping.evidenceLevel && (
                                <Badge variant="outline" className={`text-xs ${getEvidenceColor(mapping.evidenceLevel)}`}>
                                  {mapping.evidenceLevel}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="space-y-4">
                {medicine.sideEffects && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
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
                      <CardTitle className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {medicine.warnings.split('. ').map((warning, index) => (
                          warning.trim() && (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">{warning}.</p>
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Find Nearby Pharmacies
                </Button>
                <Button className="w-full" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
                <Button className="w-full" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Related Information */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Consult Healthcare Provider</h4>
                    <p className="text-sm text-gray-600">
                      Always consult with a healthcare professional before starting any medication.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Read Instructions Carefully</h4>
                    <p className="text-sm text-gray-600">
                      Follow the dosage instructions and warnings provided with the medication.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Store Properly</h4>
                    <p className="text-sm text-gray-600">
                      Keep medications in a cool, dry place away from children.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">If you experience severe reactions:</p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 font-medium">Emergency: 193</p>
                    <p className="text-red-700 text-sm">Ghana National Ambulance Service</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
            for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician 
            or other qualified health provider with any questions you may have regarding a medical condition.
          </AlertDescription>
        </Alert>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">© 2024 SymptomMed Ghana. Providing reliable health information for Ghanaians.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}