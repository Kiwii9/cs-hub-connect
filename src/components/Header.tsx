import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Upload, LogIn, Shield, Map, Menu, LogOut, User, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import kfuLogo from "@/assets/kfu-logo.png";

const Header = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Colleges", show: true },
    { path: "/roadmap", label: "Roadmap", icon: Map, show: true },
    { path: "/upload", label: "Upload", icon: Upload, show: true },
    { path: "/my-uploads", label: "My Uploads", icon: FileText, show: !!user },
    { path: "/profile", label: "Profile", icon: User, show: !!user },
    { path: "/admin", label: "Admin", icon: Shield, show: isAdmin },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.filter(i => i.show).map((item) => (
        <Link key={item.path} to={item.path} onClick={() => mobile && setOpen(false)}>
          <Button
            variant={isActive(item.path) ? "default" : "ghost"}
            className={`rounded-full font-medium ${mobile ? "w-full justify-start" : ""}`}
          >
            {item.icon && <item.icon className="w-4 h-4 mr-2" />}
            {item.label}
          </Button>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={kfuLogo} alt="KFU Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">KFU Resource Hub</h1>
              <p className="text-xs text-muted-foreground">Free • English + Arabic</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {user.email}
                </span>
                <Button variant="outline" className="rounded-full border" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="rounded-full border font-medium">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <img src={kfuLogo} alt="KFU Logo" className="h-10 w-auto" />
                  <span className="font-bold">KFU Resource Hub</span>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLinks mobile />
                  <div className="border-t border-border my-4" />
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <Button variant="outline" className="w-full rounded-full border" onClick={() => { signOut(); setOpen(false); }}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full border">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
