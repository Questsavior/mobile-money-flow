import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { parseSMS } from '@/lib/sms-parser';
import { SMSData } from '@/types';
import { toast } from 'sonner';
import { Copy, Sparkles } from 'lucide-react';

interface SMSReaderProps {
  onParsed: (data: SMSData) => void;
  onCancel: () => void;
}

export function SMSReader({ onParsed, onCancel }: SMSReaderProps) {
  const [text, setText] = useState('');

  const handleParse = () => {
    const data = parseSMS(text);
    if (data) {
      onParsed(data);
      toast.success('Transaction data extracted successfully!');
    } else {
      toast.error('Could not extract transaction data. Please check the text format.');
    }
  };

  const templates = [
    "Confirmed. 500 USD received from 254712345678. Ref: ABC123XYZ.",
    "Withdrawal of 1000 USD to 254799888777 successful. Ref: CONF456.",
  ];

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          SMS Confirmation Reader
        </CardTitle>
        <CardDescription>
          Paste the confirmation SMS from the mobile money provider here. We'll automatically extract the amount, phone, and reference.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Paste SMS here..." 
          className="min-h-[120px] bg-background"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Try a sample message:</p>
          <div className="flex flex-col gap-2">
            {templates.map((tpl, i) => (
              <button 
                key={i}
                type="button"
                className="text-[10px] text-left p-2 rounded bg-background border hover:border-primary transition-colors flex items-center justify-between group"
                onClick={() => setText(tpl)}
              >
                <span className="truncate mr-2">{tpl}</span>
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1" onClick={handleParse}>Extract Data</Button>
        </div>
      </CardContent>
    </Card>
  );
}