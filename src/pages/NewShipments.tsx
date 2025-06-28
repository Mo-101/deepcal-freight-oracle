
import { useNavigate } from "react-router-dom"
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader"
import NewShipmentForm from "@/components/NewShipmentForm"
import { toast } from "@/components/ui/use-toast"

interface ShipmentEntry {
  request_reference: string
  cargo_description: string
  item_category: string
  origin_country: string
  destination_country: string
  freight_agent: string
  freight_agent_cost: string
  weight_kg: string
  volume_cbm: string
  mode_of_shipment: string
  shipment_date: string
}

export default function NewShipments() {
  const navigate = useNavigate()

  const handleSubmit = (data: ShipmentEntry) => {
    console.log("📦 New Shipment Submitted:", data)
    
    toast({
      title: "Shipment Captured",
      description: `DeepCAL received shipment ${data.request_reference}`
    })
    
    navigate("/analytics")
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <DeepCALSymbolicHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">📦 New Shipment Entry</h1>
            <p className="text-blue-200">Add a new shipment to the DeepCAL system for analysis and tracking</p>
          </div>
          <NewShipmentForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
