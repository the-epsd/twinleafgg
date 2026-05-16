import { Action } from '../store/actions/action';
import { AbortGameAction } from '../store/actions/abort-game-action';
import { AddPlayerAction } from '../store/actions/add-player-action';
import { AppendLogAction } from '../store/actions/append-log-action';
import { ChangeAvatarAction } from '../store/actions/change-avatar-action';
import { ConcedeAction } from '../store/actions/concede-action';
import {
  AttackAction,
  PassTurnAction,
  RetreatAction,
  RetreatStartAction,
  UseAbilityAction,
  UseEnergyAbilityAction,
  UseStadiumAction,
  UseTrainerAbilityAction
} from '../store/actions/game-actions';
import { InvitePlayerAction } from '../store/actions/invite-player-action';
import { PlayCardAction } from '../store/actions/play-card-action';
import { ReorderBenchAction, ReorderHandAction } from '../store/actions/reorder-actions';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
import { SandboxModifyCardAction } from '../store/actions/sandbox-modify-card-action';
import { SandboxModifyGameStateAction } from '../store/actions/sandbox-modify-game-state-action';
import { SandboxModifyPlayerAction } from '../store/actions/sandbox-modify-player-action';
import { SandboxModifyPokemonAction } from '../store/actions/sandbox-modify-pokemon-action';
import { State } from '../store/state/state';
import { ReplayActionRecord } from './replay.interface';

export function buildReplayActionPayload(action: Action): any {
  if (action instanceof ResolvePromptAction) {
    const payload: any = {
      id: action.id,
      result: action.encodedResult !== undefined ? action.encodedResult : action.result
    };
    if (action.encodedResult !== undefined) {
      payload.decodedResult = action.result;
    }
    if (action.log !== undefined) {
      payload.log = action.log;
    }
    return payload;
  }

  const payload: any = { ...action };
  delete payload.type;
  return payload;
}

export function buildActionFromReplayRecord(record: ReplayActionRecord, state?: State): Action {
  const payload = record.payload || {};

  switch (record.type) {
    case 'ABORT_GAME':
      return new AbortGameAction(payload.culpritId, payload.reason);
    case 'ADD_PLAYER':
      return new AddPlayerAction(
        payload.clientId,
        payload.name,
        payload.deck,
        payload.artworksMap,
        payload.deckId,
        payload.sleeveImagePath
      );
    case 'APPEND_LOG_ACTION':
      return new AppendLogAction(payload.id, payload.message, payload.params);
    case 'CHANGE_AVATAR':
      return new ChangeAvatarAction(payload.id, payload.avatarName, payload.log);
    case 'CONCEDE_GAME':
      return new ConcedeAction(payload.playerId);
    case 'ATTACK_ACTION':
      return new AttackAction(payload.clientId, payload.name);
    case 'USE_ABILITY_ACTION':
      return new UseAbilityAction(payload.clientId, payload.name, payload.target);
    case 'USE_TRAINER_ABILITY_ACTION':
      return new UseTrainerAbilityAction(payload.clientId, payload.name, payload.target);
    case 'USE_ENERGY_ABILITY_ACTION':
      return new UseEnergyAbilityAction(payload.clientId, payload.name, payload.target);
    case 'USE_STADIUM_ACTION':
      return new UseStadiumAction(payload.clientId);
    case 'RETREAT_ACTION':
      return new RetreatAction(payload.clientId, payload.benchIndex);
    case 'RETREAT_START_ACTION':
      return new RetreatStartAction(payload.clientId);
    case 'PASS_TURN':
      return new PassTurnAction(payload.clientId);
    case 'INVITE_PLAYER':
      return new InvitePlayerAction(payload.clientId, payload.name);
    case 'PLAY_CARD_ACTION':
      return new PlayCardAction(payload.id, payload.handIndex, payload.target);
    case 'REORDER_BENCH_ACTION':
      return new ReorderBenchAction(payload.id, payload.from, payload.to);
    case 'REORDER_HAND_ACTION':
      return new ReorderHandAction(payload.id, payload.order);
    case 'RESOLVE_PROMPT':
      return buildResolvePromptAction(payload, state);
    case 'SANDBOX_MODIFY_CARD':
      return new SandboxModifyCardAction(
        payload.clientId,
        payload.targetPlayerId,
        payload.action,
        payload.cardName,
        payload.fromZone,
        payload.toZone,
        payload.fromIndex,
        payload.toIndex,
        payload.prizeIndex
      );
    case 'SANDBOX_MODIFY_GAME_STATE':
      return new SandboxModifyGameStateAction(payload.clientId, payload.modifications);
    case 'SANDBOX_MODIFY_PLAYER':
      return new SandboxModifyPlayerAction(payload.clientId, payload.targetPlayerId, payload.modifications);
    case 'SANDBOX_MODIFY_POKEMON':
      return new SandboxModifyPokemonAction(
        payload.clientId,
        payload.targetPlayerId,
        payload.location,
        payload.modifications,
        payload.benchIndex
      );
    default:
      throw new Error(`Unsupported replay action type: ${record.type}`);
  }
}

function buildResolvePromptAction(payload: any, state?: State): ResolvePromptAction {
  if (state !== undefined) {
    const prompt = state.prompts.find(item => item.id === payload.id);
    if (prompt !== undefined) {
      const decoded = prompt.decode(payload.result, state);
      if (prompt.validate(decoded, state) === false) {
        throw new Error(`Invalid replay prompt result for prompt ${payload.id}`);
      }
      return new ResolvePromptAction(payload.id, decoded, payload.log, payload.result);
    }
  }

  return new ResolvePromptAction(
    payload.id,
    payload.decodedResult !== undefined ? payload.decodedResult : payload.result,
    payload.log,
    payload.result
  );
}
