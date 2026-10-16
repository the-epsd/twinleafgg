import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCard, PowerType, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { CardTag, CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect, PlayPokemonFromDiscardEffect } from '../../../game/store/effects/play-card-effects';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GarchompLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Garchomp';
  public hp: number = 140;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +30 }];
  public retreat = [];

  public powers = [{
    name: 'Dragon Pulse',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you put Garchomp LV.X from your hand onto your Active Garchomp, you may flip 3 coins. For each heads, put 1 damage counter on each of your opponent\'s Benched Pokémon.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Restore',
    cost: [],
    damage: 0,
    text: 'Search your discard pile for a Pokémon (excluding Pokémon LV.X) and put it onto your Bench as a Basic Pokémon. Then, you may search your discard pile for up to 3 basic Energy cards and attach them to that Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Garchomp LV.X';
  public fullName: string = 'Garchomp LV.X MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Dragon Pulse
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
          const heads = results.filter(r => r).length;
          if (heads === 0) {
            return;
          }

          const opponent = StateUtils.getOpponent(state, player);
          for (let i = 0; i < heads; i++) {
            opponent.bench.forEach(benchSlot => {
              if (benchSlot.cards.length > 0) {
                const placeDamage = new PlaceDamageCountersEffect(player, benchSlot, 10, this);
                store.reduceEffect(state, placeDamage);
              }
            });
          }
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Restore
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const openSlots = player.bench.filter(b => b.cards.length === 0);
      if (openSlots.length === 0) {
        return state;
      }

      const hasPokemon = player.discard.cards.some(
        c => c.superType === SuperType.POKEMON
          && !(c instanceof PokemonCard && (c.stage === Stage.LV_X || c.hasTag(CardTag.POKEMON_LV_X))),
      );
      if (!hasPokemon) {
        return state;
      }

      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c.superType !== SuperType.POKEMON) {
          blocked.push(index);
        } else if (c instanceof PokemonCard && (c.stage === Stage.LV_X || c.hasTag(CardTag.POKEMON_LV_X))) {
          blocked.push(index);
        }
      });

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.discard,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: false, blocked },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }

        const benchSlot = openSlots[0];
        store.reduceEffect(state, new PlayPokemonFromDiscardEffect(player, cards[0] as PokemonCard, benchSlot));

        const hasBasicEnergy = player.discard.cards.some(
          c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
        );
        if (!hasBasicEnergy) {
          return;
        }

        CONFIRMATION_PROMPT(store, state, player, attachEnergy => {
          if (!attachEnergy) {
            return;
          }

          ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store, state, player, 3, undefined, {
            energyFilter: { energyType: EnergyType.BASIC },
            min: 0,
            allowCancel: true,
            targetFilter: (list) => list === benchSlot,
          });
        });
      });
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
