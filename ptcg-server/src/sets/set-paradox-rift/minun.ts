import { GameLog, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Minun extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: 20 }];
  public retreat = [CardType.COLORLESS];
  
  public powers = [{
    name: 'Buddy Pulse',
    powerType: PowerType.ABILITY,
    text: 'If you have Plusle in play, whenever your opponent attaches an Energy card from their hand to 1 of their Pokémon, put 2 damage counters on that Pokémon. The effect of Buddy Pulse doesn\'t stack.'
  }];
  
  public attacks = [{
    name: 'Speed Ball',
    cost: [CardType.LIGHTNING],
    damage: 20,
    text: '',
  }]

  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Minun';
  public regulationMark: string = 'G';
  public fullName: string = 'Minun PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      let hasMinunInPlay = false;
      
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasMinunInPlay = true;
        }
      });

      if (!hasMinunInPlay) {
        return state;
      }

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
    
      let plusleIsOnBench = player.bench.some(c => c.cards.some(card => card.name === 'Plusle'));
      if (!plusleIsOnBench) {
        return state;
      }      
      
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, { name: opponent.name, damage: 20, target: effect.target.getPokemonCard()!.name, effect: this.name });

      effect.target.damage += 20;
      
      return state;
    }

    return state;
  }
}
