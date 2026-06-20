import { createContext, useContext, useState, type ReactNode } from "react";

interface SurveyContextType {
  isSurveyOpen: boolean;
  openSurvey: () => void;
  closeSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  return (
    <SurveyContext.Provider
      value={{
        isSurveyOpen,
        openSurvey: () => setIsSurveyOpen(true),
        closeSurvey: () => setIsSurveyOpen(false),
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurvey must be used within SurveyProvider");
  }
  return context;
};
