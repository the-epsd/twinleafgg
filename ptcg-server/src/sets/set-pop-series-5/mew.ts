import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag, SuperType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt,
  EnergyMap,
  Player,
  AttachEnergyPrompt,
  PlayerType,
  SlotType
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { MOVE_CARD_TO, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Mew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Copy',
      cost: [C],
      damage: 0,
      text: 'Choose 1 of the Defending Pokémon\'s attacks. Copy copies that attack. This attack does nothing if Mew doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Mew performs that attack.'
    },
    {
      name: 'Extra Draw',
      cost: [R],
      damage: 0,
      text: 'If your opponent has any Pokémon-ex in play, search your deck for up to 2 basic Energy cards and attach them to Mew. Shuffle your deck afterward.'
    }
  ];

  public set: string = 'P5';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Mew';
  public fullName: string = 'Mew P5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Copy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: true, blocked }
      ), attack => {
        if (attack !== null) {
          const attackEffect = new AttackEffect(player, opponent, attack);
          store.reduceEffect(state, attackEffect);

          if (attackEffect.damage > 0) {
            const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
            state = store.reduceEffect(state, dealDamage);
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasexPokemon = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_ex)) {
          hasexPokemon = true;
        }
      });

      if (hasexPokemon) {
        store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, max: 2, allowCancel: true }
        ), transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARD_TO(state, transfer.card, target);
          }

          SHUFFLE_DECK(store, state, player);
        });
      }
    }

    return state;
  }

  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {
    const opponent = StateUtils.getOpponent(state, player);
    const opponentActive = opponent.active.getPokemonCard();

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];
    if (opponentActive) {
      this.checkAttack(state, store, player, opponentActive, energyMap, pokemonCards, blocked);
    }

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    {

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
}