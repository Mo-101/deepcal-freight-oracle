
import { toast } from "@/hooks/use-toast";

// Helper for dry, symbolic system toasts
export const humorToast = (msg: string, desc?: string, duration = 2500) => {
  toast({
    title: msg,
    description: desc,
    duration,
  });
};
