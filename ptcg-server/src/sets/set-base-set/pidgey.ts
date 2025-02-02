import { GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Pidgey extends PokemonCard {

  public name = 'Pidgey';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '57';

  public cardType = CardType.COLORLESS;

  public fullName = 'Pidgey BS';

  public stage = Stage.BASIC;

  public evolvesInto = 'Pidgeotto';

  public hp = 40;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 10,
      text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.bench.some(b => b.cards.length > 0)) {
        return store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), (results) => {
          if (results && results.length > 0) {
            const target = results[0];
            opponent.active.clearEffects();
            opponent.switchPokemon(target);
          }
        });
      }
    }

    return state;
  }

}
