import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, PowerType, ChoosePokemonPrompt, ConfirmPrompt, SlotType
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class HopsDubwool extends PokemonCard {

  public tags = [CardTag.HOPS, CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hop\'s Wooloo';

  public cardType: CardType = C;

  public hp: number = 120;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public powers = [{
    name: 'Challenge Horn',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
  }];

  public attacks = [{
    name: 'Headbutt',
    cost: [C, C, C],
    damage: 80,
    text: ''
  }
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name: string = 'Hop\'s Dubwool';

  public fullName: string = 'Hop\'s Dubwool SV9';

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
            [SlotType.BENCH],
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