import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PokemonCardList } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

const HITMON_NAMES = new Set(['Hitmonlee', 'Hitmonchan', 'Hitmontop']);

export class Tyrogue extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may put Hitmonlee, Hitmonchan, or Hitmontop from your hand onto Tyrogue (this counts as evolving Tyrogue) and remove all damage counters from Tyrogue.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Gut Blow',
    cost: [F],
    damage: 10,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 10 damage plus 20 more damage and Tyrogue does 10 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '126';
  public name: string = 'Tyrogue';
  public fullName: string = 'Tyrogue LA';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Baby Evolution
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      const hasEvolution = player.hand.cards.some(
        c => c instanceof PokemonCard && HITMON_NAMES.has(c.name),
      );
      if (!hasEvolution) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || !HITMON_NAMES.has(card.name)) {
          blocked.push(index);
        }
      });
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: true, blocked },
      ), selected => {
        const selectedCards = selected || [];
        if (selectedCards.length === 0) {
          return;
        }
        const evolution = selectedCards[0] as PokemonCard;
        const target = StateUtils.findCardList(state, this) as PokemonCardList;
        MOVE_CARDS(store, state, player.hand, target, { cards: [evolution], sourceCard: this });
        const pokemonTarget = target;
        pokemonTarget.clearEffects();
        pokemonTarget.pokemonPlayedTurn = state.turn;
        const healEffect = new HealEffect(player, pokemonTarget, pokemonTarget.damage);
        store.reduceEffect(state, healEffect);
      });
      return state;
    }

    // Gut Blow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemons().length > 1) {
        effect.damage += 20;
        THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
