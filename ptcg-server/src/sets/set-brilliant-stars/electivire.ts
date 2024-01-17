import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';


export class Electivire extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Electabuzz';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Outrage',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'Does 10 more damage for each damage counter on this Pokemon.'
    },
    {
      name: 'Glaciate',
      cost: [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS ],
      damage: 0,
      text: 'This attack does 50 damage to each of your opponent\'s Pokémon ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.'
    }
  ];

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Electivire';

  public fullName: string = 'Electivire BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      let isMagmortarInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Magmortar') {
          isMagmortarInPlay = true;
        }
      });

      if (isMagmortarInPlay) {

        const source = player.bench.filter(b => b.cards[0].name === 'Magmortar')[0];


        // Check if source Pokemon has damage
        const damage = source.damage;
        if (damage > 0) {
          effect.damage += 90;
        }

        return state;

      }

      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        const opponent = effect.opponent;
        const benched = opponent.bench.filter(b => b.cards.length > 0);

        const activeDamageEffect = new DealDamageEffect(effect, 50);
        store.reduceEffect(state, activeDamageEffect);

        benched.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      }

      return state;
    }

    return state;
  }
}
