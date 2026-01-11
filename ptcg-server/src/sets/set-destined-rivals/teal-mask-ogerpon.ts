import { Attack, CardType, EnergyType, PlayerType, PokemonCard, SlotType, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TealMaskOgerpon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: R }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
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
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Teal Mask Ogerpon';
  public fullName: string = 'Teal Mask Ogerpon DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(store, state, player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DECK,
        [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 0, max: 1, allowCancel: false },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Ogre Hammer')) {
        player.active.cannotUseAttacksNextTurnPending.push('Ogre Hammer');
      }
    }

    return state;
  }
}