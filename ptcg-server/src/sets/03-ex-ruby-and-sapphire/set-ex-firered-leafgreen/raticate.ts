import { CardType, ChooseCardsPrompt, GameMessage, PokemonCard, PowerType, Stage, State, StoreLike, SuperType, TrainerCard } from '../../../game';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import { AFTER_ATTACK, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Raticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rattata';
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [];

  public powers = [{
    name: 'Thick Skin',
    powerType: PowerType.POKEBODY,
    text: 'Raticate can\'t be affected by any Special Conditions.',
  }];

  public attacks = [{
    name: 'Pickup',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for a Basic Pokémon (or Evolution card), a Trainer card, and an Energy card. Show them to your opponent and put them into your hand.',
  },
  {
    name: 'Quick Attack',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 40 more damage.',
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Raticate';
  public fullName: string = 'Raticate RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thick Skin
    if (effect instanceof AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
      effect.preventDefault = true;
    }

    // Pickup
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let pokemons = 0;
      let energies = 0;
      let trainers = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c.superType === SuperType.ENERGY) {
          energies += 1;
        } else if (c instanceof PokemonCard) {
          pokemons += 1;
        } else if (c instanceof TrainerCard) {
          trainers += 1;
        } else {
          blocked.push(index);
        }
      });

      const maxPokemons = Math.min(pokemons, 1);
      const maxEnergies = Math.min(energies, 1);
      const maxTrainers = Math.min(trainers, 1);
      const count = maxPokemons + maxEnergies + maxTrainers;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {},
        { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies, maxTrainers }
      ), selected => {
        const cards = selected || [];
        MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
      });
    }

    // Quick Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
    }

    return state;
  }
}
