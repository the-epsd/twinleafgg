import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Suicune extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Aqua Recover',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Suicune from your hand onto your Bench, you may search your discard pile for up to 3 Water Pokémon, show them to your opponent, and put them into your hand.'
  }];

  public attacks = [{
    name: 'Cure Stream',
    cost: [W, W, W],
    damage: 60,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 20 (before applying Weakness and Resistance).'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Suicune';
  public fullName: string = 'Suicune SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Recover
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      const waterPokemon = player.discard.cards.filter(c => {
        if (!(c instanceof PokemonCard)) {
          return false;
        }
        const types = Array.isArray(c.cardType) ? c.cardType : [c.cardType];
        return types.includes(CardType.WATER);
      });

      if (waterPokemon.length === 0) {
        return state;
      }

      return CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }
        const max = Math.min(3, waterPokemon.length);
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.POKEMON },
          {
            min: 0,
            max,
            allowCancel: true,
            blocked: player.discard.cards
              .map((c, index) => ({ c, index }))
              .filter(({ c }) => !waterPokemon.includes(c as PokemonCard))
              .map(({ index }) => index),
          }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
            MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard: this });
          }
        });
      });
    }

    // Cure Stream
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    return state;
  }
}
