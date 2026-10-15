import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownH extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'HEAL',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if you have Unown H, Unown E, Unown A, and Unown L on your Bench, you may remove all Special Conditions from 1 of your Active Pokémon.',
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P],
    damage: 30,
    text: 'Discard a card from your hand. (If you can\'t discard a card from your hand, this attack does nothing.)'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Unown [H]';
  public fullName: string = 'Unown [H] GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // HEAL
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isOnBench = player.bench.some(slot => slot.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const benchNames = new Set<string>();
      player.bench.forEach(slot => {
        const card = slot.getPokemonCard();
        if (card) {
          benchNames.add(card.name);
        }
      });

      const required = ['Unown [H]', 'Unown [E]', 'Unown [A]', 'Unown [L]'];
      if (!required.every(name => benchNames.has(name))) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.active.specialConditions.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      const conditions = player.active.specialConditions.slice();
      conditions.forEach(condition => {
        player.active.removeSpecialCondition(condition);
      });
      return state;
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length === 0) {
        effect.damage = 0;
        return state;
      }
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
        }
      });
    }

    return state;
  }
}
