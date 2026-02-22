import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronLeaves extends PokemonCard {

  public tags = [CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Recovery Net',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Choose up to 2 Pokémon from your discard pile, reveal them, and put them into your hand.'
    },
    {
      name: 'Avenging Edge',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 60 more damage.'
    }
  ];

  public set: string = 'TWM';

  public name: string = 'Iron Leaves';

  public fullName: string = 'Iron Leaves TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const pokemonCount = player.discard.cards.filter(c => {
        return c instanceof PokemonCard;
      }).length;

      if (pokemonCount === 0) {
        return state;
      }

      const max = Math.min(2, pokemonCount);

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.POKEMON },
          { min: 1, max, allowCancel: false }
        )], selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 60;
      }
    }

    return state;
  }
}