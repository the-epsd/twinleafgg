import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, TrainerCard, GameMessage, GameError } from '../../game';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Meowthex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 170;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Trump Card Catch',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to your Bench during your turn, you may use this Ability. Search your deck for a Supporter card, reveal it, and put it into your hand. You can\'t use this Ability if you\'ve already used another Ability with "Trump Card" in its name this turn.',
  }];

  public attacks = [{
    name: 'Tuck Tail',
    cost: [C, C, C],
    damage: 60,
    text: 'Return this Pokémon and all attached cards into your hand.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Meowth ex';
  public fullName: string = 'Meowth ex M3';
  public readonly TRUMP_CARD_MARKER = 'TRUMP_CARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      if (player.marker.hasMarker(this.TRUMP_CARD_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof TrainerCard && (card.trainerType !== TrainerType.SUPPORTER)) {
          blocked.push(index);
        }
      });

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          ABILITY_USED(player, this);
          player.marker.addMarkerToState(this.TRUMP_CARD_MARKER);
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.powers[0]);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TRUMP_CARD_MARKER)) {
      effect.player.marker.removeMarker(this.TRUMP_CARD_MARKER);
    }

    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const pokemons = player.active.getPokemons();
      const otherCards = player.active.cards.filter(card =>
        !(card instanceof PokemonCard) &&
        !pokemons.includes(card as PokemonCard) &&
        (!player.active.tools || !player.active.tools.includes(card))
      );
      const tools = [...player.active.tools];
      player.active.clearEffects();

      // Move other cards to hand
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, player.active, player.hand, { cards: otherCards });
      }

      // Move tools to hand explicitly
      for (const tool of tools) {
        player.active.moveCardTo(tool, player.hand);
      }

      // Move Pokémon to hand
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, player.active, player.hand, { cards: pokemons });
      }
      return state;
    }
    return state;
  }
}