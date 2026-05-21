import { useState, useEffect } from 'react';
import { Agent, Transaction, TransactionType } from '../types';
import { toast } from 'sonner';

const STORAGE_KEY = 'agent_portal_data';

export function useAgent() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setAgent(JSON.parse(savedData));
    }
    setIsLoading(false);
  }, []);

  const saveAgent = (newAgent: Agent | null) => {
    if (newAgent) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgent));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setAgent(newAgent);
  };

  const login = (phone: string, name: string) => {
    const newAgent: Agent = {
      phone,
      name,
      agentId: `AG-${Math.floor(100000 + Math.random() * 900000)}`,
      balance: 50000, // Initial balance for demo
      transactions: []
    };
    saveAgent(newAgent);
    toast.success(`Welcome back, Agent ${name}`);
  };

  const logout = () => {
    saveAgent(null);
    toast.info('Logged out successfully');
  };

  const processTransaction = (type: TransactionType, amount: number, customerPhone: string, reference?: string) => {
    if (!agent) return;

    // Validation
    if (type === 'deposit' && agent.balance < amount) {
      toast.error('Insufficient balance for this deposit');
      return;
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(7),
      type,
      amount,
      customerPhone,
      agentPhone: agent.phone,
      timestamp: Date.now(),
      status: 'completed',
      reference: reference || `REF-${Math.random().toString(36).substring(7).toUpperCase()}`
    };

    const newBalance = type === 'deposit' 
      ? agent.balance - amount 
      : agent.balance + amount;

    const updatedAgent: Agent = {
      ...agent,
      balance: newBalance,
      transactions: [newTransaction, ...agent.transactions]
    };

    saveAgent(updatedAgent);
    toast.success(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} of ${amount} to ${customerPhone} completed`);
  };

  return {
    agent,
    isLoading,
    login,
    logout,
    processTransaction
  };
}