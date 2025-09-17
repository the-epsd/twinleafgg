import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, PlayerType, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Regirockex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Healing Stone',
    powerType: PowerType.POKEBODY,
    text: 'At any time between turns, remove 1 damage counter from Regirock ex.'
  }];

  public attacks = [{
    name: 'Tonnage',
    cost: [F, F, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may do 60 damage plus 20 more damage. If you do, Regirock ex does 30 damage to itself.'
  }];

  public set: string = 'HL';
  public setNumber: string = '98';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Regirock ex';
  public fullName: string = 'Regirock ex HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Healing Stone Poké-Body
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      player.forEachPokemon(PlayerType.ANY, cardList => {
        if (cardList.getPokemonCard() === this) {
          const healEffect = new HealEffect(player, cardList, 10);
          state = store.reduceEffect(state, healEffect);
        }
      });
    }


    // Handle Tonnage attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage += 20;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
        }
      });
    }

    return state;
  }
} 