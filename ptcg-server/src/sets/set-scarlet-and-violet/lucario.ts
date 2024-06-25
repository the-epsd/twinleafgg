import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Lucario extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  
  public cardType: CardType = CardType.FIGHTING;
  
  public hp: number = 130;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Avenging Knuckle',
      cost: [CardType.FIRE, CardType.WATER],
      damage: 30,
      text: 'If any of your [F] Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 120 more damage.'
    },
    {
      name: 'Accelerating Stab',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t use Accelerating Stab.'
    }
  ];

  public set: string = 'SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';
  
  public evolvesFrom = 'Riolu';
  
  public name: string = 'Lucario';

  public fullName: string = 'Lucario SVI';

  public readonly REVENGE_MARKER = 'REVENGE_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.REVENGE_MARKER) && this.damageDealt) {
        effect.damage += 120;
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      if (player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
        effect.target.tool === this) {
      const player = StateUtils.getOpponent(state, effect.player);

      if (player.active.tool === this) {
        this.damageDealt = true;
      }
    }

    if (effect instanceof EndTurnEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      
      if (owner === effect.player) {
        this.damageDealt = false;
      }

      effect.player.marker.removeMarker(this.REVENGE_MARKER);
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER);
    }

    return state;
  }

}
