import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Insert local type definition
type ForwarderKPI = {
  name: string,
  avgTransitDays: number,
  costPerKg: number,
  onTimeRate: number,
  totalShipments: number,
};

interface Props {
  forwarderKPIs: ForwarderKPI[];
}

export const TOPSISMatrix: React.FC<Props> = ({ forwarderKPIs }) => {
  if (!forwarderKPIs || forwarderKPIs.length === 0) {
    return (
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle>TOPSIS Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          No forwarder data available.
        </CardContent>
      </Card>
    );
  }

  // Extract relevant metrics
  const costPerKg = forwarderKPIs.map(f => f.costPerKg);
  const avgTransitDays = forwarderKPIs.map(f => f.avgTransitDays);
  const onTimeRate = forwarderKPIs.map(f => f.onTimeRate);

  // Find max and min values for normalization
  const maxCost = Math.max(...costPerKg);
  const minCost = Math.min(...costPerKg);
  const maxTime = Math.max(...avgTransitDays);
  const minTime = Math.min(...avgTransitDays);
  const maxRate = Math.max(...onTimeRate);
  const minRate = Math.min(...onTimeRate);

  // Normalize the values (simple min-max scaling)
  const normalizedCost = costPerKg.map(cost => (maxCost - cost) / (maxCost - minCost)); // Inverted for cost (lower is better)
  const normalizedTime = avgTransitDays.map(time => (maxTime - time) / (maxTime - minTime)); // Inverted for time (lower is better)
  const normalizedRate = onTimeRate.map(rate => (rate - minRate) / (maxRate - minRate));

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle>TOPSIS Matrix</CardTitle>
        <TableCaption>Normalized performance metrics for each forwarder.</TableCaption>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Forwarder</TableHead>
                <TableHead>Cost (Normalized)</TableHead>
                <TableHead>Transit Time (Normalized)</TableHead>
                <TableHead>On-Time Rate (Normalized)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forwarderKPIs.map((fwd, index) => (
                <TableRow key={fwd.name}>
                  <TableCell className="font-medium">{fwd.name}</TableCell>
                  <TableCell>{normalizedCost[index].toFixed(2)}</TableCell>
                  <TableCell>{normalizedTime[index].toFixed(2)}</TableCell>
                  <TableCell>{normalizedRate[index].toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
