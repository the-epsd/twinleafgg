import { PokemonCard, Stage, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StoreLike, State, CardTag } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Drizzile extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sobble';

  public tags = [ CardTag.RAPID_STRIKE ];

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Bounce',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    }
  ];
  
  public regulationMark = 'E';

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '42';
  
  public name: string = 'Drizzile';
  
  public fullName: string = 'Drizzile CRE';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasBenched: boolean = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false },
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