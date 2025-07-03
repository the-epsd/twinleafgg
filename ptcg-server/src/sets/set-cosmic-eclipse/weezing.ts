import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Koffing';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Blow-Away Bomb',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you discard this Pokémon with the effect of Roxie, you may put 1 damage counter on each of your opponent\'s Pokémon. (Place damage counters after the effect of Roxie.)'
  }];

  public attacks = [{
    name: 'Balloon Burst',
    cost: [P, C],
    damage: 90,
    text: 'Discard this Pokémon and all cards attached to it.'
  }];

  public set: string = 'CEC';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing CEC';

  public usedBalloonBurst = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Blow-Away Bomb is handled in Roxie. 
    // It shouldn't be, so if you can figure out how to get it to be contained in Koffing and Weezing themselves, please do so.

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedBalloonBurst = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedBalloonBurst === true) {
      const player = effect.player;
      const target = player.active;

      // Separate Pokemon card from attached cards
      const pokemons = target.getPokemons();
      const otherCards = target.cards.filter(card => !(card instanceof PokemonCard));

      // Move other cards to discard first
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, target, player.discard, { cards: otherCards });
      }

      // Move Pokemon to discard
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, target, player.discard, { cards: pokemons });
      }
    }

    if (effect instanceof EndTurnEffect && this.usedBalloonBurst) {
      this.usedBalloonBurst = false;
    }

    return state;
  }
}