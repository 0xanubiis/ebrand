import { Link } from "react-router-dom";
import { CheckCircle, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const Success = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="marketplace-container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4 text-muted-foreground">
                <Package className="h-5 w-5" />
                <span>You will receive an email confirmation with tracking details once your order ships.</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center space-x-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/products">
              <Button className="flex items-center">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;