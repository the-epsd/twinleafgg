import {
  CardType,
  GameMessage,
  Player,
  PlayerType,
  PokemonCard,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  CAN_APPLY_LOCK_TO_TARGET,
  CAN_APPLY_LOCKER_ABILITY,
  HANDLE_ABILITY_LOCK,
} from '../../../game/store/prefabs/ability-lock';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Giratina extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Devour Light',
    powerType: PowerType.ABILITY,
    text: 'Each Pokémon BREAK has no Abilities (this includes Abilities of its previous Evolution).',
  }];

  public attacks = [{
    name: 'Shadow Claw',
    cost: [P, P, C, C],
    damage: 110,
    text: 'Discard a random card from your opponent\'s hand.',
  }];

  public set: string = 'XYP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '184';
  public name: string = 'Giratina';
  public fullName: string = 'Giratina XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Devour Light
    HANDLE_ABILITY_LOCK(
      effect,
      ({ card }) => {
        const slot = StateUtils.findPokemonSlot(state, card);
        if (!slot || slot.getPokemonCard()?.stage !== Stage.BREAK) {
          return false;
        }

        let isInPlay = false;
        let owner: Player | undefined;
        for (const player of state.players) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
            if (cardList.getPokemonCard() === this) {
              isInPlay = true;
              owner = player;
            }
          });
        }
        if (!isInPlay || !owner) {
          return false;
        }

        if (!CAN_APPLY_LOCKER_ABILITY(store, state, owner, this, this.powers[0])) {
          return false;
        }
        return CAN_APPLY_LOCK_TO_TARGET(store, state, owner, this, this.powers[0], card);
      },
      {
        allowUseFromHand: true,
        allowUseFromDiscard: true,
        error: GameMessage.BLOCKED_BY_EFFECT,
      },
    );

    // Shadow Claw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const card = opponent.hand.cards[randomIndex];
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards: [card], sourceCard: this });
      }
    }

    return state;
  }
}
