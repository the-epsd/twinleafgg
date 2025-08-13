import { Attack, CardType, EnergyType, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class CornerstoneMaskOgerpon extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Rock Dance',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Basic [F] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Mountain Ramming',
      cost: [F, F, C],
      damage: 100,
      text: 'Discard the top card of your opponent\'s deck.'
    },
  ];

  public set: string = 'DRI';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '111';
  public name: string = 'Cornerstone Mask Ogerpon';
  public fullName: string = 'Cornerstone Mask Ogerpon DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player, PlayerType.BOTTOM_PLAYER, SlotType.DECK, [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC, name: 'Fighting Energy' },
        { min: 0, max: 1, allowCancel: false },
      );
    }
    // Knocking Hammer
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[1] });
    }

    return state;
  }
}