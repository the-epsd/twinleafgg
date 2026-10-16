import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, IS_POKEBODY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Vespiquen extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Combee';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Green Dignity',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have more Prize cards left than your opponent, Vespiquen\'s attacks do 10 more damage for each Grass Pokémon on your Bench to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Bee Drain',
    cost: [G],
    damage: 20,
    text: 'After your attack, remove from Vespiquen the number of damage counters equal to the damage you did to the Defending Pokémon.'
  },
  {
    name: 'Bee Powder',
    cost: [G, C],
    damage: 50,
    text: 'Flip 2 coins. If both are heads, the Defending Pokémon is now Burned, Paralyzed, and Poisoned.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Vespiquen';
  public fullName: string = 'Vespiquen SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Green Dignity
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.source);
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, owner);
      if (owner.getPrizeLeft() <= opponent.getPrizeLeft()) {
        return state;
      }
      if (effect.target !== opponent.active) {
        return state;
      }
      let grassOnBench = 0;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        if (target.slot !== SlotType.BENCH || cardList.cards.length === 0) {
          return;
        }
        const checkType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkType);
        if (checkType.cardTypes.includes(CardType.GRASS)) {
          grassOnBench++;
        }
      });
      if (grassOnBench > 0) {
        effect.damage += grassOnBench * 10;
      }
    }

    // Bee Drain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const healEffect = new HealEffect(player, player.active, effect.damage);
      state = store.reduceEffect(state, healEffect);
    }

    // Bee Powder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        if (results.length === 2 && results.every(r => r)) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
