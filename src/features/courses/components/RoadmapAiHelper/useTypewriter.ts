import { useState, useEffect } from "react";

export function useTypewriter(
  answer: string | null,
  asking: boolean,
  speed = 3,
) {
  const [displayedAnswer, setDisplayedAnswer] = useState<string>("");

  useEffect(() => {
    if (!answer || asking) {
      setDisplayedAnswer("");
      return;
    }

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += speed;
      if (currentLength >= answer.length) {
        setDisplayedAnswer(answer);
        clearInterval(interval);
      } else {
        setDisplayedAnswer(answer.slice(0, currentLength));
      }
    }, 15);

    return () => clearInterval(interval);
  }, [answer, asking, speed]);

  return displayedAnswer;
}
