import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Wobbuffet extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Bide Barricade',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is your Active Pokemon, each Pokemon in ' +
      'play, in each player\'s hand, and in each player\'s discard pile has ' +
      'no Abilities (except for P Pokemon).'
  }];

  public attacks = [{
    name: 'Psychic Assault',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 10,
    text: 'This attack does 10 more damage for each damage counter on ' +
      'your opponent\'s Active Pokemon.'
  }];

  public set: string = 'PHF';

  public name: string = 'Wobbuffet';

  public fullName: string = 'Wobbuffet PHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.opponent.active.damage;
      return state;
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Wobbuffet is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      let cardTypes = [effect.card.cardType];

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are not blocking the Abilities from Psychic Pokemon
      if (cardTypes.includes(CardType.PSYCHIC)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
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
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }

      return state;
    }
    return state;
  }
}
