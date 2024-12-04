import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, EnergyCard, AttachEnergyPrompt, GameError, GameMessage, SlotType, StateUtils } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Regigigas extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Ancient Wisdom',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if you have Regirock, Regice, Registeel, Regieleki, and Regidrago in play, you may attach up to 3 Energy cards from your discard pile to 1 of your Pokémon.'
  }];

  public attacks = [{
    name: 'Gigaton Break',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 150,
    damageCalculator: '+',
    text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 150 more damage.'
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name: string = 'Regigigas';

  public fullName: string = 'Regigigas ASR';

  public readonly ANCIENT_WISDOM_MARKER = 'ANCIENT_WISDOM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      // Check if player has Regirock, Regice, Registeel, Regieleki, and Regidrago in play
      const player = effect.player;
      let hasRegis = false;

      let regis = ['Regirock', 'Regice', 'Registeel', 'Regieleki', 'Regidrago'];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (regis.includes(card.name)) {
          regis = regis.filter(r => r !== card.name);
        }
      });

      if (regis.length === 0) {
        hasRegis = true;
      }

      if (!hasRegis) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (hasRegis) {


        // Check if player has energy cards in discard pile
        const hasEnergy = player.discard.cards.some(c => c instanceof EnergyCard);
        if (!hasEnergy) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        if (player.marker.hasMarker(this.ANCIENT_WISDOM_MARKER, this)) {
          throw new GameError(GameMessage.POWER_ALREADY_USED);
        }

        state = store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 0, max: 3, sameTarget: true }
        ), transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
            player.marker.addMarker(this.ANCIENT_WISDOM_MARKER, this);

            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
              if (cardList.getPokemonCard() === this) {
                cardList.addBoardEffect(BoardEffect.ABILITY_USED);
              }
            });

          }
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_VMAX)) {
        effect.damage += 150;
      }
    }
    return state;
  }
}

