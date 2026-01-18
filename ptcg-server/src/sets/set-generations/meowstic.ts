import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


function* useMagicalSwap(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(opponent, cardList);
    store.reduceEffect(state, checkHpEffect);
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  return store.prompt(state, new MoveDamagePrompt(
    effect.player.id,
    GameMessage.MOVE_DAMAGE,
    PlayerType.TOP_PLAYER,
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
      if (source.damage >= 10) {
        source.damage -= 10;
        target.damage += 10;
      }
    }
  });
}

export class Meowstic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Espurr';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Ear Influence',
    cost: [P],
    damage: 0,
    text: 'Move as many damage counters on your opponent\'s Pokémon as you like to any of your opponent\'s other Pokémon in any way you like.'
  },
  {
    name: 'Psychic',
    cost: [P, P, P],
    damage: 60,
    damageCalculation: '+',
    text: 'Does 10 more damage for each Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'GEN';
  public setNumber = 'RC15';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Meowstic';
  public fullName: string = 'Meowstic GEN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useMagicalSwap(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
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
