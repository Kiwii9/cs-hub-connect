import { Link } from "react-router-dom";
import { AlertTriangle, GraduationCap } from "lucide-react";
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
                <span className="font-bold">KFU Study Hub</span>
                <p className="text-xs text-muted-foreground">By Students, For Students</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A community-driven resource sharing platform for King Faisal University students. 
              Serving every KFU college and major as the catalog grows.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Browse Courses
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
              No leaked exams or cheating materials allowed. All resources must be student-made notes, lecture links, or educational explanations.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>Official @student.kfu.edu.sa and @kfu.edu.sa emails accepted</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 KFU Study Hub. Made with ❤️ by students, for students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
