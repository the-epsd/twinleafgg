import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Krokorok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sandile';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Crunch',
      cost: [F, C, C],
      damage: 40,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Krokorok';
  public fullName: string = 'Krokorok EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const opponentActive = opponent.active;
          const energyCards = opponentActive.cards.filter(c => c.superType === SuperType.ENERGY);
          if (energyCards.length > 0) {
            const energyToDiscard = energyCards[0];
            opponentActive.moveCardTo(energyToDiscard, opponent.discard);
          }
        }
      });
    }
    return state;
  }
}
