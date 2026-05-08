import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useLecturers } from "@/hooks/use-lecturers";
import { academicYears, batchYears, resourceTypeOptions } from "@/data/kfuCatalog";

interface SearchFiltersProps { searchQuery: string; setSearchQuery: (query: string) => void; academicYear: string; setAcademicYear: (year: string) => void; semester: string; setSemester: (semester: string) => void; batchYear: string; setBatchYear: (batch: string) => void; lecturerId: string; setLecturerId: (id: string) => void; resourceType?: string; setResourceType?: (type: string) => void; }
const semesters = [{ value: "1", label: "Semester 1" }, { value: "2", label: "Semester 2" }, { value: "Summer", label: "Summer" }];

const SearchFilters = ({ searchQuery, setSearchQuery, academicYear, setAcademicYear, semester, setSemester, batchYear, setBatchYear, lecturerId, setLecturerId, resourceType, setResourceType }: SearchFiltersProps) => {
  const { data: lecturers = [] } = useLecturers();
  const hasFilters = searchQuery || academicYear || semester || batchYear || lecturerId || resourceType;
  const clearFilters = () => { setSearchQuery(""); setAcademicYear(""); setSemester(""); setBatchYear(""); setLecturerId(""); if (setResourceType) setResourceType(""); };
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="relative"><Search className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by title, tags, or topic..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-12 rounded-2xl border border-border pl-10 text-base" /></div>
      <div className="flex flex-wrap gap-3">
        <Select value={academicYear} onValueChange={setAcademicYear}><SelectTrigger className="w-[160px] rounded-full border border-border"><SelectValue placeholder="Academic Year" /></SelectTrigger><SelectContent className="border border-border bg-popover">{academicYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select>
        <Select value={semester} onValueChange={setSemester}><SelectTrigger className="w-[140px] rounded-full border border-border"><SelectValue placeholder="Semester" /></SelectTrigger><SelectContent className="border border-border bg-popover">{semesters.map((sem) => <SelectItem key={sem.value} value={sem.value}>{sem.label}</SelectItem>)}</SelectContent></Select>
        <Select value={batchYear} onValueChange={setBatchYear}><SelectTrigger className="w-[140px] rounded-full border border-border"><SelectValue placeholder="Batch Year" /></SelectTrigger><SelectContent className="border border-border bg-popover">{batchYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select>
        <Select value={lecturerId} onValueChange={setLecturerId}><SelectTrigger className="w-[200px] rounded-full border border-border"><SelectValue placeholder="Lecturer" /></SelectTrigger><SelectContent className="border border-border bg-popover">{lecturers.map((lecturer) => <SelectItem key={lecturer.id} value={lecturer.id}>{lecturer.name}</SelectItem>)}</SelectContent></Select>
        {setResourceType && <Select value={resourceType} onValueChange={setResourceType}><SelectTrigger className="w-[160px] rounded-full border border-border"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent className="border border-border bg-popover">{resourceTypeOptions.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent></Select>}
        {hasFilters && <Button variant="ghost" onClick={clearFilters} className="rounded-full text-muted-foreground"><X className="w-4 h-4 mr-1" />Clear</Button>}
      </div>
    </div>
  );
};

export default SearchFilters;
