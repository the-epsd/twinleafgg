import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Lumineon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Finneon';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Lure Ring',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Lumineon is your Active Pokémon, you may choose 1 of your opponent\'s Benched Pokémon that has a maximum HP of 100 or more and switch it with 1 of the Defending Pokémon. This power can\'t be used if Lumineon is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Reverse Stream',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 10 more damage for each Water Energy attached to Lumineon. Then, return all Water Energy attached to Lumineon to your hand.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Lumineon';
  public fullName: string = 'Lumineon MT';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

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
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const blocked: CardTarget[] = [];
      let hasValidTarget = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList === opponent.active) {
          return;
        }
        if (card.hp < 100) {
          blocked.push(target);
        } else {
          hasValidTarget = true;
        }
      });

      if (!hasValidTarget) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      return GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        { allowCancel: false, blocked },
      );
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);

      const waterEnergies = checkProvidedEnergy.energyMap.filter(
        em => em.provides.includes(CardType.WATER) || em.provides.includes(CardType.ANY)
      );
      effect.damage += waterEnergies.length * 10;

      const waterCards = waterEnergies.map(em => em.card);
      if (waterCards.length > 0) {
        MOVE_CARDS(store, state, player.active, player.hand, {
          cards: waterCards,
          sourceCard: this,
          sourceEffect: this.attacks[0],
        });
      }
    }

    return state;
  }
}
