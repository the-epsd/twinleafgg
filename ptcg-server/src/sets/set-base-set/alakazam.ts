import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { CoinFlipPrompt } from '../..';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

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

export class Alakazam extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kadabra';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 80;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Damage Swap',
    useWhenInPlay: true,
    powerType: PowerType.POKEMON_POWER,
    text: 'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another as long as you don\'t Knock Out that Pokémon. This power can\'t be used if Alakazam is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Shadow Punch',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'BS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Alakazam';
  public fullName: string = 'Alakazam BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(effect.player, this);
      const generator = useDamageSwap(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }
    return state;
  }
}