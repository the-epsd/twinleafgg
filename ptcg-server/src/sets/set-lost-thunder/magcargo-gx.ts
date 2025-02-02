import { PokemonCard } from '../../game/store/card/pokemon-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Stage, CardType, SuperType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, Card, GameError, CardList, PlayerType, SlotType, EnergyCard } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';

// LOT Magcargo-GX 44 (https://limitlesstcg.com/cards/LOT/44)
export class MagcargoGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Slugma';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 210;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Crushing Charge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard the top card of your deck. If it\'s a basic Energy card, attach it to 1 of your Pokémon. '
  }];
  public attacks = [
    {
      name: 'Lava Flow',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 50,
      text: 'Discard any amount of basic Energy from this Pokémon. This attack does 50 more damage for each card you discarded in this way.'
    },

    {
      name: 'Burning Magma-GX',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'Discard the top 5 cards of your opponent\'s deck. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'LOT';

  public setNumber = '44';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Magcargo-GX';

  public fullName: string = 'Magcargo-GX LOT';

  public readonly CRUSHING_CHARGE_MARKER = 'CRUSHING_CHARGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.CRUSHING_CHARGE_MARKER, this);
    }

    // Crushing Charge
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.CRUSHING_CHARGE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const topOfTheDeck = new CardList();
      player.deck.moveTo(topOfTheDeck, 1);

      // Check if any cards discarded are basic energy
      const discardedEnergy = topOfTheDeck.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC;
      });

      if (discardedEnergy.length == 0) {
        player.marker.addMarker(this.CRUSHING_CHARGE_MARKER, this);
        topOfTheDeck.moveTo(player.discard);
      }

      if (discardedEnergy.length > 0) {
        store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          topOfTheDeck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { allowCancel: false, min: 0, max: 1 }
        ), transfers => {
          transfers = transfers || [];
          player.marker.addMarker(this.CRUSHING_CHARGE_MARKER, this);
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            topOfTheDeck.moveCardTo(transfer.card, target);
          }
        });
      }

      return state;
    }


    // Lava Flow
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 0, allowCancel: false }
      ), selected => {
        cards = selected || [];
        effect.damage += cards.length * 50;
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    // Burning Magma-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      opponent.deck.moveTo(opponent.discard, 5);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.CRUSHING_CHARGE_MARKER, this);
    }

    return state;
  }

}