import { Attack, CardType, EnergyType, PlayerType, PokemonCard, SlotType, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from "../../game/store/prefabs/attack-effects";
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class WellspringMaskOgerpon extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Water Dance',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Basic [W] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Bubble Drain',
      cost: [W, W, C],
      damage: 100,
      text: 'Heal 30 damage from this Pokémon.'
    },
  ];

  public set: string = 'SV9a';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Wellspring Mask Ogerpon';
  public fullName: string = 'Wellspring Mask Ogerpon SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player, PlayerType.BOTTOM_PLAYER, SlotType.DECK, [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 0, max: 1, allowCancel: false },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(30, effect, store, state);
    }

    return state;
  }
}