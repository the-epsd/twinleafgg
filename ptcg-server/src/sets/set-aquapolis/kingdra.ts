import { CardTarget, ChooseCardsPrompt, GameMessage, MoveEnergyPrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Kingdra extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Seadra';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Water Cyclone',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), you may move a [W] Energy card from your Active Pokémon to 1 of your Benched Pokémon. This power can\'t be used if Kingdra is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Rapids',
    cost: [W, W, C, C],
    damage: 50,
    text: 'Flip a coin. If heads, discard 1 Energy card attached to the Defending Pokémon, if any.'
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Kingdra';
  public fullName: string = 'Kingdra AQ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

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
          source.moveCardTo(transfer.card, target);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              opponent.active,
              { superType: SuperType.ENERGY },
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              const card = selected[0];

              MOVE_CARDS(store, state, StateUtils.findCardList(state, card), opponent.discard, { cards: [card], sourceCard: this, sourceEffect: this.attacks[0] });
              return state;
            });
          }
        });
      }
    }

    return state;
  }

}