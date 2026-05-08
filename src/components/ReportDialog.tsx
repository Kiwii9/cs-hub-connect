import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateReport } from "@/hooks/use-reports";

interface ReportDialogProps {
  resourceId: string;
  resourceTitle: string;
}

const reportReasons = [
  { value: 'leaked_exam', label: 'Leaked exam / Cheating content' },
  { value: 'wrong_course', label: 'Wrong course' },
  { value: 'spam', label: 'Spam / Low quality' },
  { value: 'copyright', label: 'Copyright / Stolen content' },
  { value: 'other', label: 'Other' },
];

const ReportDialog = ({ resourceId, resourceTitle }: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const createReport = useCreateReport();

  const handleSubmit = async () => {
    if (!reason) {
      toast({ title: "Please select a reason", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Please sign in to report", variant: "destructive" });
      return;
    }

    try {
      await createReport.mutateAsync({
        resource_id: resourceId,
        reporter_id: user.id,
        reason,
        details: details || undefined,
      });
      toast({ title: "Report submitted", description: "Thank you for helping keep KFU Study Hub safe." });
      setOpen(false);
      setReason('');
      setDetails('');
    } catch {
      toast({ title: "Failed to submit report", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Flag className="w-4 h-4 mr-2" />Report
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2">
        <DialogHeader>
          <DialogTitle>Report Resource</DialogTitle>
          <DialogDescription>Report "{resourceTitle}" for violating community guidelines.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="border-2"><SelectValue placeholder="Select a reason" /></SelectTrigger>
              <SelectContent className="bg-popover border-2">
                {reportReasons.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Additional details (optional)</Label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Provide more context..." className="border-2 min-h-[100px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="destructive" disabled={createReport.isPending}>
            {createReport.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
