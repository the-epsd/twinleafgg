import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, Card, GameError, GameMessage, ChooseCardsPrompt, TrainerCard, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class DarkraiVSTAR extends PokemonCard {

  public tags = [ CardTag.POKEMON_VSTAR ];

  public evolvesFrom = 'Darkrai V';

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public cardType: CardType = CardType.DARK;

  public hp: number = 270;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Star Abyss',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'During your turn, you may put up to 2 Item cards from your discard pile into your hand. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];
  
  public attacks = [
    {
      name: 'Dark Pulse',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'This attack does 30 more damage for each [D] Energy attached to all of your Pokémon.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '99';

  public name: string = 'Darkrai VSTAR';

  public fullName: string = 'Darkrai VSTAR ASR';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
  
      const hasItem = player.discard.cards.some(c => {
        return c instanceof TrainerCard && c.trainerType === TrainerType.ITEM;
      });
    
      if (!hasItem) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.marker.addMarker(this.VSTAR_MARKER, this);

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 1, max: 2, allowCancel: true }
      ), selected => {
        cards = selected || [];
      
        if (cards.length > 0) {
          player.discard.moveCardsTo(cards, player.hand);
        }
      });
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      let energies = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          if (energy.provides.includes(CardType.DARK)) {
            energies += 1;
          }
        });
      });
  
      effect.damage = 30 + energies * 30;
    }
  
    return state;
  }

}