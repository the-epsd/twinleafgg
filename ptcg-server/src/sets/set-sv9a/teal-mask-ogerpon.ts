import { Attack, CardType, EnergyType, GameError, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, ATTACH_ENERGY_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TealMaskOgerpon extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: R }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Grass Dance',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Basic [G] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Ogre Hammer',
      cost: [G, G, C],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t use Ogre Hammer.'
    },
  ];

  public set: string = 'SV9a';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Teal Mask Ogerpon';
  public fullName: string = 'Teal Mask Ogerpon SV9a';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player, PlayerType.BOTTOM_PLAYER, SlotType.DECK, [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 0, max: 1, allowCancel: false },
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this) || HAS_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    return state;
  }
}