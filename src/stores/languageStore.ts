import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTranslation, type Language } from "@/utils/translations";

interface ILanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<ILanguageState>()(
  persist(
    (set, get) => ({
      language: "ko",
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string, params?: Record<string, string | number>) => {
        const { language } = get();
        return getTranslation(language, key, params);
      },
    }),
    {
      name: "language-storage",
    },
  ),
);
