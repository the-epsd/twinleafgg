import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, DISCARD_TOP_X_OF_OPPONENTS_DECK, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GameMessage } from '../../../game/game-message';

export class Rhyperior extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Rhydon';
  public hp: number = 140;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: 30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Earth Fissure',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Rhyperior from your hand to evolve 1 of your Pokémon, you may discard the top 3 cards from your opponent\'s deck.'
  }];

  public attacks = [{
    name: 'Rock Wrecker',
    cost: [F, F, C],
    damage: 80,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. Rhyperior can\'t attack during your next turn.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Rhyperior';
  public fullName: string = 'Rhyperior DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Earth Fissure
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.deck.cards.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (wantToUse) {
          DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, effect.player, 3, this, this.powers[0]);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Rock Wrecker
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
