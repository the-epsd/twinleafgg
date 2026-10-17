import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Metapod extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Caterpie';
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Emerge',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Metapod is your Active Pokémon, you may flip a coin. If heads, search your deck for a card that evolves from Metapod and put it onto Metapod. (This counts as evolving Metapod.) Shuffle your deck afterward. This power can\'t be used if Metapod is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Ram',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Metapod';
  public fullName: string = 'Metapod GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Emerge
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        const blocked: number[] = [];
        player.deck.cards.forEach((c, index) => {
          if (!(c instanceof PokemonCard && c.evolvesFrom === this.name)) {
            blocked.push(index);
          }
        });
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_EVOLVE,
          player.deck,
          { superType: SuperType.POKEMON },
          { min: 0, max: 1, allowCancel: true, blocked }
        ), (selected: Card[] | null) => {
          const cards = selected || [];
          if (cards.length > 0) {
            const pokemonCardList = StateUtils.findCardList(state, this) as PokemonCardList;
            MOVE_CARDS(store, state, player.deck, pokemonCardList, { cards, sourceCard: this });
            pokemonCardList.clearEffects();
            pokemonCardList.pokemonPlayedTurn = state.turn;
          }
          SHUFFLE_DECK(store, state, player);
        });
      });
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
