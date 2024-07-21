import { Attack, GameError, GameMessage, StateUtils } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { ColorlessCostReducer } from '../../game/store/card/pokemon-interface';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckAttackCostEffect, CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TechnicalMachineCrisisPunch extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [];

  public set: string = 'PAF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

  public name: string = 'Technical Machine: Crisis Punch';

  public fullName: string = 'Technical Machine: Crisis Punch PAF';

  public attacks: Attack[] = [{
    name: 'Crisis Punch',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 280,
    text: 'You can use this attack only when your opponent has exactly 1 Prize card remaining.'
  }];

  public text: string =
    'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const pokemonCard = effect.player.active.getPokemonCard();
      if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
        const reduction = (pokemonCard as ColorlessCostReducer).getColorlessReduction(state);
        for (let i = 0; i < reduction && effect.cost.includes(CardType.COLORLESS); i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard()?.tools.includes(this) &&
      !effect.attacks.includes(this.attacks[0])) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.attacks.includes(this.attacks[0]);
    }

    if (effect instanceof EndTurnEffect && effect.player.active.tool) {
      const player = effect.player;
      const tool = effect.player.active.tool;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (tool.name === this.name) {
        player.active.moveCardTo(tool, player.discard);
        player.active.tool = undefined;
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      const prizes = opponent.getPrizeLeft();

      if (prizes !== 1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return state;
    }
    return state;
  }
}
