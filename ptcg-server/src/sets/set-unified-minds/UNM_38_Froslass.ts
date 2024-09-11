import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, DamageMap, PlayerType, PutDamagePrompt, GameMessage, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { AddSpecialConditionsEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Froslass extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.WATER;
  public hp: number = 80;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.METAL }];
  public evolvesFrom = 'Snorunt';

  public attacks = [{
    name: 'Spitful Sigh',
    cost: [CardType.WATER],
    damage: 20,
    text: 'Put up to 7 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way. '
  },
  {
    name: 'Icy Wind',
    cost: [CardType.WATER],
    damage: 40,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public set: string = 'UNM';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Froslass';
  public fullName: string = 'Froslass UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = attack(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    function* attack(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
      const player = effect.player;

      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp + 70 });
      });

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        90,
        maxAllowedDamage,
        { allowCancel: false, allowPlacePartialDamage: true }
      ), targets => {
        const results = targets || [];
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          const putCountersEffect = new PutCountersEffect(effect, result.damage);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
          effect.damage = result.damage * 2;
        }
      });
    }

    return state;
  }

}

