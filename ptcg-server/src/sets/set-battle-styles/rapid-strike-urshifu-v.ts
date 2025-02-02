import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';

export class RapidStrikeUrshifuV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V, CardTag.RAPID_STRIKE ];

  public regulationMark = 'E';
  
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 220;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Strafe',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'You may switch this Pokémon with 1 of your Benched ' +
      'Pokémon. '
    }, {
      name: 'Hundred Furious Blows',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 150,
      text: ''
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '87';

  public name: string = 'Rapid Strike Urshifu V';

  public fullName: string = 'Rapid Strike Urshifu V BST';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
  
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
            PlayerType.BOTTOM_PLAYER,
            [ SlotType.BENCH ],
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
      });
    }
    return state;
  }
}