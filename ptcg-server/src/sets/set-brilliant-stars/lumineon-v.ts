import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import {
  PowerType, StoreLike, State,
  ShuffleDeckPrompt,
  TrainerCard,
  GameMessage
} from '../../game';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, CONFIRMATION_PROMPT, MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class LumineonV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 170;

  public weakness = [{ type: L }];

  public retreat = [C];

  public powers = [{
    name: 'Luminous Sign',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand onto your ' +
      'Bench during your turn, you may search your deck for a ' +
      'Supporter card, reveal it, and put it into your hand. Then, ' +
      'shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Aqua Return',
      cost: [W, C, C],
      damage: 120,
      text: 'Shuffle this Pokémon and all attached cards into your deck.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Lumineon V';

  public fullName: string = 'Lumineon V BRS';

  public usedAquaReturn: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
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

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof TrainerCard && (card.trainerType !== TrainerType.SUPPORTER)) {
          blocked.push(index);
        }
      });

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          ABILITY_USED(player, this);
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.powers[0]);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.usedAquaReturn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedAquaReturn) {
      const player = effect.player;
      const pokemons = player.active.getPokemons();
      const otherCards = player.active.cards.filter(card =>
        !(card instanceof PokemonCard) &&
        !pokemons.includes(card as PokemonCard) &&
        (!player.active.tools || !player.active.tools.includes(card))
      );
      const tools = [...player.active.tools];
      player.active.clearEffects();

      // Move other cards to discard
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, player.active, player.discard, { cards: otherCards });
      }

      // Move tools to discard explicitly
      for (const tool of tools) {
        player.active.moveCardTo(tool, player.discard);
      }

      // Move Pokémon to deck
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, player.active, player.deck, { cards: pokemons });
      }
      this.usedAquaReturn = false;

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }
    return state;
  }
}