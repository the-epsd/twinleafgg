import { PokemonCard, Stage, PowerType, StoreLike, State, GameMessage, StateUtils, CardTag, PlayerType, SuperType, GameError, CardType, SlotType, ChoosePokemonPrompt } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckPokemonStatsEffect, CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class AzelfLVX extends PokemonCard {
  public stage = Stage.LV_X;
  public evolvesFrom = 'Azelf';
  public tags = [CardTag.POKEMON_LV_X];
  public cardType = P;
  public hp = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Psychic Aura',
    powerType: PowerType.POKEBODY,
    text: 'Each of your [P] Pokémon has no Weakness.'
  }];

  public attacks = [{
    name: 'Deep Balance',
    cost: [P],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. Put 1 damage counter on that Pokémon for each Energy attached to all of your opponent\'s Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name: string = 'Azelf';
  public fullName: string = 'Azelf Lv. X LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);

      let isAzelfInPlay = false;
      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isAzelfInPlay = true;
        }
      });

      if (isAzelfInPlay && !IS_POKEBODY_BLOCKED(store, state, player, this)) {
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.PSYCHIC)) {
          effect.weakness = [];
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // get the energies from the opponent's pokemon
      let energies = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies += energy.provides.length;
        });
      });

      if (energies === 0) {
        return state;
      }

      // choose and put the counters on the chosen pokemon
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const putCountersEffect = new PutCountersEffect(effect, energies * 10);
        putCountersEffect.target = targets[0];
        store.reduceEffect(state, putCountersEffect);

      });
    }

    //Lv. X Stuff
    // making sure it gets put on the active pokemon
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
    }

    // Trying to get all of the previous stage's attacks and powers
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
          player.showAllStageAbilities = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Add attacks from the previous stage to this one
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
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
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Adds the powers from the previous stage
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}