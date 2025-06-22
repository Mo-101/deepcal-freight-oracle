import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type Message = {
  id: string;
  content: string;
  from: string;
  timestamp: Date;
  status: 'sent' | 'received' | 'error';
  channel: 'sms' | 'whatsapp' | 'email';
};

interface FieldIntelCommProps {
  shipmentId: string;
  onMessageSent: (message: string) => void;
}

export const FieldIntelComm: React.FC<FieldIntelCommProps> = ({ shipmentId, onMessageSent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'sms' | 'whatsapp'>('whatsapp');
  const [isConnected, setIsConnected] = useState(false);

  // Simulate connecting to Twilio service
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      toast.success('Field Intel connected', {
        description: 'Twilio API connection established',
      });
      
      // Simulate incoming messages
      setMessages([
        {
          id: '1',
          content: 'Driver check-in: Load secured and departing origin',
          from: '+254712345678',
          timestamp: new Date(Date.now() - 3600000),
          status: 'received',
          channel: 'whatsapp'
        },
        {
          id: '2',
          content: 'Weather alert: Heavy rain expected on route',
          from: 'WeatherBot',
          timestamp: new Date(Date.now() - 1800000),
          status: 'received',
          channel: 'sms'
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      from: 'You',
      timestamp: new Date(),
      status: 'sent',
      channel: selectedChannel
    };
    
    setMessages(prev => [...prev, message]);
    onMessageSent(newMessage);
    setNewMessage('');
    
    // Simulate message sending
    toast.message('Message queued', {
      description: `Sending via ${selectedChannel.toUpperCase()}`,
    });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="text-emerald-400" />
          <span>Field Intel Comms</span>
          <div className={`ml-2 h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedChannel('whatsapp')}
            className={`px-3 py-1 rounded-md flex items-center space-x-1 ${selectedChannel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => setSelectedChannel('sms')}
            className={`px-3 py-1 rounded-md flex items-center space-x-1 ${selectedChannel === 'sms' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            <Phone className="w-4 h-4" />
            <span>SMS</span>
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {messages.map(message => (
            <div key={message.id} className={`p-3 rounded-lg ${message.from === 'You' ? 'bg-emerald-900/50 ml-auto max-w-xs' : 'bg-slate-700 mr-auto max-w-xs'}`}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium">{message.from}</span>
                <span className="text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
              <div className="flex justify-end mt-1">
                {message.status === 'sent' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                {message.status === 'error' && <AlertCircle className="w-3 h-3 text-amber-400" />}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Type ${selectedChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'} message...`}
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-emerald-600 hover:bg-emerald-500"
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
