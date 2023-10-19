import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';


export class Dodrio extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Doduo';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 100;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Zooming Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 1 damage counter on this Pokémon. If you do, draw a card.'
  }];

  public attacks = [
    {
      name: 'Balliastic Beak',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: 'This attack does 30 more damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = '151';

  public set2: string = '151';

  public setNumber: string = '85';

  public name: string = 'Dodrio';

  public fullName: string = 'Dodrio MEW';

  public readonly MAKE_IT_RAIN_MARKER = 'MAKE_IT_RAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      effect.damage = 10;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card !== this) {
          return state;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);

        // Draw 1 card
        player.deck.moveTo(player.hand, 1);
    
        return state;
      });
  
      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

        // Get damage counters
        const damageCounters = effect.player.active.damage;
  
        // Calculate bonus damage
        const bonusDamage = 30 * damageCounters;

        // Add bonus to base damage  
        effect.damage += bonusDamage;

      }
      return state;
    }
    return state;
  }
}
