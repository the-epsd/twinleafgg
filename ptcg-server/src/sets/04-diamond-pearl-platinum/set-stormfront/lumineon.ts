import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Lumineon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Finneon';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [];

  public powers = [{
    name: 'Fin Luster',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Lumineon is your Active Pokémon, you may look at your opponent\'s hand. If your opponent\'s Bench isn\'t full, choose 1 Basic Pokémon from your opponent\'s hand, and put it onto his or her Bench. Then, switch it with the Defending Pokémon. This power can\'t be used if Lumineon is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Quick Swim',
    cost: [],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
  },
  {
    name: 'Elegant Swim',
    cost: [W],
    damage: 30,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Lumineon during your opponent\'s next turn.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Lumineon';
  public fullName: string = 'Lumineon SF';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fin Luster
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
      const slots = opponent.bench.filter(b => b.cards.length === 0);
      if (slots.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_BASIC_POKEMON_TO_BENCH,
        opponent.hand,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: 1, allowCancel: true },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, opponent.hand, slots[0], { cards, sourceCard: this });
        slots[0].pokemonPlayedTurn = state.turn;
        opponent.switchPokemon(slots[0]);
      });
    }

    // Quick Swim
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attackEffect = effect;
      attackEffect.ignoreWeakness = true;
      attackEffect.ignoreResistance = true;
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(20, attackEffect, store, state);
    }

    // Elegant Swim
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
