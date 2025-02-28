import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GET_PLAYER_PRIZES, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TapuKoko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Summon Lightning',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 2 [L] Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Prize Count',
      cost: [L, L, C],
      damage: 90,
      damageCalculation: '+',
      text: 'If you have more Prize cards remaining than your opponent, this attack does 90 more damage.',
    },
  ];

  public set: string = 'SSP';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tapu Koko';
  public fullName: string = 'Tapu Koko SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this))
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store, state, effect.player, { cardType: L }, { min: 0, max: 2 }
      );

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (GET_PLAYER_PRIZES(player).length > GET_PLAYER_PRIZES(opponent).length)
        effect.damage += 90;
    }

    return state;
  }

}