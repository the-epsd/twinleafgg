import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { PowerType, StoreLike, Card, State, GameError, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game/game-message';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class RadiantGreninja extends PokemonCard {

  public tags = [CardTag.RADIANT];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Concealed Cards',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard an Energy card from your hand in order ' +
      'to use this ability. Once during your turn, you may draw ' +
      '2 cards.'
  }];

  public attacks = [
    {
      name: 'Moonlight Shuriken',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 0,
      text: 'Discard 2 energy from this Pokémon. This attack does ' +
        '90 damage to 2 of your opponent\'s Pokémon. (Don\'t apply ' +
        'Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Radiant Greninja';

  public fullName: string = 'Radiant Greninja ASR';

  public readonly CONCEALED_CARDS_MARKER = 'CONCEALED_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.CONCEALED_CARDS_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.CONCEALED_CARDS_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard;
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.CONCEALED_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
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
        player.marker.addMarker(this.CONCEALED_CARDS_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 2);
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
      const max = Math.min(2);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 90);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }
    return state;
  }
}

