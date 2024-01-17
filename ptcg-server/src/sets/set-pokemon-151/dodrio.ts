import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, PokemonCardList } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';


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

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '85';

  public name: string = 'Dodrio';

  public fullName: string = 'Dodrio MEW';

  public readonly MAKE_IT_RAIN_MARKER = 'MAKE_IT_RAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      const cards = player.discard.cards.filter(c => c === this);
      cards.forEach(card => {
        slots[0].damage += 10; // Add 10 damage
      });
      player.deck.moveTo(player.hand, 1);

      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

        // Get Dodrio's damage
        const dodrioDamage = effect.player.active.damage;

        // Calculate 30 damage per counter
        const damagePerCounter = 30;
        effect.damage = dodrioDamage * damagePerCounter;

        return state;
      }

      return state;
    }
    return state;

  }

}
