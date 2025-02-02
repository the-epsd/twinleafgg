import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GamePhase, PowerType, StateUtils, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';

// SCR Garganacl ex 89 (https://limitlesstcg.com/cards/SCR/89)
export class Garganaclex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Naclstack';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 340;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Salty Body',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t be affected by any Special Conditions.'
  }];

  public attacks = [
    { name: 'Block Hammer', cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS], damage: 170, text: 'During your opponent\'s next turn, this Pokémon takes 60 less damage from attacks (after applying Weakness and Resistance).' }
  ];

  public regulationMark = 'H';

  public set: string = 'SCR';

  public setNumber: string = '89';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Garganacl ex';

  public fullName: string = 'Garganacl ex SCR';

  public readonly BLOCK_HAMMER_MARKER = 'BLOCK_HAMMER_MARKER';
  public readonly CLEAR_BLOCK_HAMMER_MARKER = 'CLEAR_BLOCK_HAMMER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.BLOCK_HAMMER_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_BLOCK_HAMMER_MARKER, this);
    }

    // Salty Body
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        const activeCard = player.active.getPokemonCard();

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        // checking if the player's active has special conditions or if the active is Garganacl ex with the ability (i swear if they make another garganacl ex with the same ability name but with a different effect)
        if (player.active.specialConditions.length === 0
          || (activeCard && activeCard.name !== 'Garganacl ex')
          || (activeCard && activeCard.powers[0] !== this.powers[0])) {
          return state;
        }

        const conditions = player.active.specialConditions.slice();
        conditions.forEach(condition => {
          player.active.removeSpecialCondition(condition);
        });
      });
      return state;
    }

    // doing end of turn things with the markers
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_BLOCK_HAMMER_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_BLOCK_HAMMER_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.BLOCK_HAMMER_MARKER, this);
      });
    }

    // Reduce damage by 60
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      if (!effect.target.marker.hasMarker(this.BLOCK_HAMMER_MARKER)) {
        return state;
      }

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 60;
    }

    return state;
  }

}