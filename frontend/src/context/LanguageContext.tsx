import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "ProjectProof",
    appSubtitle: "Authenticity & Problem-Solving Evidence Platform",
    learnerDashboard: "Learner Dashboard",
    mentorDashboard: "Mentor Review Queue",
    ethics: "Ethics & Principles",
    totalProjects: "Total Projects",
    draftProjects: "Draft Projects",
    submittedProjects: "Submitted Projects",
    avgProcessScore: "Avg Process Score",
    processScore: "Process Score",
    presentationScore: "Presentation Score",
    gap: "Presentation/Process Gap",
    authenticityStatus: "Authenticity Status",
    evidenceCompleteness: "Evidence Completeness",
    viewProject: "View Details",
    addEvidence: "Add Evidence",
    submitProject: "Submit Project",
    createNewProject: "Create New Project",
    logout: "Logout",
    login: "Sign In",
    register: "Register",
    strongEvidence: "STRONG EVIDENCE",
    moderateEvidence: "MODERATE EVIDENCE",
    needsReview: "NEEDS REVIEW",
    insufficientEvidence: "INSUFFICIENT EVIDENCE",
  },
  ta: {
    appTitle: "பிராஜெக்ட் புரூஃப்",
    appSubtitle: "திட்ட நம்பகத்தன்மை மற்றும் சிக்கல் தீர்க்கும் சான்று தளம்",
    learnerDashboard: "கற்பவர் டாஷ்போர்டு",
    mentorDashboard: "மெண்டர் மதிப்பாய்வு வரிசை",
    ethics: "அறநெறிகள் & கோட்பாடுகள்",
    totalProjects: "மொத்த திட்டங்கள்",
    draftProjects: "வரைவு திட்டங்கள்",
    submittedProjects: "சமர்ப்பிக்கப்பட்ட திட்டங்கள்",
    avgProcessScore: "சராசரி செயல்முறை மதிப்பெண்",
    processScore: "செயல்முறை மதிப்பெண்",
    presentationScore: "விளக்கக்காட்சி மதிப்பெண்",
    gap: "விளக்கக்காட்சி/செயல்முறை இடைவெளி",
    authenticityStatus: "நம்பகத்தன்மை நிலை",
    evidenceCompleteness: "சான்றுகளின் முழுமை",
    viewProject: "விவரங்களைப் பார்",
    addEvidence: "சான்றுகளைச் சேர்",
    submitProject: "திட்டத்தைச் சமர்ப்பி",
    createNewProject: "புதிய திட்டத்தை உருவாக்கு",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    register: "பதிவுசெய்",
    strongEvidence: "வலுவான சான்று",
    moderateEvidence: "மிதமான சான்று",
    needsReview: "மதிப்பாய்வு தேவை",
    insufficientEvidence: "போதிய சான்றுகள் இல்லை",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
