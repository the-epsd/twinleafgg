import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

export class RotasWeavile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Night Attack',
    cost: [D],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon in play and put 1 damage counter on it.'
  },
  {
    name: 'Slash',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'PCGP';
  public name: string = 'Rota\'s Weavile';
  public fullName: string = 'Rota\'s Weavile PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutCountersEffect(effect, 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }

    return state;
  }

}
