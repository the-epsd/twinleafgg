import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

function* useDamageSwap(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  const maxAllowedDamage: DamageMap[] = [];
  player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(player, cardList);
    store.reduceEffect(state, checkHpEffect);
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  return store.prompt(state, new MoveDamagePrompt(
    effect.player.id,
    GameMessage.MOVE_DAMAGE,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    maxAllowedDamage,
    { allowCancel: true }
  ), transfers => {
    if (transfers === null) {
      return;
    }

    for (const transfer of transfers) {
      const source = StateUtils.getTarget(state, player, transfer.from);
      const target = StateUtils.getTarget(state, player, transfer.to);

      // Check if ability can target the transfer source
      const canApplyAbilityToSource = new EffectOfAbilityEffect(player, effect.power, effect.card, source);
      store.reduceEffect(state, canApplyAbilityToSource);

      // Remove damage if we can target the transfer source
      if (canApplyAbilityToSource.target && source.damage >= 10) {
        source.damage -= 10;

        // Check if ability can target the transfer target
        const canApplyAbilityToTarget = new EffectOfAbilityEffect(player, effect.power, effect.card, target);
        store.reduceEffect(state, canApplyAbilityToTarget);

        // Add damage if we can target the transfer target
        if (canApplyAbilityToTarget.target) {
          target.damage += 10;
        }
      }
    }
  });
}

export class Reuniclus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Duosion';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Damage Swap',
    useWhenInPlay: true,
    powerType: PowerType.POKEMON_POWER,
    text: 'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another of your Pokémon.'
  }];

  public attacks = [{
    name: 'Psywave',
    cost: [P, P, P],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 10 more damage for each Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Reuniclus';
  public fullName: string = 'Reuniclus BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const generator = useDamageSwap(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 10;
    }
    return state;
  }
}