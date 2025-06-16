
import { registerMoScript } from './engine';
import { mo_OFAC_SENTINEL } from './rules/mo_OFAC_SENTINEL';
import { mo_AUTO_SCORE_REPLY } from './autoScoreReply';

// Register all MoScripts here
export function loadAllMoScripts() {
  registerMoScript(mo_OFAC_SENTINEL);
  registerMoScript(mo_AUTO_SCORE_REPLY);
}
