import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import OnboardingModal from "../../../survey/OnboardingModal";
import SurveyModal, { surveyQuestions } from "../../../survey/SurveyModal";
import NamePetModal from "../../../survey/NamePetModal";
import { useAuthStore } from "../../store/auth.store";
import { onboardingApi } from "../../../onboarding/api/onboarding.api";

type OnboardingStep = "intro" | "survey" | "naming";

const OnboardingFlowPage = () => {
  const [step, setStep] = useState<OnboardingStep>("intro");
  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, string>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  useEffect(() => {
    document.title = "Welcome to Devcopet | Onboarding";
  }, []);

  const handleCompleteSurvey = (answers: Record<number, string>) => {
    setSurveyAnswers(answers);
    setStep("naming");
  };

  const handleConfirmPetName = async (petName: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const scores = {
        disciplined: 0,
        curious: 0,
        competitive: 0,
        analytical: 0,
        social: 0,
        empathetic: 0,
        adaptable: 0,
        creative: 0,
        leader: 0,
        independent: 0,
      };

      Object.entries(surveyAnswers).forEach(([qIdxStr, optionId]) => {
        const qIdx = parseInt(qIdxStr);
        const question = surveyQuestions[qIdx];
        if (!question) return;
        const option = question.options.find((o) => o.id === optionId);
        if (option && option.scores) {
          Object.entries(option.scores).forEach(([trait, val]) => {
            if (trait in scores) {
              scores[trait as keyof typeof scores] += val;
            }
          });
        }
      });

      const mappedTraits = {
        guidanceNeed: Math.max(
          0,
          scores.social + scores.empathetic - scores.independent,
        ),
        decisiveness: Math.max(
          0,
          scores.leader + scores.disciplined - scores.adaptable,
        ),
        failureSensitivity: Math.max(
          0,
          scores.competitive + scores.analytical - scores.adaptable,
        ),
        exploration: Math.max(0, scores.curious + scores.creative),
        precision: Math.max(0, scores.analytical + scores.disciplined),
        motivationStyle: Math.max(
          0,
          scores.competitive + scores.social + scores.leader,
        ),
      };

      await onboardingApi.completeOnboarding({
        petName: petName.trim(),
        surveyAnswers: mappedTraits,
      });

      if (user) {
        const token = localStorage.getItem("accessToken") || "";
        const refresh = localStorage.getItem("refreshToken") || "";
        setAuth(token, refresh, { ...user, onboardingCompleted: true });
      }
      navigate({ to: "/" });
    } catch (err) {
      console.error("Failed to complete onboarding", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center px-4 py-10">
      {step === "intro" && (
        <OnboardingModal isOpen onBeginSurvey={() => setStep("survey")} />
      )}

      {step === "survey" && (
        <SurveyModal isOpen embedded onComplete={handleCompleteSurvey} />
      )}

      {step === "naming" && (
        <NamePetModal
          isOpen
          onClose={() => {}}
          onConfirm={handleConfirmPetName}
        />
      )}
    </main>
  );
};

export default OnboardingFlowPage;
