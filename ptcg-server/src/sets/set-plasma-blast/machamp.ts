import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PlayerType, PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Machoke';
  public cardType: CardType = F;
  public hp: number = 150;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Badge of Discipline',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'The damage of each of your Fighting Pokémon\'s attacks isn\'t affected by Resistance.'
  }];

  public attacks = [
    {
      name: 'Close Combat',
      cost: [F, C, C, C],
      damage: 120,
      text: 'Flip a coin. If tails, during your opponent\'s next turn, any damage done to this Pokémon by attacks is increased by 30 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp PLB';

  public readonly CLOSE_COMBAT_MARKER = 'CLOSE_COMBAT_MARKER';
  public readonly CLEAR_CLOSE_COMBAT_MARKER = 'CLEAR_CLOSE_COMBAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Badge of Discipline - passive, intercept AttackEffect
    if (effect instanceof AttackEffect) {
      const player = effect.player;

      // Check if attacker is a Fighting Pokemon
      const attackerCard = player.active.getPokemonCard();
      if (attackerCard && attackerCard.cardType === CardType.FIGHTING) {
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
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          // Tails: take 30 more damage during opponent's next turn
          player.active.marker.addMarker(this.CLOSE_COMBAT_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_CLOSE_COMBAT_MARKER, this);
        }
      });
    }

    // Intercept incoming damage for Close Combat penalty
    // Ref: set-base-set/pluspower.ts (AfterWeaknessAndResistance timing via post-W/R hook)
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.CLOSE_COMBAT_MARKER, this)) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      if (state.phase === GamePhase.ATTACK && effect.player !== targetOwner) {
        effect.damage += 30;
      }
    }

    // Cleanup Close Combat marker
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_CLOSE_COMBAT_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_CLOSE_COMBAT_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.CLOSE_COMBAT_MARKER, this);
      });
    }

    return state;
  }
}
