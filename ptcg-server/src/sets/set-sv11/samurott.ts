import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from "../../game";
import { IS_ABILITY_BLOCKED } from "../../game/store/prefabs/prefabs";

export class Samurott extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dewott';
  public cardType: CardType = W;
  public hp: number = 160;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public abilities = [{
    name: 'Strong Currents',
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokemon. If you do, your opponent switches their Active Pokemon with 1 of their Benched Pokemon.'
  }];

  public attacks = [{
    name: 'Energy Slash',
    cost: [W],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Energy attached to this Pokemon.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Samurott';
  public fullName: string = 'Samurott SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Strong Currents ability
    if (effect instanceof AttackEffect && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerHasBench = player.bench.some(b => b.cards.length > 0);
      const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

      if (playerHasBench && opponentHasBench) {
        // First, opponent switches
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), results => {
          if (results && results.length > 0) {
            player.active.clearEffects();
            player.switchPokemon(results[0]);

            // Then player switches
            return store.prompt(state, new ChoosePokemonPrompt(
              opponent.id,
              GameMessage.CHOOSE_POKEMON_TO_SWITCH,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH],
              { allowCancel: false }
            ), playerResults => {
              if (playerResults && playerResults.length > 0) {
                opponent.active.clearEffects();
                opponent.switchPokemon(playerResults[0]);
              }
              return state;
            });
          }
          return state;
        });
      }
    }

    // Energy Slash attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCount = checkProvidedEnergy.energyMap.length;
      effect.damage = 30 + (50 * energyCount);
    }
    return state;
  }
}
