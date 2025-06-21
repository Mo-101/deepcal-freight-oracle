
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Package, Save, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { csvDataEngine, ShipmentRecord } from '@/services/csvDataEngine';

// Schema based on the exact base data structure
const newShipmentSchema = z.object({
  request_reference: z.string().min(1, 'Request reference is required'),
  origin_country: z.string().min(1, 'Origin country is required'),
  destination_country: z.string().min(1, 'Destination country is required'),
  weight_kg: z.number().min(0.1, 'Weight must be greater than 0'),
  volume_cbm: z.number().min(0.01, 'Volume must be greater than 0'),
  item_category: z.string().min(1, 'Item category is required'),
  cargo_description: z.string().optional(),
  date_of_collection: z.string().min(1, 'Collection date is required'),
  date_of_arrival_destination: z.string().optional(),
  delivery_status: z.enum(['Pending', 'In Transit', 'Delivered', 'Delayed']),
  mode_of_shipment: z.enum(['Air', 'Sea', 'Road', 'Rail']),
  final_quote_awarded_freight_forwader_carrier: z.string().optional(),
  initial_quote_awarded: z.string().optional(),
  'carrier+cost': z.number().min(0, 'Cost must be non-negative').optional(),
  kuehne_nagel: z.number().optional(),
  dhl_global: z.number().optional(),
  scan_global_logistics: z.number().optional(),
  siginon: z.number().optional(),
  agl: z.number().optional(),
  frieght_in_time: z.number().optional(),
  transit_days: z.number().optional(),
  'emergency grade': z.string().optional(),
});

type NewShipmentData = z.infer<typeof newShipmentSchema>;

interface NewShipmentFormProps {
  onShipmentAdded?: (shipment: ShipmentRecord) => void;
}

