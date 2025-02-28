import { Attack, CardType, EnergyType, PlayerType, PokemonCard, SlotType, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HearthflameMaskOgerpon extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: W }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Flame Dance',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Basic [R] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Searing Flame',
      cost: [R, R, C],
      damage: 80,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    },
  ];

  public set: string = 'SV9a';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Hearthflame Mask Ogerpon';
  public fullName: string = 'Hearthflame Mask Ogerpon SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player, PlayerType.BOTTOM_PLAYER, SlotType.DECK, [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 0, max: 1, allowCancel: false },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    return state;
  }
}