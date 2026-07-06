import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, GameError, GameMessage, ChooseAttackPrompt, ConfirmPrompt, Player, EnergyMap, StateUtils } from "../../../game";
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { UseAttackEffect } from "../../../game/store/effects/game-effects";
import { AfterAttackEffect } from "../../../game/store/effects/game-phase-effects";
import { WAS_POWER_USED, IS_ABILITY_BLOCKED, SWITCH_ACTIVE_WITH_BENCHED } from "../../../game/store/prefabs/prefabs";

export class Mewex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 160;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Memory Helix',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can use the attacks of any of your Benched Pokémon. (You still need the necessary Energy to use each attack.)'
  }];
  public attacks = [{
    name: 'Teleportation Burst',
    cost: [P],
    damage: 30,
    text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Mew ex';
  public fullName: string = 'Mew ex 30C';
  public usedTeleportationBurst = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-fates-collide/mew.ts (Memories of Dawn — copy attacks from in-play Pokémon)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);
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
    // Ref: set-celestial-storm/deoxys-3.ts (Teleportation Burst — optional switch after attack)
    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      if (player.bench.some(b => b.cards.length > 0)) {
        store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_SWITCH_POKEMON,
        ), wantToSwitch => {
          if (wantToSwitch) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
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
    player.bench.forEach(benchSpot => {
      const card = benchSpot.getPokemonCard();
      if (card) {
        this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
      }
    });
    return { pokemonCards, blocked };
  }
  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
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
