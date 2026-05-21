import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TransactionType, SMSData } from '@/types';
import { ArrowLeft, Send, Receipt, Scan } from 'lucide-react';
import { SMSReader } from './SMSReader';

interface TransactionFormProps {
  type: TransactionType;
  onBack: () => void;
  onSubmit: (amount: number, phone: string, reference?: string) => void;
  agentBalance: number;
}

export function TransactionForm({ type, onBack, onSubmit, agentBalance }: TransactionFormProps) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [showSMSReader, setShowSMSReader] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (phone && numAmount > 0) {
      onSubmit(numAmount, phone, reference);
    }
  };

  const handleSMSParsed = (data: SMSData) => {
    setPhone(data.phone);
    setAmount(data.amount.toString());
    setReference(data.reference);
    setShowSMSReader(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold capitalize">{type}</h2>
      </div>

      {showSMSReader ? (
        <SMSReader onParsed={handleSMSParsed} onCancel={() => setShowSMSReader(false)} />
      ) : (
        <Card className="border-border/50 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {type === 'deposit' ? <Send className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                {type === 'deposit' ? 'Send Money to Customer' : 'Receive Money from Customer'}
              </CardTitle>
              <CardDescription>
                {type === 'deposit' 
                  ? 'Enter customer details to deposit money into their wallet.' 
                  : 'Enter transaction details for customer withdrawal.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium">Available Balance</span>
                <span className="font-bold">{agentBalance.toLocaleString()} USD</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cust-phone">Customer Phone Number</Label>
                <Input 
                  id="cust-phone" 
                  placeholder="254 7XX XXX XXX" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ref">Reference (Optional)</Label>
                <Input 
                  id="ref" 
                  placeholder="TX-XXXXXX" 
                  value={reference} 
                  onChange={(e) => setReference(e.target.value)} 
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center gap-2 border-dashed"
                  onClick={() => setShowSMSReader(true)}
                >
                  <Scan className="w-4 h-4" />
                  Read from SMS Confirmation
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className={`w-full h-11 text-lg ${type === 'deposit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}