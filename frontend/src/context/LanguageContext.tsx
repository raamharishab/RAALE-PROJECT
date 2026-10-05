import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ta' | 'hi' | 'es';

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
    benchmark: "Benchmark & Experiments",
    edgeCases: "Edge Cases & Failures",
    ethics: "Ethics & Risk Assessment",
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
    gitCommits: "Git Micro-Commits",
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
    benchmark: "ஒப்பீட்டு சோதனைகள்",
    edgeCases: "விளிம்பு வழக்குகள்",
    ethics: "அறநெறிகள் & அபாயங்கள்",
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
    gitCommits: "கிட் கமிட்கள்",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    register: "பதிவுசெய்",
    strongEvidence: "வலுவான சான்று",
    moderateEvidence: "மிதமான சான்று",
    needsReview: "மதிப்பாய்வு தேவை",
    insufficientEvidence: "போதிய சான்றுகள் இல்லை",
  },
  hi: {
    appTitle: "प्रोजेक्टप्रूफ",
    appSubtitle: "प्रमाणिकता और समस्या निवारण साक्ष्य मंच",
    learnerDashboard: "छात्र डैशबोर्ड",
    mentorDashboard: "मेंटॉर समीक्षा कतार",
    benchmark: "बेंचमार्क प्रयोग",
    edgeCases: "अपवाद मामले",
    ethics: "नैतिकता और जोखिम",
    totalProjects: "कुल प्रोजेक्ट",
    draftProjects: "ड्राफ्ट प्रोजेक्ट",
    submittedProjects: "जमा प्रोजेक्ट",
    avgProcessScore: "औसत प्रक्रिया स्कोर",
    processScore: "प्रक्रिया स्कोर",
    presentationScore: "प्रस्तुति स्कोर",
    gap: "प्रस्तुति/प्रक्रिया अंतर",
    authenticityStatus: "प्रमाणिकता स्थिति",
    evidenceCompleteness: "साक्ष्य पूर्णता",
    viewProject: "विवरण देखें",
    addEvidence: "साक्ष्य जोड़ें",
    submitProject: "प्रोजेक्ट सबमिट करें",
    createNewProject: "नया प्रोजेक्ट बनाएं",
    gitCommits: "गिट कमिट्स",
    logout: "लॉगआउट",
    login: "लॉग इन",
    register: "पंजीकरण",
    strongEvidence: "मजबूत साक्ष्य",
    moderateEvidence: "मध्यम साक्ष्य",
    needsReview: "समीक्षा आवश्यक",
    insufficientEvidence: "अपर्याप्त साक्ष्य",
  },
  es: {
    appTitle: "ProjectProof",
    appSubtitle: "Plataforma de Evidencia de Autenticidad y Resolución de Problemas",
    learnerDashboard: "Panel del Estudiante",
    mentorDashboard: "Cola de Revisión del Mentor",
    benchmark: "Evaluación Comparativa",
    edgeCases: "Casos Límite y Fallos",
    ethics: "Ética y Evaluación de Riesgos",
    totalProjects: "Proyectos Totales",
    draftProjects: "Borradores",
    submittedProjects: "Proyectos Enviados",
    avgProcessScore: "Puntaje Promedio de Proceso",
    processScore: "Puntaje de Proceso",
    presentationScore: "Puntaje de Presentación",
    gap: "Brecha Presentación/Proceso",
    authenticityStatus: "Estado de Autenticidad",
    evidenceCompleteness: "Completes de Evidencia",
    viewProject: "Ver Detalles",
    addEvidence: "Agregar Evidencia",
    submitProject: "Enviar Proyecto",
    createNewProject: "Crear Nuevo Proyecto",
    gitCommits: "Commits de Git",
    logout: "Cerrar Sesión",
    login: "Iniciar Sesión",
    register: "Registrarse",
    strongEvidence: "EVIDENCIA SÓLIDA",
    moderateEvidence: "EVIDENCIA MODERADA",
    needsReview: "REQUIERE REVISIÓN",
    insufficientEvidence: "EVIDENCIA INSUFICIENTE",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
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

