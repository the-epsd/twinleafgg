
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachPokemonToolEffect, PlayItemEffect, PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Vileplumeex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gloom';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Block Dust',
    powerType: PowerType.POKEBODY,
    text: 'As long as Vileplume ex is your Active Pokémon, your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand.'
  }];

  public attacks = [{
    name: 'Special Formula',
    cost: [G, C, C],
    damage: 50,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep and Poisoned. If tails, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'HL';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vileplume ex';
  public fullName: string = 'Vileplume ex HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayItemEffect || effect instanceof AttachPokemonToolEffect || effect instanceof PlayStadiumEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // Checking to see if ability is being blocked
      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      if (opponent.active.getPokemonCard() === this) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        } else {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });
    }

    return state;
  }

}