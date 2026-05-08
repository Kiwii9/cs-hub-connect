import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Sparkles, Users, Database, MessageSquare, Bell, Trophy, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface RoadmapItem {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  icon: React.ElementType;
  features: string[];
}

const roadmapItems: RoadmapItem[] = [
  {
    title: "MVP Launch",
    description: "Core platform features",
    status: "completed",
    icon: BookOpen,
    features: [
      "College → Major navigation for KFU",
      "Theory and Lab/Practical resource browsing",
      "Search and filter functionality",
      "Upload resources with approval before public release",
      "Report inappropriate content",
      "Admin moderation panel"
    ]
  },
  {
    title: "User Authentication",
    description: "Secure student-only access",
    status: "in-progress",
    icon: Users,
    features: [
      "KFU email verification (@student.kfu.edu.sa and @kfu.edu.sa)",
      "Google Sign-in integration",
      "User profiles and upload history",
      "Contributor recognition"
    ]
  },
  {
    title: "Database & Storage",
    description: "Persistent data storage",
    status: "in-progress",
    icon: Database,
    features: [
      "Cloud database for all resources",
      "File storage for PDFs and images",
      "Real-time updates",
      "Data backup and recovery"
    ]
  },
  {
    title: "KFU-Wide Coverage",
    description: "Support every KFU college",
    status: "planned",
    icon: Sparkles,
    features: [
      "College and major filters",
      "Exact KFU college and major catalog",
      "Major-specific course tagging",
      "Cleaner admin workflow for adding courses"
    ]
  },
  {
    title: "Community Features",
    description: "Enhanced collaboration",
    status: "planned",
    icon: MessageSquare,
    features: [
      "Comments and discussions on resources",
      "Upvote and Praise recognition system",
      "Resource requests",
      "Study groups"
    ]
  },
  {
    title: "Notifications",
    description: "Stay updated",
    status: "planned",
    icon: Bell,
    features: [
      "New resource alerts for your courses",
      "Email notifications",
      "Bookmark/favorite resources",
      "Weekly digest"
    ]
  },
  {
    title: "Gamification",
    description: "Reward contributors",
    status: "planned",
    icon: Trophy,
    features: [
      "Recognition for helpful uploads",
      "Contributor badges",
      "Leaderboards",
      "Recognition for top helpers"
    ]
  }
];

const statusConfig = {
  'completed': { label: 'Completed', variant: 'default' as const, className: 'bg-chart-2 text-primary-foreground' },
  'in-progress': { label: 'In Progress', variant: 'secondary' as const, className: 'bg-chart-1 text-primary-foreground' },
  'planned': { label: 'Planned', variant: 'outline' as const, className: '' }
};

const RoadmapPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Platform Roadmap</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              KFU Resource Hub is built by students, for students. Here's what we're working on to make it even better.
            </p>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Badge className={statusConfig['completed'].className}>Completed</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig['in-progress'].className}>In Progress</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Planned</Badge>
            </div>
          </div>

          {/* Roadmap Items */}
          <div className="space-y-6">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon;
              const status = statusConfig[item.status];
              
              return (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 flex items-center justify-center border-2 ${
                          item.status === 'completed' ? 'bg-chart-2/10 border-chart-2/30' :
                          item.status === 'in-progress' ? 'bg-chart-1/10 border-chart-1/30' :
                          'bg-secondary border-border'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            item.status === 'completed' ? 'text-chart-2' :
                            item.status === 'in-progress' ? 'text-chart-1' :
                            'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={status.className} variant={status.variant}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          {item.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-chart-2 flex-shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={item.status === 'completed' ? '' : 'text-muted-foreground'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          <Card className="border-2 mt-12 bg-secondary">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-bold mb-2">Have Ideas?</h3>
              <p className="text-muted-foreground mb-4">
                This platform is built for you! If you have feature suggestions or want to contribute, 
                reach out to us.
              </p>
              <p className="text-sm text-muted-foreground">
                Built with ❤️ by KFU students
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoadmapPage;