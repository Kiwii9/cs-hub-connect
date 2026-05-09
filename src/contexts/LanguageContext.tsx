import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ar";

type LanguageContextType = {
  language: Language;
  isArabic: boolean;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  t: (en: string, ar: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  isArabic: false,
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (en) => en,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("marja-language") as Language) || "en";
  });

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("marja-language", nextLanguage);
  };

  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      isArabic: language === "ar",
      toggleLanguage,
      setLanguage,
      t: (en: string, ar: string) => (language === "ar" ? ar : en),
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
