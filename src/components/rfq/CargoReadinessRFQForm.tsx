
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
import { CalendarIcon, FileText, Save, Send, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CargoReadinessRFQ, rfqFormFields } from '@/types/rfq';

const rfqSchema = z.object({
  CARGO_READINESS: z.string().min(1, 'Cargo readiness date is required'),
  ROAD: z.number().min(1, 'Road value is required'),
  FREQUENCY: z.string().min(1, 'Frequency is required'),
  'Truck type , Capacity and Dimensions': z.string().min(1, 'Truck details are required'),
  'ESTIMATED CARGO PICK-UP DATE AT DOOR': z.string().min(1, 'Pick-up date is required'),
  ETD: z.string().min(1, 'ETD is required'),
  ETD_Schedule: z.string().min(1, 'ETD Schedule is required'),
  DESTINATION_NAME: z.string().min(1, 'Destination name is required'),
  DESTINATION_LOCATION: z.string().min(1, 'Destination location is required'),
  ETA: z.string().min(1, 'ETA is required'),
  'FREIGHT RATE PER KG': z.string().min(1, 'Freight rate per kg is required'),
  'ALL INCLUSIVE FREIGHT COST PER UNIT AND OTHERS': z.string().min(1, 'Unit cost is required'),
  'ALL INCLUSIVE FREIGHT COST FOR total cargo': z.string().min(1, 'Total cargo cost is required'),
  DESTINATION_FREE_TIME: z.string().min(1, 'Free time is required'),
  'PAYMENT TERMS (SPECIFY IF DIFFERENT)': z.string().min(1, 'Payment terms are required'),
  'PROVIDE NAME AND CONTACT DETAILS OF LOCAL AGENT AT ORIGIN AND DESTINATION.': z.string().min(1, 'Agent details are required'),
  'PROVIDE DETAILS OF TRANSPORT OPERATION FROM': z.string().min(1, 'Transport operation details are required'),
  'PROVIDE DETAILS OF TRANSPORT OPERATION CONTACT': z.string().min(1, 'Transport contact is required'),
  'VALIDITY OF OFFER (PLEASE INDICATE DD/MM/YYYY)': z.string().min(1, 'Validity date is required'),
  'IMPORTANT Please indicate currency': z.string().min(1, 'Currency is required'),
  'Name of Authorized Representative': z.string().min(1, 'Representative name is required'),
  Signature: z.string().optional(),
  Title: z.string().min(1, 'Title is required'),
  Date: z.string().min(1, 'Date is required'),
});

interface CargoReadinessRFQFormProps {
  onSubmit?: (data: CargoReadinessRFQ) => void;
  initialData?: Partial<CargoReadinessRFQ>;
}

export const CargoReadinessRFQForm: React.FC<CargoReadinessRFQFormProps> = ({
  onSubmit,
  initialData
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CargoReadinessRFQ>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      CARGO_READINESS: '',
      ROAD: 0,
      FREQUENCY: '',
      'Truck type , Capacity and Dimensions': '',
      'ESTIMATED CARGO PICK-UP DATE AT DOOR': '',
      ETD: '',
      ETD_Schedule: '',
      DESTINATION_NAME: '',
      DESTINATION_LOCATION: '',
      ETA: '',
      'FREIGHT RATE PER KG': '',
      'ALL INCLUSIVE FREIGHT COST PER UNIT AND OTHERS': '',
      'ALL INCLUSIVE FREIGHT COST FOR total cargo': '',
      DESTINATION_FREE_TIME: '',
      'PAYMENT TERMS (SPECIFY IF DIFFERENT)': '',
      'PROVIDE NAME AND CONTACT DETAILS OF LOCAL AGENT AT ORIGIN AND DESTINATION.': '',
      'PROVIDE DETAILS OF TRANSPORT OPERATION FROM': '',
      'PROVIDE DETAILS OF TRANSPORT OPERATION CONTACT': '',
      'VALIDITY OF OFFER (PLEASE INDICATE DD/MM/YYYY)': '',
      'IMPORTANT Please indicate currency': '',
      'Name of Authorized Representative': '',
      Signature: '',
      Title: '',
      Date: '',
      ...initialData
    }
  });

  const handleSubmit = async (data: CargoReadinessRFQ) => {
    setIsSubmitting(true);
    try {
      // Store in IndexedDB or send to backend
      console.log('Submitting RFQ data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(data);
      }
      
      toast({
        title: 'RFQ Submitted Successfully',
        description: 'Your Cargo Readiness RFQ has been processed and stored.',
      });
      
      form.reset();
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error processing your RFQ. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: typeof rfqFormFields[0]) => {
    const { name, label, type, placeholder } = field;

    if (type === 'date') {
      return (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-yellow-300 font-medium">{label}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-slate-900 border-slate-700 text-white hover:bg-slate-800",
                        !formField.value && "text-slate-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formField.value ? format(new Date(formField.value), "PPP") : "Select date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={formField.value ? new Date(formField.value) : undefined}
                    onSelect={(date) => formField.onChange(date?.toISOString().split('T')[0] || '')}
                    initialFocus
                    className="bg-slate-800"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (type === 'textarea') {
      return (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-yellow-300 font-medium">{label}</FormLabel>
              <FormControl>
                <Textarea
                  {...formField}
                  placeholder={placeholder}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 focus:border-yellow-400 min-h-[80px]"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (type === 'number') {
      return (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-yellow-300 font-medium">{label}</FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  type="number"
                  placeholder={placeholder}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 focus:border-yellow-400"
                  onChange={(e) => formField.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (type === 'file') {
      return (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-yellow-300 font-medium">{label}</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  className="bg-slate-900 border-slate-700 text-white file:bg-slate-800 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-md hover:file:bg-slate-700"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      formField.onChange(file.name);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-yellow-300 font-medium">{label}</FormLabel>
            <FormControl>
              <Input
                {...formField}
                type="text"
                placeholder={placeholder}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 focus:border-yellow-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-yellow-300">
              <Truck className="w-8 h-8 text-deepcal-light" />
              Cargo Readiness RFQ Form
            </CardTitle>
            <p className="text-slate-300 mt-2">
              Complete all required fields to submit your Request for Quotation
            </p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rfqFormFields.map(renderField)}
                </div>
                
                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    onClick={() => {
                      // Save as draft
                      const currentData = form.getValues();
                      localStorage.setItem('rfq-draft', JSON.stringify(currentData));
                      toast({
                        title: 'Draft Saved',
                        description: 'Your RFQ has been saved as a draft.',
                      });
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit RFQ
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
