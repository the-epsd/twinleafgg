import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';

export class Staryu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Recover',
      cost: [C],
      damage: 0,
      text: 'Discard an Energy attached to this Pokémon and heal all damage from this Pokémon.'
    },
    {
      name: 'Water Gun',
      cost: [W],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Staryu';
  public fullName: string = 'Staryu NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Recover
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards: Card[] = selected || [];
        if (cards.length > 0) {
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          // Heal all damage
          const healAmount = player.active.damage;
          if (healAmount > 0) {
            const healEffect = new HealTargetEffect(effect, healAmount);
            healEffect.target = player.active;
            store.reduceEffect(state, healEffect);
          }
        }
      });
    }

    return state;
  }
}
