import { PlayerType, PokemonCard, PowerType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { BetweenTurnsEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Froslass extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snorunt';
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public hp: number = 90;
  public retreat = [C];

  public powers = [{
    name: 'Freezing Shroud',
    powerType: PowerType.ABILITY,
    text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
  }];

  public attacks = [{
    name: 'Frost Smash',
    cost: [W, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';
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

        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
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
          if (card.name !== 'Froslass') {
            const powersEffect = new CheckPokemonPowersEffect(player, card);
            state = store.reduceEffect(state, powersEffect);
            if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
              const placeCountersEffect = new PlaceDamageCountersEffect(
                player,
                cardList,
                10 * numberOfFroslass,
                this
              );
              state = store.reduceEffect(state, placeCountersEffect);
            }
          }
        });

        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card.name !== 'Froslass') {
            const powersEffect = new CheckPokemonPowersEffect(opponent, card);
            state = store.reduceEffect(state, powersEffect);
            if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
              const placeCountersEffect = new PlaceDamageCountersEffect(
                player,
                cardList,
                10 * numberOfFroslass,
                this
              );
              state = store.reduceEffect(state, placeCountersEffect);
            }
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