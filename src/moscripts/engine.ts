
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
        // Add toast here if available, else console.log as fallback
        if (typeof window !== "undefined" && window?.toast) {
          window.toast[m.sass ? "info" : "success"](m.voiceLine(result));
        } else {
          // eslint-disable-next-line no-console
          console.log(`[${m.name}]: ${m.voiceLine(result)}`);
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
