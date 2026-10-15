import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GameMessage } from '../../../game/game-message';

export class Togekiss extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Togetic';
  public hp: number = 120;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Serene Grace',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Togekiss from your hand to evolve 1 of your Pokémon, you may look at the top 10 cards of your deck, choose as many basic Energy cards as you like, and attach them to your Pokémon in any way you like. Put the other cards back on top of your deck. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Air Scroll',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 40 damage plus 30 more damage. If tails, remove 3 damage counters from Togekiss.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Togekiss';
  public fullName: string = 'Togekiss GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Serene Grace
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      return CONFIRMATION_PROMPT(store, state, player, wantTo => {
        if (!wantTo) {
          return;
        }
        LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(
          store,
          state,
          player,
          10,
          10,
          {
            energyFilter: { energyType: EnergyType.BASIC },
            remainderDestination: 'shuffle',
          }
        );
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Air Scroll
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
        } else {
          HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
      });
    }

    return state;
  }
}
