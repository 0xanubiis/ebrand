import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="marketplace-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-white">Brand.ed</span>
            </div>
            <p className="text-white/80 mb-4">
              Your premier destination for multi-brand fashion shopping. Discover, shop, and express your style.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-sm inline-block">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/80 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 BrandHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};