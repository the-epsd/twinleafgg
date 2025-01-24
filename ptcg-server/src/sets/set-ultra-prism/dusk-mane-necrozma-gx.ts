import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, Card } from '../../game';
import { StateUtils } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

// UPR Dusk Mane Necrozma-GX 90 (https://limitlesstcg.com/cards/UPR/90)
export class DuskManeNecrozmaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Claw Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    },
    {
      name: 'Meteor Tempest',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 220,
      text: 'Discard 3 Energy from this Pokémon.'
    },
    {
      name: 'Sun\'s Eclipse-GX',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL],
      damage: 250,
      text: 'You can use this attack only if you have more Prize cards remaining than your opponent. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'UPR';

  public setNumber = '90';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Dusk Mane Necrozma-GX';

  public fullName: string = 'Dusk Mane Necrozma-GX UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Meteor Tempest
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    // Sun's Eclipse-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;
    }

    return state;
  }
}