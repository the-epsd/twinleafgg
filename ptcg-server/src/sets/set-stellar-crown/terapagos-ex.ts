import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Terapagosex extends PokemonCard {

  public regulationMark = 'H';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Unified Beatdown',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      damageCalculation: 'x',
      text: 'If you go second, you can\'t use this attack during your first turn.This attack does 30 damage for each of your Benched Pokémon.'
    },
    {
      name: 'Crown Opal',
      cost: [CardType.GRASS, CardType.WATER, CardType.LIGHTNING],
      damage: 180,
      damageCalculation: '+',
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic non-[C] Pokémon.'
    },
  ];

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public name: string = 'Terapagos ex';

  public fullName: string = 'Terapagos ex SCR';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      if (state.turn <= 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const player = effect.player;

      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = playerBench;

      effect.damage = totalBenched * 30;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
    }

    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard && sourceCard.stage === Stage.BASIC && sourceCard.cardType !== CardType.COLORLESS) {
        effect.preventDefault = true;
        return state;
      }
      return state;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}