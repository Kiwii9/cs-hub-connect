import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Upload, LogIn, Shield, Map, Menu, LogOut, User, FileText, Languages } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import kfuLogo from "@/assets/kfu-logo.png";

const Header = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { language, toggleLanguage, t, isArabic } = useLanguage();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: t("Search", "البحث"), show: true },
    { path: "/roadmap", label: t("Roadmap", "الخطة"), icon: Map, show: true },
    { path: "/upload", label: t("Upload", "رفع مصدر"), icon: Upload, show: true },
    { path: "/my-uploads", label: t("My Uploads", "مرفوعاتي"), icon: FileText, show: !!user },
    { path: "/profile", label: t("Profile", "الملف الشخصي"), icon: User, show: !!user },
    { path: "/admin", label: t("Admin", "الإدارة"), icon: Shield, show: isAdmin },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.filter(i => i.show).map((item) => (
        <Link key={item.path} to={item.path} onClick={() => mobile && setOpen(false)}>
          <Button
            variant={isActive(item.path) ? "default" : "ghost"}
            className={`rounded-full font-medium ${mobile ? "w-full justify-start" : ""}`}
          >
            {item.icon && <item.icon className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />}
            {item.label}
          </Button>
        </Link>
      ))}
    </>
  );

  const LanguageToggle = ({ mobile = false }: { mobile?: boolean }) => (
    <Button variant="outline" className={`${mobile ? "w-full justify-start" : ""} rounded-full border font-medium`} onClick={toggleLanguage}>
      <Languages className={`${isArabic ? "ml-2" : "mr-2"} h-4 w-4`} />
      {language === "en" ? "العربية" : "English"}
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-3 group">
            <img src={kfuLogo} alt="KFU Logo" className="h-12 w-auto" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight">Marja&apos; | مرجع</h1>
              <p className="truncate text-xs text-muted-foreground">{t("Free community resource platform", "منصة موارد مجانية يقودها المجتمع")}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
            <LanguageToggle />
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {user.email}
                </span>
                <Button variant="outline" className="rounded-full border" onClick={signOut}>
                  <LogOut className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />
                  {t("Sign Out", "تسجيل الخروج")}
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="rounded-full border font-medium">
                  <LogIn className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />
                  {t("Sign In", "تسجيل الدخول")}
                </Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isArabic ? "left" : "right"} className="w-72 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <img src={kfuLogo} alt="KFU Logo" className="h-10 w-auto" />
                  <div>
                    <span className="font-bold">Marja&apos; | مرجع</span>
                    <p className="text-xs text-muted-foreground">{t("Free community resource platform", "منصة موارد مجانية يقودها المجتمع")}</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLinks mobile />
                  <LanguageToggle mobile />
                  <div className="border-t border-border my-4" />
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <Button variant="outline" className="w-full rounded-full border" onClick={() => { signOut(); setOpen(false); }}>
                        <LogOut className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />
                        {t("Sign Out", "تسجيل الخروج")}
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full border">
                        <LogIn className={`${isArabic ? "ml-2" : "mr-2"} w-4 h-4`} />
                        {t("Sign In", "تسجيل الدخول")}
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
