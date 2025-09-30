import { MedicineData, SymptomData } from './client-component'
import MedicineDetailClient from './client-component'
import medicinesData from '../../../../public/medicines.json'

// Generate static params for all medicine IDs
export async function generateStaticParams() {
  const medicines = medicinesData.medicines || []
  
  // Return params for each medicine
  return medicines.map((medicine: any) => ({
    id: medicine.id
  }))
}

// Get medicine data for the specific ID
async function getMedicineData(id: string): Promise<MedicineData | null> {
  const medicines = medicinesData.medicines || []
  return medicines.find((medicine: any) => medicine.id === id) || null
}

// Get symptoms data
async function getSymptomsData(): Promise<SymptomData[]> {
  // In a real app, this would fetch from symptoms.json
  // For now, we'll return an empty array and let the client component handle it
  return []
}

export default async function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const medicine = await getMedicineData(id)
  const symptoms = await getSymptomsData()
  
  if (!medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Medicine Not Found</h1>
            <p className="text-gray-700">The medicine you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  // Pass data to client component as props
  return <MedicineDetailClient medicine={medicine} symptoms={symptoms} />
}