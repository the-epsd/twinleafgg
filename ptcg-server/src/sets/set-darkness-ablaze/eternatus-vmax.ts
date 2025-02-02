import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { GameError, GameMessage, PlayerType, PowerType } from '../../game';
import { CheckPokemonTypeEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class EternatusVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Eternatus V';
  public tags = [CardTag.POKEMON_VMAX];
  public cardType: CardType = D;
  public hp: number = 340;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [
    {
      name: 'Eternal Zone',
      powerType: PowerType.ABILITY,
      text: 'If all of your Pokémon in play are [D] type, you can have up to 8 Pokémon on your Bench, and you can\'t put non-[D] Pokémon into play. (If this Ability stops working, discard Pokémon from your Bench until you have 5.)'
    }];

  public attacks = [{
    name: 'Dread End',
    cost: [D, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each of your [D] Pokémon in play.'
  }];

  public set: string = 'DAA';
  public name: string = 'Eternatus VMAX';
  public fullName: string = 'Eternatus VMAX DAA';
  public setNumber: string = '117';
  public regulationMark: string = 'D';
  public cardImage: string = 'assets/cardback.png';

  public readonly ETERNATUS_EXPANDED_BENCH = 'ETERNATUS_EXPANDED_BENCH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eternal Zone
    if (effect instanceof CheckTableStateEffect) {
      effect.benchSizes = state.players.map((player, index) => {
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          if (!player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
            player.marker.removeMarker(this.ETERNATUS_EXPANDED_BENCH, this);
          }
          return 5;
        }

        // checking if eternatus is in play for the player in question
        let isEternInPlay = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          const pokemon = cardList.getPokemonCard();
          if (!!pokemon && pokemon.name === 'Eternatus VMAX' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
            isEternInPlay = true;
          }
        });

        // if eternatus isn't in play, just skip everything effectively
        if (!isEternInPlay) {
          if (!player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
            player.marker.removeMarker(this.ETERNATUS_EXPANDED_BENCH, this);
          }
          return 5;
        }

        // checking each pokemon for dark typing (must use CheckPokemonTypeEffect for pokemon with an added typing)
        let darkPokemon = 0;
        let pokemonInPlay = 1;

        const activeType = new CheckPokemonTypeEffect(player.active);
        store.reduceEffect(state, activeType);
        if (activeType.cardTypes.includes(CardType.DARK)) {
          darkPokemon++;
        }

        player.bench.forEach(benchSpot => {
          if (benchSpot.cards.length > 0) {
            pokemonInPlay++;
            const benchedType = new CheckPokemonTypeEffect(benchSpot);
            store.reduceEffect(state, benchedType);
            if (benchedType.cardTypes.includes(CardType.DARK)) {
              darkPokemon++;
            }
          }
        });

        // if all pokemon in play are dark types
        if (darkPokemon === pokemonInPlay) {
          // slaps on a marker to check played pokemon for dark typing later
          if (!player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
            player.marker.addMarker(this.ETERNATUS_EXPANDED_BENCH, this);
          }
          return 8;
        } else {
          // removes the previous marker if this effect is removed
          if (player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
            player.marker.removeMarker(this.ETERNATUS_EXPANDED_BENCH, this);
          }
          return 5;
        }
      });
    }

    if (effect instanceof PlayPokemonEffect && effect.player.marker.hasMarker(this.ETERNATUS_EXPANDED_BENCH, this)) {
      // trying to block non-dark types from being benched (this might still allow trainer to put in non-dark types)
      if (effect.pokemonCard.cardType !== D) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Dread End
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let darksInPlay = 0;

      const activeType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, activeType);
      if (activeType.cardTypes.includes(CardType.DARK)) {
        darksInPlay++;
      }

      player.bench.forEach(benchSpot => {
        if (benchSpot.cards.length > 0) {
          const benchedType = new CheckPokemonTypeEffect(benchSpot);
          store.reduceEffect(state, benchedType);
          if (benchedType.cardTypes.includes(CardType.DARK)) {
            darksInPlay++;
          }
        }
      });
      effect.damage = 30 * darksInPlay;
    }

    return state;
  }
}