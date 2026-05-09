import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-chart-1/10 border-2 border-chart-1/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-chart-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Academic Integrity</h1>
              <p className="text-muted-foreground">Guidelines for Marja' | مرجع</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-chart-2">
                  <CheckCircle className="w-5 h-5" />
                  What IS Allowed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Theory Resources:</strong> Student-made lecture notes, explanations, and study guides</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Lab / Practical Resources:</strong> Student-made lab notes, practical checklists, and safe learning references</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Self-made Practice:</strong> Original revision questions that are not copied from exams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Educational Links:</strong> Links to free, public educational resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Concept Explanations:</strong> Your own explanations of difficult concepts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  What is NOT Allowed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Leaked Exams:</strong> Past exam papers that were not officially released</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Exam Solutions:</strong> Answers to actual exam questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Assignment Solutions:</strong> Complete solutions to graded assignments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Copyrighted Materials:</strong> Textbook PDFs, publisher resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span><strong>Cheating Content:</strong> Any material that could be used for academic dishonesty</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Reporting Violations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you encounter any resource that violates these guidelines, please use the 
                  <strong> Report</strong> button on the resource page. Our moderation team will review 
                  all reports and take appropriate action.
                </p>
                <p className="text-muted-foreground text-sm">
                  Violations may result in content removal and account suspension. Repeated violations 
                  may lead to permanent bans.
                </p>
              </CardContent>
            </Card>

            <div className="text-center pt-8">
              <p className="text-muted-foreground mb-4">
                By using Marja' | مرجع, you agree to follow these guidelines. The platform is 100% free.
              </p>
              <Link to="/">
                <Button size="lg" className="border-2">
                  Back to Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DisclaimerPage;
