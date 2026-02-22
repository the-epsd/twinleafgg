import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AfterDamageEffect, ApplyWeaknessEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronCrownex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 220;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cobalt Command',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'Your Future Pokémon\'s attacks, except any Iron Crown ex, do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Twin Shotels',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on those Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '81';

  public name: string = 'Iron Crown ex';

  public fullName: string = 'Iron Crown ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const max = Math.min(2);
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];

        if (targets == null) {
          return state;
        }

        targets.forEach(target => {
          effect.ignoreWeakness = true;
          effect.ignoreResistance = true;
          const applyWeakness = new ApplyWeaknessEffect(effect, 50);
          store.reduceEffect(state, applyWeakness);
          const damage = applyWeakness.damage;

          effect.damage = 0;

          if (damage > 0) {
            target.damage += damage;
            const afterDamage = new AfterDamageEffect(effect, damage);
            state = store.reduceEffect(state, afterDamage);
          }
        });
      });
    }

    if (effect instanceof DealDamageEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);
      const source = effect.source.getPokemonCard() as PokemonCard;

      if (state.phase === GamePhase.ATTACK &&
        source.tags.includes(CardTag.FUTURE) && source.name !== 'Iron Crown ex' &&
        effect.target === opponent.active && effect.damage > 0 && !IS_ABILITY_BLOCKED(store, state, player, this)
      ) {
        effect.damage += 20;
      }
    }
    return state;
  }
}
