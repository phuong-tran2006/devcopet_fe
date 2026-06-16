import { api } from "../../../services/axiosClient";

export const onboardingApi = {
  completeOnboarding: async (data: {
    petName: string;
    surveyAnswers: Record<string, number>;
  }) => {
    const response = await api.post("/onboarding/complete", data);
    return response.data;
  },
};
