import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, 
  GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

// import mappings from '../../sets/card-mappings.json';

export class RegielekiVMAX extends PokemonCard {

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_VMAX ];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Regieleki V';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 310;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Transistor',
    powerType: PowerType.ABILITY,
    text: 'Your Basic [L] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Max Thunder and Lightning',
      cost: [ CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 220,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];


  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '58';

  public name: string = 'Regieleki VMAX';

  public fullName: string = 'Regieleki VMAX SIT';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // const changes: any = mappings[this.setNumber];
    // if(changes) {
    //   this.set2 = changes.set2;
    //   this.name = changes.name;
    //   this.fullName = changes.fullName;
    // }
  
    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      
      if (player.active.getPokemonCard()?.stage == Stage.BASIC && player.active.getPokemonCard()?.cardType == CardType.LIGHTNING) {
        if (effect instanceof DealDamageEffect) {
          effect.damage += 30;
        }
        return state;
      }
      return state;
    }
    return state;
  }
}