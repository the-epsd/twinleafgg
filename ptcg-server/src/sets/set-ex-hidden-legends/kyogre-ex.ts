import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, CardTag, GameError, GameMessage, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { CONFIRMATION_PROMPT, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kyogreex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex]
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Mark of Antiquity',
    powerType: PowerType.POKEBODY,
    text: 'As long as Kyogre ex is your Active Pokémon, each player\'s Groudon ex and Rayquaza ex can\'t attack.'
  }];

  public attacks = [{
    name: 'Water Arrow',
    cost: [C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Super Tidal Wave',
    cost: [W, W, C],
    damage: 50,
    damageCalculation: '+',
    text: 'You may show your hand to your opponent. If you do, this attack does 50 damage plus 10 more damage for each Energy card in your hand. After doing damage, shuffle the Energy cards back into your deck.'
  }];

  public set: string = 'HL';
  public setNumber: string = '94';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kyogre ex';
  public fullName: string = 'Kyogre ex HL';

  public usedSTW = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && (effect.source.getPokemonCard()?.name === 'Groudon ex' || effect.source.getPokemonCard()?.name === 'Rayquaza ex')) {
      if (effect.opponent.active.getPokemonCard() === this) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, player.hand.cards);

          const energyCards = player.hand.cards.filter(card => card.superType === SuperType.ENERGY);
          effect.damage += 10 * energyCards.length;

          this.usedSTW = true;
        }
      }, GameMessage.WANT_TO_USE_ABILITY)
    }

    // doing this after so that the energy are in hand when they are shown to the opponent
    if (effect instanceof AfterAttackEffect && this.usedSTW === true) {
      const player = effect.player;
      const energyCards = player.hand.cards.filter(card => card.superType === SuperType.ENERGY);

      MOVE_CARDS(store, state, player.hand, player.deck, { cards: energyCards, sourceCard: this, sourceEffect: this.attacks[1] });
      SHUFFLE_DECK(store, state, player);
      this.usedSTW = false;
    }

    return state;
  }
} 