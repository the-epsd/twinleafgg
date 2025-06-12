import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, PutDamagePrompt, SlotType, DamageMap, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class DragapultVMAX extends PokemonCard {

  public tags = [CardTag.POKEMON_VMAX];
  public regulationMark = 'D';
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Dragapult V';
  public cardType: CardType = P;
  public hp: number = 320;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Shred',
      cost: [P],
      damage: 60,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    },
    {
      name: 'Max Phantom',
      cost: [P, P],
      damage: 130,
      text: 'Put 5 damage counters on your opponent\'s Benched Pokémon in any way you like.'
    }
  ];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Dragapult VMAX';
  public fullName: string = 'Dragapult VMAX RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)){
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
    }

    if (WAS_ATTACK_USED(effect, 1, this)){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
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
  
      const damage = Math.min(50, damageLeft);
  
      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
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
    return state;
  }
}