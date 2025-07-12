import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, CardList, ChooseCardsPrompt, GameMessage, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARD_TO, REMOVE_MARKER, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AbstractAttackEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Celebiex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Time Reversal',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Celebi ex from your hand onto your Bench, you may search your discard pile for a card, show it to your opponent, and put it on top of your deck.'
  }];

  public attacks = [{
    name: 'Psychic Shield',
    cost: [P, C],
    damage: 30,
    text: 'Prevent all effects of attacks, including damage, done to Celebi ex by your opponent\'s Pokémon-ex during your opponent\'s next turn.'
  }];

  public set: string = 'P2';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Celebi ex';
  public fullName: string = 'Celebi ex P2';

  public readonly PSYCHIC_SHIELD_MARKER = 'PSYCHIC_SHIELD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.discard.cards.length === 0) {
        return state;
      }

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (wantToUse) {
          const deckTop = new CardList();
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DECK,
            player.discard,
            {},
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            if (selected.length === 0) return;

            selected.forEach(card => {
              store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
              MOVE_CARD_TO(state, card, deckTop);
            });
            deckTop.moveToTopOfDestination(player.deck);
            SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);

            ABILITY_USED(player, this);
          });
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.marker.addMarker(this.PSYCHIC_SHIELD_MARKER, this);
      ADD_MARKER(this.PSYCHIC_SHIELD_MARKER, effect.opponent, this);
    }

    if ((effect instanceof PutDamageEffect || effect instanceof AbstractAttackEffect) && effect.target.getPokemonCard() === this && effect.source.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
      if (this.marker.hasMarker(this.PSYCHIC_SHIELD_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.PSYCHIC_SHIELD_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.PSYCHIC_SHIELD_MARKER, effect.player, this);
      this.marker.removeMarker(this.PSYCHIC_SHIELD_MARKER, this);
    }

    return state;
  }
}