import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { NEXT_TURN_ATTACK_BASE_DAMAGE_EFFECT } from '../../../game/store/prefabs/attack-effects';

export class Slowking extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Slowpoke';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Trump Card',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if any of your Pokémon were Knocked Out during your opponent\'s last turn, search your deck for any 1 card and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Slowking is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Psych Up',
    cost: [P, C],
    damage: 30,
    text: 'During your next turn, Slowking\'s Psych Up attack\'s base damage is 60.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Slowking';
  public fullName: string = 'Slowking GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Trump Card
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (opponent.prizesTakenLastTurn <= 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    // Psych Up
    NEXT_TURN_ATTACK_BASE_DAMAGE_EFFECT(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[0],
      source: this,
      baseDamage: 60,
    });

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
