import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, ChoosePokemonPrompt, CoinFlipPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Moltres extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 80;

  public weakness = [];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Dry Up',
      cost: [R, R],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokémon and flip a coin until you get tails. For each heads, discard 1 Water Energy card attached to that Pokémon, if any.'
    },
    {
      name: 'Fire Wing',
      cost: [R, R, R, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'VS2';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Moltres';

  public fullName: string = 'Moltres VS2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let numFlips = 0;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          numFlips++;
          return this.reduceEffect(store, state, effect);
        }

        if (numFlips === 0) {
          return state;
        }

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), targets => {
          targets.forEach(target => {

            return store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
              target, // Card source is target Pokemon
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
              { min: 0, max: numFlips, allowCancel: false }
            ), selected => {
              const cards = selected || [];
              if (cards.length > 0) {

                targets.forEach(target => {

                  const discardEnergy = new DiscardCardsEffect(effect, cards);
                  discardEnergy.target = target;
                  store.reduceEffect(state, discardEnergy);
                });
              }
              return state;
            });
          });
        });
      });
      return state;
    }
    return state;
  }
}