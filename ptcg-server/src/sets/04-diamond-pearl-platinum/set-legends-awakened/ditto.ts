import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect, CheckPokemonAttacksEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Ditto extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Ditto DNA',
    powerType: PowerType.POKEBODY,
    text: 'As long as Ditto is your Active Pokémon, its maximum HP is the same as your opponent\'s Active Pokémon. Ditto can use the attacks of that Pokémon as its own. (You still need the necessary Energy to use each attack.) If that Pokémon is no longer your opponent\'s Active Pokémon, choose 1 of your opponent\'s Active Pokémon for Ditto to copy.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Ditto';
  public fullName: string = 'Ditto LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ditto DNA
    if (effect instanceof CheckHpEffect && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, owner);
      if (!opponent.active.getPokemonCard()) {
        return state;
      }
      const checkOpponentHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkOpponentHp);
      effect.hp = checkOpponentHp.hp;
    }

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, player);
      const copied = opponent.active.getPokemonCard();
      if (copied) {
        for (const attack of copied.attacks || []) {
          if (!effect.attacks.includes(attack)) {
            effect.attacks.push(attack);
          }
        }
      }
    }

    return state;
  }
}
