import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Card } from '../../game/store/card/card';
import { ChoosePokemonPrompt } from '../../game';

export class Meganium extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 150;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public evolvesFrom: string = 'Bayleef';

  public powers = [{
    name: 'Quick-Ripening Herb',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may use this Ability. Choose 1 of your Basic Pokémon in play. If you have a Stage 2 card in your hand that evolves from that Pokémon, put that card onto the Basic Pokémon to evolve it. You can use this Ability during your first turn or on a Pokémon that was put into play this turn.'
  }];

  public attacks = [
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 110,
      text: ''
    }];

  public set: string = 'LOT';
  public name: string = 'Meganium';
  public fullName: string = 'Meganium LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';

  public readonly QUICK_RIPENING_HERB_MARKER = 'QUICK_RIPENING_HERB_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_RIPENING_HERB_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_RIPENING_HERB_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.QUICK_RIPENING_HERB_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      let cards: Card[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 },
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        cards = selected || [];

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_EVOLVE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
        ), targets => {
          if (cards.length > 0) {
            // Evolve Pokemon
            player.hand.moveCardsTo(cards, targets[0]);
            targets[0].clearEffects();
            targets[0].pokemonPlayedTurn = state.turn;
          }
        });
      });
    }
    return state;
  }

}