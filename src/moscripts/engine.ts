
import { toast } from "@/hooks/use-toast";

/**
 * MoScript Engine – Runtime and Registry
 */
export type MoScript = {
  id: string;
  name: string;
  trigger: string;
  inputs: string[];
  logic: (inputs: Record<string, any>) => any;
  voiceLine?: (result: any) => string;
  sass?: boolean;
};

type Registry = MoScript[];

// Internal registry for scripts
const MOS_REGISTRY: Registry = [];

// Prevent duplicate toast spam
const toastCooldowns = new Map<string, number>();
const TOAST_COOLDOWN = 2000;

/**
 * Register a MoScript with the engine.
 */
export function registerMoScript(script: MoScript) {
  if (!MOS_REGISTRY.some(m => m.id === script.id)) {
    MOS_REGISTRY.push(script);
  }
}

/**
 * Fire all MoScripts for a trigger, passing input variables.
 * Invokes voiceLine on result if present, returns array of results.
 */
export function fire(trigger: string, inputs: Record<string, any>): any[] {
  return MOS_REGISTRY
    .filter(m => m.trigger === trigger)
    .map(m => {
      const result = m.logic(inputs);
      if (m.voiceLine) {
        const voiceText = m.voiceLine(result);
        const now = Date.now();
        const lastToast = toastCooldowns.get(voiceText) || 0;
        
        // Only show toast if enough time has passed
        if (now - lastToast > TOAST_COOLDOWN) {
          toast({
            title: voiceText,
            variant: m.sass ? "default" : "default",
          });
          toastCooldowns.set(voiceText, now);
        }
      }
      return result;
    });
}

/**
 * Expose the registry for introspection/testing.
 */
export function listMoScripts() {
  return [...MOS_REGISTRY];
}

// MoScript host listener for score events - prevent multiple listeners
let listenerAttached = false;
if (typeof window !== 'undefined' && !listenerAttached) {
  window.addEventListener('onScoreReturned', (e: any) => {
    fire('onScoreReturned', { voiceline: e.detail });
  });
  listenerAttached = true;
}
