import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import {GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';
import {IS_ABILITY_BLOCKED} from '../../game/store/prefabs/prefabs';
import {CheckHpEffect} from '../../game/store/effects/check-effects';

export class Vanilluxe extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vanillish';
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: M }];
  public retreat = [ C, C ];

  public powers = [{
    name: 'Frigid Room',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Pokémon that have 40 HP or less remaining can\'t attack.'
  }];

  public attacks = [{
    name: 'Icicle Missile',
    cost: [W, W],
    damage: 110,
    text: ''
  }];

  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Vanilluxe';
  public fullName: string = 'Vanilluxe PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frigid Room
    if (effect instanceof AttackEffect){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // checking if this is in play on the opponent's side
      let isVanilluxeInPlay = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this){
          isVanilluxeInPlay = true;
        }
      });
      if (!isVanilluxeInPlay){ return state; }
      // checking for ability lock (way cleaner than before :) )
      if (IS_ABILITY_BLOCKED(store, state, opponent, this)){ return state; }
      // checking for any hp boosters/removers
      const checkHpEffect = new CheckHpEffect(effect.player, effect.source);
      store.reduceEffect(state, checkHpEffect);
      // actually doing the attack blocking
      if (checkHpEffect.hp - effect.source.damage <= 40){
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }
    
    return state;
  }
}