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
  const [questions, setQuestions] = useState<any[]>([]);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, string>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  useEffect(() => {
    document.title = "Welcome to Devcopet | Onboarding";

    // Fetch questions from backend
    onboardingApi
      .getQuestions()
      .then((data) => {
        if (data && data.questions) {
          setQuestions(data.questions);
        }
      })
      .catch((err) => {
        console.error("Failed to load onboarding questions from backend", err);
      });
  }, []);

  const handleCompleteSurvey = (answers: Record<number, string>) => {
    setSurveyAnswers(answers);
    setStep("naming");
  };

  const handleConfirmPetName = async (petName: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Map frontend surveyAnswers (Record<index, optionId>) to backend payload (Array<{ questionNumber, selectedOption }>)
      const payloadAnswers = Object.entries(surveyAnswers).map(
        ([indexStr, optionId]) => {
          const index = parseInt(indexStr, 10);
          const question = questions[index];
          return {
            questionNumber: question ? question.questionNumber : index + 1,
            selectedOption: optionId,
          };
        },
      );

      await onboardingApi.submitAnswers({
        answers: payloadAnswers,
        petName,
      });

      localStorage.setItem("petName", petName);
      if (user) {
        setAuth(null, null, { ...user, petName, onboardingCompleted: true });
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
        <SurveyModal
          isOpen
          embedded
          onComplete={handleCompleteSurvey}
          questions={questions}
        />
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
