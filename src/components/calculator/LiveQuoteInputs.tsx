
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, Trash2 } from 'lucide-react';

interface LiveQuote {
  forwarder: string;
  cost: number;
  transitDays: number;
  notes?: string;
}

interface LiveQuoteInputsProps {
  quotes: LiveQuote[];
  onQuotesChange: (quotes: LiveQuote[]) => void;
}

const LiveQuoteInputs: React.FC<LiveQuoteInputsProps> = ({
  quotes,
  onQuotesChange
}) => {
  const addNewQuote = () => {
    const newQuote: LiveQuote = {
      forwarder: '',
      cost: 0,
      transitDays: 0,
      notes: ''
    };
    onQuotesChange([...quotes, newQuote]);
  };

  const updateQuote = (index: number, field: keyof LiveQuote, value: string | number) => {
    const updatedQuotes = quotes.map((quote, i) => 
      i === index ? { ...quote, [field]: value } : quote
    );
    onQuotesChange(updatedQuotes);
  };

  const removeQuote = (index: number) => {
    const updatedQuotes = quotes.filter((_, i) => i !== index);
    onQuotesChange(updatedQuotes);
  };

  return (
    <Card className="oracle-card border-2 border-green-500/30 bg-green-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <DollarSign className="w-5 h-5 text-green-400" />
          Live Quote Inputs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotes.length === 0 && (
          <p className="text-gray-300 text-sm italic">
            Add live quotes from freight forwarders to compare against historical data
          </p>
        )}
        
        {quotes.map((quote, index) => (
          <div key={index} className="p-4 border border-slate-600 rounded-lg bg-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Quote #{index + 1}</h4>
              <Button
                onClick={() => removeQuote(index)}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-900/30"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-white text-xs">Forwarder Name</Label>
                <Input
                  value={quote.forwarder}
                  onChange={(e) => updateQuote(index, 'forwarder', e.target.value)}
                  placeholder="e.g., DHL Express"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white text-xs">Total Cost ($)</Label>
                <Input
                  type="number"
                  value={quote.cost || ''}
                  onChange={(e) => updateQuote(index, 'cost', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white text-xs">Transit Days</Label>
                <Input
                  type="number"
                  value={quote.transitDays || ''}
                  onChange={(e) => updateQuote(index, 'transitDays', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white text-xs">Notes (Optional)</Label>
                <Input
                  value={quote.notes || ''}
                  onChange={(e) => updateQuote(index, 'notes', e.target.value)}
                  placeholder="Special conditions, etc."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          onClick={addNewQuote}
          variant="outline"
          className="w-full border-green-500 text-green-400 hover:bg-green-900/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Live Quote
        </Button>
      </CardContent>
    </Card>
  );
};

export default LiveQuoteInputs;
