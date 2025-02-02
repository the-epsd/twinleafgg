import { BoardEffect, CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ConfirmPrompt, EnergyCard, GameError, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCard, PowerType, SlotType, StateUtils } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Blisseyex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Chansey';

  public tags = [CardTag.POKEMON_ex];

  public regulationMark = 'H';

  public cardType: CardType = CardType.COLORLESS;

  public weakness = [{ type: CardType.FIGHTING }];

  public hp: number = 310;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Happy Switch',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may move a Basic Energy from 1 of your Pokémon to another of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Return',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 180,
      text: 'You may draw until you have 6 cards in hand.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '134';

  public name: string = 'Blissey ex';

  public fullName: string = 'Blissey ex TWM';

  public readonly BLISSFUL_SWAP_MARKER = 'BLISSFUL_SWAP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BLISSFUL_SWAP_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.BLISSFUL_SWAP_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      let hasBasicEnergy = false;
      let pokemonCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        pokemonCount += 1;
        const basicEnergyAttached = cardList.cards.some(c => {
          return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
        });
        hasBasicEnergy = hasBasicEnergy || basicEnergyAttached;
      });

      if (!hasBasicEnergy || pokemonCount <= 1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 1, max: 1, allowCancel: false }
      ), transfers => {
        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          player.marker.addMarker(this.BLISSFUL_SWAP_MARKER, this);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
        }

        return state;
      });
    }

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.BLISSFUL_SWAP_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_DRAW_UNTIL_6,
      ), wantToUse => {
        if (wantToUse) {

          while (player.hand.cards.length < 6) {
            if (player.deck.cards.length === 0) {
              break;
            }
            player.deck.moveTo(player.hand, 1);
          }
        }

      });

    }
    return state;
  }

}