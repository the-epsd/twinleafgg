import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, DamageMap, GameError, GameMessage, MoveDamagePrompt, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { ABILITY_USED, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class GastrodonEastSea extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shellos East Sea';
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Osmotic Pressure',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if you have Gastrodon West Sea in play, you may move up to 3 damage counters from Gastrodon East Sea to 1 of your Gastrodon West Sea.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Dwindling Wave',
    cost: [W, C, C],
    damage: 80,
    damageCalculation: '-',
    text: 'Does 80 damage minus 10 damage for each damage counter on Gastrodon East Sea.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Gastrodon East Sea';
  public fullName: string = 'Gastrodon East Sea SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Osmotic Pressure
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      if (cardList.damage === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];
      let hasWestSea = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card !== this) {
          blockedFrom.push(target);
        }
        if (card.name === 'Gastrodon West Sea') {
          hasWestSea = true;
        } else {
          blockedTo.push(target);
        }
      });

      if (!hasWestSea) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, _card, target) => {
        const checkHpEffect = new CheckHpEffect(player, list);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const maxCounters = Math.min(3, Math.floor(cardList.damage / 10));

      return store.prompt(state, new MoveDamagePrompt(
        player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: maxCounters, allowCancel: true, blockedFrom, blockedTo }
      ), transfers => {
        if (!transfers) {
          return;
        }
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 10) {
            source.damage -= 10;
            target.damage += 10;
          }
        }
      });
    }

    // Dwindling Wave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const damageCounters = effect.player.active.damage / 10;
      effect.damage = Math.max(0, 80 - 10 * damageCounters);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
