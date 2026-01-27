import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, BoardEffect } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State,
  GameMessage, Card, ChooseCardsPrompt, ShuffleDeckPrompt, PokemonCardList, PlayerType,
  GameError
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Miraidonex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 220;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Tandem Unit',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for up ' +
      'to 2 Basic [L] Pokémon and put them onto your Bench. ' +
      'Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Photon Blaster',
    cost: [L, L, C],
    damage: 220,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Miraidon ex';
  public fullName: string = 'Miraidon ex SVI';

  public readonly TANDEM_UNIT_MARKER = 'TANDEM_UNIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.TANDEM_UNIT_MARKER, this);
    }

    // Photon Blaster
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.TANDEM_UNIT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.marker.addMarker(this.TANDEM_UNIT_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC, cardType: CardType.LIGHTNING },
        { min: 0, max: 2, allowCancel: false }
      ), selectedCards => {
        cards = selectedCards || [];


        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;

          return state;
        });

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    
    return state;
  }
}