
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FileText, Search, Download, Eye, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { CargoReadinessRFQ } from '@/types/rfq';
import { CargoReadinessRFQForm } from './CargoReadinessRFQForm';
import { useToast } from '@/hooks/use-toast';

interface RFQRecord extends CargoReadinessRFQ {
  id: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
}

export const RFQManager: React.FC = () => {
  const { toast } = useToast();
  const [rfqRecords, setRfqRecords] = useState<RFQRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingRFQ, setEditingRFQ] = useState<RFQRecord | null>(null);

  // Load RFQ records from storage
  useEffect(() => {
    const loadRFQRecords = () => {
      try {
        const stored = localStorage.getItem('rfq-records');
        if (stored) {
          setRfqRecords(JSON.parse(stored));
        } else {
          // Create some sample data for demonstration
          const sampleData: RFQRecord[] = [
            {
              id: 'rfq-001',
              CARGO_READINESS: '2024-12-25',
              ROAD: 90000,
              FREQUENCY: 'Weekly',
              'Truck type , Capacity and Dimensions': '40ft Container Truck, 30 tons capacity',
              'ESTIMATED CARGO PICK-UP DATE AT DOOR': '2024-12-20',
              ETD: 'Estimated Time of Departure from origin warehouse',
              ETD_Schedule: '2024-12-21 08:00',
              DESTINATION_NAME: 'Mombasa Port',
              DESTINATION_LOCATION: 'Mombasa, Kenya',
              ETA: '2024-12-23 14:00',
              'FREIGHT RATE PER KG': '2.50 USD',
              'ALL INCLUSIVE FREIGHT COST PER UNIT AND OTHERS': '500 USD per container',
              'ALL INCLUSIVE FREIGHT COST FOR total cargo': '15,000 USD',
              DESTINATION_FREE_TIME: '5 days',
              'PAYMENT TERMS (SPECIFY IF DIFFERENT)': 'Net 30 days',
              'PROVIDE NAME AND CONTACT DETAILS OF LOCAL AGENT AT ORIGIN AND DESTINATION.': 'Origin: John Doe (+254701234567), Destination: Jane Smith (+254709876543)',
              'PROVIDE DETAILS OF TRANSPORT OPERATION FROM': 'Nairobi Industrial Area',
              'PROVIDE DETAILS OF TRANSPORT OPERATION CONTACT': 'Transport Manager: +254701234567',
              'VALIDITY OF OFFER (PLEASE INDICATE DD/MM/YYYY)': '31/12/2024',
              'IMPORTANT Please indicate currency': 'USD',
              'Name of Authorized Representative': 'John Doe',
              Signature: 'john_doe_signature.pdf',
              Title: 'Logistics Manager',
              Date: '2024-12-11',
              status: 'submitted',
              createdAt: '2024-12-11T10:30:00Z',
              updatedAt: '2024-12-11T10:30:00Z',
              submittedBy: 'john.doe@company.com'
            }
          ];
          setRfqRecords(sampleData);
          localStorage.setItem('rfq-records', JSON.stringify(sampleData));
        }
      } catch (error) {
        console.error('Error loading RFQ records:', error);
      }
    };

    loadRFQRecords();
  }, []);

  const handleRFQSubmit = (data: CargoReadinessRFQ) => {
    const newRecord: RFQRecord = {
      ...data,
      id: `rfq-${Date.now()}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedBy: 'current.user@company.com'
    };

    const updatedRecords = [newRecord, ...rfqRecords];
    setRfqRecords(updatedRecords);
    localStorage.setItem('rfq-records', JSON.stringify(updatedRecords));
    setShowForm(false);
    setEditingRFQ(null);
  };

  const handleStatusChange = (id: string, newStatus: RFQRecord['status']) => {
    const updatedRecords = rfqRecords.map(record =>
      record.id === id
        ? { ...record, status: newStatus, updatedAt: new Date().toISOString() }
        : record
    );
    setRfqRecords(updatedRecords);
    localStorage.setItem('rfq-records', JSON.stringify(updatedRecords));
    
    toast({
      title: 'Status Updated',
      description: `RFQ ${id} status changed to ${newStatus}`,
    });
  };

  const filteredRecords = rfqRecords.filter(record => {
    const matchesSearch = record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.DESTINATION_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record['Name of Authorized Representative'].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: RFQRecord['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'submitted': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-yellow-300">
            {editingRFQ ? 'Edit RFQ' : 'Create New RFQ'}
          </h2>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setEditingRFQ(null);
            }}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Back to Manager
          </Button>
        </div>
        <CargoReadinessRFQForm
          onSubmit={handleRFQSubmit}
          initialData={editingRFQ || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-yellow-300">
              <FileText className="w-8 h-8 text-deepcal-light" />
              RFQ Management System
            </CardTitle>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New RFQ
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
                  All RFQs ({rfqRecords.length})
                </TabsTrigger>
                <TabsTrigger value="draft" onClick={() => setStatusFilter('draft')}>
                  Drafts ({rfqRecords.filter(r => r.status === 'draft').length})
                </TabsTrigger>
                <TabsTrigger value="submitted" onClick={() => setStatusFilter('submitted')}>
                  Submitted ({rfqRecords.filter(r => r.status === 'submitted').length})
                </TabsTrigger>
                <TabsTrigger value="approved" onClick={() => setStatusFilter('approved')}>
                  Approved ({rfqRecords.filter(r => r.status === 'approved').length})
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search RFQs by ID, destination, or representative..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No RFQs found matching your criteria.</p>
                  </div>
                ) : (
                  filteredRecords.map((record) => (
                    <Card key={record.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-white text-lg">{record.id}</h3>
                              <Badge className={`${getStatusColor(record.status)} text-white`}>
                                {record.status.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-slate-400">Destination:</span>
                                <p className="text-white font-medium">{record.DESTINATION_NAME}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Representative:</span>
                                <p className="text-white font-medium">{record['Name of Authorized Representative']}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Total Cost:</span>
                                <p className="text-white font-medium">{record['ALL INCLUSIVE FREIGHT COST FOR total cargo']}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Currency:</span>
                                <p className="text-white font-medium">{record['IMPORTANT Please indicate currency']}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Valid Until:</span>
                                <p className="text-white font-medium">{record['VALIDITY OF OFFER (PLEASE INDICATE DD/MM/YYYY)']}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">Created:</span>
                                <p className="text-white font-medium">{new Date(record.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                              onClick={() => {
                                // View RFQ details
                                console.log('Viewing RFQ:', record);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                              onClick={() => {
                                setEditingRFQ(record);
                                setShowForm(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                              onClick={() => {
                                // Export RFQ
                                const dataStr = JSON.stringify(record, null, 2);
                                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                                const url = URL.createObjectURL(dataBlob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `${record.id}.json`;
                                link.click();
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {record.status === 'submitted' && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-600">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusChange(record.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(record.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
