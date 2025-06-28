// NewShipments.tsx — DeepCAL Data-Conformant Shipment Entry Form

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

interface ShipmentEntry {
  request_reference: string
  cargo_description: string
  item_category: string
  origin_country: string
  destination_country: string
  weight_kg: number
  volume_cbm: number
  mode_of_shipment: string
  delivery_status: string
  date_of_collection: string
  comments?: string
}

const defaultShipment: ShipmentEntry = {
  request_reference: '',
  cargo_description: '',
  item_category: 'Emergency Health Kits',
  origin_country: 'Kenya',
  destination_country: 'Uganda',
  weight_kg: 0,
  volume_cbm: 0,
  mode_of_shipment: 'Air',
  delivery_status: 'Pending',
  date_of_collection: new Date().toISOString().split('T')[0],
  comments: ''
}

export default function NewShipments() {
  const [shipment, setShipment] = useState<ShipmentEntry>(defaultShipment)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShipment(prev => ({ ...prev, [name]: name.includes('weight') || name.includes('volume') ? parseFloat(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 🔁 Hook this into csvDataEngine.appendShipment(shipment) or other backend
    toast({
      title: "Shipment Captured",
      description: `DeepCAL received shipment ${shipment.request_reference}`
    })
    console.log("📦 New Shipment:", shipment)
    setShipment(defaultShipment)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-deepcal-text-primary">📦 New Shipment Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Request Reference</Label>
            <Input name="request_reference" value={shipment.request_reference} onChange={handleChange} required />
          </div>
          <div>
            <Label>Date of Collection</Label>
            <Input type="date" name="date_of_collection" value={shipment.date_of_collection} onChange={handleChange} required />
          </div>
          <div className="sm:col-span-2">
            <Label>Cargo Description</Label>
            <Input name="cargo_description" value={shipment.cargo_description} onChange={handleChange} required />
          </div>
          <div>
            <Label>Item Category</Label>
            <Input name="item_category" value={shipment.item_category} onChange={handleChange} required />
          </div>
          <div>
            <Label>Origin Country</Label>
            <Input name="origin_country" value={shipment.origin_country} onChange={handleChange} required />
          </div>
          <div>
            <Label>Destination Country</Label>
            <Input name="destination_country" value={shipment.destination_country} onChange={handleChange} required />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input type="number" name="weight_kg" value={shipment.weight_kg} onChange={handleChange} required />
          </div>
          <div>
            <Label>Volume (CBM)</Label>
            <Input type="number" name="volume_cbm" value={shipment.volume_cbm} onChange={handleChange} />
          </div>
          <div>
            <Label>Mode of Shipment</Label>
            <select name="mode_of_shipment" value={shipment.mode_of_shipment} onChange={handleChange} className="w-full border rounded-md p-2">
              <option>Air</option>
              <option>Sea</option>
              <option>Road</option>
            </select>
          </div>
          <div>
            <Label>Delivery Status</Label>
            <select name="delivery_status" value={shipment.delivery_status} onChange={handleChange} className="w-full border rounded-md p-2">
              <option>Pending</option>
              <option>Delivered</option>
              <option>In Transit</option>
            </select>
          </div>
        </div>
        <div>
          <Label>Comments</Label>
          <Textarea name="comments" value={shipment.comments} onChange={handleChange} rows={3} />
        </div>
        <Button type="submit" className="mt-4">Submit Shipment</Button>
      </form>
    </div>
  )
}
