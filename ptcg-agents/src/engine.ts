// Single point of contact with the ptcg-server engine. Everything else in
// ptcg-agents imports from here, so the engine link (in-process today, possibly
// a CLI subprocess later) can change without touching the rest of the harness.

export { HeadlessCommandRunner, HeadlessCommandRequest } from '../../ptcg-server/src/game/headless/command-handler';
export {
  HeadlessDeckGameConfig,
  HeadlessSnapshot,
  AvailableActionsScope,
  AvailableActionsView
} from '../../ptcg-server/src/game/headless/headless-session';
export { HeadlessPromptJson } from '../../ptcg-server/src/game/headless/prompt-adapters';
export { GamePhase, GameWinner } from '../../ptcg-server/src/game/store/state/state';
export { PlayerType, SlotType, CardTarget } from '../../ptcg-server/src/game/store/actions/play-card-action';
