import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChooseCardsPrompt, GameMessage, Card, PokemonCardList, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class CarracostaGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Tirtouga';
  public cardType: CardType = F;
  public hp: number = 250;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'High Density Armor',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP, it takes 90 less damage from your opponent\'s attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Ground Crush',
    cost: [F, C, C, C],
    damage: 160,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Stone Age-GX',
    cost: [C],
    damage: 0,
    text: 'Put any number of Pokémon that evolve from Unidentified Fossil from your discard pile onto your Bench. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'SMP';
  public setNumber = '239';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Carracosta-GX';
  public fullName: string = 'Carracosta-GX SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crimson Armor
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      // i love checking for ability lock woooo
      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      // checking damage (it having no damage should confirm that this has full hp, no matter what its hp is set to)
      if (effect.target.damage === 0) {
        effect.damage -= 80;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.usedGX) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      // Allow player to search deck and choose up to 2 Basic Pokemon
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.discard.cards.length === 0) {
        return state;
      }
      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        return state;
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.discard,
        { evolvesFrom: 'Unidentified Fossil' },
        { min: 0, max: openSlots.length, allowCancel: false }
      ), selectedCards => {
        cards = selectedCards || [];

        cards.forEach((card, index) => {
          player.discard.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });
      });
    }

    return state;
  }
}