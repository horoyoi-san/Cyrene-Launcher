import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import th from "./locales/th";

const browserLang = navigator.language.startsWith("th") ? "th" : "en";
const savedLang = localStorage.getItem("lang");

const lang =
  savedLang === "en" || savedLang === "th"
    ? savedLang
    : browserLang;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
    },
    lng: lang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false, // 🔥 สำคัญมาก
    react: {
      useSuspense: false, // 🔥 แก้ context crash
    },
  });

export default i18n;
