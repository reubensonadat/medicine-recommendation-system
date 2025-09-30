"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Pill, 
  Stethoscope, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  BarChart3,
  Users,
  Activity
} from "lucide-react"

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
  isActive: boolean
  createdAt: string
}

interface Symptom {
  id: string
  name: string
  description?: string
  createdAt: string
}

export default function AdminDashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls
    const mockMedicines: Medicine[] = [
      {
        id: "1",
        brandName: "Panadol",
        genericName: "Paracetamol",
        description: "Pain reliever and fever reducer",
        usage: "For relief of mild to moderate pain and fever",
        dosageAdult: "1-2 tablets every 4-6 hours",
        dosageChild: "Consult doctor for children under 12",
        sideEffects: "Rare when used as directed",
        warnings: "Do not take with other paracetamol products",
        priceRange: "GHS 5-15",
        category: "Pain Relief",
        isActive: true,
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        brandName: "Mentholix",
        genericName: "Menthol + Dextromethorphan",
        description: "Cough syrup with menthol flavor",
        usage: "For relief of cough and cold symptoms",
        dosageAdult: "10ml every 6-8 hours",
        sideEffects: "Drowsiness, dizziness",
        warnings: "May cause drowsiness",
        priceRange: "GHS 20-25",
        category: "Cough Syrup",
        isActive: true,
        createdAt: "2024-01-16"
      }
    ]

    const mockSymptoms: Symptom[] = [
      { id: "1", name: "Cough", description: "Dry or productive cough", createdAt: "2024-01-15" },
      { id: "2", name: "Fever", description: "Elevated body temperature", createdAt: "2024-01-15" },
      { id: "3", name: "Headache", description: "Pain in head or neck", createdAt: "2024-01-15" },
      { id: "4", name: "Sore Throat", description: "Pain or irritation in throat", createdAt: "2024-01-16" }
    ]

    setMedicines(mockMedicines)
    setSymptoms(mockSymptoms)
    setIsLoading(false)
  }, [])

  const stats = {
    totalMedicines: medicines.length,
    activeMedicines: medicines.filter(m => m.isActive).length,
    totalSymptoms: symptoms.length,
    totalUsers: 1234 // Mock data
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Admin User</Button>
              <Button>Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMedicines}</div>
                  <p className="text-xs text-muted-foreground">In database</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Medicines</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeMedicines}</div>
                  <p className="text-xs text-muted-foreground">Currently available</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Symptoms</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSymptoms}</div>
                  <p className="text-xs text-muted-foreground">In database</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Medicines</CardTitle>
                  <CardDescription>Latest medicines added to the database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medicines.slice(0, 5).map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{medicine.brandName}</h4>
                          <p className="text-sm text-gray-600">{medicine.genericName}</p>
                        </div>
                        <Badge variant={medicine.isActive ? "default" : "secondary"}>
                          {medicine.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Symptoms</CardTitle>
                  <CardDescription>Latest symptoms added to the database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {symptoms.slice(0, 5).map((symptom) => (
                      <div key={symptom.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{symptom.name}</h4>
                          <p className="text-sm text-gray-600">{symptom.description}</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medicines Tab */}
          <TabsContent value="medicines" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Medicines Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Medicines</CardTitle>
                <CardDescription>Manage medicines in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medicines.map((medicine) => (
                    <div key={medicine.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{medicine.brandName}</h3>
                          <Badge variant="outline">{medicine.genericName}</Badge>
                          <Badge variant={medicine.isActive ? "default" : "secondary"}>
                            {medicine.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{medicine.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          {medicine.category && (
                            <Badge variant="secondary" className="text-xs">{medicine.category}</Badge>
                          )}
                          {medicine.priceRange && (
                            <span className="text-xs text-gray-500">{medicine.priceRange}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Symptoms Tab */}
          <TabsContent value="symptoms" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Symptoms Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Symptom
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Symptoms</CardTitle>
                <CardDescription>Manage symptoms in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {symptoms.map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{symptom.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{symptom.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Added: {symptom.createdAt}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Most Searched Symptoms</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Headache</span>
                      <Badge variant="outline">245 searches</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fever</span>
                      <Badge variant="outline">198 searches</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cough</span>
                      <Badge variant="outline">176 searches</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Body Aches</span>
                      <Badge variant="outline">134 searches</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sore Throat</span>
                      <Badge variant="outline">98 searches</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Medicines</CardTitle>
                  <CardDescription>Most viewed medicines this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Panadol</span>
                      <Badge variant="outline">423 views</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mentholix</span>
                      <Badge variant="outline">387 views</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ibuprofen</span>
                      <Badge variant="outline">298 views</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Benylin</span>
                      <Badge variant="outline">267 views</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Strepsils</span>
                      <Badge variant="outline">234 views</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Recent user activity and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">89</div>
                    <div className="text-sm text-gray-600">Active Users Today</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-gray-600">Searches Today</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-gray-600">New Signups Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Warning */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Access:</strong> This dashboard is for authorized personnel only. 
            All changes are logged and monitored. Please ensure accuracy when updating medical information.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  )
}