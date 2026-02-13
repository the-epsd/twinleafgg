import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlayerType, StateUtils } from '../../game';

export class Golisopod extends PokemonCard {

  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Wimpod';
  public cardType = G;
  public hp = 130;
  public weakness = [{ type: F}];
  public retreat = [C, C];
  public attacks = [
    {
      name: 'Hard Time Slash',
      cost: [C, C],
      damage: 30,
      damageCalculation: '+',
      text: 'This attack does 50 more damage for each of your opponent\'s Pokémon V and Pokémon-GX in play.'
    },
    {
      name: 'Smash Turn',
      cost: [G, C, C],
      damage: 70,
      text: 'Switch this Pokemon with 1 of your Benched Pokemon'
    }
  ];

  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Golisopod';
  public fullName: string = 'Golisopod DAA';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let opponentGXOrV = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_cardList, card, _target) => {
        if (card.tags.includes(CardTag.POKEMON_GX)) {
          opponentGXOrV++;
        }
        if (card.tags.includes(CardTag.POKEMON_V)) {
          opponentGXOrV++;
        }
        if (card.tags.includes(CardTag.POKEMON_VMAX)) {
          opponentGXOrV++;
        }
        if (card.tags.includes(CardTag.POKEMON_VSTAR)) {
          opponentGXOrV++;
        }
      });
      effect.damage += 50 * opponentGXOrV;
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
         SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
         }
      
          return state;
        }    
  }
