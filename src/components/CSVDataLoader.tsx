import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface CSVDataLoaderProps {
  onDataLoaded?: (data: any[]) => void;
}

const CSVDataLoader: React.FC<CSVDataLoaderProps> = ({ onDataLoaded }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          CSV Data Loader
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Data loading functionality</p>
      </CardContent>
    </Card>
  );
};

export default CSVDataLoader;