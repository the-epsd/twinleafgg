import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, PowerType, ChoosePrizePrompt, PlayerType, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import {CheckProvidedEnergyEffect} from '../../game/store/effects/check-effects';
import {ABILITY_USED} from '../../game/store/prefabs/prefabs';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class NaganadelGuzzlordGX extends PokemonCard {
  public tags = [CardTag.TAG_TEAM, CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 280;
  public weakness = [{ type: Y }];
  public retreat = [ C, C, C ];

  public powers = [{ 
    name: 'Violent Appetite',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may discard a Pokémon from your hand. If you do, heal 60 damage from this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Jet Pierce',
      cost: [ P, D, C ],
      damage: 180,
      text: ''
    },
    {
      name: 'Chaotic Order-GX',
      cost: [ C ],
      damage: 0,
      gxAttack: true,
      text: 'Turn all of your Prize cards face up. (Those Prize cards remain face up for the rest of the game.) If this Pokémon has at least 1 extra [P] Energy and 1 extra [D] Energy attached to it (in addition to this attack\'s cost), take 2 Prize cards. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '158';
  public name: string = 'Naganadel & Guzzlord-GX';
  public fullName: string = 'Naganadel & Guzzlord-GX CEC';

  public readonly VIOLENT_APPETITE_MARKER = 'VIOLENT_APPETITE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Violent Appetite
    if (effect instanceof PowerEffect && effect.power === this.powers[0]){
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this){
          if (card.marker.hasMarker(this.VIOLENT_APPETITE_MARKER, this)){
            throw new GameError(GameMessage.POWER_ALREADY_USED);
          }
          
          const hasPokemonInHand = player.hand.cards.some(b => b instanceof PokemonCard);
          if (!hasPokemonInHand){
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          };

          return store.prompt(state, new ChooseCardsPrompt( 
            player,
            GameMessage.CHOOSE_CARDS,
            player.hand,
            { superType: SuperType.POKEMON },
            { allowCancel: false, min: 1, max: 1 }
          ), cards => {
            player.hand.moveCardsTo(cards, player.discard);

            card.marker.addMarker(this.VIOLENT_APPETITE_MARKER, this);
            player.marker.addMarker(this.VIOLENT_APPETITE_MARKER, this);
            ABILITY_USED(player, card);

            const healing = new HealEffect(player, player.active, 60);
            store.reduceEffect(state, healing);
          });
        }
      })
    }

    // Chaotic Order-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.usedGX === true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }

      player.usedGX = true;
      
      player.prizes.forEach(p => {
        p.isPublic = true;
        p.faceUpPrize = true;
        p.isSecret = false;
      });

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [ P, D, C ];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) { return state; }  // If we don't have the extra energy, we just deal damage.

      return store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_PRIZE_CARD,
        { count: 2, allowCancel: false }
      ), prizes => {
        for (const prize of prizes){
          prize.moveTo(player.hand);
        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.VIOLENT_APPETITE_MARKER, this)){
      effect.player.marker.removeMarker(this.VIOLENT_APPETITE_MARKER, this);
      this.marker.removeMarker(this.VIOLENT_APPETITE_MARKER, this);
    }

    return state;
  }
}
