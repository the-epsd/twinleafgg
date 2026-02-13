import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, TrainerCard, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = D;

  public hp: number = 70;

  public weakness = [];

  public retreat = [C];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [C],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Junk Hunt',
      cost: [D],
      damage: 0,
      text: 'Put 2 Item cards from your discard pile into your hand.'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (card instanceof TrainerCard && (card.trainerType !== TrainerType.ITEM)) {
          blocked.push(index);
        }
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false, blocked }, this.attacks[0]);
    }

    return state;
  }

}
