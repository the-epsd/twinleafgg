import { BoardEffect, CardType, GameError, GameMessage, PlayerType, PokemonCard, PowerType, SpecialCondition, Stage, State, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect, PowerEffect } from "../../game/store/effects/game-effects";
import { PlayPokemonEffect, TrainerEffect } from "../../game/store/effects/play-card-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";


export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Golbat';
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public powers = [
    {
      name: 'Shadowy Envoy',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: 'Once during your turn, if you played Janine\'s Secret Art from your hand this turn, you may draw cards until you have 8 cards in your hand.'
    }
  ];

  public attacks = [
    {
      name: 'Poison Fang',
      cost: [D, C],
      damage: 120,
      text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 2 damage counters on that Pokémon instead of 1.'
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'SFA';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat SFA';

  public readonly SHADOWY_ENVOY_MARKER = 'SHADOWY_ENVOY_MARKER';
  public readonly PLAY_JANINES_SECRET_ART_MARKER = 'PLAY_JANINES_SECRET_ART_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard.name == 'Janine\'s Secret Art') {
      effect.player.marker.addMarker(this.PLAY_JANINES_SECRET_ART_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.SHADOWY_ENVOY_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.hand.cards.length >= 8) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.SHADOWY_ENVOY_MARKER, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.PLAY_JANINES_SECRET_ART_MARKER, this)) {
        while (player.hand.cards.length < 8) {
          if (player.deck.cards.length === 0) {
            break;
          }
          player.deck.moveTo(player.hand, 1);
        }

        player.marker.addMarker(this.SHADOWY_ENVOY_MARKER, this);
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });
      } else {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SHADOWY_ENVOY_MARKER, this)) {
      effect.player.marker.removeMarker(this.SHADOWY_ENVOY_MARKER, this);
      effect.player.marker.removeMarker(this.PLAY_JANINES_SECRET_ART_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 20;
      store.reduceEffect(state, specialCondition);
    }
    return state;
  }
}