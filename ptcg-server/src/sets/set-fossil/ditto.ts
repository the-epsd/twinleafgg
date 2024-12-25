import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

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
    powerType: PowerType.POKEPOWER,
    text: 'If Ditto is your Active Pokémon, treat it as if it were the same card as the Defending Pokémon, including type, Hit Points, Weakness, and so on, except Ditto can’t evolve, always has this Pokémon Power, and you may treat any Energy attached to Ditto as Energy of any type. Ditto isn’t a copy of any other Pokémon while Ditto is Asleep, Confused, or Paralyzed.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Ditto';
  public fullName: string = 'Ditto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActiveHP = new CheckHpEffect(opponent, opponent.active);

      effect.hp = opponentActiveHP.hp;

    }

    // Royal pain in my ass; coming back to this later
    /*if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentAttacks = new CheckPokemonAttacksEffect(opponent);

      let thisAttackIndex = 0;
      opponentAttacks.attacks.forEach((attacks, index, attackArray) => {
        this.attacks.includes(attackArray[index]);
        console.log(this.attacks[thisAttackIndex]);
        thisAttackIndex++;
      });
    }*/

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActiveRetreat = new CheckRetreatCostEffect(opponent);

      effect.cost = opponentActiveRetreat.cost;
    }

    return state;
  }

}