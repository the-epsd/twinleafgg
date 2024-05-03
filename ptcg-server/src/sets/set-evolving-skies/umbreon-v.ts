import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class UmbreonV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V, CardTag.SINGLE_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.DARK;

  public hp: number = 200;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = 
    [
      {
        name: 'Mean Look',
        cost: [ CardType.DARK ],
        damage: 30,
        text: 'During your opponent\'s next turn, the Defending Pokémon ' +
        'can\'t retreat.'
      },
      {
        name: 'Moonlight Blade',
        cost: [ CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
        damage: 80,
        text: 'If this Pokémon has any damage counters on it, this attack ' +
        'does 80 more damage.'
      }
    ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '94';

  public name: string = 'Umbreon V';

  public fullName: string = 'Umbreon V EVS';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.attackMarker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }
        
    if (effect instanceof RetreatEffect && effect.player.active.attackMarker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
        
    if (effect instanceof EndTurnEffect) {
      effect.player.active.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }
  
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const source = player.active;
    
      // Check if source Pokemon has damage
      const damage = source.damage;
      if (damage > 0) {
        effect.damage += 80; 
      }
    
      return state;
    
    }
    return state;
  }
}