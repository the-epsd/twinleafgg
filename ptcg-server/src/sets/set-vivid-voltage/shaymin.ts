import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class ShayminVIV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS],
      damage: 20,
      text: 'Heal 20 damage from this Pokémon.'
    },

    {
      name: 'Flower Bearing',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 0,
      text: 'Flip a coin. If heads, your opponent shuffles their Active Pokémon and all attached cards and puts them on the bottom of their deck.'
    }
  ];

  public set: string = 'VIV';

  public setNumber = '15';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'D';

  public name: string = 'Shaymin';

  public fullName: string = 'Shaymin VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leech Seed
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const healingTime = new HealTargetEffect(effect, 20);
      healingTime.target = player.active;
      store.reduceEffect(state, healingTime);
    }

    // Flower Bearing
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.active.moveTo(opponent.deck);
          opponent.active.clearEffects();
        }
      });
    }

    return state;
  }
} 
