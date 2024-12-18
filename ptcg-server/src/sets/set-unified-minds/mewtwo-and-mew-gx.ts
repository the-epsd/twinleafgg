import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, ChooseAttackPrompt, Player, EnergyMap, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect, UseAttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class MewtwoMewGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 270;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Perfection',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'This Pokemon can use the attacks of any Pokemon-GX or Pokemon-EX on your Bench ' +
      'or in your discard pile. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [
    {
      name: 'Miraculous Duo-GX',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 200,
      text: 'If this Pokemon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), ' +
        'heal all damage from all of your Pokemon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'UNM';

  public name: string = 'Mewtwo & Mew-GX';

  public fullName: string = 'Mewtwo & Mew-GX UNM';

  public setNumber: string = '71';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();
      if (pokemonCard !== this) { throw new GameError(GameMessage.CANNOT_USE_POWER); }

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) { throw new GameError(GameMessage.CANNOT_USE_POWER); }

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Handle GX attack marker
      if (player.usedGX == true) { throw new GameError(GameMessage.LABEL_GX_USED); }
      player.usedGX = true;

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) { return state; }  // If we don't have the extra energy, we just deal damage.
      // Otherwise, heal all of our Pokemon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 999);
        store.reduceEffect(state, healEffect);
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

    player.discard.cards.forEach((card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: Card, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    if (
      !(card instanceof PokemonCard) || (card instanceof MewtwoMewGX) ||
      !(card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_GX))
    ) { return; }
    const attacks = card.attacks.filter(attack => {
      const checkAttackCost = new CheckAttackCostEffect(player, attack);
      state = store.reduceEffect(state, checkAttackCost);
      return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
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