import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Beldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Metal Chain',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you attach a Metal Energy card from your hand to Beldum (excluding effects of attacks or Poké-Powers), you may search your deck for Beldum and put it onto your Bench. Shuffle your deck afterward. This power can\'t be used if Beldum is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Take Down',
    cost: [M, C],
    damage: 30,
    text: 'Beldum does 10 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum LA';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Chain
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      if (effect.energyCard.name !== 'Metal Energy') {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        return state;
      }
      try {
        BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      } catch {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
        ABILITY_USED(player, this);
        SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { name: 'Beldum', stage: Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
      });
    }

    // Take Down
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
