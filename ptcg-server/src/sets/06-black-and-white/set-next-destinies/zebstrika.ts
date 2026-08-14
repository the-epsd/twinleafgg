import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Zebstrika extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Blitzle';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Disconnect',
    cost: [L, C],
    damage: 40,
    text: 'Your opponent can\'t play any Item cards from his or her hand during your opponent\'s next turn.'
  },
  {
    name: 'Lightning Crash',
    cost: [L, L, C],
    damage: 0,
    text: 'Discard all [L] Energy attached to this Pokémon. This attack does 80 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'NXD';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zebstrika';
  public fullName: string = 'Zebstrika NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Disconnect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }

    // Lightning Crash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const lightningEnergy = player.active.cards.filter(card =>
        card.superType === SuperType.ENERGY &&
        card.energyType === EnergyType.BASIC &&
        (card as EnergyCard).provides.includes(L)
      );
      if (lightningEnergy.length > 0) {
        const discardEffect = new DiscardCardsEffect(effect, lightningEnergy);
        store.reduceEffect(state, discardEffect);
      }
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
    }
    return state;
  }
}