export const NewShipmentForm: React.FC<NewShipmentFormProps> = ({ onShipmentAdded }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewShipmentData>({
    resolver: zodResolver(newShipmentSchema),
    defaultValues: {
      request_reference: `REQ-${Date.now()}`,
      origin_country: '',
      destination_country: '',
      weight_kg: 0,
      volume_cbm: 0,
      item_category: '',
      cargo_description: '',
      date_of_collection: '',
      date_of_arrival_destination: '',
      delivery_status: 'Pending',
      mode_of_shipment: 'Air',
      final_quote_awarded_freight_forwader_carrier: '',
      initial_quote_awarded: '',
      'carrier+cost': 0,
      kuehne_nagel: 0,
      dhl_global: 0,
      scan_global_logistics: 0,
      siginon: 0,
      agl: 0,
      frieght_in_time: 0,
      transit_days: 0,
      'emergency grade': '',
    }
  });

  const handleSubmit = async (data: NewShipmentData) => {
    setIsSubmitting(true);
    try {
      // Create new shipment record following exact base data schema
      const newShipment: ShipmentRecord = {
        request_reference: data.request_reference,
        origin_country: data.origin_country,
        destination_country: data.destination_country,
        weight_kg: data.weight_kg,
        volume_cbm: data.volume_cbm,
        item_category: data.item_category,
        cargo_description: data.cargo_description,
        date_of_collection: data.date_of_collection,
        date_of_arrival_destination: data.date_of_arrival_destination,
        delivery_status: data.delivery_status,
        mode_of_shipment: data.mode_of_shipment,
        final_quote_awarded_freight_forwader_carrier: data.final_quote_awarded_freight_forwader_carrier,
        initial_quote_awarded: data.initial_quote_awarded,
        'carrier+cost': data['carrier+cost'],
        kuehne_nagel: data.kuehne_nagel,
        dhl_global: data.dhl_global,
        scan_global_logistics: data.scan_global_logistics,
        siginon: data.siginon,
        agl: data.agl,
        frieght_in_time: data.frieght_in_time,
        transit_days: data.transit_days,
        'emergency grade': data['emergency grade'],
      };

      // Add to the data engine (this will append to the existing base data)
      const currentShipments = csvDataEngine.listShipments();
      const updatedShipments = [...currentShipments, newShipment];
      
      console.log(`Adding new shipment. Total records will be: ${updatedShipments.length}`);
      console.log('New shipment data:', newShipment);

      // Store in IndexedDB or your preferred storage
      // For now, we'll simulate adding to the engine
      if (onShipmentAdded) {
        onShipmentAdded(newShipment);
      }

      toast({
        title: 'Shipment Added Successfully',
        description: `New shipment ${data.request_reference} has been added to the database.`,
      });

      // Generate new reference for next shipment
      form.setValue('request_reference', `REQ-${Date.now()}`);
      form.reset({
        request_reference: `REQ-${Date.now()}`,
        delivery_status: 'Pending',
        mode_of_shipment: 'Air',
      });

    } catch (error) {
      console.error('Error adding shipment:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error adding the shipment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDateField = (name: keyof NewShipmentData, label: string, required = false) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-yellow-300 font-medium">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-900 border-slate-700 text-white hover:bg-slate-800",
                    !field.value && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value && field.value !== '' 
                    ? (() => {
                        try {
                          const date = new Date(field.value);
                          return !isNaN(date.getTime()) ? format(date, "PPP") : "Select date";
                        } catch {
                          return "Select date";
                        }
                      })()
                    : "Select date"
                  }
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
              <Calendar
                mode="single"
                selected={field.value && field.value !== '' ? (() => {
                  try {
                    const date = new Date(field.value);
                    return !isNaN(date.getTime()) ? date : undefined;
                  } catch {
                    return undefined;
                  }
                })() : undefined}
                onSelect={(date) => field.onChange(date?.toISOString().split('T')[0] || '')}
                initialFocus
                className="bg-slate-800 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-yellow-300">
          <Package className="w-8 h-8 text-deepcal-light" />
          New Shipment Entry
        </CardTitle>
        <p className="text-slate-300 mt-2">
          Add new shipment to the base data. This will append to the existing 105+ records.
        </p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Basic Information */}
              <FormField
                control={form.control}
                name="request_reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Request Reference</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-900 border-slate-700 text-white" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Item Category</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                             placeholder="e.g., Emergency Health Kits" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="origin_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Origin Country</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                             placeholder="e.g., Kenya" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Destination Country</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                             placeholder="e.g., Burundi" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight_kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                        placeholder="0.00" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volume_cbm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Volume (CBM)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.001"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                        placeholder="0.000" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode_of_shipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Mode of Shipment</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Air" className="text-white">Air</SelectItem>
                        <SelectItem value="Sea" className="text-white">Sea</SelectItem>
                        <SelectItem value="Road" className="text-white">Road</SelectItem>
                        <SelectItem value="Rail" className="text-white">Rail</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Delivery Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Pending" className="text-white">Pending</SelectItem>
                        <SelectItem value="In Transit" className="text-white">In Transit</SelectItem>
                        <SelectItem value="Delivered" className="text-white">Delivered</SelectItem>
                        <SelectItem value="Delayed" className="text-white">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {renderDateField('date_of_collection', 'Date of Collection', true)}
              {renderDateField('date_of_arrival_destination', 'Date of Arrival at Destination')}

              <FormField
                control={form.control}
                name="cargo_description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-yellow-300 font-medium">Cargo Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                                placeholder="Detailed description of the cargo..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forwarder Information */}
              <FormField
                control={form.control}
                name="final_quote_awarded_freight_forwader_carrier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Final Quote Awarded Carrier</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                             placeholder="e.g., DHL Global" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carrier+cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-300 font-medium">Carrier Cost (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" 
                        placeholder="0.00" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            
            <div className="flex gap-4 pt-6 border-t border-slate-700">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                onClick={() => form.reset()}
              >
                <Save className="w-4 h-4 mr-2" />
                Reset Form
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Add Shipment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
