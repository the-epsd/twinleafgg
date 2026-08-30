import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, StoreLike, State, StateUtils } from '../../../game';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Machoke';
  public cardType: CardType[] = [F];
  public hp: number = 150;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Fighting Fury',
    powerType: PowerType.ABILITY,
    text: 'Each of your Fighting Pokémon\'s attacks do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Machamp Crush',
    cost: [F, F, F],
    damage: 80,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 40 (before applying Weakness and Resistance).'
  }];

  public set: string = 'FFI';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp FFI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fighting Fury
    if (effect instanceof DealDamageEffect && effect.target === StateUtils.getOpponent(state, effect.player).active) {
      const player = effect.player;

      // Check if Machamp is in play for this player
      let isMachampInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isMachampInPlay = true;
        }
      });

      if (!isMachampInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Check if attacking Pokemon is Fighting type
      const checkType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkType);

      if (checkType.cardTypes.includes(CardType.FIGHTING)) {
        effect.damage += 20;
      }
    }

    // Machamp Crush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 40);
    }

    return state;
  }
}
