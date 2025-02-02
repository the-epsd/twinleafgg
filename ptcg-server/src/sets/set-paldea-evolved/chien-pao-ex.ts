import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, ShuffleDeckPrompt, PowerType, PlayerType, SlotType, GameError, ShowCardsPrompt, StateUtils, EnergyCard } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameLog, GameMessage } from '../../game/game-message';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class ChienPaoex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 220;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Shivery Chill',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active ' +
      'Spot, you may search your deck for up to 2 Basic [W] Energy ' +
      'cards, reveal them, and put them into your hand. Then, ' +
      'shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Hail Blade',
      cost: [CardType.WATER, CardType.WATER],
      damage: 60,
      damageCalculation: 'x',
      text: 'You may discard any amount of W Energy from your ' +
        'Pokémon. This attack does 60 damage for each card you ' +
        'discarded in this way.'
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public name: string = 'Chien-Pao ex';

  public fullName: string = 'Chien-Pao ex PAL';

  public readonly SHIVERY_CHILL_MARKER = 'SHIVERY_CHILL_MARKER';

  // Implement power
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.SHIVERY_CHILL_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SHIVERY_CHILL_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.SHIVERY_CHILL_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 0, max: 2, allowCancel: false }
      ), cards => {

        player.marker.addMarker(this.SHIVERY_CHILL_MARKER, this);

        if (cards.length === 0) {
          return state;
        }

        cards.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });

        if (cards.length > 0) {
          state = store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          ), () => state);
        }

        player.deck.moveCardsTo(cards, player.hand);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      });
    }

    //     if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

    //       const player = effect.player;

    //       return store.prompt(state, new ChoosePokemonPrompt(
    //         player.id,
    //         GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    //         PlayerType.BOTTOM_PLAYER,
    //         [SlotType.ACTIVE, SlotType.BENCH],
    //         { min: 1, max: 6, allowCancel: false }
    //       ), targets => {
    //         targets.forEach(target => {

    //           return store.prompt(state, new ChooseCardsPrompt(
    //             player.id,
    //             GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    //             target, // Card source is target Pokemon
    //             { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
    //             { allowCancel: false }
    //           ), selected => {
    //             const cards = selected || [];
    //             if (cards.length > 0) {

    //               let totalDiscarded = 0;

    //               const discardEnergy = new DiscardCardsEffect(effect, cards);
    //               discardEnergy.target = target;

    //               totalDiscarded += discardEnergy.cards.length;

    //               store.reduceEffect(state, discardEnergy);

    //               console.log('Total discarded:' + totalDiscarded);

    //               effect.damage += totalDiscarded * 60;
    //               console.log('Total Damage: ' + effect.damage);

    //               return state;
    //             }
    //           });
    //         });
    //         effect.damage -= 60;
    //         return state;
    //       });
    //     }
    //     return state;
    //   }
    // }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // return store.prompt(state, new ChoosePokemonPrompt(
      //   player.id,
      //   GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      //   PlayerType.BOTTOM_PLAYER,
      //   [SlotType.ACTIVE, SlotType.BENCH],
      //   { min: 1, max: 6, allowCancel: true }
      // ), targets => {
      //   targets.forEach(target => {

      let totalWaterEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const waterCount = cardList.cards.filter(card =>
          card instanceof EnergyCard && card.name === 'Water Energy'
        ).length;
        totalWaterEnergy += waterCount;
      });

      console.log('Total Water Energy: ' + totalWaterEnergy);

      return store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],// Card source is target Pokemon
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 1, max: totalWaterEnergy, allowCancel: false }
      ), transfers => {

        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          let totalDiscarded = 0;

          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = player.discard;
          source.moveCardTo(transfer.card, target);

          totalDiscarded = transfers.length;

          effect.damage = totalDiscarded * 60;

        }
        console.log('Total Damage: ' + effect.damage);
        return state;
      });
    }
    return state;
  }
}