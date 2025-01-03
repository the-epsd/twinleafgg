import { Action } from './actions/action';
import { AbortGameAction } from './actions/abort-game-action';
import { AppendLogAction } from './actions/append-log-action';
import { Card } from './card/card';
import { ChangeAvatarAction } from './actions/change-avatar-action';
import { Effect } from './effects/effect';
import { GameError } from '../game-error';
import { GameMessage, GameLog } from '../game-message';
import { Prompt } from './prompts/prompt';
import { ReorderHandAction, ReorderBenchAction } from './actions/reorder-actions';
import { ResolvePromptAction } from './actions/resolve-prompt-action';
import { State } from './state/state';
import { StateLog, StateLogParam } from './state/state-log';
import { StoreHandler } from './store-handler';
import { StoreLike } from './store-like';
import { generateId, deepClone } from '../../utils/utils';
import { attackReducer } from './effect-reducers/attack-effect';
import { playCardReducer } from './reducers/play-card-reducer';
import { playEnergyReducer } from './effect-reducers/play-energy-effect';
import { playPokemonReducer } from './effect-reducers/play-pokemon-effect';
import { playTrainerReducer } from './effect-reducers/play-trainer-effect';
import { playerTurnReducer } from './reducers/player-turn-reducer';
import { gamePhaseReducer } from './effect-reducers/game-phase-effect';
import { gameReducer } from './effect-reducers/game-effect';
import { checkState, checkStateReducer } from './effect-reducers/check-effect';
import { playerStateReducer } from './reducers/player-state-reducer';
import { retreatReducer } from './effect-reducers/retreat-effect';
import { setupPhaseReducer } from './reducers/setup-reducer';
import { abortGameReducer } from './reducers/abort-game-reducer';

interface PromptItem {
  ids: number[],
  then: (results: any) => void;
}

export class Store implements StoreLike {

  //private effectHistory: Effect[] = [];

  public state: State = new State();
  private promptItems: PromptItem[] = [];
  private waitItems: (() => void)[] = [];
  private logId: number = 0;

  constructor(private handler: StoreHandler) { }

  public dispatch(action: Action): State {
    let state = this.state;

    if (action instanceof AbortGameAction) {
      state = abortGameReducer(this, state, action);
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof ReorderHandAction
      || action instanceof ReorderBenchAction
      || action instanceof ChangeAvatarAction) {
      state = playerStateReducer(this, state, action);
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof ResolvePromptAction) {
      state = this.reducePrompt(state, action);
      if (this.promptItems.length === 0) {
        state = checkState(this, state);
      }
      this.handler.onStateChange(state);
      return state;
    }

    if (action instanceof AppendLogAction) {
      this.log(state, action.message, action.params, action.id);
      this.handler.onStateChange(state);
      return state;
    }

    if (state.prompts.some(p => p.result === undefined)) {
      throw new GameError(GameMessage.ACTION_IN_PROGRESS);
    }

    state = this.reduce(state, action);

    return state;
  }

  public reduceEffect(state: State, effect: Effect): State {
    // this.checkEffectHistory(state, effect);

    state = this.propagateEffect(state, effect);

    const cardEffect = <any>effect;
    
    if (cardEffect.card)
      console.log(`Running effect: ${effect.type} for card ${cardEffect.card?.name}`);
    
    if (cardEffect.energyCard)
      console.log(`Running effect: ${effect.type} for card ${cardEffect.energyCard?.name}`);
    
    if (cardEffect.trainerCard)
      console.log(`Running effect: ${effect.type} for card ${cardEffect.trainerCard?.name}`);
    
    if (cardEffect.pokemonCard)
      console.log(`Running effect: ${effect.type} for card ${cardEffect.pokemonCard?.name}`);
    
    if (effect.preventDefault === true) {
      return state;
    }

    state = gamePhaseReducer(this, state, effect);
    state = playEnergyReducer(this, state, effect);
    state = playPokemonReducer(this, state, effect);
    state = playTrainerReducer(this, state, effect);
    state = retreatReducer(this, state, effect);
    state = gameReducer(this, state, effect);
    state = attackReducer(this, state, effect);
    state = checkStateReducer(this, state, effect);

    return state;
  }

  // checkEffectHistory(state: State, effect: Effect) {
  //   if (this.effectHistory.length === 300) {
  //     this.effectHistory.shift();
  //   }

  //   this.effectHistory.push(effect);
  //   if (this.effectHistory.length === 300) {
  //     let isLoop = true;

  //     const firstEffect = this.effectHistory[0];

  //     this.effectHistory.forEach((effect, index) => {
  //       if (index % 5 !== 0) {
  //         return;
  //       }

