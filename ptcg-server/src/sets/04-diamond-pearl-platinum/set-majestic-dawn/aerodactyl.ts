import { PlayerType, PokemonCard, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect, PowerEffect } from '../../../game/store/effects/game-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Aerodactyl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Old Amber';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Primal Claw',
    powerType: PowerType.POKEBODY,
    text: 'After your opponent\'s Pokémon uses a Poké-Power, put 2 damage counters on that Pokémon.'
  }];

  public attacks = [{
    name: 'Supersonic',
    cost: [C, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Aerodactyl';
  public fullName: string = 'Aerodactyl MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Primal Claw
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      if (!effect.card.powers.includes(effect.power)) {
        return state;
      }

      const powerUser = effect.player;
      const owner = StateUtils.getOpponent(state, powerUser);

      if (!StateUtils.isPokemonInPlay(owner, this) || IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const target = StateUtils.findCardList(state, effect.card);

      powerUser.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === target) {
          const placeCountersEffect = new PlaceDamageCountersEffect(powerUser, cardList, 20, this);
          state = store.reduceEffect(state, placeCountersEffect);
        }
      });
    }

    // Supersonic
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }

    return state;
  }
}
