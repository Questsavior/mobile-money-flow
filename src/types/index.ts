export type TransactionType = 'deposit' | 'withdrawal';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  customerPhone: string;
  agentPhone: string;
  timestamp: number;
  status: TransactionStatus;
  reference: string;
}

export interface Agent {
  phone: string;
  name: string;
  agentId: string;
  balance: number;
  transactions: Transaction[];
}

export interface SMSData {
  amount: number;
  phone: string;
  reference: string;
  type?: TransactionType;
}