  //       if (!this.compareEffects(effect, firstEffect)) {
  //         isLoop = false;
  //       }
  //     });

  //     if (isLoop) {
  //       console.error(`Loop detected: ${firstEffect.type}, card: ${(<any>firstEffect).card?.fullName}`);
  //       throw new Error('Loop detected');
  //     }
  //   }
  // }

  compareEffects(effect1: Effect, effect2: Effect): boolean {
    if (effect1.type !== effect2.type) {
      return false;
    }

    const effect1CardId = (<any>effect1)?.card?.id;
    const effect2CardId = (<any>effect2)?.card?.id;

    const effect1CardPlayerId = (<any>effect1)?.player?.id;
    const effect2CardPlayerId = (<any>effect2)?.player?.id;

    return effect1CardId === effect2CardId &&
      effect1CardPlayerId === effect2CardPlayerId;
  }

  public prompt(state: State, prompts: Prompt<any>[] | Prompt<any>, then: (results: any) => void): State {
    if (!(prompts instanceof Array)) {
      prompts = [prompts];
    }

    for (let i = 0; i < prompts.length; i++) {
      const id = generateId(state.prompts);
      prompts[i].id = id;
      state.prompts.push(prompts[i]);
    }

    const promptItem: PromptItem = {
      ids: prompts.map(prompt => prompt.id),
      then: then
    };

    this.promptItems.push(promptItem);
    return state;
  }

  public waitPrompt(state: State, callback: () => void): State {
    this.waitItems.push(callback);
    return state;
  }

  public log(state: State, message: GameLog, params?: StateLogParam, client?: number): void {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).toString();

    const log = new StateLog(message, params, client);
    log.params = { ...params, timestamp };
    log.id = ++this.logId;
    state.logs.push(log);
  }

  private reducePrompt(state: State, action: ResolvePromptAction): State {
    // Resolve prompts actions
    const prompt = state.prompts.find(item => item.id === action.id);
    const promptItem = this.promptItems.find(item => item.ids.indexOf(action.id) !== -1);

    if (prompt === undefined || promptItem === undefined) {
      return state;
    }

    if (prompt.result !== undefined) {
      throw new GameError(GameMessage.PROMPT_ALREADY_RESOLVED);
    }

    try {
      prompt.result = action.result;

      const results = promptItem.ids.map(id => {
        const p = state.prompts.find(item => item.id === id);
        return p === undefined ? undefined : p.result;
      });

      if (action.log !== undefined) {
        this.log(state, action.log.message, action.log.params, action.log.client);
      }

      if (results.every(result => result !== undefined)) {
        const itemIndex = this.promptItems.indexOf(promptItem);
        promptItem.then(results.length === 1 ? results[0] : results);
        this.promptItems.splice(itemIndex, 1);
      }

      this.resolveWaitItems();
    } catch (storeError) {
      // Illegal action
      prompt.result = undefined;
      throw storeError;
    }

    return state;
  }

  private resolveWaitItems(): void {
    while (this.promptItems.length === 0 && this.waitItems.length > 0) {
      const waitItem = this.waitItems.pop();
      if (waitItem !== undefined) {
        waitItem();
      }
    }
  }

  public hasPrompts(): boolean {
    return this.promptItems.length > 0;
  }

  private reduce(state: State, action: Action): State {
    const stateBackup = deepClone(state, [Card]);
    this.promptItems.length = 0;

    try {
      state = setupPhaseReducer(this, state, action);
      state = playCardReducer(this, state, action);
      state = playerTurnReducer(this, state, action);

      this.resolveWaitItems();
      if (this.promptItems.length === 0) {
        state = checkState(this, state);
      }
    } catch (storeError) {
      // Illegal action
      this.state = stateBackup;
      this.promptItems.length = 0;
      throw storeError;
    }

    this.handler.onStateChange(state);
    return state;
  }

  private propagateEffect(state: State, effect: Effect): State {
    const cards: Card[] = [];
    for (const player of state.players) {
      player.stadium.cards.forEach(c => cards.push(c));
      player.supporter.cards.forEach(c => cards.push(c));
      player.active.cards.forEach(c => cards.push(c));
      for (const bench of player.bench) {
        bench.cards.forEach(c => cards.push(c));
      }
      for (const prize of player.prizes) {
        prize.cards.forEach(c => cards.push(c));
      }
      player.hand.cards.forEach(c => cards.push(c));
      player.deck.cards.forEach(c => cards.push(c));
      player.discard.cards.forEach(c => cards.push(c));
    }
    cards.sort(c => c.superType);
    cards.forEach(c => { state = c.reduceEffect(this, state, effect); });
    return state;
  }
}
