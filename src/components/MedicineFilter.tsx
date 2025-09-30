"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, X, Search } from "lucide-react"

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

interface CategoryInfo {
  category: string
  count: number
  drugClasses: string[]
}

interface FilterOptions {
  categories: CategoryInfo[]
  drugClasses: string[]
  totalMedicines: number
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

interface MedicineFilterProps {
  filters: MedicineFilters
  onFiltersChange: (filters: MedicineFilters) => void
  onClearFilters: () => void
  symptoms?: Array<{ id: string; name: string }>
  medicines?: MedicineData[]
}

export default function MedicineFilter({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  symptoms = [],
  medicines = []
}: MedicineFilterProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    drugClasses: [],
    totalMedicines: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Calculate filter options from local medicines data
    const calculateFilterOptions = () => {
      if (!medicines || medicines.length === 0) {
        console.log("MedicineFilter: No medicines data provided")
        return
      }
      
      console.log("MedicineFilter: Processing", medicines.length, "medicines")
      
      const categoriesMap = new Map<string, { count: number; drugClasses: Set<string> }>()
      const allDrugClasses = new Set<string>()
      
      medicines.forEach(medicine => {
        if (medicine.category) {
          const category = categoriesMap.get(medicine.category) || 
            { count: 0, drugClasses: new Set<string>() }
          category.count++
          if (medicine.drugClass) {
            category.drugClasses.add(medicine.drugClass)
            allDrugClasses.add(medicine.drugClass)
          }
          categoriesMap.set(medicine.category, category)
        }
      })
      
      const categories: CategoryInfo[] = Array.from(categoriesMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        drugClasses: Array.from(data.drugClasses)
      }))
      
      console.log("MedicineFilter: Found categories", categories.map(c => c.category))
      
      setFilterOptions({
        categories: categories.sort((a, b) => a.category.localeCompare(b.category)),
        drugClasses: Array.from(allDrugClasses).sort(),
        totalMedicines: medicines.length
      })
      setIsLoading(false)
    }
    
    calculateFilterOptions()
  }, [medicines])

  const handleFilterChange = (key: keyof MedicineFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleSymptomToggle = (symptomId: string) => {
    const currentSymptoms = filters.symptoms || []
    const newSymptoms = currentSymptoms.includes(symptomId)
      ? currentSymptoms.filter(id => id !== symptomId)
      : [...currentSymptoms, symptomId]
    
    handleFilterChange('symptoms', newSymptoms)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== false && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Medicines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Medicines</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Search */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search medicines..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filterOptions.categories.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Drug Class Filter */}
          {filters.category && (
            <div>
              <label className="text-sm font-medium mb-2 block">Drug Class</label>
              <Select
                value={filters.drugClass || 'all'}
                onValueChange={(value) => handleFilterChange('drugClass', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select drug class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drug Classes</SelectItem>
                  {filterOptions.categories
                    .find(cat => cat.category === filters.category)
                    ?.drugClasses.map((drugClass) => (
                      <SelectItem key={drugClass} value={drugClass}>
                        {drugClass}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Effectiveness Slider */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Minimum Effectiveness: {filters.minEffectiveness || 0}/10
            </label>
            <Slider
              value={[filters.minEffectiveness || 0]}
              onValueChange={(value) => handleFilterChange('minEffectiveness', value[0])}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Prescription Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Prescription Status</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescription-only"
                  checked={filters.prescriptionOnly || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange('prescriptionOnly', checked as boolean)
                  }
                />
                <label htmlFor="prescription-only" className="text-sm">
                  Prescription Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="controlled-only"
                  checked={filters.controlledOnly || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange('controlledOnly', checked as boolean)
                  }
                />
                <label htmlFor="controlled-only" className="text-sm">
                  Controlled Substances Only
                </label>
              </div>
            </div>
          </div>

          {/* Symptoms Filter */}
          {symptoms.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Symptoms</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {symptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`symptom-${symptom.id}`}
                      checked={(filters.symptoms || []).includes(symptom.id)}
                      onCheckedChange={() => handleSymptomToggle(symptom.id)}
                    />
                    <label htmlFor={`symptom-${symptom.id}`} className="text-sm">
                      {symptom.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Maximum Price (GHS)</label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value || undefined)}
            />
          </div>
        </CardContent>
    </Card>
  )
}