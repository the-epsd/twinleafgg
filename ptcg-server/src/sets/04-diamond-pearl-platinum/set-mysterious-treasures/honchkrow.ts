import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Player, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckPokemonAttacksEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Honchkrow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Murkrow';
  public hp: number = 90;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Dark Genes',
    powerType: PowerType.POKEBODY,
    text: 'As long as Honchkrow has the Energy necessary to use its attack, each of your Murkrow can use Honchkrow\'s attack as its own without the Energy necessary to use that attack.'
  }];

  public attacks = [{
    name: 'Dark Wing Flaps',
    cost: [D, D, C],
    damage: 50,
    text: 'Choose 1 card from your opponent\'s hand without looking. Look at the card you chose, then have your opponent shuffle that card into his or her deck.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Honchkrow';
  public fullName: string = 'Honchkrow MT';

  private honchkrowHasAttackEnergy(store: StoreLike, state: State, owner: Player): boolean {
    let hasEnergy = false;
    owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (card !== this || hasEnergy) {
        return;
      }
      const checkEnergy = new CheckProvidedEnergyEffect(owner, cardList);
      store.reduceEffect(state, checkEnergy);
      if (StateUtils.checkEnoughEnergy(checkEnergy.energyMap, this.attacks[0].cost)) {
        hasEnergy = true;
      }
    });
    return hasEnergy;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Genes — Murkrow may use Honchkrow's attack
    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const active = player.active.getPokemonCard();
      if (active?.name !== 'Murkrow') {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player || !StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      if (!this.honchkrowHasAttackEnergy(store, state, owner)) {
        return state;
      }

      for (const attack of this.attacks) {
        if (!effect.attacks.includes(attack)) {
          effect.attacks.push(attack);
        }
      }
    }

    // Dark Genes — Murkrow pays no Energy for Honchkrow's attack
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const active = player.active.getPokemonCard();
      if (active?.name !== 'Murkrow') {
        return state;
      }

      if (!this.attacks.some(a => a.name === effect.attack.name)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player || !StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      if (!this.honchkrowHasAttackEnergy(store, state, owner)) {
        return state;
      }

      effect.cost = [];
    }

    // Dark Wing Flaps
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const randomCard = opponent.hand.cards[randomIndex];
      SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
      MOVE_CARDS(store, state, opponent.hand, opponent.deck, {
        cards: [randomCard],
        sourceCard: this,
        sourceEffect: this.attacks[0],
      });
      SHUFFLE_DECK(store, state, opponent);
    }

    return state;
  }
}
