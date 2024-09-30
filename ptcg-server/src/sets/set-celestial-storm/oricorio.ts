import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { GustOpponentBenchEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Oricorio extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Captivating Salsa',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'Switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon. The new Active Poekmon is now Burned and Confused.'
    },
    {
      name: 'Heat Blast',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'SHF';
  public name: string = 'Oricorio';
  public fullName: string = 'Oricorio SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {

        const cardList = result[0];

        const gustOpponentBenchEffect = new GustOpponentBenchEffect(effect, cardList);
        store.reduceEffect(state, gustOpponentBenchEffect);

        opponent.switchPokemon(cardList);

        const active = opponent.active;
        active.addSpecialCondition(SpecialCondition.BURNED);
        active.addSpecialCondition(SpecialCondition.CONFUSED);
      });
    }

    return state;
  }

}