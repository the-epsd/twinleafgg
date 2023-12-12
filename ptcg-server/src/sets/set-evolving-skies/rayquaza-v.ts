import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


export class RayquazaV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V, CardTag.RAPID_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 210;

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Dragon Pulse',
      cost: [ CardType.LIGHTNING ],
      damage: 40,
      text: 'Discard the top 2 cards of your deck.'
    },
    {
      name: 'Spiral Burst',
      cost: [CardType.FIRE, CardType.LIGHTNING ],
      damage: 20,
      text: 'You may discard up to 2 basic [R] Energy or up to 2 basic [L] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'EVS';

  public set2: string = 'evolvingskies';

  public setNumber: string = '110';

  public name: string = 'Rayquaza V';

  public fullName: string = 'Rayquaza V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
        
      // Discard 4 cards from your deck 
      player.deck.moveTo(player.discard, 2);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let pokemons = 0;
      let trainers = 0;
      const blocked: number[] = [];
      player.active.cards.forEach((c, index) => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Basic Fire Energy') {
          trainers += 1;
        } else if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Basic Lightning Energy') {
          pokemons += 1;
        } else {
          blocked.push(index);
        }
      });

      // We will discard this card after prompt confirmation
      // This will prevent unblocked supporter to appear in the discard pile
      effect.preventDefault = true;

      const maxPokemons = Math.min(pokemons, 2);
      const maxTrainers = Math.min(trainers, 2);
      const count = maxPokemons || maxTrainers;

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        player.active, // Card source is target Pokemon
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC  },
        { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers }
      ), selected => {
        const cards = selected || [];

        let totalDiscarded = 0;

        cards.forEach(target => {

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          totalDiscarded = discardEnergy.cards.length;
          store.reduceEffect(state, discardEnergy);

          effect.damage = (totalDiscarded * 80) + this.attacks[0].damage;

        });
        return state;
      });
    }
    return state;
  }
}