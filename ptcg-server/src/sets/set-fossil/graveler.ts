import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Graveler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 60;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Geodude';

  public attacks = [{
    name: 'Harden',
    cost: [F, F],
    damage: 0,
    text: 'During your opponent\'s next turn, whenever 30 or less damage is done to Graveler (after applying Weakness and Resistance), prevent that damage. (Any other effects of attacks still happen.)'
  },
  {
    name: 'Rock Throw',
    cost: [F, F, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Graveler';
  public fullName: string = 'Graveler FO';

  public readonly HARDEN_MARKER = 'HARDEN_MARKER'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.attackMarker.addMarker(this.HARDEN_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.player.active.attackMarker.hasMarker(this.HARDEN_MARKER, this)) {
      const damageBeingDealt = effect.damage;

      if (damageBeingDealt <= 30) {
        const damageEffect = new DealDamageEffect(effect, 0);
        damageEffect.target = effect.target;

        state = store.reduceEffect(state, damageEffect);
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.attackMarker.removeMarker(this.HARDEN_MARKER, this);
    }


    return state;
  }
}