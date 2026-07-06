import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../../game/store/card/card-types';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { State, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

export class Celebi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Traverse Time',
      cost: [G],
      damage: 0,
      text: 'Search your deck for up to 3 in any combination of [G] Pokémon and Stadium cards, reveal them, and put them into your hand. Then, shuffle your deck.',
    },
    {
      name: 'Solar Cutter',
      cost: [G],
      damage: 30,
      text: '',
    },
  ];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Celebi';
  public fullName: string = 'Celebi MEG 12';
  public regulationMark: string = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        const isGrassPokemon = c instanceof PokemonCard && c.cardType === CardType.GRASS;
        const isStadiumCard = c instanceof TrainerCard && c.trainerType === TrainerType.STADIUM;
        if (!isGrassPokemon && !isStadiumCard) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        effect.player,
        this,
        {},
        {
          min: 0,
          max: 3,
          allowCancel: false,
          blocked,
        },
        this.attacks[0],
      );
    }

    return state;
  }
}
