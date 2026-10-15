import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import {
  DamageMap, GameError, GameMessage, MoveDamagePrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  CheckHpEffect, CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect
} from '../../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import {
  ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES,
  IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED
} from '../../../game/store/prefabs/prefabs';

export class CresseliaLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Cresselia';
  public hp: number = 100;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Full Moon Dance',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may move 1 damage counter from either player\'s Pokémon to another Pokémon (yours or your opponent\'s). This power can\'t be used if Cresselia is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Moon Skip',
    cost: [P, P, C],
    damage: 40,
    text: 'If the Defending Pokémon is Knocked Out by this attack, take 1 more Prize card.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Cresselia';
  public fullName: string = 'Cresselia LV.X GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Full Moon Dance
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const maxAllowedDamage: DamageMap[] = [];
      let hasDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        const checkHp = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHp);
        maxAllowedDamage.push({ target, damage: checkHp.hp });
        if (cardList.damage > 0) {
          hasDamage = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, _card, target) => {
        const checkHp = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHp);
        maxAllowedDamage.push({ target, damage: checkHp.hp });
        if (cardList.damage > 0) {
          hasDamage = true;
        }
      });

      if (!hasDamage) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new MoveDamagePrompt(
        player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.ANY,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        { min: 1, max: 1, allowCancel: false }
      ), transfers => {
        if (!transfers || transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 10) {
            source.damage -= 10;
            target.damage += 10;
          }
        }
      });
    }

    // Moon Skip
    IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Moon Skip',
    });

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
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
