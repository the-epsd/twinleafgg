import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

function* useDamageSwap(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  // Find the CardList of this Pokemon (the one with this power)
  let thisTarget: CardTarget | undefined = undefined;
  player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (card === effect.card) {
      thisTarget = target;
    }
  });

  const maxAllowedDamage: DamageMap[] = [];
  player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(player, cardList);
    store.reduceEffect(state, checkHpEffect);
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  // Block all "to" targets except thisTarget (the Slowbro with the power)
  const blockedTo: CardTarget[] = [];
  player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (thisTarget === undefined || target !== thisTarget) {
      blockedTo.push(target);
    }
  });

  // Block "from" thisTarget (can't move damage from itself to itself)
  const blockedFrom: CardTarget[] = [];
  if (thisTarget !== undefined) {
    blockedFrom.push(thisTarget);
  }

  return store.prompt(state, new MoveDamagePrompt(
    effect.player.id,
    GameMessage.MOVE_DAMAGE,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    maxAllowedDamage,
    { allowCancel: true, blockedTo, blockedFrom }
  ), transfers => {
    if (transfers === null) {
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

export class Slowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slowpoke';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Strange Behavior',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may move 1 damage counter from 1 of your other Pokémon to this Pokémon.'
  }];

  public attacks = [{
    name: 'Bubble Drain',
    cost: [W, C],
    damage: 60,
    text: 'Heal 30 damage from this Pokémon.'
  }];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Slowbro';
  public fullName: string = 'Slowbro SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const generator = useDamageSwap(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30)
    }
    return state;
  }
}