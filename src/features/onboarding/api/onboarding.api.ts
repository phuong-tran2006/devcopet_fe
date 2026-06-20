import { api } from "../../../services/axiosClient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const onboardingApi = {
  getQuestions: async () => {
    const response = await api.get("/onboarding/questions");
    return response.data;
  },

  submitAnswers: async (data: {
    answers: Array<{ questionNumber: number; selectedOption: string }>;
  }) => {
    const response = await api.post("/onboarding/submit", data);
    return response.data;
  },
};
