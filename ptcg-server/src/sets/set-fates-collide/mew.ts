import { Card, ChooseAttackPrompt, ChooseCardsPrompt, EnergyMap, GameError, GameMessage, Player, PlayerType, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* useEncounter(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 0, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, player.hand);
  });

  state = store.prompt(state, new ShowCardsPrompt(
    opponent.id,
    GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
    cards), () => state);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Mew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [];

  public powers = [{
    name: 'Memories of Dawn',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can use the attacks of any of your Basic Pokémon in play. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [{
    name: 'Encounter',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'FCO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Mew';

  public fullName: string = 'Mew FCO';

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useEncounter(() => generator.next(), store, state, effect);
      return generator.next().value;
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

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const card = cardList.getPokemonCard();
      if (card && card.stage === Stage.BASIC) {
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