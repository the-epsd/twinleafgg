import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { AttachPokemonToolEffect, PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType } from '../../game';

export class Jellicentex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom = 'Frillish';
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: D }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sea Curse',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Item cards  or attach any Pokémon Tool cards from their hand.'
  }];

  public attacks = [{
    name: 'Power Press',
    cost: [P, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has at least 2 extra Energy attached (in addition to this attack\'s cost), this attack does 80 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Jellicent ex';
  public fullName: string = 'Jellicent ex SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
    }

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isJellicentexInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isJellicentexInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isJellicentexInPlay = true;
        }
      });

      if (!isJellicentexInPlay) {
        return state;
      }

      if (player.active.getPokemonCard() === this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (opponent.active.getPokemonCard() === this) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (effect instanceof AttachPokemonToolEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isJellicentexInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isJellicentexInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isJellicentexInPlay = true;
        }
      });

      if (!isJellicentexInPlay) {
        return state;
      }

      if (player.active.getPokemonCard() === this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (opponent.active.getPokemonCard() === this) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }
    return state;
  }
}