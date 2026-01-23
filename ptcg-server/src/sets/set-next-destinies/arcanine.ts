import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Arcanine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Growlithe';
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Crunch',
      cost: [R, C],
      damage: 30,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokemon.'
    },
    {
      name: 'Heat Blast',
      cost: [R, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arcanine';
  public fullName: string = 'Arcanine NXD 13';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crunch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const opponentActive = opponent.active;
          const energyCards = opponentActive.cards.filter(c => c.superType === SuperType.ENERGY);
          if (energyCards.length > 0) {
            const discardEffect = new DiscardCardsEffect(effect, energyCards.slice(0, 1));
            discardEffect.target = opponentActive;
            store.reduceEffect(state, discardEffect);
          }
        }
      });
    }

    return state;
  }
}
