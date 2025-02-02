import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, GameError, GameMessage,
  ChooseCardsPrompt,
  PlayerType,
  AttachEnergyPrompt,
  EnergyCard,
  SlotType,
  StateUtils
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Cinccino extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Minccino';

  public regulationMark = 'D';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Make Do',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a card from your hand in order to use this Ability. Once during your turn, you may draw 2 cards.'
  }];

  public attacks = [
    {
      name: 'Energy Assist',
      cost: [CardType.COLORLESS],
      damage: 40,
      text: 'Attach a basic Energy card from your discard pile to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';

  public name: string = 'Cinccino';

  public fullName: string = 'Cinccino SSH';

  public readonly REFINEMENT_MARKER = 'REFINEMENT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.REFINEMENT_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.REFINEMENT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.marker.addMarker(this.REFINEMENT_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 2);
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.REFINEMENT_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      const hasBasicEnergy = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
      });

      if (hasBench === false || hasBasicEnergy === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    return state;
  }

}
