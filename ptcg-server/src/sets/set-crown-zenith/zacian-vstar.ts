import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';

export class ZacianVSTAR extends PokemonCard {

  public tags = [CardTag.POKEMON_VSTAR];

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Zacian V';

  public cardType: CardType = CardType.METAL;

  public hp: number = 270;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Break Edge',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      // cost: [],
      damage: 200,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
    },
    {
      name: 'Sword Star',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 310,
      text: 'This Pokémon also does 30 damage to itself. (You can\'t use more than 1 VSTAR Power in a game.)'
    },
  ];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Zacian VSTAR';

  public fullName: string = 'Zacian VSTAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damage = 200;  // Fixed damage without weakness/resistance
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const damage = 30;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      const dealDamage = new DealDamageEffect(effect, damage);
      dealDamage.target = player.active;
      player.usedVSTAR = true;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}  