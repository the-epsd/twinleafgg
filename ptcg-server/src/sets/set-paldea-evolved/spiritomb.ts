import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, StateUtils } from '../../game';

export class Spiritomb extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Fettered in Misfortune',
    powerType: PowerType.ABILITY,
    text: 'Basic Pokémon V in play (both yours and your opponent\'s) have ' +
      'no Abilities. '
  }];

  public attacks = [{
    name: 'Fade Out',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'Put this Pokémon and all attached cards into your hand. '
  }];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '89';

  public name: string = 'Spiritomb';

  public fullName: string = 'Spiritomb PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect
      && effect.power.powerType === PowerType.ABILITY
      && effect.power.name !== 'Fettered in Misfortune') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isSpiritombInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpiritombInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpiritombInPlay = true;
        }
      });

      if (!isSpiritombInPlay) {
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

      const pokemonCard = effect.card;

      if (pokemonCard.tags.includes(CardTag.POKEMON_V)) {

        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.active.clearEffects();
      player.active.moveTo(player.hand);
      const pokemon = player.active.getPokemonCard();
      pokemon?.cards.moveCardsTo(pokemon.cards.cards, player.hand);
    }
    return state;
  }
}