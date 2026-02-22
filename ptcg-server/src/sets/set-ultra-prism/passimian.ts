import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PowerType, StateUtils, SlotType } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Passimian extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Power Huddle',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, your Passimian\'s attacks do 30 more damage to your opponent\'s Active Evolution Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Rock Hurl',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 40,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'UPR';

  public setNumber = '70';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Passimian';

  public fullName: string = 'Passimian UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && StateUtils.isPokemonInPlay(effect.player, this, SlotType.BENCH)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const oppActive = opponent.active.getPokemonCard();
      const damageSource = effect.source.getPokemonCard();

      if (damageSource
        && damageSource.name === 'Passimian'
        && effect.target === opponent.active
        && oppActive
        && oppActive.stage !== Stage.BASIC) {
        effect.damage += 30;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }
    return state;
  }
}
