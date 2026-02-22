import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEMON_POWER_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class DarkDragonair extends PokemonCard {
  public tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Dratini';
  public cardType: CardType = C;
  public hp: number = 60;
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Evolutionary Light',
    useWhenInPlay: true,
    powerType: PowerType.POKEMON_POWER,
    text: 'Once during your turn (before your attack), you may search your deck for an Evolution card. Show it to your opponent and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Dark Dragonair is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Tail Strike',
    cost: [C, C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage; if tails, this attack does 20 damage.'
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Dark Dragonair';
  public fullName: string = 'Dark Dragonair TR';

  public readonly EVOLUTIONARY_LIGHT_MARKER = 'EVOLUTIONARY_LIGHT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.EVOLUTIONARY_LIGHT_MARKER, player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.EVOLUTIONARY_LIGHT_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEMON_POWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.marker.hasMarker(this.EVOLUTIONARY_LIGHT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        // eslint-disable-next-line no-empty
        if (card instanceof PokemonCard && card.evolvesFrom !== '' && card.stage !== Stage.LV_X) {
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 1, blocked });

      ADD_MARKER(this.EVOLUTIONARY_LIGHT_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}