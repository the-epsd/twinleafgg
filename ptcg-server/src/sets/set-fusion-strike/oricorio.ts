import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { DamageMap, PlayerType, GameMessage, PutDamagePrompt, SlotType } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class Oricorio extends PokemonCard {

  public tags = [CardTag.FUSION_STRIKE];

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Lesson in Zeal',
    powerType: PowerType.ABILITY,
    text: 'All of your Fusion Strike Pokémon take 20 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). You can\'t apply more than 1 Lesson in Zeal Ability at a time.'
  }];

  public attacks = [{
    name: 'Glistening Droplets',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 0,
    text: 'Put 5 damage counters on your opponent\'s Pokémon in ' +
      'any way you like.'
  }];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '42';

  public name: string = 'Oricorio';

  public fullName: string = 'Oricorio FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const damage = Math.min(50, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
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

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;

      const activePokemon = player.active.getPokemonCard();
      const activeFusion = activePokemon && activePokemon.tags.includes(CardTag.FUSION_STRIKE);
      const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
      const benchFusion = benchPokemon.filter(card => card.tags.includes(CardTag.FUSION_STRIKE));

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

      if (activeFusion || benchFusion) {
        effect.damage -= 20;
      }
      return state;
    }
    return state;
  }
}