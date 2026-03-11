import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State, GamePhase, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Kabutops extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kabuto';
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Ancient Shell',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have Omanyte or Omastar in play, damage done to Kabutops by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Energy Stream',
    cost: [F],
    damage: 30,
    text: 'Search your discard pile for a basic Energy card and attach it to Kabutops.'
  },
  {
    name: 'Extra Claws',
    cost: [F, C, C],
    damage: 50,
    text: 'If the Defending Pokémon is Pokémon-ex, this attack does 50 damage plus 30 more damage.'
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Kabutops';
  public fullName: string = 'Kabutops LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {

      let isOmaInPlay = false;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Omanyte' || card.name === 'Omastar') {
          isOmaInPlay = true;
        }
      });

      if (!isOmaInPlay) {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.damage -= 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
        store, state, player, 1, undefined,
        {
          destinationSlots: [SlotType.ACTIVE],
          energyFilter: { energyType: EnergyType.BASIC },
          min: 0
        }
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingPokemon = opponent.active;
      if (defendingPokemon.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage += 30;
      }
    }

    return state;
  }
}

