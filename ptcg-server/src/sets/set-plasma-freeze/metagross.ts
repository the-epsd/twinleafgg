import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  WAS_ATTACK_USED, WAS_POWER_USED, IS_ABILITY_BLOCKED,
  USE_ABILITY_ONCE_PER_TURN, REMOVE_MARKER_AT_END_OF_TURN,
  ABILITY_USED, SHUFFLE_DECK, BLOCK_IF_DECK_EMPTY,
  SHOW_CARDS_TO_PLAYER
} from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { StateUtils } from '../../game/store/state-utils';

export class Metagross extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metang';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Plasma Search',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may search your deck for a Team Plasma card, reveal it, and put it in your hand. Shuffle your deck afterward. You may not use an Ability with the same name during your turn.'
  }];

  public attacks = [
    {
      name: 'Mind Bend',
      cost: [P, C, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Confused.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Metagross';
  public fullName: string = 'Metagross PLF';

  public readonly PLASMA_SEARCH_MARKER = 'PLASMA_SEARCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Plasma Search
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) { return state; }

      BLOCK_IF_DECK_EMPTY(player);
      USE_ABILITY_ONCE_PER_TURN(player, this.PLASMA_SEARCH_MARKER, this);
      ABILITY_USED(player, this);

      // Build blocked list: only Team Plasma cards
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (!c.tags || !c.tags.includes(CardTag.TEAM_PLASMA)) {
          blocked.push(index);
        }
      });

      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 1, allowCancel: true, blocked }
      ), selected => {
        if (selected && selected.length > 0) {
          // Reveal to opponent
          SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);

          player.deck.moveCardTo(selected[0], player.hand);
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.PLASMA_SEARCH_MARKER, this);

    // Attack: Mind Bend
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }
}
