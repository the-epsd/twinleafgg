import { DamageMap, GameMessage, PlayerType, PutDamagePrompt, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianRunerigus extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Galarian Yamask';
  public regulationMark = 'D';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks =
    [
      {
        name: 'Spreading Spite',
        cost: [C, C],
        damage: 0,
        text: 'For each damage counter on this Galarian Runerigus, put 2 damage counters on your opponent\'s Pokémon in any way you like.'
      },
      {
        name: 'Mad Hammer',
        cost: [F, C, C],
        damage: 120,
        text: 'This Pokémon also does 30 damage to itself.'
      },
    ];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Galarian Runerigus';
  public fullName: string = 'Galarian Runerigus RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const selfDamageTimesTwo = player.active.damage * 2;
      const damage = Math.min(selfDamageTimesTwo, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
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

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}