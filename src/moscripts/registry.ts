
import { registerMoScript } from './engine';
import { mo_OFAC_SENTINEL } from './rules/mo_OFAC_SENTINEL';

// Register all MoScripts here
export function loadAllMoScripts() {
  registerMoScript(mo_OFAC_SENTINEL);
}
