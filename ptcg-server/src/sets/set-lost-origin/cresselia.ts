import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, PokemonCardList, ChoosePokemonPrompt, GameMessage, SlotType } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Cresselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Moonglow Reverse',
      cost: [P],
      damage: 0,
      text: 'Move 2 damage counters from each of your Pokémon to 1 of your opponent\'s Pokémon.'
    },
    {
      name: 'Lunar Blast',
      cost: [P, P, C],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'LOR';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Cresselia';
  public fullName: string = 'Cresselia LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const targets: PokemonCardList[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.damage > 0) {
          targets.push(cardList);
        }
      });

      let totalHealed = 0;

      targets.forEach(target => {
        let damageToMove = Math.min(target.damage, 20);
        target.damage -= damageToMove;
        totalHealed += damageToMove;
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const selectedTargets = selected || [];
        selectedTargets.forEach(target => {
          const putCountersEffect = new PutCountersEffect(effect, totalHealed);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        });
        return state;
      });
    }
    return state;
  }
}