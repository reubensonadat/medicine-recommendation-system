"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Filter, Search, X, ChevronDown, ChevronUp } from "lucide-react"

interface MedicineFilters {
  category?: string
  drugClass?: string
  prescriptionOnly?: boolean
  controlledOnly?: boolean
  search?: string
  minEffectiveness?: number
  maxPrice?: number
  symptoms?: string[]
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

interface Symptom {
  id: string
  name: string
  description?: string
  category?: string
  severity?: string
}

interface MedicineFilterProps {
  filters: MedicineFilters
  onFiltersChange: (filters: MedicineFilters) => void
  onClearFilters: () => void
  symptoms: Symptom[]
  medicines: MedicineData[]
}

export default function MedicineFilter({
  filters,
  onFiltersChange,
  onClearFilters,
  symptoms,
  medicines
}: MedicineFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    drugClasses: true,
    price: true,
    effectiveness: true,
    symptoms: true,
    prescription: true
  })

  // Extract unique categories and drug classes from medicines
  const categories = [...new Set(medicines.map(m => m.category).filter(Boolean))]
  const drugClasses = [...new Set(medicines.map(m => m.drugClass).filter(Boolean))]

  // Extract price range
  const extractPrice = (priceStr: string | undefined): number => {
    if (!priceStr) return 50 // Default price
    const match = priceStr.match(/(\d+)/)
    return match ? parseInt(match[1]) : 50
  }

  const maxPriceValue = Math.max(...medicines.map(m => extractPrice(m.priceRange)))
  const [priceRange, setPriceRange] = useState([0, maxPriceValue])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({ ...filters, category })
    } else if (filters.category === category) {
      onFiltersChange({ ...filters, category: undefined })
    }
  }

  const handleDrugClassChange = (drugClass: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({ ...filters, drugClass })
    } else if (filters.drugClass === drugClass) {
      onFiltersChange({ ...filters, drugClass: undefined })
    }
  }

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    const currentSymptoms = filters.symptoms || []
    if (checked) {
      onFiltersChange({ ...filters, symptoms: [...currentSymptoms, symptomId] })
    } else {
      onFiltersChange({
        ...filters,
        symptoms: currentSymptoms.filter(id => id !== symptomId)
      })
    }
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({ ...filters, maxPrice: value[1] })
  }

  const handleEffectivenessChange = (value: number[]) => {
    onFiltersChange({ ...filters, minEffectiveness: value[0] })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== false && (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Medicines
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        <CardDescription>
          Narrow down your search to find the right medicine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium">Search</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name or description..."
              value={filters.search || ""}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection("categories")}
          >
            Categories
            {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {expandedSections.categories && (
            <div className="mt-2 space-y-2">
              {categories.map(category => (
                category !== undefined ? (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.category === category}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ) : null
              ))}
            </div>
          )}
        </div>

        {/* Drug Classes */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection("drugClasses")}
          >
            Drug Classes
            {expandedSections.drugClasses ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {expandedSections.drugClasses && (
            <div className="mt-2 space-y-2">
              {drugClasses.filter((dc): dc is string => dc !== undefined).map(drugClass => (
                    <div key={drugClass} className="flex items-center space-x-2">
                      <Checkbox
                        id={`drugClass-${drugClass}`}
                        checked={filters.drugClass === drugClass}
                        onCheckedChange={(checked) => handleDrugClassChange(drugClass, checked as boolean)}
                      />
                      <Label htmlFor={`drugClass-${drugClass}`} className="text-sm">
                        {drugClass}
                      </Label>
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection("price")}
          >
            Price Range (GHS)
            {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {expandedSections.price && (
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>0</span>
                <span>{priceRange[1]}</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={maxPriceValue}
                step={1}
                className="mt-2"
              />
            </div>
          )}
        </div>

        {/* Effectiveness */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection("effectiveness")}
          >
            Minimum Effectiveness
            {expandedSections.effectiveness ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {expandedSections.effectiveness && (
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>1</span>
                <span>{filters.minEffectiveness || 5}</span>
                <span>10</span>
              </div>
              <Slider
                value={[filters.minEffectiveness || 5]}
                onValueChange={handleEffectivenessChange}
                min={1}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>
          )}
        </div>

        {/* Symptoms */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection("symptoms")}
          >
            Symptoms
            {expandedSections.symptoms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {expandedSections.symptoms && (
            <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
              {symptoms.slice(0, 10).map(symptom => (
                <div key={symptom.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`symptom-${symptom.id}`}
                    checked={filters.symptoms?.includes(symptom.id) || false}
                    onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                  />
                  <Label htmlFor={`symptom-${symptom.id}`} className="text-sm">
                    {symptom.name}
                  </Label>
                </div>
              ))}
              {symptoms.length > 10 && (
                <p className="text-xs text-gray-500 italic">
                  Showing first 10 symptoms. Use search for more specific filtering.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Prescription and Controlled */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
            onClick={() => toggleSection("prescription")}
          >
            Special Requirements
            {expandedSections.prescription ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {expandedSections.prescription && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescription-only"
                  checked={filters.prescriptionOnly || false}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, prescriptionOnly: checked as boolean })}
                />
                <Label htmlFor="prescription-only" className="text-sm">
                  Prescription Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="controlled-only"
                  checked={filters.controlledOnly || false}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, controlledOnly: checked as boolean })}
                />
                <Label htmlFor="controlled-only" className="text-sm">
                  Controlled Substances Only
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-1">
              {filters.category && (
                <Badge variant="secondary" className="text-xs">
                  Category: {filters.category}
                </Badge>
              )}
              {filters.drugClass && (
                <Badge variant="secondary" className="text-xs">
                  Class: {filters.drugClass}
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="secondary" className="text-xs">
                  Max Price: GHS {filters.maxPrice}
                </Badge>
              )}
              {filters.minEffectiveness && (
                <Badge variant="secondary" className="text-xs">
                  Min Effectiveness: {filters.minEffectiveness}/10
                </Badge>
              )}
              {filters.prescriptionOnly && (
                <Badge variant="secondary" className="text-xs">
                  Prescription Only
                </Badge>
              )}
              {filters.controlledOnly && (
                <Badge variant="secondary" className="text-xs">
                  Controlled Only
                </Badge>
              )}
              {filters.symptoms && filters.symptoms.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.symptoms.length} Symptom{filters.symptoms.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}