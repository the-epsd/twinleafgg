import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, ShowCardsPrompt, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Grotle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Turtwig';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public powers = [{
    name: 'Sun-Drenched Shell',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a [G] Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
  }];
  public attacks = [
    {
      name: 'Razor Leaf',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public regulationMark: string = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Grotle';
  public fullName: string = 'Grotle BRS';

  public readonly SUN_DRENCHED_SHELL_MARKER = 'SUN_DRENCHED_SHELL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SUN_DRENCHED_SHELL_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SUN_DRENCHED_SHELL_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.SUN_DRENCHED_SHELL_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check to see if anything is blocking our Ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }


      if (player.marker.hasMarker(this.SUN_DRENCHED_SHELL_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON, cardType: CardType.GRASS },
        { min: 0, max: 1, allowCancel: true }
      ), cards => {
        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this, sourceEffect: this.powers[0] });

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          player.marker.addMarker(this.SUN_DRENCHED_SHELL_MARKER, this);
        });

        return store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards), () => state
        );
      });
    }

    return state;
  }
}