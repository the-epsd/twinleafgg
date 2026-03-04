import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, AttachEnergyPrompt, CardList, EnergyCard, PlayerType, SlotType, StateUtils, ShowCardsPrompt, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { UseAttackEffect } from '../../game/store/effects/game-effects';

export class Walrein extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Sealeo';
  public cardType: CardType = W;
  public hp = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Crush Draw',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may reveal the top card of your deck. If that card is a basic Energy card, attach it to 1 of your Pokémon. If not, put the card back on your deck. This power can\'t be used if Walrein is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Sheer Cold',
    cost: [W, W, C],
    damage: 50,
    text: 'Flip a coin. If heads, each Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Walrein';
  public fullName: string = 'Walrein HL';

  public readonly CRUSH_DRAW_MARKER = 'CRUSH_DRAW_MARKER';
  public readonly SHEER_COLD_MARKER = 'SHEER_COLD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.CRUSH_DRAW_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.CRUSH_DRAW_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const temp = new CardList();

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.CRUSH_DRAW_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      player.deck.moveTo(temp, 1);

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC;
      });

      // If no energy cards were drawn, move all cards to discard
      if (energyCardsDrawn.length == 0) {
        player.marker.addMarker(this.CRUSH_DRAW_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        temp.cards.slice(0, 1).forEach(card => {

          store.prompt(state, [new ShowCardsPrompt(
            player.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            temp.cards
          )], () => {
            temp.moveToTopOfDestination(player.deck);
          });
        });
      } else {

        // Prompt to attach energy if any were drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, max: energyCardsDrawn.length, allowCancel: false }
        ), transfers => {

          player.marker.addMarker(this.CRUSH_DRAW_MARKER, this);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
            }
            temp.cards.forEach(card => {
              temp.moveCardTo(card, player.hand); // Move card to hand

            });
          }

        });
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_MARKER(this.SHEER_COLD_MARKER, opponent.active, this);
        }
      });
    }

    if (effect instanceof UseAttackEffect && HAS_MARKER(this.SHEER_COLD_MARKER, effect.player.active, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      REMOVE_MARKER(this.SHEER_COLD_MARKER, effect.player.active, this);
    }

    return state;
  }
}
