import { ChooseCardsPrompt, GameError, GameMessage, PokemonCard, PowerType, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonFromDiscardEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

const FOSSIL_NAMES = ['Helix Fossil', 'Dome Fossil', 'Old Amber'];

export class Omanyte extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Helix Fossil';
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Call Up',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, search your discard pile for Helix Fossil, Dome Fossil, or Old Amber and put it onto your Bench. This power can\'t be used if Omanyte is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Wash Over',
    cost: [W, C],
    damage: 20,
    text: 'Does 10 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Omanyte';
  public fullName: string = 'Omanyte MD';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // Call Up
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const openSlots = player.bench.filter(b => b.cards.length === 0);
      const hasFossilInDiscard = player.discard.cards.some(c => FOSSIL_NAMES.includes(c.name));
      if (openSlots.length === 0 || !hasFossilInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const blocked: number[] = [];
        player.discard.cards.forEach((c, index) => {
          if (!FOSSIL_NAMES.includes(c.name)) {
            blocked.push(index);
          }
        });

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.discard,
          {},
          { min: 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }
          store.reduceEffect(
            state,
            new PlayPokemonFromDiscardEffect(player, cards[0] as PokemonCard, openSlots[0]),
          );
        });
      });

      return state;
    }

    // Wash Over
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const benchedCount = opponent.bench.filter(b => b.cards.length > 0).length;
      if (benchedCount === 0) {
        return state;
      }
      const maxTargets = Math.min(2, benchedCount);
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state, maxTargets, maxTargets);
    }

    return state;
  }
}
