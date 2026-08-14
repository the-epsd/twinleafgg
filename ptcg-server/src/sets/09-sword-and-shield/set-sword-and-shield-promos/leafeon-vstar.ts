import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import {
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  PlayerType,
  PowerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class LeafeonVSTAR extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Leafeon V';
  public cardType: CardType = G;
  public hp: number = 260;
  protected _tags = [CardTag.POKEMON_VSTAR];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Ivy Star',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: "During your turn, you may switch 1 of your opponent's Benched Pokémon with their Active Pokémon. (You can't use more than 1 VSTAR Power in a game.)",
    },
  ];

  public attacks = [{
    name: 'Leaf Guard',
    cost: [G, G, C],
    damage: 180,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark = 'F';
  public set = 'SWSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '195';
  public name = 'Leafeon VSTAR';
  public fullName = 'Leafeon VSTAR SWSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ivy Star
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some((b) => b.cards.length > 0);

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false },
        ),
        (result) => {
          const cardList = result[0];
          opponent.switchPokemon(cardList);
          player.usedVSTAR = true;
        },
      );
    }

    // Leaf Guard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }
}
