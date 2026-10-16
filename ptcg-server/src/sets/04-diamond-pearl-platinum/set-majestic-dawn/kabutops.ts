import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttachPokemonToolEffect, PlayItemEffect, PlayStadiumEffect, PlaySupporterEffect } from '../../../game/store/effects/play-card-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class Kabutops extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Kabuto';
  public hp: number = 120;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Primal Shell',
    powerType: PowerType.POKEBODY,
    text: 'As long as Kabutops is your Active Pokémon, your opponent can\'t play any Trainer cards from his or her hand.'
  }];

  public attacks = [{
    name: 'Chop Up',
    cost: [F, F, C],
    damage: 70,
    text: 'Does 10 damage to each of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Kabutops';
  public fullName: string = 'Kabutops MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Primal Shell
    if (
      effect instanceof PlayItemEffect ||
      effect instanceof PlaySupporterEffect ||
      effect instanceof AttachPokemonToolEffect ||
      effect instanceof PlayStadiumEffect
    ) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    // Chop Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      opponent.bench.forEach(target => {
        if (target.cards.length > 0 && target.damage > 0) {
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
