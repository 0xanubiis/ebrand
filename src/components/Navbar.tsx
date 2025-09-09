import { Link } from "react-router-dom";
import { Menu, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CartTrigger } from "@/components/CartDropdown";

export const Navbar = () => {

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 backdrop-blur border-b border-border">
      <div className="marketplace-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-white">
              Brand.ed
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-slate-300 transition-colors font-medium flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-white hover:text-slate-300 transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-slate-300 transition-colors font-medium"
            >
              About
            </Link>
          </div>

          {/* Search & Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 w-64 text-black"
              />
              <CartTrigger />
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4 text-black" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg font-medium text-white hover:text-slate-300 transition-colors flex items-center"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                  <Link 
                    to="/products" 
                    className="text-lg font-medium text-white hover:text-slate-300 transition-colors"
                  >
                    Marketplace
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-lg font-medium text-white hover:text-slate-300 transition-colors"
                  >
                    About
                  </Link>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
                    <Input 
                      placeholder="Search products..." 
                      className="pl-10 text-black"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};