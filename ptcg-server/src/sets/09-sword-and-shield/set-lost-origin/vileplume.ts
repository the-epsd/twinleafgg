import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gloom';
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Mega Drain',
    cost: [G, C],
    damage: 50,
    text: 'Heal 30 damage from this Pokémon.'
  }, {
    name: 'Allergy Storm',
    cost: [G, C, C],
    damage: 90,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, they can\'t play any Supporter cards from their hand. If tails, during your opponent\'s next turn, they can\'t play any Item cards from their hand.'
  }];

  public regulationMark: string = 'F';

  public set: string = 'LOR';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vileplume';
  public fullName: string = 'Vileplume LOR 3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mega Drain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(30, effect, store, state);
    }

    // Allergy Storm
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { supporter: true });
        } else {
          OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true });
        }
      });
    }
    return state;
  }
}
