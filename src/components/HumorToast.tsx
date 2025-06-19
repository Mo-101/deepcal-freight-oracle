
import { toast } from "@/hooks/use-toast";

// Prevent spam by tracking recent toasts
const recentToasts = new Set<string>();
const TOAST_COOLDOWN = 3000; // 3 seconds cooldown

// Helper for dry, symbolic system toasts
export const humorToast = (msg: string, desc?: string, duration = 2500) => {
  const toastKey = `${msg}-${desc || ''}`;
  
  // Prevent duplicate toasts within cooldown period
  if (recentToasts.has(toastKey)) {
    return;
  }
  
  recentToasts.add(toastKey);
  
  toast({
    title: msg,
    description: desc,
    duration,
  });
  
  // Remove from cooldown after specified time
  setTimeout(() => {
    recentToasts.delete(toastKey);
  }, TOAST_COOLDOWN);
};
