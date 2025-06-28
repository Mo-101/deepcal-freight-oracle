
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Ship, Plane, Train, Calendar, DollarSign, Save, Loader2, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Define the form schema using Zod
const shipmentSchema = z.object({
  request_reference: z.string().min(3, "Reference must be at least 3 characters"),
  cargo_description: z.string().min(5, "Description must be at least 5 characters"),
  item_category: z.string().min(1, "Category is required"),
  origin_country: z.string().min(1, "Origin country is required"),
  destination_country: z.string().min(1, "Destination country is required"),
  freight_agent: z.string().min(1, "Freight agent is required"),
  freight_agent_cost: z.string().min(1, "Cost is required"),
  weight_kg: z.string().min(1, "Weight is required"),
  volume_cbm: z.string().min(1, "Volume is required"),
  mode_of_shipment: z.string().min(1, "Mode of shipment is required"),
  shipment_date: z.string().min(1, "Collection date is required"),
})

type ShipmentFormValues = z.infer<typeof shipmentSchema>

interface NewShipmentFormProps {
  onSubmit?: (data: ShipmentFormValues) => void;
  onCancel?: () => void;
}

export default function NewShipmentForm({ onSubmit, onCancel }: NewShipmentFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form setup with react-hook-form and zod validation
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      request_reference: "",
      cargo_description: "",
      item_category: "",
      origin_country: "",
      destination_country: "",
      freight_agent: "",
      freight_agent_cost: "",
      weight_kg: "",
      volume_cbm: "",
      mode_of_shipment: "",
      shipment_date: new Date().toISOString().split("T")[0],
    },
  })

  // Updated categories based on the provided list
  const categories = [
    "Biomedical Equipments",
    "Cold Chain Equipment",
    "Emergency Health Kits",
    "Field Support Material",
    "Lab & Diagnostics",
    "Pharmarceuticals",
    "PPE",
    "Visibility",
    "WASH/IPC",
    "Wellbeing",
  ]

  // Updated countries based on the provided list
  const countries = [
    "Benin",
    "Burundi",
    "Central Africa Republic",
    "Chad",
    "Comoros",
    "Congo Brazzaville",
    "Congo Kinshasa",
    "Cote d'Ivoire",
    "DR Congo",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Ghana",
    "Guinea",
    "Guinea Bissau",
    "Madagascar",
    "Malawi",
    "Mauritius",
    "Mayotte",
    "Nigeria",
    "Rwanda",
    "Sao Tome",
    "Senegal",
    "Sierra Leone",
    "South Sudan",
    "Sudan",
    "Tanzania",
    "Togo",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ]

  // Updated freight agents based on the provided list
  const freightAgents = [
    "Kuehne Nagel",
    "Scan Global Logistics",
    "DHL Express",
    "DHL Global",
    "BWOSI",
    "AGL",
    "Siginon",
    "Freight In Time",
    "Kenya Airways",
  ]

  const transportModes = ["Air", "Sea", "Road", "Rail"]

  // Handle form submission
  const handleSubmit = async (data: ShipmentFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Generate a unique SN (serial number)
      const sn = `SHP-${Date.now().toString().substring(7)}-${Math.floor(Math.random() * 1000)}`

      // Prepare the shipment data
      const shipmentData = {
        sn,
        shipment_date: data.shipment_date,
        request_reference: data.request_reference,
        cargo_description: data.cargo_description,
        item_category: data.item_category,
        origin_country: data.origin_country,
        destination_country: data.destination_country,
        freight_agent: data.freight_agent,
        freight_agent_cost: data.freight_agent_cost,
        weight_kg: data.weight_kg,
        volume_cbm: data.volume_cbm,
        mode_of_shipment: data.mode_of_shipment,
        delivery_status: "Pending",
      }

      console.log("📦 New Shipment Data:", shipmentData)

      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(data)
      }

      // Show success toast
      toast({
        title: "Shipment Added",
        description: "The shipment has been successfully added to your data.",
      })

      // Reset form
      form.reset()
    } catch (err) {
      console.error("Error adding shipment:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Card className="bg-blue-900/50 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white">Shipment Details</CardTitle>
          <CardDescription className="text-blue-200">Enter the details of the new shipment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-700">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="request_reference" className="text-blue-100">
                Request Reference
              </Label>
              <Input
                id="request_reference"
                placeholder="Enter reference number"
                className="bg-blue-950/50 border-blue-700 text-white placeholder:text-blue-400"
                {...form.register("request_reference")}
              />
              {form.formState.errors.request_reference && (
                <p className="text-red-400 text-sm">{form.formState.errors.request_reference.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipment_date" className="text-blue-100">
                Collection Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-blue-300" />
                <Input
                  id="shipment_date"
                  type="date"
                  className="pl-8 bg-blue-950/50 border-blue-700 text-white"
                  {...form.register("shipment_date")}
                />
              </div>
              {form.formState.errors.shipment_date && (
                <p className="text-red-400 text-sm">{form.formState.errors.shipment_date.message}</p>
              )}
            </div>
          </div>

          {/* Cargo Information */}
          <div className="space-y-2">
            <Label htmlFor="cargo_description" className="text-blue-100">
              Cargo Description
            </Label>
            <Textarea
              id="cargo_description"
              placeholder="Describe the cargo"
              className="bg-blue-950/50 border-blue-700 text-white placeholder:text-blue-400 min-h-[100px]"
              {...form.register("cargo_description")}
            />
            {form.formState.errors.cargo_description && (
              <p className="text-red-400 text-sm">{form.formState.errors.cargo_description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="item_category" className="text-blue-100">
                Item Category
              </Label>
              <Select
                onValueChange={(value) => form.setValue("item_category", value)}
                defaultValue={form.getValues("item_category")}
              >
                <SelectTrigger id="item_category" className="bg-blue-950/50 border-blue-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-blue-700 text-white">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.item_category && (
                <p className="text-red-400 text-sm">{form.formState.errors.item_category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode_of_shipment" className="text-blue-100">
                Mode of Transport
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {transportModes.map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={form.getValues("mode_of_shipment") === mode ? "default" : "outline"}
                    className={
                      form.getValues("mode_of_shipment") === mode ? "bg-blue-600" : "border-blue-700 text-blue-200"
                    }
                    onClick={() => form.setValue("mode_of_shipment", mode)}
                  >
                    {mode === "Sea" && <Ship className="h-4 w-4 mr-2" />}
                    {mode === "Air" && <Plane className="h-4 w-4 mr-2" />}
                    {mode === "Road" && <Truck className="h-4 w-4 mr-2" />}
                    {mode === "Rail" && <Train className="h-4 w-4 mr-2" />}
                    {mode}
                  </Button>
                ))}
              </div>
              {form.formState.errors.mode_of_shipment && (
                <p className="text-red-400 text-sm">{form.formState.errors.mode_of_shipment.message}</p>
              )}
            </div>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="origin_country" className="text-blue-100">
                Origin Country
              </Label>
              <Select
                onValueChange={(value) => form.setValue("origin_country", value)}
                defaultValue={form.getValues("origin_country")}
              >
                <SelectTrigger id="origin_country" className="bg-blue-950/50 border-blue-700 text-white">
                  <SelectValue placeholder="Select origin country" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-blue-700 text-white max-h-[200px]">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.origin_country && (
                <p className="text-red-400 text-sm">{form.formState.errors.origin_country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination_country" className="text-blue-100">
                Destination Country
              </Label>
              <Select
                onValueChange={(value) => form.setValue("destination_country", value)}
                defaultValue={form.getValues("destination_country")}
              >
                <SelectTrigger id="destination_country" className="bg-blue-950/50 border-blue-700 text-white">
                  <SelectValue placeholder="Select destination country" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-blue-700 text-white max-h-[200px]">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.destination_country && (
                <p className="text-red-400 text-sm">{form.formState.errors.destination_country.message}</p>
              )}
            </div>
          </div>

          {/* Freight Agent and Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="freight_agent" className="text-blue-100">
                Freight Forwarder
              </Label>
              <Select
                onValueChange={(value) => form.setValue("freight_agent", value)}
                defaultValue={form.getValues("freight_agent")}
              >
                <SelectTrigger id="freight_agent" className="bg-blue-950/50 border-blue-700 text-white">
                  <SelectValue placeholder="Select freight forwarder" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-blue-700 text-white">
                  {freightAgents.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.freight_agent && (
                <p className="text-red-400 text-sm">{form.formState.errors.freight_agent.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="freight_agent_cost" className="text-blue-100">
                Freight Cost
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-blue-300" />
                <Input
                  id="freight_agent_cost"
                  type="number"
                  placeholder="0.00"
                  className="pl-8 bg-blue-950/50 border-blue-700 text-white placeholder:text-blue-400"
                  {...form.register("freight_agent_cost")}
                />
              </div>
              {form.formState.errors.freight_agent_cost && (
                <p className="text-red-400 text-sm">{form.formState.errors.freight_agent_cost.message}</p>
              )}
            </div>
          </div>

          {/* Weight and Volume */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight_kg" className="text-blue-100">
                Weight (kg)
              </Label>
              <Input
                id="weight_kg"
                type="number"
                placeholder="0.00"
                className="bg-blue-950/50 border-blue-700 text-white placeholder:text-blue-400"
                {...form.register("weight_kg")}
              />
              {form.formState.errors.weight_kg && (
                <p className="text-red-400 text-sm">{form.formState.errors.weight_kg.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume_cbm" className="text-blue-100">
                Volume (m³)
              </Label>
              <Input
                id="volume_cbm"
                type="number"
                placeholder="0.00"
                className="bg-blue-950/50 border-blue-700 text-white placeholder:text-blue-400"
                {...form.register("volume_cbm")}
              />
              {form.formState.errors.volume_cbm && (
                <p className="text-red-400 text-sm">{form.formState.errors.volume_cbm.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-blue-700 pt-6">
          <Button
            variant="outline"
            type="button"
            className="border-blue-700 text-blue-200"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Shipment
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
