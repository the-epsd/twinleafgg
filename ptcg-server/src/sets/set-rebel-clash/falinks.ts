import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { State, StoreLike, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  AFTER_ATTACK,
  SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class Falinks extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Call for Family',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.',
    },
    {
      name: 'Team Attack',
      cost: [C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'This attack does 30 damage for each of your Benched pokemon that have "Falinks" in its name.',
    },
  ];

  public regulationMark = 'D';
  public set = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '109';
  public name = 'Falinks';
  public fullName = 'Falinks RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        effect.player,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: 2, allowCancel: false },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Count benched Pokémon that have "Falinks" in their name
      let falinksCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.name.includes('Falinks')) {
          falinksCount++;
        }
      });
      effect.damage = 30 * falinksCount;
    }

    return state;
  }
}
