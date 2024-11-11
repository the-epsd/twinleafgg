import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, StateUtils, Card, ChooseEnergyPrompt, GameMessage } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Beedrill extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public tags = [CardTag.SINGLE_STRIKE];

  public evolvesFrom = 'Kakuna';

  public regulationMark = 'E';

  public cardType: CardType = CardType.GRASS;

  public hp = 130;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Persist Sting',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'If your opponent\'s Active Pokémon has any Special Energy attached, it is Knocked Out.'
    },
    {
      name: 'Jet Spear',
      cost: [CardType.GRASS],
      damage: 110,
      text: 'Discard an Energy from this Pokémon.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name: string = 'Beedrill';

  public fullName: string = 'Beedrill CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const pokemon = player.active;
      const opponent = StateUtils.getOpponent(state, player);

      const checkEnergy = new CheckProvidedEnergyEffect(opponent, pokemon);
      store.reduceEffect(state, checkEnergy);

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL) {

          const activePokemon = opponent.active.getPokemonCard();
          if (activePokemon) {
            activePokemon.hp = 0;
          }
        }
        if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
          const player = effect.player;

          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          state = store.reduceEffect(state, checkProvidedEnergy);

          return store.prompt(state, new ChooseEnergyPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            checkProvidedEnergy.energyMap,
            [CardType.COLORLESS],
            { allowCancel: false }
          ), energy => {
            const cards: Card[] = (energy || []).map(e => e.card);
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            return state;
          });
        }
        return state;
      });
      return state;
    }
    return state;
  }
}