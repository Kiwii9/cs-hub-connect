export const kfuCollegeMajors = {
  "College of Business Administration": [
    "Management",
    "Accounting",
    "Finance",
    "Quantitative Methods",
    "Economics",
    "Management Information Systems",
  ],
  "College of Education": [
    "Educational Leadership",
    "Physical Education",
    "Art Education",
    "Kindergarten",
    "Curriculum and Instruction",
    "Education and Psychology",
    "Special Education",
  ],
  "College of Medicine": [
    "Biomedical Sciences",
    "Family and Community Medicine",
    "Internal Medicine",
    "Obstetrics and Gynecology",
    "Surgery",
    "Medical Education",
    "Pediatrics",
    "Clinical Neurosciences",
  ],
  "College of Science": ["Mathematics and Statistics", "Physics", "Chemistry", "Life Sciences"],
  "College of Veterinary Medicine": [
    "Anatomy",
    "Biomedical Sciences",
    "Clinical Sciences",
    "Pathology",
    "Public Health",
    "Microbiology",
  ],
  "College of Sharia and Islamic Studies": [
    "Sharia",
    "Fundamentals of Religion (Usul al-Din)",
    "Islamic Studies",
    "Jurisprudence (Fiqh)",
  ],
  "College of Arts": ["Arabic Language", "English Language", "Social Studies", "Geography", "Communication and Media"],
  "College of Law": ["Public Law", "Private Law"],
  "College of Dentistry": ["Oral and Dental Surgery"],
  "Applied College": [
    "Accounting",
    "Marketing",
    "Computer",
    "Nursing",
    "Oral Health Technician",
    "Finance",
    "Risk Management",
  ],
  "Applied College - Abqaiq Branch": ["Computer", "Administration", "Health"],
} as const;

export const kfuColleges = Object.keys(kfuCollegeMajors) as Array<keyof typeof kfuCollegeMajors>;

export const getMajorsForCollege = (college: string) => {
  return (kfuCollegeMajors as Record<string, readonly string[]>)[college] ?? [];
};

export const resourceTypeOptions = [
  { value: "theory", label: "Theory", labelAr: "نظري" },
  { value: "lab_practical", label: "Lab / Practical", labelAr: "عملي / مختبر" },
] as const;

export const legacyResourceTypeLabels: Record<string, string> = {
  notes: "Theory",
  summary: "Theory",
  lecture_link: "Theory",
  practice: "Lab / Practical",
  theory: "Theory",
  lab_practical: "Lab / Practical",
};

export const academicYears = ["2026-2027", "2025-2026", "2024-2025", "2023-2024", "2022-2023"];
export const batchYears = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];
export const semesters = [
  { value: "1", label: "Semester 1", labelAr: "الفصل الأول" },
  { value: "2", label: "Semester 2", labelAr: "الفصل الثاني" },
  { value: "Summer", label: "Summer", labelAr: "الصيفي" },
];
