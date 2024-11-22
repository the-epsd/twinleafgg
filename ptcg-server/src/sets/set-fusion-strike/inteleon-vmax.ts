import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, StateUtils, ChooseCardsPrompt, EnergyCard, GameError, PowerType, CardList, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CardsToHandEffect } from '../../game/store/effects/attack-effects';

export class InteleonVMAX extends PokemonCard {

  public tags = [CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE];

  public regulationMark = 'E';

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Inteleon V';

  public cardType: CardType = CardType.WATER;

  public hp: number = 320;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Double Gunner',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a [W] Energy card from your hand in order to use this Ability. Once during your turn, you may choose 2 of your opponent\'s Benched Pokémon and put 2 damage counters on each of them.'
  }];

  public attacks = [
    {
      name: 'Aqua Bullet',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 70,
      text: 'You may put an Energy attached to this Pokémon into your hand. If you do, this attack does 70 more damage.'
    }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public name: string = 'Inteleon VMAX';

  public fullName: string = 'Inteleon VMAX FST';

  public readonly DOUBLE_GUNNER_MARKER = 'DOUBLE_GUNNER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DOUBLE_GUNNER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.DOUBLE_GUNNER_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const energyCards = player.active.cards.filter(c => c instanceof EnergyCard);
          const cardList = new CardList();
          cardList.cards = energyCards;

          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_ENERGIES_TO_HAND,
            cardList,
            { superType: SuperType.ENERGY },
            { max: 1, allowCancel: false }
          ), energies => {
            effect.damage += 70;
            const cardsToHand = new CardsToHandEffect(effect, energies);
            cardsToHand.target = player.active;
            return store.reduceEffect(state, cardsToHand);
          });
        }

        return state;
      });
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard;
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.DOUBLE_GUNNER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 2, allowCancel: false },
        ), selected => {
          const targets = selected || [];
          targets.forEach(target => {
            target.damage += 20;
            player.marker.addMarker(this.DOUBLE_GUNNER_MARKER, this);
          });
        });
      });

    }
    return state;

  }
}
