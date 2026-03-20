import { AFTER_ATTACK, IS_POKEBODY_BLOCKED, MOVE_CARDS, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { Card, ChooseCardsPrompt, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CheckPokemonPowersEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';

export class Exploudex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Loudred';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 150;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Extra Noise',
    powerType: PowerType.POKEBODY,
    text: 'As long as Exploud ex is your Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon-ex between turns.',
  }];

  public attacks = [{
    name: 'Derail',
    cost: [C, C],
    damage: 40,
    text: 'Discard a Special Energy card, if any, attached to the Defending Pokémon.'
  },
  {
    name: 'Hyper Tail',
    cost: [C, C, C],
    damage: 60,
    text: 'If the Defending Pokémon has any Poké-Powers or Poké-Bodies, this attack does 60 damage plus 20 more damage.'
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Exploud ex';
  public fullName: string = 'Exploud ex CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          const placeCountersEffect = new PlaceDamageCountersEffect(opponent, cardList, 10, this);
          state = store.reduceEffect(state, placeCountersEffect);
        }
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const oppActive = opponent.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, oppActive);
      store.reduceEffect(state, checkEnergy);

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard.superType === SuperType.ENERGY && energyCard.energyType === EnergyType.SPECIAL) {

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            oppActive,
            { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected;
          });
          MOVE_CARDS(store, state, oppActive, opponent.discard, { cards: cards, sourceCard: this, sourceEffect: this.attacks[0] });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActivePokemon = opponent.active.getPokemonCard();

      if (opponentActivePokemon) {
        const powersEffect = new CheckPokemonPowersEffect(opponent, opponentActivePokemon);
        state = store.reduceEffect(state, powersEffect);
        if (powersEffect.powers.some(power => power.powerType === PowerType.POKEBODY || power.powerType === PowerType.POKEPOWER)) {
          THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 20);
        }
      }
    }

    return state;
  }
}