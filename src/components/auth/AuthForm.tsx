import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet, Phone } from 'lucide-react';

interface AuthFormProps {
  onLogin: (phone: string, name: string) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && name) {
      onLogin(phone, name);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">( BETA)</h1>
          <p className="text-muted-foreground mt-2">Manage your deposits and withdrawals securely</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Agent Login</CardTitle>
              <CardDescription>Enter your details to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel"
                    className="pl-10"
                    placeholder="254 7XX XXX XXX" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-11 text-lg">
                Enter Dashboard
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="rounded-xl overflow-hidden shadow-lg">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/9091d285-1767-491d-b67f-5edfd38b55a0/mobile-money-agent-login-screen-71d838db-1779353595951.webp" 
            alt="Agent App Interface" 
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}