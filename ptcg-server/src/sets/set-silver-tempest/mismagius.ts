import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Mismagius extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'F';

  public evolvesFrom = 'Misdreavus';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Spiteful Magic',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP and is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 8 damage counters on the Attacking Pokémon.'
  }
  ];

  public attacks = [{
    name: 'Eerie Voice',
    cost: [ CardType.PSYCHIC ],
    damage: 0,
    text: 'Put 2 damage counters on each of your opponent\'s Pokémon.'
  }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Mismagius';

  public fullName: string = 'Mismagius SIT';
  
  public damageDealt = false;
  
  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }
    
    if (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) {
      const player = StateUtils.getOpponent(state, effect.player);
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (player !== owner) {
        this.damageDealt = true;
      }
    }
    
     if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner === effect.player) {
        this.damageDealt = false;
      }
    }
    
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && this.damageDealt) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (this.hp == this.hp) {
        opponent.active.damage += 80;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const damageEffect = new PutCountersEffect(effect, 20);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}