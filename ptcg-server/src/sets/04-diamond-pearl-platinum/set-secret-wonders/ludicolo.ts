import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ludicolo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lombre';
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Rain Dish',
    powerType: PowerType.POKEBODY,
    text: 'At any time between turns, remove 1 damage counter from Ludicolo.'
  }];

  public attacks = [{
    name: 'Nature Power',
    cost: [W, W, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If you have a Stadium Card in play, this attack does 60 damage plus 20 more damage. If your opponent has a Stadium card in play, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Ludicolo';
  public fullName: string = 'Ludicolo SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rain Dish
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this && cardList.damage > 0) {
          if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
            return;
          }
          const healEffect = new HealEffect(player, cardList, 10);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Nature Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        const stadiumList = StateUtils.findCardList(state, stadiumCard);
        const stadiumOwner = StateUtils.findOwner(state, stadiumList);
        if (stadiumOwner === player) {
          effect.damage += 20;
        }
        if (stadiumOwner === opponent) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      }
    }

    return state;
  }
}
