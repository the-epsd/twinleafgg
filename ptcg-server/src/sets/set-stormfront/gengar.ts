import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, TrainerCard, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Haunter';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: D, value: +30 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Fainting Spell',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your opponent\'s turn, if Gengar would be Knocked Out by damage from an attack, you may flip a coin. If heads, the Defending Pokémon is Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Shadow Room',
      cost: [P],
      damage: 0,
      text: 'Put 3 damage counters on 1 of your opponent\'s Pokémon. If that Pokémon has any Poké-Powers, put 6 damage counters on that Pokémon instead.'
    },
    {
      name: 'Poltergeist',
      cost: [P, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Look at your opponent\'s hand. This attack does 30 damage times the number of Trainer, Supporter, and Stadium cards in your opponent\'s hand.'
    }
  ];

  public set: string = 'SF';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      // This Pokemon was knocked out
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (wantToUse) {
          COIN_FLIP_PROMPT(store, state, player, flipResult => {
            if (flipResult) {
              opponent.active.damage += 999;
            }
          })
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }

        let damageAmount = 30
        if (targets.some(cardList => cardList.getPokemonCard()?.powers
          && cardList.getPokemonCard()?.powers.some(power => power.powerType === PowerType.POKEPOWER))) {
          damageAmount = 60;
        }
        const damageEffect = new PutCountersEffect(effect, damageAmount);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {

        const cardsInOpponentHand = opponent.hand.cards.filter(card =>
          card instanceof TrainerCard &&
          [TrainerType.ITEM, TrainerType.SUPPORTER, TrainerType.STADIUM].includes(card.trainerType)
        ).length;

        const damage = cardsInOpponentHand * 30;
        effect.damage = damage;
      });
    }

    return state;
  }
} 