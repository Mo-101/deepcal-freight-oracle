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
        // Use shadcn toast directly
        toast({
          title: m.voiceLine(result),
          variant: m.sass ? "default" : "destructive", // Type fix: use only "default" | "destructive"
        });
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

// MoScript host listener for score events
if (typeof window !== 'undefined') {
  window.addEventListener('onScoreReturned', (e: any) => {
    fire('onScoreReturned', { voiceline: e.detail });
  });
}
