import { Link } from "react-router-dom";
import { ArrowLeft, Users, Target, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="marketplace-container py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-slate-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">About Brand.ed</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Your premier destination for multi-brand fashion shopping. Discover, shop, and express your style.
          </p>
        </div>

        {/* Hero Section */}
        <section className="marketplace-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Multi-Brand Fashion Platform
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Bringing Fashion Brands Together
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Brand.ed is more than just a marketplace - it's a platform that connects fashion enthusiasts 
                with their favorite brands and helps them discover new ones. We believe that great style 
                shouldn't be limited by brand boundaries.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
              </div>
            </div>
            <div className="bg-marketplace-gradient rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/90 mb-4">
                To create a unified shopping experience where fashion lovers can explore, 
                discover, and purchase from multiple brands in one seamless platform.
              </p>
              <p className="text-white/90">
                We're building the future of fashion retail - one where brands and customers 
                connect directly, creating authentic relationships and driving innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="marketplace-section bg-slate-950 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Building a community where brands and customers can connect, 
                  share stories, and grow together.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  Constantly evolving our platform to provide the best shopping 
                  experience with cutting-edge technology.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  Curating only the best products from trusted brands to ensure 
                  every purchase exceeds expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="marketplace-section">
          <h2 className="text-3xl font-bold text-center mb-12">How Brand.ed Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">For Shoppers</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Discover Brands</h4>
                    <p className="text-muted-foreground text-sm">
                      Browse through hundreds of brands and thousands of products
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Shop Seamlessly</h4>
                    <p className="text-muted-foreground text-sm">
                      Add items from multiple brands to your cart and checkout once
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Enjoy Fast Delivery</h4>
                    <p className="text-muted-foreground text-sm">
                      Get your orders delivered quickly with our logistics network
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">For Brands</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Easy Setup</h4>
                    <p className="text-muted-foreground text-sm">
                      Create your store and start selling in minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Reach More Customers</h4>
                    <p className="text-muted-foreground text-sm">
                      Access our growing community of fashion enthusiasts
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Grow Your Business</h4>
                    <p className="text-muted-foreground text-sm">
                      Use our analytics and tools to optimize your sales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="marketplace-section text-center mb-16">
          <div className="bg-marketplace-gradient rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Brand.ed?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Whether you're looking to shop the latest fashion or grow your brand, 
              Brand.ed is the perfect platform for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-white text-black hover:bg-slate-300">
                  Start Shopping
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="bg-white border-white text-black hover:bg-slate-300">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;