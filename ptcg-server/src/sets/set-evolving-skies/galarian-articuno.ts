import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils,
  GameMessage, ConfirmPrompt, ChooseCardsPrompt, EnergyCard, GameError, ChoosePokemonPrompt, PlayerType, SlotType
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class GalarianArticuno extends PokemonCard {

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cruel Charge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may attach up to 2 [P] Energy cards from your hand to this Pokémon.'

  }];

  public attacks = [
    {
      name: 'Psylaser',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 0,
      text: 'Discard all [P] Energy from this Pokémon. This attack does 120 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Galarian Articuno';

  public fullName: string = 'Galarian Articuno EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof PlayPokemonEffect) && effect.pokemonCard === this) {


      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const hasEnergyInHand = player.hand.cards.some(c => {
            return c instanceof EnergyCard
              && c.energyType === EnergyType.BASIC
              && c.provides.includes(CardType.PSYCHIC);
          });
          if (!hasEnergyInHand) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }

          const cardList = StateUtils.findCardList(state, this);
          if (cardList === undefined) {
            return state;
          }


          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_ATTACH,
            player.hand,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
            { min: 0, max: 2, allowCancel: true }
          ), cards => {
            cards = cards || [];
            if (cards.length > 0) {
              player.hand.moveCardsTo(cards, cardList);
            }
          });
        }
      });

      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
        const cards = player.active.cards.filter(c => c instanceof EnergyCard);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;

        state = store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { max: 1, allowCancel: false }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          let damage = 0;
          targets[0].cards.forEach(c => {
            damage = 120;

          });
          const damageEffect = new PutDamageEffect(effect, damage);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        });
      }
    }
    return state;
  }
}