import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, ConfirmPrompt, PlayerType } from '../../../game';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { GameLog, GameMessage } from '../../../game/game-message';
import { ABILITY_USED, IS_ABILITY_BLOCKED, SEARCH_DECK_FOR_CARDS_TO_HAND, SHUFFLE_DECK, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  evolvesFrom = 'Roselia';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Le Parfum',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
    'Pokemon, you may search your deck for any card and put it into your ' +
    'hand. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Squeeze',
    cost: [G, C],
    damage: 30,
    text: 'Flip a coin. If heads, this attack does 20 more damage and ' +
    'the Defending Pokemon is now Paralyzed.'
  }];

  public set: string = 'DRX';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Le Parfum' });
            }
          });

          ABILITY_USED(player, this);
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 1, max: 1, allowCancel: false }, this.powers[0]);
          SHUFFLE_DECK(store, state, player);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          effect.damage += 20;
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    return state;
  }

}
