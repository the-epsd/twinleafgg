import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardTarget, GameMessage, MoveEnergyPrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Swampert extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Marshtomp';
  public hp: number = 130;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: 30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Wash Out',
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), you may move a Water or Fighting Energy attached to 1 of your Benched Pokémon to your Active Pokémon. This power can\'t be used if Swampert is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Hammer Arm',
    cost: [W, W, C, C],
    damage: 80,
    text: 'Discard the top card from your opponent\'s deck.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Swampert';
  public fullName: string = 'Swampert GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wash Out
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      // Block all energy on bench (can't move from bench)
      const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      if (target.slot === SlotType.BENCH) {
      // Block all cards on bench
      blockedMap.push({ source: target, blocked: cardList.cards.map((_, i) => i) });
      }
      });
      // Only allow moving to bench (can't move to active)
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
      if (target.slot === SlotType.ACTIVE) {
      blockedTo.push(target);
      }
      });
      return store.prompt(state, new MoveEnergyPrompt(
      effect.player.id,
      GameMessage.MOVE_ENERGY_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH], // Allow moving from active to bench
      { superType: SuperType.ENERGY },
      { allowCancel: false, min: 0, blockedMap, blockedTo }
      ), transfers => {
      if (transfers === null) {
      return;
      }
      for (const transfer of transfers) {
      const source = StateUtils.getTarget(state, player, transfer.from);
      const target = StateUtils.getTarget(state, player, transfer.to);
      MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this });
      }
      });
    }

    // Hammer Arm
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: heads, sourceCard: this, sourceEffect: this.attacks[1] });
          });
    }

    return state;
  }
}
