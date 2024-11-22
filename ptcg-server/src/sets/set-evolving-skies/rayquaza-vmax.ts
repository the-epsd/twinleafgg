import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, PowerType, ChooseCardsPrompt, SelectPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


export class RayquazaVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE ];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Rayquaza V';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 320;

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Azure Pulse',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may discard your hand and draw 3 cards.'
  }];

  public attacks = [
    {
      name: 'Max Burst',
      cost: [CardType.FIRE, CardType.LIGHTNING ],
      damage: 20,
      text: 'You may discard any amount of basic [R] Energy or any amount of basic [L] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '111';

  public name: string = 'Rayquaza VMAX';

  public fullName: string = 'Rayquaza VMAX EVS';

  public readonly AZURE_PULSE_MARKER = 'AZURE_PULSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.AZURE_PULSE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
        
      const player = effect.player;

      if (player.marker.hasMarker(this.AZURE_PULSE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      player.hand.moveCardsTo(cards, player.discard);
      player.deck.moveTo(player.hand, 3);
      player.marker.addMarker(this.AZURE_PULSE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.AZURE_PULSE_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.ALL_FIRE_ENERGIES,
          action: () => {

            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.active,
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
              { min: 1, allowCancel: false }
            ), selected => {
              const cards = selected || [];
              if (cards.length > 0) {
    
                let totalDiscarded = 0; 
    
                const discardEnergy = new DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
    
                totalDiscarded += discardEnergy.cards.length;
                effect.damage = (totalDiscarded * 80) + 20;
                store.reduceEffect(state, discardEnergy);
              }
            });
          }
        },

        { 
          message: GameMessage.ALL_LIGHTNING_ENERGIES,
          action: () => {

            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.active,
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
              { min: 1, allowCancel: false }
            ), selected => {
              const cards = selected || [];
              if (cards.length > 0) {
    
                let totalDiscarded = 0; 
    
                const discardEnergy = new DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
    
                totalDiscarded += discardEnergy.cards.length;
                effect.damage = (totalDiscarded * 80) + 20;
                store.reduceEffect(state, discardEnergy);
              }
            });
          }
        }
      ];
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }
    return state;
  }
}