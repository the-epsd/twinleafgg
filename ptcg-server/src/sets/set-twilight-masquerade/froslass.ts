import { PlayerType, PokemonCard, PowerType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Froslass extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Snorunt';

  public regulationMark = 'H';

  public cardType: CardType = CardType.WATER;

  public weakness = [{ type: CardType.METAL }];

  public hp: number = 90;

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Freezing Shroud',
    powerType: PowerType.ABILITY,
    text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
  }];

  public attacks = [
    {
      name: 'Frost Smash',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '53';

  public name: string = 'Froslass';

  public fullName: string = 'Froslass TWM';

  public CHILLING_CURTAIN_MARKER = 'CHILLING_CURTAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect && effect.player.marker.hasMarker(this.CHILLING_CURTAIN_MARKER, this)) {
      if (state.phase === GamePhase.BETWEEN_TURNS) {

        const player = effect.player;

        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        const opponent = StateUtils.getOpponent(state, player);

        let numberOfFroslass = 0;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          const pokemon = cardList.getPokemonCard();
          if (!!pokemon && pokemon.name === 'Froslass' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
            numberOfFroslass += 1;
          }
        });

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card.powers.length > 0 && card.name !== 'Froslass') {
            cardList.damage += (10 * numberOfFroslass);
          }
        });

        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card.name !== 'Froslass' && card.powers.length > 0) {
            cardList.damage += (10 * numberOfFroslass);
          }
        });

        player.marker.removeMarker(this.CHILLING_CURTAIN_MARKER, this);

        return state;
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {

      let numberOfFroslass = 0;
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const pokemon = cardList.getPokemonCard();
        if (!!pokemon && pokemon.name === 'Froslass' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
          numberOfFroslass += 1;
        }
      });

      if (numberOfFroslass > 0 && !player.marker.hasMarker(this.CHILLING_CURTAIN_MARKER)) {
        player.marker.addMarker(this.CHILLING_CURTAIN_MARKER, this);
      }

      numberOfFroslass = 0;

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const pokemon = cardList.getPokemonCard();
        if (!!pokemon && pokemon.name === 'Froslass' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
          numberOfFroslass += 1;
        }
      });

      if (numberOfFroslass > 0 && !opponent.marker.hasMarker(this.CHILLING_CURTAIN_MARKER)) {
        opponent.marker.addMarker(this.CHILLING_CURTAIN_MARKER, this);
      }
    }

    return state;
  }
}