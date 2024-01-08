import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, CardType, Format, PokemonType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, PokemonCard, Attack, CardList, Power, Resistance, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList === effect.target) {
          return;
        }

        if (cardList.tool instanceof ForestSealStone) {
          // Create a new class extending cardList
          class ForestSealStone implements PokemonCard {
            public superType!: SuperType;
            public cardType!: CardType;
            public cardTag!: CardTag[];
            public pokemonType!: PokemonType;
            public evolvesFrom!: string;
            public stage!: Stage;
            public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS,];
            public hp!: number;
            public weakness!: Weakness[];
            public resistance!: Resistance[];
            public powers!: Power[];
            public attacks!: Attack[];
            public format!: Format;
            public movedToActiveThisTurn!: boolean;
            public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
              throw new Error('Method not implemented.');
            }
            public fullName!: string;
            public id!: number;
            public regulationMark!: string;
            public tags!: string[];
            public setNumber!: string;
            public cardImage!: string;
            public cards!: CardList;
            public set!: string;
            public name!: string;
          }

          // Instantiate the new class
          const newCardList = new ForestSealStone();

          // Copy the properties from the old cardList
          newCardList.retreat = cardList.tool.retreat;

          // Push the new cardList to the target
          cardList.cards.push(newCardList);
        }
      });
    }

    return state;
  }
}
  