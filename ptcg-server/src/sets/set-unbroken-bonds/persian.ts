import { PokemonCard, Stage, PowerType, StoreLike, State, PlayerType } from '../../game';
import { CheckAttackCostEffect, CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Persian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Meowth';
  public cardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [];

  public powers = [{
    name: 'Gathering of Cats',
    powerType: PowerType.ABILITY,
    text: 'Ignore all Energy in the attack costs of each of your Pokémon in play that has the Caturday attack.'
  }];

  public attacks = [{
    name: 'Claw Slash',
    cost: [C, C, C],
    damage: 90,
    text: ''
  }];

  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '148';
  public name: string = 'Persian';
  public fullName: string = 'Persian UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;

      let isPersianInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isPersianInPlay = true;
        }
      });

      if (!isPersianInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const pokemonCard = player.active.getPokemonCard();
      const pokemonAttacks = new CheckPokemonAttacksEffect(player);
      store.reduceEffect(state, pokemonAttacks);
      if (pokemonCard && pokemonAttacks.attacks.some(attack => attack.name === 'Caturday')) {
        effect.cost = [];
      }
    }

    return state;
  }
}
