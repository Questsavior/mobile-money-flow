import { Agent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowUpCircle, ArrowDownCircle, History, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverviewProps {
  agent: Agent;
  onAction: (action: 'deposit' | 'withdraw' | 'history') => void;
}

export function Overview({ agent, onAction }: OverviewProps) {
  const recentTransactions = agent.transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <Wallet className="w-40 h-40" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 opacity-90">
              <Wallet className="w-4 h-4" />
              Agent Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {agent.balance.toLocaleString()} <span className="text-sm font-normal">USD</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
              <User className="w-4 h-4" />
              Agent ID: {agent.agentId}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onAction('deposit')}
            className="h-full flex-col gap-2 bg-emerald-500 hover:bg-emerald-600 border-none shadow-md"
          >
            <ArrowUpCircle className="w-8 h-8" />
            <span>Deposit</span>
          </Button>
          <Button 
            onClick={() => onAction('withdraw')}
            className="h-full flex-col gap-2 bg-orange-500 hover:bg-orange-600 border-none shadow-md"
          >
            <ArrowDownCircle className="w-8 h-8" />
            <span>Withdraw</span>
          </Button>
        </div>
      </motion.div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Button variant="ghost" size="sm" onClick={() => onAction('history')} className="flex items-center gap-2">
            <History className="w-4 h-4" />
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                No transactions yet. Start by making a deposit.
              </CardContent>
            </Card>
          ) : (
            recentTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                        {tx.type === 'deposit' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm capitalize">{tx.type}</p>
                        <p className="text-xs text-muted-foreground">{tx.customerPhone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === 'deposit' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {tx.type === 'deposit' ? '-' : '+'}{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow-lg border border-border/50">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/9091d285-1767-491d-b67f-5edfd38b55a0/mobile-money-agent-dashboard-a627c01d-1779353597739.webp" 
          alt="Agent Dashboard Illustration" 
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}