import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';
import { AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function isMassExplosionPokemon(name: string | undefined): boolean {
  return name === 'Koffing' || name === 'Weezing' || name === 'Dark Weezing';
}

export class DarkWeezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Koffing';
  public hp: number = 60;
  public cardType: CardType = G;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Mass Explosion',
    cost: [G, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the total number of Koffings, Weezings, and Dark Weezings in play (Apply Weakness and Resistance.). Then, this attack does 20 damage to each Koffing, Weezing, and Dark Weezing (even your own). Don\'t apply Weakness and Resistance.'
  },
  {
    name: 'Stun Gas',
    cost: [G, G, G],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned; if tails, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Dark Weezing';
  public fullName: string = 'Dark Weezing TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mass Explosion
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let count = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (isMassExplosionPokemon(cardList.getPokemonCard()?.name)) {
          count++;
        }
      });
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (isMassExplosionPokemon(cardList.getPokemonCard()?.name)) {
          count++;
        }
      });

      effect.damage = 20 * count;
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let source = player.active;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          source = cardList;
        }
      });

      const attackEffect = new AttackEffect(player, opponent, effect.attack);
      attackEffect.source = source;
      attackEffect.ignoreWeakness = true;
      attackEffect.ignoreResistance = true;

      const dealSecondaryDamage = (cardList: typeof source) => {
        const damageEffect = new PutDamageEffect(attackEffect, 20);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      };

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (isMassExplosionPokemon(cardList.getPokemonCard()?.name)) {
          dealSecondaryDamage(cardList);
        }
      });
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (isMassExplosionPokemon(cardList.getPokemonCard()?.name)) {
          dealSecondaryDamage(cardList);
        }
      });
    }

    // Stun Gas
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
      });
    }

    return state;
  }
}
