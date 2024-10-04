import { PokemonCard, Stage, CardTag, CardType, DamageMap, GameMessage, PlayerType, PutDamagePrompt, SlotType, State, StateUtils, StoreLike, SpecialCondition } from '../../game';
import { AddSpecialConditionsEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Banette extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'E';

  public tags = [CardTag.SINGLE_STRIKE];

  public evolvesFrom = 'Shuppet';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Resolute Spite',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Put up to 7 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way.'
  }, {
    name: 'Eerie Light',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 50,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Banette';

  public fullName: string = 'Banette CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = attack(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
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
    70,
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
      console.log(effect.damage);
    }
  });
}