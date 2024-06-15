import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Spearow extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ ];

  public attacks = 
    [
      {
        name: 'Peck',
        cost: [ CardType.COLORLESS ],
        damage: 10,
        text: ''
      },
      {
        name: 'Mirror Move',
        cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
        damage: 0,
        text: 'If Spearow was attacked last turn, do the final result of that attack on Spearow to the Defending Pokémon.'
      }
    ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public name: string = 'Spearow';

  public fullName: string = 'Spearow JU';

  private mirrorMoveEffects: AbstractAttackEffect[] = [];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;      
      const opponent = StateUtils.getOpponent(state, effect.player);      
      
      this.mirrorMoveEffects.forEach(effect => {
        effect.target = opponent.active;
        effect.opponent;
        effect.player = player;
        effect.source = player.active;
        // eslint-disable-next-line no-self-assign
        effect.attackEffect = effect.attackEffect;
        
        store.reduceEffect(state, effect.attackEffect);
      });
    }
    
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
  
      if (pokemonCard !== this) {
        return state;
      }
  
      this.mirrorMoveEffects.push(effect);
      
      return state;
    }
    
    if (effect instanceof EndTurnEffect) {
      if (effect.player.active.cards.includes(this) || effect.player.bench.some(b => b.cards.includes(this))) {
        this.mirrorMoveEffects = [];
      }
      
      return state;
    }
    
    return state;
  }

}
