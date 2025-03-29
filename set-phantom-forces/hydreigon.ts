import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils,
  GameError, GameMessage, EnergyCard, PlayerType, SlotType, ChooseEnergyPrompt,
  Card
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Hydreigon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Zweilous';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 140;
  public weakness = [{ type: CardType.FAIRY }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Dark Impulses',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before you attack) you may attack a [D] Energy card from your discard pile to your active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Crazy Headbutt',
      cost: [P, D, C, C],
      damage: 130,
      text: 'Discard an Energy attached to this Pokémon'
    }
  ];

  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Hydreigon';
  public fullName: string = 'Hydreigon PHF';
  public readonly DARKIMPULSE_MARKER = 'DARKIMPULSE_MARKER';

    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
          const player = effect.player;
          player.marker.removeMarker(this.DARKIMPULSE_MARKER, this);
      }
        
        if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
          const player = effect.player;

          
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.DARK);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.DARKIMPULSE_MARKER, this)) {
          throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        player.marker.addMarker(this.DARKIMPULSE_MARKER, this);
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
      
    }
    //Crazy Headbutt
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.COLORLESS ],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        return store.reduceEffect(state, discardEnergy);

        
      });
    }

    
        if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.DARKIMPULSE_MARKER, this)) {
              effect.player.marker.removeMarker(this.DARKIMPULSE_MARKER, this);
            
            }
        
            return state;
            
          }
        
        )
      return state;
      
    }
     
    return state;

    
}}

  

