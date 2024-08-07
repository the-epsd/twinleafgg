import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, StateUtils } from '../../game';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class SlitherWing extends PokemonCard {

  public regulationMark = 'H';

  public tags = [CardTag.ANCIENT];

  public stage = Stage.BASIC;

  public cardType = CardType.FIGHTING;

  public hp = 140;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Iron Buster',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'If your opponent has a Future Pokémon in play, this attack does 120 more damage.'
    },
    {
      name: 'Smashing Wings',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 130,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '26';

  public name: string = 'Slither Wing';

  public fullName: string = 'Slither Wing SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let opponentFuturePokemon = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card.tags.includes(CardTag.FUTURE)) {
          opponentFuturePokemon++;
        }
      });
      if (opponentFuturePokemon >= 1) {
        effect.damage += 120;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 2);
    }
    return state;
  }

}