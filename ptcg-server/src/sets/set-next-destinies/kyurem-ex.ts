import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { EnergyCard } from '../../game/store/card/energy-card';

export class KyuremEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Frozen Wings',
      cost: [W, C, C],
      damage: 60,
      text: 'Discard a Special Energy attached to the Defending Pokémon.'
    },
    {
      name: 'Hail Blizzard',
      cost: [W, W, C, C],
      damage: 120,
      text: 'This Pokémon can\'t use Hail Blizzard during your next turn.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kyurem-EX';
  public fullName: string = 'Kyurem-EX NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frozen Wings - discard Special Energy from defending
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Find special energy on defender
      const specialEnergy = opponent.active.cards.filter(card =>
        card instanceof EnergyCard && card.energyType === EnergyType.SPECIAL
      );

      if (specialEnergy.length > 0) {
        // Discard the first special energy found
        const discardEffect = new DiscardCardsEffect(effect, [specialEnergy[0]]);
        discardEffect.target = opponent.active;
        store.reduceEffect(state, discardEffect);
      }
    }

    // Hail Blizzard - can't use next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Hail Blizzard')) {
        player.active.cannotUseAttacksNextTurnPending.push('Hail Blizzard');
      }
    }

    return state;
  }
}
