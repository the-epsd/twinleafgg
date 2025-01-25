import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayerType, PowerType, StateUtils } from '../../game';
import {BetweenTurnsEffect, EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class Garganacl extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Naclstack';
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

    public powers = [{
      name: 'Blessed Salt',
      powerType: PowerType.ABILITY,
      text: 'During Pokémon Checkup, heal 20 damage from each of your Pokémon.'
    }];

  public attacks = [{
    name: 'Knocking Hammer',
    cost: [F, F],
    damage: 130,
    text: 'Discard the top card of your opponent\'s deck.'
  }];

  public BLESSED_SALT_MARKER = 'BLESSED_SALT_MARKER';

  public set: string = 'PAL';
  public name: string = 'Garganacl';
  public fullName: string = 'Garganacl PAL';
  public setNumber: string = '123';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blessed Salt
    if (effect instanceof BetweenTurnsEffect && effect.player.marker.hasMarker(this.BLESSED_SALT_MARKER, this)) {
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

        let numOfGargs = 0;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          const pokemon = cardList.getPokemonCard();
          if (!!pokemon && pokemon.name === 'Garganacl' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
            numOfGargs += 1;
          }
        });

        console.log('Number of Garganacls: ' + numOfGargs + ' --------------------------');
        let testVar = 0;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          testVar++;
          const healEffect = new HealEffect(player, cardList, (20 * numOfGargs));
          store.reduceEffect(state, healEffect);
        });

        console.log(testVar);

        player.marker.removeMarker(this.BLESSED_SALT_MARKER, this);

        return state;
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {

      let numOfGargs = 0;
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const pokemon = cardList.getPokemonCard();
        if (!!pokemon && pokemon.name === 'Garganacl' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
          numOfGargs += 1;
        }
      });

      if (numOfGargs > 0 && !player.marker.hasMarker(this.BLESSED_SALT_MARKER)) {
        player.marker.addMarker(this.BLESSED_SALT_MARKER, this);
      }

      numOfGargs = 0;

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const pokemon = cardList.getPokemonCard();
        if (!!pokemon && pokemon.name === 'Garganacl' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
          numOfGargs += 1;
        }
      });

      if (numOfGargs > 0 && !opponent.marker.hasMarker(this.BLESSED_SALT_MARKER)) {
        opponent.marker.addMarker(this.BLESSED_SALT_MARKER, this);
      }
    }

    // Knocking Hammer
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.deck.moveTo(opponent.discard, 1);
    }
    
    return state;
  }
}