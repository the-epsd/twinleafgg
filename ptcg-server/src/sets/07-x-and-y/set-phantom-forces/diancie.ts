import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Diancie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [Y];
  public hp: number = 90;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sparkle',
    cost: [Y],
    damage: 0,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  },
  {
    name: 'Diamond Storm',
    cost: [Y, Y, C],
    damage: 60,
    text: 'Heal 30 damage from each of your Fairy Pokémon.'
  }];

  public set: string = 'PHF';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Diancie';
  public fullName: string = 'Diancie PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sparkle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    // Diamond Storm
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const checkType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkType);

        if (checkType.cardTypes.includes(CardType.FAIRY) && cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
