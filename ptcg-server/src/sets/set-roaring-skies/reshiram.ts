import { AttachEnergyPrompt, Card, ChooseEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, Power, PowerType, SlotType, State, StateUtils, StoreLike, Weakness } from '../../game';
import { BoardEffect, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Reshiram extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.DRAGON;
  
  public weakness: Weakness[] = [{ type: CardType.FAIRY }];
  
  public hp: number = 130;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers: Power[] = [
    {
      name: 'Turboblaze',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may attach a [R] Energy card from your hand to 1 of your [N] Pokémon.'
    }
  ];
  
  public attacks = [
    {
      name: 'Bright Wing',
      cost: [CardType.FIRE, CardType.FIRE, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 110,
      text: 'Discard a [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'ROS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Reshiram';

  public fullName: string = 'Reshiram ROS';
  
  private readonly TURBOBLAZE_MARKER = 'TURBOBLAZE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.FIRE);
      });
      
      if (player.marker.hasMarker(this.TURBOBLAZE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, max: 1, min: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
        
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });
        
        player.marker.addMarker(this.TURBOBLAZE_MARKER, this);
        
        return state;
      });
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      
      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.FIRE ],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }

}
