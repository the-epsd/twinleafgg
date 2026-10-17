import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, DISCARD_ALL_ENERGY_FROM_POKEMON, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Rayquaza extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Speed Gain',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin until you get tails. For each heads, search your discard pile for a basic Fire Energy card or a basic Lightning Energy card and attach it to Rayquaza. This power can\'t be used if Rayquaza is affected by a Special Condition or if you have another Rayquaza in play.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Sky Judgement',
    cost: [R, R, L, L],
    damage: 150,
    text: 'Discard all Energy attached to Rayquaza.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Rayquaza';
  public fullName: string = 'Rayquaza LA';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Speed Gain
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      let otherRayquaza = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card.name === 'Rayquaza' && card !== this) {
          otherRayquaza = true;
        }
      });
      if (otherRayquaza) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
        if (heads === 0) {
          return;
        }
        const cardList = StateUtils.findCardList(state, this);
        for (let i = 0; i < heads; i++) {
          const hasEnergy = player.discard.cards.some(c => {
            if (!(c instanceof EnergyCard) || c.energyType !== EnergyType.BASIC) {
              return false;
            }
            return c.provides.includes(CardType.FIRE) || c.provides.includes(CardType.LIGHTNING);
          });
          if (!hasEnergy) {
            break;
          }
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.discard,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 1, max: 1, allowCancel: false },
          ), selected => {
            const cards = selected || [];
            if (cards.length === 0) {
              return;
            }
            const card = cards[0] as EnergyCard;
            if (!card.provides.includes(CardType.FIRE) && !card.provides.includes(CardType.LIGHTNING)) {
              return;
            }
            MOVE_CARDS(store, state, player.discard, cardList, { cards: [card], sourceCard: this });
          });
        }
      });
      return state;
    }

    // Sky Judgement
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
