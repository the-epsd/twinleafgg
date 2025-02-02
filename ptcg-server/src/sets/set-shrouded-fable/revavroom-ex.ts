import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Revavroomex extends PokemonCard {

  public regulationMark = 'H';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Varoom';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 280;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Accelerator Flash',
      cost: [CardType.METAL],
      damage: 20,
      damageCalculation: '+',
      text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 120 more damage.'
    },
    {
      name: 'Shattering Speed',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL],
      damage: 250,
      text: 'Discard this Pokémon and all attached cards.'
    },
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Revavroom ex';

  public fullName: string = 'Revavroom ex SFA';

  public discardRevavroom: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (!this.movedToActiveThisTurn) {
        effect.damage = 20;
        return state;
      }

      effect.damage += 120;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const knockOutEffect = new KnockOutEffect(player, player.active);
      state = store.reduceEffect(state, knockOutEffect);
      return state;
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}