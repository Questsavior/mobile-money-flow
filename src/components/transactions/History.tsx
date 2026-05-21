import { Transaction } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

interface HistoryProps {
  transactions: Transaction[];
  onBack: () => void;
}

export function History({ transactions, onBack }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => 
    tx.customerPhone.includes(searchTerm) || 
    tx.reference.includes(searchTerm)
  );

  const exportCSV = () => {
    const headers = ["ID", "Type", "Amount", "Phone", "Reference", "Date"].join(",") + String.fromCharCode(10);
    const rows = filteredTransactions.map(tx => 
      [tx.id, tx.type, tx.amount, tx.customerPhone, tx.reference, new Date(tx.timestamp).toLocaleString()].join(",")
    ).join(String.fromCharCode(10));
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'agent-transactions.csv');
    a.click();
    toast.success('Transaction history exported to CSV');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10" 
          placeholder="Search by phone or reference..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No transactions found.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <Card key={tx.id} className="border-border/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                      {tx.type === 'deposit' ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                    </div>
                    <span className="font-bold text-sm capitalize">{tx.type}</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                      {tx.reference}
                    </span>
                  </div>
                  <span className={`font-bold ${tx.type === 'deposit' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {tx.type === 'deposit' ? '-' : '+'}{tx.amount.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between items-end text-xs text-muted-foreground">
                  <div>
                    <p>Customer: {tx.customerPhone}</p>
                    <p>{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}