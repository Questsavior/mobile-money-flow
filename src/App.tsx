import { useState } from "react";
import { useAgent } from "./hooks/use-agent";
import { AuthForm } from "./components/auth/AuthForm";
import { Overview } from "./components/dashboard/Overview";
import { TransactionForm } from "./components/transactions/TransactionForm";
import { History } from "./components/transactions/History";
import { Toaster } from "@/components/ui/sonner";
import { LogOut, LayoutDashboard, History as HistoryIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "dashboard" | "deposit" | "withdraw" | "history";

function App() {
  const { agent, login, logout, processTransaction, isLoading } = useAgent();
  const [currentView, setCurrentView] = useState<View>("dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <div className="h-4 w-32 bg-primary/10 rounded" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <>
        <AuthForm onLogin={login} />
        <Toaster position="top-center" />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Overview 
            agent={agent} 
            onAction={(action) => setCurrentView(action)} 
          />
        );
      case "deposit":
        return (
          <TransactionForm 
            type="deposit" 
            agentBalance={agent.balance}
            onBack={() => setCurrentView("dashboard")}
            onSubmit={(amount, phone, ref) => {
              processTransaction("deposit", amount, phone, ref);
              setCurrentView("dashboard");
            }}
          />
        );
      case "withdraw":
        return (
          <TransactionForm 
            type="withdrawal" 
            agentBalance={agent.balance}
            onBack={() => setCurrentView("dashboard")}
            onSubmit={(amount, phone, ref) => {
              processTransaction("withdrawal", amount, phone, ref);
              setCurrentView("dashboard");
            }}
          />
        );
      case "history":
        return (
          <History 
            transactions={agent.transactions} 
            onBack={() => setCurrentView("dashboard")} 
          />
        );
      default:
        return <Overview agent={agent} onAction={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <LayoutDashboard className="w-6 h-6" />
            <span>( BETA)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-4">
              <User className="w-4 h-4" />
              <span>{agent.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {renderView()}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-border flex justify-around items-center h-16 px-4">
        <Button 
          variant="ghost" 
          className={`flex-col gap-1 h-auto py-2 ${currentView === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex-col gap-1 h-auto py-2 ${currentView === 'deposit' ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => setCurrentView('deposit')}
        >
          <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/30">
            <LogOut className="w-4 h-4 rotate-90 text-emerald-600" />
          </div>
          <span className="text-[10px]">Deposit</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex-col gap-1 h-auto py-2 ${currentView === 'withdraw' ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => setCurrentView('withdraw')}
        >
          <div className="p-1 rounded bg-orange-100 dark:bg-orange-900/30">
            <LogOut className="w-4 h-4 -rotate-90 text-orange-600" />
          </div>
          <span className="text-[10px]">Withdraw</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`flex-col gap-1 h-auto py-2 ${currentView === 'history' ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={() => setCurrentView('history')}
        >
          <HistoryIcon className="w-5 h-5" />
          <span className="text-[10px]">History</span>
        </Button>
      </nav>
    </div>
  );
}

export default App;