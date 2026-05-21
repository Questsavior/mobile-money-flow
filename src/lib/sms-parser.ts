import { SMSData, TransactionType } from '../types';

/**
 * Simulates parsing a mobile money SMS confirmation message.
 * In a real app, this would use regex patterns matching the specific telco format.
 * 
 * Example formats:
 * 1. "Confirmed. You have received 500 USD from 254712345678. Ref: XYZ123."
 * 2. "Withdrawal of 1000 USD to 254712345678 successful. Ref: ABC456."
 */
export function parseSMS(text: string): SMSData | null {
  try {
    // Basic regex for amount (digits followed by currency or vice versa)
    const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:USD|KES|GHS|UGX|TZS|RWF|ZAR|EUR)/i) || 
                       text.match(/(?:USD|KES|GHS|UGX|TZS|RWF|ZAR|EUR)\s*(\d+(?:\.\d+)?)/i);
    
    // Basic regex for phone numbers (usually starts with + or a common prefix)
    const phoneMatch = text.match(/(?:\+?\d{10,13})/);
    
    // Basic regex for reference (alphanumeric, usually 6-12 chars)
    const refMatch = text.match(/Ref:\s*([A-Z0-9]+)/i) || text.match(/([A-Z0-9]{8,12})/i);

    if (!amountMatch || !phoneMatch) return null;

    const amount = parseFloat(amountMatch[1]);
    const phone = phoneMatch[0];
    const reference = refMatch ? refMatch[1] : `SIM-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Determine type based on keywords
    let type: TransactionType | undefined;
    if (text.toLowerCase().includes('received') || text.toLowerCase().includes('deposit')) {
      type = 'withdrawal'; // If agent receives money, it's usually the customer withdrawing
    } else if (text.toLowerCase().includes('withdrawal') || text.toLowerCase().includes('sent')) {
      type = 'deposit'; // If agent sends money, it's a deposit for the customer
    }

    return {
      amount,
      phone,
      reference,
      type
    };
  } catch (error) {
    console.error("SMS Parsing Error:", error);
    return null;
  }
}