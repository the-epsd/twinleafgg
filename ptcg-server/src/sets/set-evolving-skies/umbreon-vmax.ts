import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, PowerType, ChoosePokemonPrompt, ConfirmPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class UmbreonVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX, CardTag.SINGLE_STRIKE ];

  public stage: Stage = Stage.VMAX;

  public regulationMark = 'E';
  
  public evolvesFrom = 'Umbreon V';

  public cardType: CardType = CardType.DARK;

  public hp: number = 310;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Dark Signal',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of ' +
      'your Pokémon during your turn, you may switch 1 of your ' +
      'opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [{
    name: 'Max Darkness',
    cost: [ CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 160,
    text: ''
  }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Umbreon VMAX';

  public fullName: string = 'Umbreon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);
          const hasBench = opponent.bench.some(b => b.cards.length > 0);

          if (!hasBench) {
            throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
          }
            
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [ SlotType.BENCH ],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];
            opponent.switchPokemon(cardList);
            return state;
          });
        } else {
          return state;
        }
      });
    }
    return state;
  }
}