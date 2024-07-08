import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Hitmonchan extends PokemonCard {

  public name = 'Hitmonchan';
  
  public set = 'TEU';
  
  public fullName = 'Hitmonchan TEU';

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public hp = 90;
  
  public cardType = CardType.FIGHTING;

  public weakness = [{ type: CardType.PSYCHIC }]

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hit and Run',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Magnum Punch',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);
    
      if (!hasBenched) {
        return state;
      }
    
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: true },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        player.switchPokemon(target);
      });
    }
    return state;
  }
}
