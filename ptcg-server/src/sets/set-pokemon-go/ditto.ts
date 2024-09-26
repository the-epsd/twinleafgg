import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt, PowerType,
  EnergyMap,
  GameError,
  Player
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';

// function* useApexDragon(next: Function, store: StoreLike, state: State,
//   effect: PowerEffect): IterableIterator<State> {
//   const player = effect.player;
//   const opponent = StateUtils.getOpponent(state, player);

//   const discardPokemon = player.discard.cards.filter(card => card.superType === SuperType.POKEMON) as PokemonCard[];

//   const basicPokemon = discardPokemon.filter(card => card.stage === Stage.BASIC);

//   // const blocked: { index: number; attack: string }[] = [];
//   // player.deck.cards.forEach((card, index) => {
//   //   if (card instanceof PokemonCard && card.tags !== undefined) {
//   //     blocked.push({ index, attack: card.attacks[0].name });
//   //   }
//   // });

//   // if (basicPokemon.length === 0) {
//   //   throw new GameError(GameMessage.CANNOT_USE_POWER);
//   // }

//   let selected: any;
//   yield store.prompt(state, new ChooseAttackPrompt(
//     player.id,
//     GameMessage.CHOOSE_ATTACK_TO_COPY,
//     basicPokemon,
//     { allowCancel: false }
//   ), result => {
//     selected = result;
//     next();
//   });

//   const attack: Attack | null = selected;

//   // Get energy required for the attack
//   const requiredEnergy = attack?.cost;

//   // Check if Ditto (the active Pokemon) has the required energy
//   if (!player.active.cards.some(c => c instanceof PokemonCard && requiredEnergy?.includes(c.cardType))) {
//     return state;
//   }
//   if (!attack) {
//     return state;
//   }

//   store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
//     name: player.name,
//     attack: attack.name
//   });

//   // Perform attack
//   const attackEffect = new AttackEffect(player, opponent, attack);
//   store.reduceEffect(state, attackEffect);

//   if (store.hasPrompts()) {
//     yield store.waitPrompt(state, () => next());
//   }

//   if (attackEffect.damage > 0) {
//     const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
//     state = store.reduceEffect(state, dealDamage);
//   }

//   return state;
// }


export class Ditto extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Sudden Transormation',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'This Pokémon can use the attacks of any Basic Pokémon in your discard pile, except for Pokémon with a Rule Box (Pokémon V, Pokémon-GX, etc. have Rule Boxes). (You still need the necessary Energy to use each attack.)'
  }];

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '53';

  public name: string = 'Ditto';

  public fullName: string = 'Ditto PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
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
    player.discard.cards.forEach(card => {
      if (card instanceof PokemonCard && card.stage === Stage.BASIC) {
        this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
      }
    });

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