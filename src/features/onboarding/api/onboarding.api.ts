import { api } from "../../../services/axiosClient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const onboardingApi = {
  completeOnboarding: async (data: {
    petName: string;
    surveyAnswers: Record<string, number>;
  }) => {
    // const response = await api.post("/onboarding/complete", data);
    // return response.data;

    // Mock implementation
    await delay(800);
    return {
      success: true,
      petName: data.petName,
      surveyAnswers: data.surveyAnswers,
    };
  },
};
