import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class ArceusFighting extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];
  public tags = [CardTag.ARCEUS];

  public powers = [{
    name: 'Arceus Rule',
    powerType: PowerType.ARCEUS_RULE,
    text: 'You may have as many of this card in your deck as you like.'
  }];

  public attacks = [
    {
      name: 'Break Ground',
      cost: [F, C, C],
      damage: 60,
      text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'AR8';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Fighting AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Break Ground
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card !== player.active){
          const damage = new DealDamageEffect(effect, 10);
          damage.target = card;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}