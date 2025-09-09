import { BarChart3, Package, ShoppingCart, LogOut, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface AdminSidebarProps {
  currentView: string;
  setCurrentView: (view: "dashboard" | "products" | "orders") => void;
  adminData: any;
  onSignOut: () => void;
}

export const AdminSidebar = ({ currentView, setCurrentView, adminData, onSignOut }: AdminSidebarProps) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Brand.ed</h2>
            <p className="text-sm text-muted-foreground">{adminData?.store_name}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 bg-black">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setCurrentView(item.id as any)}
                isActive={currentView === item.id}
                className="w-full"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};