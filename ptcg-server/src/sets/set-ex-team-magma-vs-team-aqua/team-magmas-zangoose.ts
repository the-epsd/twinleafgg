import { PlayerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamMagmasZangoose extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_MAGMA];
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a [C] Basic Pokémon or Basic Pokémon with Team Magma in its name and put it onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Team Play',
    cost: [C, C, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of Pokémon in play with Team Magma in its name.'
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Team Magma\'s Zangoose';
  public fullName: string = 'Team Magma\'s Zangoose MA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && (card.cardType === CardType.COLORLESS || card.tags.includes(CardTag.TEAM_MAGMA))) {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: Stage.BASIC }, { min: 0, max: 1, blocked });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      let magmaCount = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.TEAM_MAGMA)) {
          magmaCount++;
        }
      });

      effect.opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.TEAM_MAGMA)) {
          magmaCount++;
        }
      });

      effect.damage = 10 * magmaCount;
    }

    return state;
  }
}