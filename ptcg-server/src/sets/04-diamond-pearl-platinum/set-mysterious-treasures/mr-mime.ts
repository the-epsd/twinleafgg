import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, GameMessage, PowerType, SelectPrompt, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect, DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Airy Wall',
    powerType: PowerType.POKEBODY,
    text: 'If your opponent\'s Pokémon that has 2 or less Energy cards attached to it attacks Mr. Mime, prevent all damage done to Mr. Mime from that attack. If Mime Jr. is anywhere under Mr. Mime, prevent all effects of that attack, including damage, done to Mr. Mime.'
  }];

  public attacks = [{
    name: 'Trick Play',
    cost: [P, C],
    damage: 0,
    text: 'Put a coin next to your Active Pokémon without showing your opponent and cover it with your hand. Your opponent guesses if the coin is heads or tails. If he or she is wrong, this attack does 50 damage to the Defending Pokémon. If he or she is right, Mr. Mime does 20 damage to itself, and this attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Mr. Mime';
  public fullName: string = 'Mr. Mime MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Airy Wall
    if (
      (effect instanceof PutDamageEffect || effect instanceof DealDamageEffect || effect instanceof AbstractAttackEffect) &&
      effect.target.cards.includes(this)
    ) {
      const player = StateUtils.findOwner(state, effect.target);
      const attacker = effect.source.getPokemonCard();
      if (!attacker) {
        return state;
      }

      const energyCards = effect.source.cards.filter(c => c instanceof EnergyCard).length;
      if (energyCards > 2) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const hasMimeJr = effect.target.getPokemons().some(p => p.name === 'Mime Jr.');

      if (hasMimeJr) {
        // Prevent all effects including damage
        effect.preventDefault = true;
      } else if (effect instanceof PutDamageEffect || effect instanceof DealDamageEffect) {
        // Prevent damage only
        effect.preventDefault = true;
      }
    }

    // Trick Play
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, coinResult => {
        store.prompt(state, new SelectPrompt(
          opponent.id,
          GameMessage.CHOOSE_OPTION,
          [GameMessage.HEADS, GameMessage.TAILS],
          { allowCancel: false }
        ), choice => {
          const guessedHeads = choice === 0;
          const actualHeads = coinResult === true;
          if (guessedHeads === actualHeads) {
            // Opponent guessed right — 20 to self, ignore W/R
            const selfDamage = new PutDamageEffect(effect, 20);
            selfDamage.target = player.active;
            store.reduceEffect(state, selfDamage);
          } else {
            effect.damage = 50;
          }
        });
      });
    }

    return state;
  }
}
