import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class StevensSkarmory extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STEVENS];
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Razor Wing',
      cost: [C, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Sonic Double',
      cost: [M, M, C],
      damage: 50,
      text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark: string = 'I';
  public set: string = 'SVOD';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steven\'s Skarmory';
  public fullName: string = 'Steven\'s Skarmory SVOD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const max = Math.min(2);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];

        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }
    return state;
  }
}
