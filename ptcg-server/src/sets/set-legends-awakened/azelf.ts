import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, ConfirmPrompt, GameMessage, CardList, ChooseCardsPrompt, ShowCardsPrompt, StateUtils } from '../../game';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Azelf extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC, value: +20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Time Walk',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Azelf from your hand onto your Bench, you may look at all of your face-down Prize cards. If you do, you may choose 1 Pokémon you find there, show it to your opponent, and put it into your hand. Then, choose 1 card in your hand and put it as a Prize card face down.'
  }];

  public attacks = [
    {
      name: 'Lock Up',
      cost: [CardType.PSYCHIC],
      damage: 20,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'LA';

  public setNumber: string = '19';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Azelf';

  public fullName: string = 'Azelf LA';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const opponent = StateUtils.getOpponent(state, player);
          const prizes = player.prizes.filter(p => p.isSecret);

          prizes.forEach(p => { p.isSecret = false; });

          const cardList = new CardList();
          prizes.forEach(prizeList => {
            cardList.cards.push(...prizeList.cards);
          });

          // Prompt the player to choose a Pokémon from their prizes
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            cardList,
            { superType: SuperType.POKEMON },
            { min: 0, max: 1, allowCancel: false }
          ), chosenPrize => {

            if (chosenPrize.length > 0) {
              state = store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                chosenPrize
              ), () => { });

              player.prizes.forEach(p => {
                if (p.cards[0] === chosenPrize[0]) {
                  p.moveCardsTo(chosenPrize, player.supporter);
                }
              });

              store.prompt(state, new ChooseCardsPrompt(
                player,
                GameMessage.CHOOSE_CARDS_TO_RETURN_TO_PRIZES,
                player.hand,
                {},
                { min: 1, max: 1, allowCancel: false }
              ), selected => {
                player.supporter.moveCardsTo(chosenPrize, player.hand);
                player.prizes.forEach(p => {
                  if (p.cards.length === 0) {
                    player.hand.moveCardsTo(selected, p);
                  }
                });
              });
            }

            player.prizes.forEach(p => {
              p.isSecret = true;
            });

            return state;
          });
        }
      }
      );
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}