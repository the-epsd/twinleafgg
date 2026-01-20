import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckRetreatCostEffect, CheckPokemonAttacksEffect, CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';

export class Ditto extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public resistance = [{ type: P, value: -30 }];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [];

  public powers = [{
    name: 'Transform',
    powerType: PowerType.POKEMON_POWER,
    text: 'If Ditto is your Active Pokémon, treat it as if it were the same card as the Defending Pokémon, including type, Hit Points, Weakness, and so on, except Ditto can\'t evolve, always has this Pokémon Power, and you may treat any Energy attached to Ditto as Energy of any type. Ditto isn\'t a copy of any other Pokémon while Ditto is Asleep, Confused, or Paralyzed.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Ditto';
  public fullName: string = 'Ditto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Handle HP check
    if (effect instanceof CheckHpEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActiveHP = new CheckHpEffect(opponent, opponent.active);
      effect.hp = opponentActiveHP.hp; // Set Ditto's HP to opponent's active HP
    }

    // Handle Retreat Cost check
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActiveRetreat = new CheckRetreatCostEffect(opponent);
      effect.cost = opponentActiveRetreat.cost; // Set Ditto's retreat cost to opponent's
    }

    // Handle Attack checks
    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentAttacks = new CheckPokemonAttacksEffect(opponent);
      // Copy opponent's attacks to effect.attacks instead of this.attacks
      effect.attacks = [...opponentAttacks.attacks];
    }

    // Handle Power checks
    if (effect instanceof CheckPokemonPowersEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentPokemon = opponent.active.getPokemonCard();
      if (opponentPokemon) {
        const opponentPowers = new CheckPokemonPowersEffect(player, opponentPokemon);
        // Logic to copy opponent's powers to Ditto's powers
        this.powers = [...opponentPowers.powers]; // Example of copying powers
      }
    }

    return state; // Return the updated state
  }

}