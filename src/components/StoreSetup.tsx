import React, { useState } from "react";
import { Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StoreSetupProps {
  onComplete: (storeData: any) => void;
}

export const StoreSetup = ({ onComplete }: StoreSetupProps) => {
  const [storeName, setStoreName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !storeName.trim()) return;

    setIsLoading(true);
    try {
      // Check if admin record exists
      const { data: existingAdmin } = await supabase
        .from("admins")
        .select("*")
        .eq("id", user.id)
        .single();

      let adminData;
      if (existingAdmin) {
        // Update existing admin
        const { data, error } = await supabase
          .from("admins")
          .update({
            store_name: storeName.trim(),
            email: user.email,
          })
          .eq("id", user.id)
          .select()
          .single();

        if (error) throw error;
        adminData = data;
      } else {
        // Create new admin record
        const { data, error } = await supabase
          .from("admins")
          .insert({
            id: user.id,
            email: user.email,
            store_name: storeName.trim(),
          })
          .select()
          .single();

        if (error) throw error;
        adminData = data;
      }

      toast({
        title: "Store Setup Complete!",
        description: `Welcome to your ${storeName} admin dashboard.`,
      });

      onComplete(adminData);
    } catch (error: any) {
      console.error("Error setting up store:", error);
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to set up store. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Brand.ed!</h1>
          <p className="text-white/80">Let's set up your store to get started</p>
        </div>

        <Card className="marketplace-card">
          <CardHeader>
            <CardTitle className="text-center">Store Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  placeholder="Enter your store name (e.g., Fashion Forward, Tech Gear)"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="marketplace-input"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This will be displayed on your products and store page.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full marketplace-button-primary"
                disabled={isLoading || !storeName.trim()}
              >
                {isLoading ? (
                  "Setting up..."
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Access your admin dashboard</li>
                <li>• Add and manage products</li>
                <li>• Track orders and sales</li>
                <li>• View analytics and reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};