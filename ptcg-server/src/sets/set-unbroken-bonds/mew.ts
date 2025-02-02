import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { DamageMap, PutDamagePrompt, GameMessage } from '../../game';

function* usePsypower(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
    
  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    maxAllowedDamage.push({ target, damage: card.hp + 30 });
  });
  
  const damage = 30;
  
  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    damage,
    maxAllowedDamage,
    { allowCancel: false }
  ), targets => {
    const results = targets || [];
    for (const result of results) {
      const target = StateUtils.getTarget(state, player, result.target);
      const putCountersEffect = new PutCountersEffect(effect, result.damage);
      putCountersEffect.target = target;
      store.reduceEffect(state, putCountersEffect);
    }
  });
}

export class Mew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Bench Barrier',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks.'
  }];

  public attacks = [{
    name: 'Psypower',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like.'
  }];

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '76';

  public name: string = 'Mew';

  public fullName: string = 'Mew UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = usePsypower(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isMewInPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isMewInPlay = true;
        }
      });

      if (!isMewInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }

}
