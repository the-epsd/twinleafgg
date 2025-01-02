import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect, CardTag } from '../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, CoinFlipPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class IonosKilowattrel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Iono\'s Wattrel';
  public tags = [CardTag.IONOS];
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Flash Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a Basic L Energy from this Pokémon in order to use this Ability. Once during your turn, you may draw cards until you have 6 cards in your hand.'
  }];

  public attacks = [{
    name: 'Mach Bolt',
    cost: [L, C, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV9';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Iono\'s Kilowattrel';
  public fullName: string = 'Iono\'s Kilowattrel SV9';

  public readonly RUMBLING_ENGINE_MARKER = 'RUMBLING_ENGINE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.hand.cards.length >= 7) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.RUMBLING_ENGINE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const ionosKilowattrelCardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, ionosKilowattrelCardList);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const hasLightningEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(CardType.LIGHTNING));

      if (!hasLightningEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.LIGHTNING],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);

        cards.forEach(card => {
          const cardList = StateUtils.findCardList(state, card);
          if (cardList) {
            cardList.moveCardTo(card, player.discard);
          }
        });

        while (player.hand.cards.length < 6) {
          if (player.deck.cards.length === 0) {
            break;
          }
          player.deck.moveTo(player.hand, 1);
        }

        player.marker.addMarker(this.RUMBLING_ENGINE_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 90;
        }
      });
    }

    return state;
  }
}