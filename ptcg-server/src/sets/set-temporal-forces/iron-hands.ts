import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class IronHands extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Volt Wave',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Superalloy Hands',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 80,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 80 more damage.'
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public name: string = 'Iron Hands';

  public fullName: string = 'Iron Hands TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {

        if (flipResult) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX || CardTag.POKEMON_ex))) {
        effect.damage += 80;
      }
    }
    return state;
  }
}