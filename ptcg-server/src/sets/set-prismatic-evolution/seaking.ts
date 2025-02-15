import { CardType, Stage } from '../../game/store/card/card-types';
import { Attack, PokemonCard, Power, PowerType, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Seaking extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Goldeen';

  public cardType: CardType = W;

  public hp: number = 110;

  public weakness = [{ type: L }];

  public retreat = [C];

  public powers: Power[] = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Rapid Draw',
      cost: [C],
      damage: 60,
      text: 'Draw 2 cards.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'PRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

  public name: string = 'Seaking';

  public fullName: string = 'Seaking PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && this.attacks.includes(effect.attack)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard && stadiumCard.name === 'Festival Grounds' && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        this.maxAttacksThisTurn = 2;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      DRAW_CARDS(effect.player, 2);
    }
    return state;
  }
}
