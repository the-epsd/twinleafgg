import { ChooseCardsPrompt, GameError, GameMessage, PlayerType, State, StoreLike } from '../../game';
import { BoardEffect, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Swampert extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.WATER;
  public hp: number = 160;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom: string = 'Marshtomp';

  public powers = [{
    name: 'Power Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard a card from your hand. If you do, draw 3 cards.'
  }];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    damageCalculation: '+',
    text: 'This attack does 20 more damage times the amount of [W] Energy attached to this Pokémon.'
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Swampert';
  public fullName: string = 'Swampert CES';

  public readonly POWER_DRAW_MARKER = 'POWER_DRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.POWER_DRAW_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.POWER_DRAW_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];

        if (cards.length === 0) {
          return;
        }

        player.marker.addMarker(this.POWER_DRAW_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 3);
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      state.players.forEach(player => {
        if (!player.marker.hasMarker(this.POWER_DRAW_MARKER)) {
          return;
        }
        player.marker.removeMarker(this.POWER_DRAW_MARKER, this);
      });
    }

    if (effect instanceof AttackEffect && effect.attack == this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;

      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER;
        }).length;
      });

      effect.damage += energyCount * 20;

      return state;
    }

    return state;
  }
}