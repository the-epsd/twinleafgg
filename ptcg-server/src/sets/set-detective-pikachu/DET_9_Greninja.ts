import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Greninja extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.WATER;
  public hp: number = 140;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.GRASS }];
  public evolvesFrom = 'Frogadier';

  public powers = [{
    name: 'Evasion Jutsu',
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage. '
  }];

  public attacks = [{
    name: 'Furious Shurikens',
    cost: [CardType.WATER, CardType.WATER],
    damage: 0,
    text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DET';
  public name: string = 'Greninja';
  public fullName: string = 'Greninja DET';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(StateUtils.findOwner(state, effect.target), {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }


      return store.prompt(state, [
        new CoinFlipPrompt(StateUtils.findOwner(state, effect.target).id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          effect.preventDefault = true;
          return state;
        }
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const max = Math.min(2);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }

    return state;
  }
}