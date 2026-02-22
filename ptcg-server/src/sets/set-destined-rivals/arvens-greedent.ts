import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, ConfirmPrompt, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, MOVE_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
export class ArvensGreedent extends PokemonCard {
  public regulationMark = 'I';
  public tags = [CardTag.ARVENS];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Arven\'s Skwovet';
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Greedy Order',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put up to 2 Arven\'s Sandwich from your discard pile into your hand.'
  }];

  public attacks = [{
    name: 'Rolling Tackle',
    cost: [C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '159';
  public name: string = 'Arven\'s Greedent';
  public fullName: string = 'Arven\'s Greedent DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // if there's no sandwiches in the discard, just skip this
      let sandwiches = false;
      player.discard.cards.forEach(card => {
        if (card.name === 'Arven\'s Sandwich') {
          sandwiches = true;
        }
      });
      if (!sandwiches) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.discard,
            { superType: SuperType.TRAINER, name: 'Arven\'s Sandwich' },
            { min: 0, max: 2, allowCancel: false }
          ), cards => {
            if (cards.length > 0) {
              return state;
            }

            MOVE_CARDS_TO_HAND(store, state, player, cards);
          });

        }
      });
    }

    return state;
  }
}