
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
const MOS_REGISTRY: Registry = [];
export function registerMoScript(script: MoScript) {
  if (!MOS_REGISTRY.some(m => m.id === script.id)) {
    MOS_REGISTRY.push(script);
  }
}
export function fire(trigger: string, inputs: Record<string, any>): any[] {
  return MOS_REGISTRY
    .filter(m => m.trigger === trigger)
    .map(m => {
      const result = m.logic(inputs);
      if (m.voiceLine) {
        // Use shadcn toast directly, fix variant to only "default" or "destructive"
        toast({
          title: m.voiceLine(result),
          variant: m.sass ? "destructive" : "default",
        });
      }
      return result;
    });
}
export function listMoScripts() {
  return [...MOS_REGISTRY];
}
