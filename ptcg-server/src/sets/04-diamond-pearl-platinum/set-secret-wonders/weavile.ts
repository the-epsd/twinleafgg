import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_MARKER, ATTACH_ENERGY_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Weavile extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sneasel';
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Dark Engage',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may use this power. Each of your Active Pokémon\'s type is Darkness until the end of your turn. If that Pokémon is no longer your Active Pokémon, this effect ends.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Shadow Charge',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 2 Darkness Energy cards and attach them to any of your Pokémon in any way you like. Shuffle your deck afterward.'
  },
  {
    name: 'Chip Off',
    cost: [D, D],
    damage: 40,
    text: 'If your opponent has 6 or more cards in his or her hand, discard a number of cards without looking until your opponent has 5 cards left in his or her hand.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public readonly DARK_ENGAGE_MARKER = 'DARK_ENGAGE_MARKER';
  public darkEngageTarget: PokemonCardList | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Engage type override
    if (effect instanceof CheckPokemonTypeEffect && this.darkEngageTarget !== undefined) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (HAS_MARKER(this.DARK_ENGAGE_MARKER, owner, this)
        && effect.target === this.darkEngageTarget
        && owner.active === this.darkEngageTarget) {
        effect.cardTypes = [CardType.DARK];
      } else if (this.darkEngageTarget !== undefined && owner.active !== this.darkEngageTarget) {
        this.darkEngageTarget = undefined;
        REMOVE_MARKER(this.DARK_ENGAGE_MARKER, owner, this);
      }
    }

    // Dark Engage
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      this.darkEngageTarget = player.active;
      ADD_MARKER(this.DARK_ENGAGE_MARKER, player, this);
      return state;
    }

    // Shadow Charge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player,
        PlayerType.BOTTOM_PLAYER, SlotType.DECK,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
        { min: 0, max: 2, allowCancel: true }
      );
    }

    // Chip Off
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      while (opponent.hand.cards.length >= 6) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
          cards: [randomCard],
          sourceCard: this,
        });
        if (opponent.hand.cards.length <= 5) {
          break;
        }
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.DARK_ENGAGE_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.DARK_ENGAGE_MARKER, effect.player, this);
      this.darkEngageTarget = undefined;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
