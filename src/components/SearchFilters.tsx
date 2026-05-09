import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useLecturers } from "@/hooks/use-lecturers";
import { academicYears, batchYears, fileTypeOptions, sectionOptions } from "@/data/kfuCatalog";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  academicYear: string;
  setAcademicYear: (year: string) => void;
  semester: string;
  setSemester: (semester: string) => void;
  batchYear: string;
  setBatchYear: (batch: string) => void;
  lecturerId: string;
  setLecturerId: (id: string) => void;
  section?: string;
  setSection?: (section: string) => void;
  fileType?: string;
  setFileType?: (type: string) => void;
}

const semesters = [{ value: "1", label: "Semester 1", labelAr: "الفصل الأول" }, { value: "2", label: "Semester 2", labelAr: "الفصل الثاني" }, { value: "Summer", label: "Summer", labelAr: "الصيفي" }];

const SearchFilters = ({ searchQuery, setSearchQuery, academicYear, setAcademicYear, semester, setSemester, batchYear, setBatchYear, lecturerId, setLecturerId, section, setSection, fileType, setFileType }: SearchFiltersProps) => {
  const { data: lecturers = [] } = useLecturers();
  const { t, isArabic } = useLanguage();
  const hasFilters = searchQuery || academicYear || semester || batchYear || lecturerId || section || fileType;
  const clearFilters = () => {
    setSearchQuery("");
    setAcademicYear("");
    setSemester("");
    setBatchYear("");
    setLecturerId("");
    if (setSection) setSection("");
    if (setFileType) setFileType("");
  };

  return (
    <div className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="relative">
        <Search className={`${isArabic ? "right-3" : "left-3"} absolute top-1/2 w-5 h-5 -translate-y-1/2 text-muted-foreground`} />
        <Input
          placeholder={t("Search by title, file type, tags, or topic...", "ابحث بالعنوان أو نوع الملف أو الوسوم أو الموضوع...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`h-12 rounded-2xl border border-border ${isArabic ? "pr-10 text-right" : "pl-10"} text-base`}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {setSection && <Select value={section} onValueChange={setSection}><SelectTrigger className="w-[180px] rounded-full border border-border"><SelectValue placeholder={t("Section", "القسم")} /></SelectTrigger><SelectContent className="border border-border bg-popover">{sectionOptions.map((item) => <SelectItem key={item.value} value={item.value}>{t(item.label, item.labelAr)}</SelectItem>)}</SelectContent></Select>}
        {setFileType && <Select value={fileType} onValueChange={setFileType}><SelectTrigger className="w-[220px] rounded-full border border-border"><SelectValue placeholder={t("File Type", "نوع الملف")} /></SelectTrigger><SelectContent className="border border-border bg-popover">{fileTypeOptions.map((item) => <SelectItem key={item.value} value={item.value}>{t(item.label, item.labelAr)}</SelectItem>)}</SelectContent></Select>}
        <Select value={academicYear} onValueChange={setAcademicYear}><SelectTrigger className="w-[160px] rounded-full border border-border"><SelectValue placeholder={t("Academic Year", "السنة الدراسية")} /></SelectTrigger><SelectContent className="border border-border bg-popover">{academicYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select>
        <Select value={semester} onValueChange={setSemester}><SelectTrigger className="w-[140px] rounded-full border border-border"><SelectValue placeholder={t("Semester", "الفصل")} /></SelectTrigger><SelectContent className="border border-border bg-popover">{semesters.map((sem) => <SelectItem key={sem.value} value={sem.value}>{t(sem.label, sem.labelAr)}</SelectItem>)}</SelectContent></Select>
        <Select value={batchYear} onValueChange={setBatchYear}><SelectTrigger className="w-[140px] rounded-full border border-border"><SelectValue placeholder={t("Batch Year", "دفعة")} /></SelectTrigger><SelectContent className="border border-border bg-popover">{batchYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select>
        <Select value={lecturerId} onValueChange={setLecturerId}><SelectTrigger className="w-[200px] rounded-full border border-border"><SelectValue placeholder={t("Lecturer", "الدكتور")} /></SelectTrigger><SelectContent className="border border-border bg-popover">{lecturers.map((lecturer) => <SelectItem key={lecturer.id} value={lecturer.id}>{lecturer.name}</SelectItem>)}</SelectContent></Select>
        {hasFilters && <Button variant="ghost" onClick={clearFilters} className="rounded-full text-muted-foreground"><X className={`${isArabic ? "ml-1" : "mr-1"} w-4 h-4`} />{t("Clear", "مسح")}</Button>}
      </div>
    </div>
  );
};

export default SearchFilters;
