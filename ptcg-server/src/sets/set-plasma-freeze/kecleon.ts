import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameMessage, ChooseAttackPrompt, PlayerType, Player } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kecleon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Color Change',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, this Pokémon is the same type as the your opponent\'s Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Imittack',
      cost: [C],
      damage: 0,
      text: 'Choose 1 of the Defending Pokémon\'s attacks. If this Pokémon has the necessary Energy to use that attack, use it as this attack.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '94';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kecleon';
  public fullName: string = 'Kecleon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Color Change (passive - type change when active)
    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      let owner: any = null;
      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList === effect.target) {
            owner = p;
          }
        });
      });

      if (!owner) { return state; }

      // Only applies when this Pokemon is the Active
      if (owner.active !== effect.target) { return state; }

      // Check ability lock
      try {
        const stub = new PowerEffect(owner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      const opponentCard = opponent.active.getPokemonCard();
      if (opponentCard) {
        // Check opponent's type via CheckPokemonTypeEffect
        const opponentTypeCheck = new CheckPokemonTypeEffect(opponent.active);
        store.reduceEffect(state, opponentTypeCheck);

        effect.cardTypes = [...opponentTypeCheck.cardTypes];
      }
    }

    // Attack: Imittack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentCard = opponent.active.getPokemonCard();

      if (!opponentCard || opponentCard.attacks.length === 0) {
        return state;
      }

      // Build blocked list based on energy cost
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player, opponentCard);

      if (pokemonCards.length === 0) {
        return state;
      }

      // Check if all attacks are blocked
      const allBlocked = opponentCard.attacks.every(attack =>
        blocked.some(b => b.index === 0 && b.attack === attack.name)
      );

      if (allBlocked) {
        return state;
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: false, blocked }
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
    state: State, store: StoreLike, player: Player, opponentCard: PokemonCard
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {
    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [opponentCard];
    const blocked: { index: number, attack: string }[] = [];

    opponentCard.attacks.forEach(attack => {
      const checkAttackCost = new CheckAttackCostEffect(player, attack);
      state = store.reduceEffect(state, checkAttackCost);
      if (!StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[])) {
        blocked.push({ index: 0, attack: attack.name });
      }
    });

    return { pokemonCards, blocked };
  }
}
