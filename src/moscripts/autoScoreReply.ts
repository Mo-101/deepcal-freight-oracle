
import { MoScript } from './engine';

export const mo_AUTO_SCORE_REPLY: MoScript = {
  id: 'mo-score-reply',
  name: 'Score Announcer',
  trigger: 'onScoreReturned',
  inputs: ['voiceline'],
  logic: ({ voiceline }) => {
    console.info('Score returned:', voiceline);
    return voiceline;
  },
  voiceLine: (result) => result,
  sass: false,
};
