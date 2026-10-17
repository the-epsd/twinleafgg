import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, SlotType, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Combee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Honey Scent',
    cost: [C],
    damage: 0,
    text: 'Remove 2 damage counters from 1 of your Pokémon.'
  },
  {
    name: 'Flitter',
    cost: [G, G],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Combee';
  public fullName: string = 'Combee MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Honey Scent
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });
      if (!hasPokemonWithDamage) {
        return state;
      }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), results => {
        const targets = results || [];
        targets.forEach(target => {
          const healEffect = new HealEffect(player, target, 20);
          store.reduceEffect(state, healEffect);
        });
      });
    }

    // Flitter
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const attackEffect = effect;
      attackEffect.ignoreWeakness = true;
      attackEffect.ignoreResistance = true;
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(20, attackEffect, store, state);
    }

    return state;
  }
}
