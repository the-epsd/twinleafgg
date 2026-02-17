import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, PlayerType, ChoosePokemonPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ErikasVictreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Erika\'s Weepinbell';
  public tags = [CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Fragrance Trap',
    useWhenInPlay: true,
    powerType: PowerType.POKEMON_POWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, and if your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon. This power can\'t be used if Erika\'s Victreebel is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [G, G, G],
    damage: 50,
    text: ''
  }];

  public set: string = 'G1';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Erika\'s Victreebel';
  public fullName: string = 'Erika\'s Victreebel G1';

  public readonly FRAGRANCE_TRAP_MARKER = 'FRAGRANCE_TRAP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.FRAGRANCE_TRAP_MARKER, player, this);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.FRAGRANCE_TRAP_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.FRAGRANCE_TRAP_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);

      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];

            if (cardList) {
              opponent.switchPokemon(cardList);
            }
          }
          );
        }
      });
      ADD_MARKER(this.FRAGRANCE_TRAP_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    return state;
  }
}