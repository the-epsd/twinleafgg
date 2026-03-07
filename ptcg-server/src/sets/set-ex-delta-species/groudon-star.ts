import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class GroudonStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR];
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Critical Collection',
    cost: [F],
    damage: 0,
    text: 'Count the number of Prize cards your opponent has taken. Search your discard pile for up to that many [F] Energy cards and attach them to Groudon Star.'
  },
  {
    name: 'Ground Slash',
    cost: [F, F, F, C, C],
    damage: 80,
    text: 'Discard a [F] Energy card attached to Groudon Star.'
  }];

  public set: string = 'DS';
  public setNumber: string = '111';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Groudon Star';
  public fullName: string = 'Groudon Star DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
        store, state, player, 1, CardType.FIGHTING,
        { destinationSlots: [SlotType.ACTIVE], min: opponent.prizesTaken, allowCancel: false }
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIGHTING)
    }

    return state;
  }
}
