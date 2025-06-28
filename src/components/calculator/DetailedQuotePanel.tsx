
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Info, AlertTriangle, TrendingUp, Check, Shield, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { humorToast } from '@/components/HumorToast';

interface QuoteDetail {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FeeBreakdownItem {
  description: string;
  amount: number;
  currency: string;
}

interface DetailedQuotePanelProps {
  selectedForwarder: string;
  transitTime: string;
  reliability: number;
  totalCost: number;
  currency: string;
  feeBreakdown: FeeBreakdownItem[];
  routeInsights: string[];
  onBookQuote: () => void;
  onSaveQuote: () => void;
}

export const DetailedQuotePanel: React.FC<DetailedQuotePanelProps> = ({
  selectedForwarder,
  transitTime,
  reliability,
  totalCost,
  currency,
  feeBreakdown,
  routeInsights,
  onBookQuote,
  onSaveQuote
}) => {
  const quoteDetails: QuoteDetail[] = [
    { label: 'Carrier', value: selectedForwarder, icon: <Package className="w-4 h-4" /> },
    { label: 'Transit Time', value: transitTime, icon: <Clock className="w-4 h-4" /> },
    { label: 'Reliability Score', value: `${reliability}%`, icon: <Shield className="w-4 h-4" /> }
  ];

  const handleBookQuote = () => {
    humorToast(
      "🚀 Quote Locked In!",
      `Your ${selectedForwarder} booking is being processed through the DeepCAL™ neural pathways`,
      4000
    );
    onBookQuote();
  };

  const handleSaveQuote = () => {
    humorToast(
      "💾 Quote Crystallized",
      "Quote details have been preserved in the DeepCAL™ quantum storage matrix",
      3000
    );
    onSaveQuote();
  };

  return (
    <Card className="glass-card border border-glassBorder shadow-glass animate-scale-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-lime-400">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-lime-400 text-slate-900 text-sm">
            5
          </span>
          Neural Quote Analysis
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transit Details */}
          <div className="space-y-4">
            <Card className="glass-card border border-slate-700/50">
              <CardContent className="p-4">
                <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-cyan-400">
                  <Clock className="w-4 h-4" />
                  Transit Intelligence
                </h3>
                
                <div className="space-y-3">
                  {quoteDetails.map((detail, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        {detail.icon}
                        {detail.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{detail.value}</span>
                        {detail.label === 'Reliability Score' && (
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-lime-400 rounded-full transition-all duration-1000"
                              style={{ width: `${reliability}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Fee Breakdown */}
            <Card className="glass-card border border-slate-700/50">
              <CardContent className="p-4">
                <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-purple-400">
                  <Info className="w-4 h-4" />
                  Cost Matrix Analysis
                </h3>
                
                <div className="space-y-2">
                  {feeBreakdown.map((fee, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{fee.description}</span>
                      <span className="font-medium">{fee.currency}{fee.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Cost</span>
                    <span className="text-lime-400 text-lg">{currency}{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Route Insights & Actions */}
          <div className="space-y-4">
            <Card className="glass-card border border-slate-700/50">
              <CardContent className="p-4">
                <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-orange-400">
                  <TrendingUp className="w-4 h-4" />
                  Route Intelligence Matrix
                </h3>
                
                <div className="space-y-3 text-sm">
                  {routeInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-lime-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-indigo-200">{insight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-lime-500 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
                onClick={handleBookQuote}
              >
                <Check className="mr-2 h-4 w-4" />
                Neural Lock & Book
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-lime-400/50 text-lime-400 hover:bg-lime-400/10"
                onClick={handleSaveQuote}
              >
                Archive Quote Matrix
              </Button>
              
              <div className="text-center">
                <Badge variant="secondary" className="bg-slate-800 text-cyan-300">
                  🧠 DeepCAL™ Confidence: 94.7%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
