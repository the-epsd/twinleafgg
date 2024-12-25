import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType, CardTag, TrainerType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, GameError, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class OranguruV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public hp: number = 210;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public powers = [{
    name: 'Back Order',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may search your deck for up to 2 Pokémon Tool cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Psychic',
      cost: [C, C, C],
      damage: 30,
      text: 'This attack does 50 more damage for each Energy attached to your opponent\'s Active Pokémon.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public setNumber = '133';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Oranguru V';

  public fullName: string = 'Oranguru V ASR';

  public readonly BACK_ORDER_MARKER = 'BACK_ORDER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BACK_ORDER_MARKER, this);
    }

    // Back Order
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.BACK_ORDER_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { trainerType: TrainerType.TOOL },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        cards = selected || [];

        player.marker.addMarker(this.BACK_ORDER_MARKER, this);
        player.deck.moveCardsTo(cards, player.hand);
      });
    }

    // Psychic
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += opponentEnergyCount * 50;
    }

    // marker gaming
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      player.marker.removeMarker(this.BACK_ORDER_MARKER, this);
    }

    return state;
  }
}