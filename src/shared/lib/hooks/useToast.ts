import { useState, useCallback } from "react";

export function useToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const show = useCallback((msg: string, duration = 2000) => {
    setMessage(msg);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), duration);
  }, []);

  const hide = useCallback(() => setIsVisible(false), []);

  return {
    isVisible,
    message,
    show,
    hide,
  };
}
