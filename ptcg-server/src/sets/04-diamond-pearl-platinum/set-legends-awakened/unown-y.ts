import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ABILITY_USED, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_DECK_FOR_CARDS_TO_HAND, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownY extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'YAWN',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Unown Y is on your Bench, you may remove 1 damage counter from 1 of your Active Unown and that Unown is now Asleep.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C, C],
    damage: 0,
    text: 'Search your deck for up to 2 Trainer cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Unown [Y]';
  public fullName: string = 'Unown [Y] LA';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // YAWN
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isOnBench = player.bench.some(slot => slot.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list !== player.active || !card.name.startsWith('Unown')) {
          blocked.push(target);
        }
      });
      if (blocked.length === player.bench.length + 1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { allowCancel: false, min: 1, max: 1, blocked },
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const target = targets[0];
        if (target.damage > 0) {
          store.reduceEffect(state, new HealEffect(player, target, 10));
        }
        target.addSpecialCondition(SpecialCondition.ASLEEP);
      });
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        effect.player,
        this,
        { superType: SuperType.TRAINER },
        { min: 0, max: 2 },
        effect,
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
