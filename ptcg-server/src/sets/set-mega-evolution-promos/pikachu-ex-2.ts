import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PlayerType, SlotType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  ATTACH_ENERGY_PROMPT,
  THIS_POKEMON_DOES_DAMAGE_TO_ITSELF,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class Pikachuex2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 190;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Shocking Fever',
    cost: [L],
    damage: 0,
    text: 'You may attach as many Basic Energy cards from your hand to your Pokémon in any way you like.'
  },
  {
    name: 'Thunder',
    cost: [L, L, C],
    damage: 200,
    text: 'This Pokémon does 30 damage to itself.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'MEP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Pikachu ex';
  public fullName: string = 'Pikachu ex2 MEP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-rebel-clash/alcremie.ts (Decorate — attach Basic Energy from hand)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const basicEnergyInHand = player.hand.cards.filter(c =>
        c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC
      ).length;
      if (basicEnergyInHand === 0) {
        return state;
      }
      return ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.HAND,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: basicEnergyInHand, allowCancel: true }
      );
    }
    // Ref: set-team-up/zeraora.ts (Wild Charge — self damage)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }
    return state;
  }
}
