import { ConfirmPrompt, GameError, GameMessage, PowerType, StateUtils } from '../..';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Machamp extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Machoke';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 150;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Crisis Muscles',
    powerType: PowerType.ABILITY,
    text: 'If your opponent has 3 or fewer Prize cards remaining, this Pokémon gets +150 HP.'
  }];

  public attacks = [{
    name: 'Strong-Arm Lariat',
    cost: [CardType.FIGHTING, CardType.FIGHTING],
    damage: 100,
    damageCalculation: '+',
    text: 'You may do 100 more damage. If you do, during your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public regulationMark = 'F';

  public name: string = 'Machamp';

  public fullName: string = 'Machamp LOR';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      if (player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          effect.damage += 100;
          effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
        }
      });
    }

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (opponent.getPrizeLeft() <= 3) {
        effect.hp += 100;
      }

      return state;
    }

    return state;
  }

}