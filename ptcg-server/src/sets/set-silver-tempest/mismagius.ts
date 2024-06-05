import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

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
    damage: 140,
    text: 'Put 2 damage counters on each of your opponent\'s Pokémon.'
  }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Mismagius';

  public fullName: string = 'Mismagius SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (this.hp == this.hp) {
        opponent.active.damage += 80;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage = 10;
  
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList === opponent.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}