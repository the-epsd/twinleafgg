import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, SlotType, ChooseAttackPrompt, Player, EnergyMap,
  AttachEnergyPrompt,
  ShuffleDeckPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Mewex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Versatile',
    useWhenInPlay: true,
    powerType: PowerType.POKEBODY,
    text: 'Mew ex can use the attacks of all Pokémon in play as its own. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [
    {
      name: 'Power Move',
      cost: [P, C],
      damage: 0,
      text: 'Search your deck for an Energy card and attach it to Mew ex. Shuffle your deck afterward. Then, you may switch Mew ex with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'LM';
  public name: string = 'Mew ex';
  public fullName: string = 'Mew ex LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    //Versatile pokebody
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.ABILITY_BLOCKED);
      }

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: true, blocked }
      ), attack => {
        if (attack !== null) {
          const useAttackEffect = new UseAttackEffect(player, attack);
          store.reduceEffect(state, useAttackEffect);
        }
      });
    }

    //Power Move attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // Attach energy if selected
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
        }

        // Shuffle the deck after attaching energy
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        // Prompt to switch Mew ex with a Benched Pokémon
        CONFIRMATION_PROMPT(store, state, player, result => {
          if (result) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      });
    }
    return state;
  }

  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];

    // Check player's Pokemon
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });

    // Check opponent's Pokemon
    const opponent = StateUtils.getOpponent(state, player);
    opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    // No need to include Mew ex to the list
    if (card instanceof Mewex) {
      return;
    }

    const attacks = card.attacks.filter(attack => {
      const checkAttackCost = new CheckAttackCostEffect(player, attack);
      state = store.reduceEffect(state, checkAttackCost);
      return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[]);
    });

    const index = pokemonCards.length;
    pokemonCards.push(card);
    card.attacks.forEach(attack => {
      if (!attacks.includes(attack)) {
        blocked.push({ index, attack: attack.name });
      }
    });
  }
}