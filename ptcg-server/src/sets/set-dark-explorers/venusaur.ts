import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, Card } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class Venusaur extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Ivysaur';

  public cardType: CardType = G;

  public hp: number = 140;

  public weakness = [{ type: R }];

  public resistance = [{ type: W, value: -20 }];

  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Floral Fragrance',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Poison Powder',
      cost: [G, G, C, C],
      damage: 70,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '3';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Venusaur';

  public fullName: string = 'Venusaur DEX';

  public readonly FLORAL_FRAGRANCE_MARKER = 'FLORAL_FRAGRANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reset marker when Pokémon is played
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FLORAL_FRAGRANCE_MARKER, this);
    }

    // Floral Fragrance ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.FLORAL_FRAGRANCE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.marker.addMarker(this.FLORAL_FRAGRANCE_MARKER, this);

      let chosen: Card[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: true }
      ), selected => {
        chosen = selected || [];

        if (chosen.length > 0) {
          player.deck.moveCardsTo(chosen, player.hand);
          store.prompt(state, new ShowCardsPrompt(
            StateUtils.getOpponent(state, player).id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            chosen
          ), () => { });
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    // Poison Powder attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    // Clean up marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.FLORAL_FRAGRANCE_MARKER, this)) {
      effect.player.marker.removeMarker(this.FLORAL_FRAGRANCE_MARKER, this);
    }

    return state;
  }
}
