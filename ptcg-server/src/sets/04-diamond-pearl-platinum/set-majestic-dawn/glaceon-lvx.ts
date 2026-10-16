import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CAN_APPLY_LOCKER_ABILITY, CAN_APPLY_LOCK_TO_TARGET, HANDLE_ABILITY_BLOCK, IS_ABILITY_LOCKER_IN_PLAY, POKEPOWER_TYPES } from '../../../game/store/prefabs/ability-lock';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GlaceonLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Glaceon';
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +30 }];
  public retreat = [C];

  public powers = [{
    name: 'Chilly Breath',
    powerType: PowerType.POKEBODY,
    text: 'As long as Glaceon is your Active Pokémon, your opponent\'s Pokémon can\'t use any Poké-Powers.'
  }];

  public attacks = [{
    name: 'Avalanche',
    cost: [W, W, C],
    damage: 70,
    text: 'Flip a coin. If heads, this attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Glaceon LV.X';
  public fullName: string = 'Glaceon LV.X MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Chilly Breath
    HANDLE_ABILITY_BLOCK(
      effect,
      ({ player, card }) => {
        const cardList = StateUtils.findCardList(state, this);
        const owner = StateUtils.findOwner(state, cardList);

        if (player === owner) {
          return false;
        }
        if (owner.active.getPokemonCard() !== this) {
          return false;
        }
        if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
          return false;
        }
        if (!IS_ABILITY_LOCKER_IN_PLAY(state, owner, this)) {
          return false;
        }
        if (!CAN_APPLY_LOCKER_ABILITY(store, state, owner, this, this.powers[0])) {
          return false;
        }
        return CAN_APPLY_LOCK_TO_TARGET(store, state, owner, this, this.powers[0], card);
      },
      {
        powerTypes: POKEPOWER_TYPES,
        error: GameMessage.BLOCKED_BY_EFFECT,
      },
    );

    // Avalanche
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          opponent.bench.forEach(bench => {
            if (bench.cards.length > 0) {
              const damageEffect = new PutDamageEffect(effect, 20);
              damageEffect.target = bench;
              store.reduceEffect(state, damageEffect);
            }
          });
        }
      });
    }

    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card === this) {
          player.showAllStageAbilities = true;
        }
      });
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }
      for (const evolutionCard of cardList.cards) {
        if (
          evolutionCard.superType === SuperType.POKEMON &&
          evolutionCard !== this &&
          evolutionCard.name === this.evolvesFrom
        ) {
          effect.attacks.push(...(evolutionCard.attacks || []));
        }
      }
    }

    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }
      for (const evolutionCard of cardList.cards) {
        if (
          evolutionCard.superType === SuperType.POKEMON &&
          evolutionCard !== this &&
          evolutionCard.name === this.evolvesFrom
        ) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}
