import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ImageIcon, Save, UserRound } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMyProfile, useUpdateProfile } from "@/hooks/use-profile";
import { getMajorsForCollege, kfuColleges } from "@/data/kfuCatalog";
import { profileSchema } from "@/lib/validations";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading } = useMyProfile(user?.id ?? "");
  const updateProfile = useUpdateProfile();
  const [displayName, setDisplayName] = useState("");
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const majors = useMemo(() => getMajorsForCollege(college), [college]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? "");
    setCollege(profile.college ?? "");
    setMajor(profile.major ?? "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.avatar_url ?? "");
    setBannerUrl(profile.banner_url ?? "");
  }, [profile]);

  const handleCollegeChange = (value: string) => {
    setCollege(value);
    setMajor("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = profileSchema.safeParse({ display_name: displayName, college, major, bio, avatar_url: avatarUrl, banner_url: bannerUrl });
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) nextErrors[String(err.path[0])] = err.message; });
      setErrors(nextErrors);
      return;
    }
    if (!user) return;
    await updateProfile.mutateAsync({
      userId: user.id,
      values: {
        display_name: displayName,
        college: college || null,
        major: major || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
        banner_url: bannerUrl || null,
      },
    });
    toast({ title: "Profile updated", description: "Your KFU profile has been saved." });
  };

  if (authLoading || isLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <UserRound className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-3">Sign in to edit your profile</h1>
          <Link to="/login"><Button>Sign In</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const FieldError = ({ field }: { field: string }) => errors[field] ? <p className="text-sm text-destructive">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="overflow-hidden rounded-3xl border">
            <div className="h-44 bg-secondary bg-cover bg-center" style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}>
              {!bannerUrl && <div className="flex h-full items-center justify-center text-muted-foreground"><ImageIcon className="mr-2 h-5 w-5" />Banner preview</div>}
            </div>
            <CardContent className="relative p-6">
              <div className="-mt-16 mb-4 flex items-end gap-4">
                <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-background bg-secondary">
                  {avatarUrl ? <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><UserRound className="h-10 w-10 text-muted-foreground" /></div>}
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold">{displayName || user.email}</h1>
                  <p className="text-muted-foreground">{major || "Choose your major"}</p>
                </div>
              </div>
              {bio && <p className="max-w-2xl text-muted-foreground">{bio}</p>}
            </CardContent>
          </Card>

          <form onSubmit={handleSave}>
            <Card className="rounded-3xl border">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Customize how you appear when you upload, comment, and help other students.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Display Name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your display name" /><FieldError field="display_name" /></div>
                  <div className="space-y-2"><Label>Profile Image URL</Label><Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." /><FieldError field="avatar_url" /></div>
                </div>
                <div className="space-y-2"><Label>Banner Image URL</Label><Input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." /><FieldError field="banner_url" /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>College</Label><Select value={college} onValueChange={handleCollegeChange}><SelectTrigger><SelectValue placeholder="Select college" /></SelectTrigger><SelectContent className="bg-popover border max-h-72">{kfuColleges.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Major</Label><Select value={major} onValueChange={setMajor} disabled={!college}><SelectTrigger><SelectValue placeholder={college ? "Select major" : "Select college first"} /></SelectTrigger><SelectContent className="bg-popover border max-h-72">{majors.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short intro, study interests, or how students can recognize your resources..." className="min-h-[120px]" /><FieldError field="bio" /></div>
                <Button type="submit" className="rounded-full" disabled={updateProfile.isPending}><Save className="mr-2 h-4 w-4" />Save Profile</Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
