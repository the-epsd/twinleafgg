import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag, EnergyType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  PlayerType, ChooseAttackPrompt, Player, EnergyMap,
  EnergyCard,
  ChooseCardsPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class MewStar extends PokemonCard {

  public tags = [CardTag.STAR];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Mimicry',
      cost: [C],
      damage: 0,
      text: 'Choose an attack on 1 of your opponent\'s Pokémon in play. Mimicry copies that attack. This attack does nothing if Mew Star doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Mew Star performs that attack.'
    },
    {
      name: 'Rainbow Wave',
      cost: [W],
      damage: 0,
      text: 'Choose 1 basic Energy card attached to Mew Star. This attack does 20 damage to each of your opponent\'s Pokémon that is the same type as the basic Energy card that you chose. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'DF';
  public name: string = 'Mew Star';
  public fullName: string = 'Mew Star DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mimicry
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

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

    //Rainbow Wave
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (!player.active.cards.some(c => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC)) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_ENERGY_TYPE,
        player.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return state;
        }
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, target => {
          const checkPokemonTypeEffect = new CheckPokemonTypeEffect(target);
          store.reduceEffect(state, checkPokemonTypeEffect);

          if (
            (cards[0] as EnergyCard).provides &&
            checkPokemonTypeEffect.cardTypes.includes((cards[0] as EnergyCard).provides[0])
          ) {
            const damageEffect = new PutDamageEffect(effect, 20);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          }
        });
        return state;
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

    // Check opponent's Pokemon
    const opponent = StateUtils.getOpponent(state, player);
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    // No need to include Mew ex to the list
    if (card instanceof MewStar) {
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