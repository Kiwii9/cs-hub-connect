import { Link } from "react-router-dom";
import { AlertTriangle, GraduationCap, Coffee } from "lucide-react";
import kfuLogo from "@/assets/kfu-logo.png";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={kfuLogo} alt="KFU Logo" className="h-10 w-auto" />
              <div>
                <span className="font-bold">KFU Resource Hub</span>
                <p className="text-xs text-muted-foreground">100% Free • مجاني بالكامل</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A 100% free community-driven resource sharing platform for King Faisal University students. Organized by college and major, with moderated Theory and Lab/Practical resources.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Browse Colleges & Majors
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-muted-foreground hover:text-foreground">
                  Upload Resource
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-muted-foreground hover:text-foreground">
                  Platform Roadmap
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground">
                  Academic Integrity
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-chart-1">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold">Academic Integrity</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              No leaked exams or cheating materials allowed. All resources must be student-made theory, lab/practical material, legitimate links, or educational explanations.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>Official @student.kfu.edu.sa and @kfu.edu.sa emails accepted</span>
              </div>
              <a href="https://ko-fi.com/kiwii9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-background">
                <Coffee className="w-4 h-4" /> Support the creator on Ko-fi
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 KFU Resource Hub. Free for KFU students. Made with ❤️ by students, for students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
