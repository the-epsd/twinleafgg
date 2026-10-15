import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import {
  Card, CardTarget, ChoosePokemonPrompt, GameError, GameMessage, MoveEnergyPrompt, PlayerType,
  PowerType, SlotType, State, StateUtils, StoreLike
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import {
  ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED,
  MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED
} from '../../../game/store/prefabs/prefabs';

export class PalkiaLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Palkia';
  public hp: number = 120;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Restructure',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may have your opponent switch 1 of your Active Pokémon with 1 of your Benched Pokémon. Then, you switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. This power can\'t be used if Palkia is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Hydro Reflect',
    cost: [W, W, W],
    damage: 60,
    text: 'You may move all Energy cards attached to Palkia to your Benched Pokémon in any way you like. (Ignore this effect if you don\'t have any Benched Pokémon.)'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Palkia';
  public fullName: string = 'Palkia LV.X GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public usedEnergyBomb = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Restructure
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const playerHasBench = player.bench.some(b => b.cards.length > 0);
      const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!playerHasBench && !opponentHasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      const switchOpponent = () => {
        if (!opponentHasBench) {
          return;
        }
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), chosen => {
          if (chosen && chosen.length > 0) {
            opponent.switchPokemon(chosen[0]);
          }
        });
      };

      if (playerHasBench) {
        return store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), chosen => {
          if (chosen && chosen.length > 0) {
            player.switchPokemon(chosen[0]);
          }
          switchOpponent();
        });
      }

      switchOpponent();
      return state;
    }

    // Hydro Reflect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedEnergyBomb = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedEnergyBomb) {
      this.usedEnergyBomb = false;
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const blockedCards: Card[] = [];
        const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergy);
          checkProvidedEnergy.energyMap.forEach(em => {
            if (em.provides.length === 0) {
              blockedCards.push(em.card);
            }
          });
          const blocked: number[] = [];
          blockedCards.forEach(bc => {
            const index = cardList.cards.indexOf(bc);
            if (index !== -1 && !blocked.includes(index)) {
              blocked.push(index);
            }
          });
          if (blocked.length !== 0) {
            blockedMap.push({ source: target, blocked });
          }
        });

        const attachedEnergies = player.active.cards.filter(c => !blockedCards.includes(c) && c.superType === SuperType.ENERGY);
        if (attachedEnergies.length === 0) {
          return;
        }

        const blockedFrom: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
          if (cardList !== player.active) {
            blockedFrom.push(target);
          }
        });

        store.prompt(state, new MoveEnergyPrompt(
          player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          {},
          { allowCancel: false, min: attachedEnergies.length, max: attachedEnergies.length, blockedMap, blockedFrom }
        ), transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.active, target, { cards: [transfer.card], sourceCard: this });
          }
        });
      }, GameMessage.MOVE_ENERGY_TO_BENCH);
    }

    if (effect instanceof EndTurnEffect && this.usedEnergyBomb) {
      this.usedEnergyBomb = false;
    }

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
