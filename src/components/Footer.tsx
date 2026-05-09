import { Link } from "react-router-dom";
import { AlertTriangle, GraduationCap, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import kfuLogo from "@/assets/kfu-logo.png";

const Footer = () => {
  const { t, isArabic } = useLanguage();
  return (
    <footer className="mt-auto border-t border-border bg-secondary/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={kfuLogo} alt="KFU Logo" className="h-10 w-auto" />
              <div>
                <span className="font-bold">Marja&apos; | مرجع</span>
                <p className="text-xs text-muted-foreground">{t("100% Free", "مجاني بالكامل")}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(
                "A free-of-charge, community-driven student resource platform for King Faisal University. Organized by college and major, with moderated Theory and Lab/Practical sections and clear file type labels.",
                "منصة موارد طلابية مجانية بالكامل ويقودها المجتمع لطلاب جامعة الملك فيصل. منظمة حسب الكلية والتخصص، مع أقسام نظري وعملي ومراجعة قبل النشر وتصنيف واضح لنوع الملف."
              )}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">{t("Quick Links", "روابط سريعة")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground">{t("Search Resources", "البحث في المصادر")}</Link></li>
              <li><Link to="/upload" className="text-muted-foreground hover:text-foreground">{t("Upload Resource", "رفع مصدر")}</Link></li>
              <li><Link to="/roadmap" className="text-muted-foreground hover:text-foreground">{t("Platform Roadmap", "خطة المنصة")}</Link></li>
              <li><Link to="/disclaimer" className="text-muted-foreground hover:text-foreground">{t("Academic Integrity", "النزاهة الأكاديمية")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-chart-1">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold">{t("Academic Integrity", "النزاهة الأكاديمية")}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {t(
                "No leaked exams or cheating materials allowed. All resources must be student-made material, legitimate links, or educational explanations.",
                "لا يُسمح بتسريب الاختبارات أو مواد الغش. يجب أن تكون الموارد من إعداد الطلاب أو روابط مشروعة أو شروحات تعليمية."
              )}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>{t("Official @student.kfu.edu.sa and @kfu.edu.sa emails accepted", "يتم قبول إيميلات @student.kfu.edu.sa و @kfu.edu.sa")}</span>
              </div>
              <a href="https://ko-fi.com/kiwii9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-background">
                <Coffee className="w-4 h-4" /> {t("Support the creator on Ko-fi", "ادعم المطور عبر Ko-fi")}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Marja&apos; | مرجع. {t("Free for KFU students. Made with love by students, for students.", "مجاني لطلاب KFU. صُنع بحب بواسطة الطلاب وللطلاب.")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
