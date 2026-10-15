import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class HopsPincurchinEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 200;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Counterattack Quills',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Spiky Thunder',
    cost: [L, L, C],
    damage: 120,
    text: 'Draw 2 cards.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Hop\'s Pincurchin ex';
  public fullName: string = 'Hop\'s Pincurchin ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counterattack Quills
    if (WAS_POWER_USED(effect, 0, this)) {
      // TODO unmatched: "If this Pokemon is in the Active Spot and is damaged by an attack from your opponent's Pokemon (even if this Pokemon is Knocked Out), place 3 damage counters on the Attacking Pokemon."
      return state;
    }

    // Spiky Thunder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 2);
    }

    return state;
  }
}
