import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import {
  ABILITY_USED,
  ADD_MARKER,
  BLOCK_IF_ASLEEP_CONFUSED_PARALYZED,
  COIN_FLIP_PROMPT,
  HAS_MARKER,
  REMOVE_MARKER,
  REMOVE_MARKER_AT_END_OF_TURN,
  WAS_POWER_USED,
} from '../../game/store/prefabs/prefabs';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';

export class ErikasVictreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = "Erika's Weepinbell";
  protected _tags = [CardTag.ERIKAS];
  public hp: number = 150;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Fragrance Trap',
    useWhenInPlay: true,
    powerType: PowerType.POKEMON_POWER,
    text: "Once during your turn (before your attack), you may flip a coin. If heads, and if your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon. This power can't be used if Erika's Victreebel is Asleep, Confused, or Paralyzed.",
  }];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [G, G, G],
    damage: 50,
    text: '',
  }];

  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = "Erika's Victreebel";
  public fullName: string = "Erika's Victreebel G1";

  public readonly FRAGRANCE_TRAP_MARKER = 'FRAGRANCE_TRAP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.FRAGRANCE_TRAP_MARKER, effect.player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.FRAGRANCE_TRAP_MARKER, this);

    // Fragrance Trap
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.FRAGRANCE_TRAP_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);

      if (!opponent.bench.some((b) => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            { allowCancel: false },
          );
        }
      });
      ADD_MARKER(this.FRAGRANCE_TRAP_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    return state;
  }
}
