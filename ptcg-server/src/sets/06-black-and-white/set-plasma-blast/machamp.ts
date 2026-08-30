import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, PlayerType, pokemonHasCardType } from '../../../game';
import { Effect } from "../../../game/store/effects/effect";
import { AttackEffect } from "../../../game/store/effects/game-effects";
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "../../../game/store/prefabs/prefabs";

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Machoke';
  public cardType: CardType[] = [F];
  public hp: number = 150;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Badge of Discipline',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'The damage of each of your Fighting Pokémon\'s attacks isn\'t affected by Resistance.'
  }];

  public attacks = [{
    name: 'Close Combat',
    cost: [F, C, C, C],
    damage: 120,
    text: 'Flip a coin. If tails, during your opponent\'s next turn, any damage done to this Pokémon by attacks is increased by 30 (after applying Weakness and Resistance).'
  }];

  public set: string = 'PLB';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Badge of Discipline - passive, intercept AttackEffect
    if (effect instanceof AttackEffect) {
      const player = effect.player;

      // Check if attacker is a Fighting Pokemon
      const attackerCard = player.active.getPokemonCard();
      if (attackerCard && pokemonHasCardType(attackerCard, CardType.FIGHTING)) {
        // Check if this Machamp is in play on the same side
        let machampInPlay = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList.getPokemonCard() === this) {
            machampInPlay = true;
          }
        });

        if (machampInPlay && !IS_ABILITY_BLOCKED(store, state, player, this)) {
          effect.ignoreResistance = true;
        }
      }
    }

    // Attack: Close Combat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.player.active.damageReductionNextTurn = -30;
        }
      });
    }

    return state;
  }
}
