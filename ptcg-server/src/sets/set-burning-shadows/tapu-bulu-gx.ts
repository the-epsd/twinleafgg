import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ConfirmPrompt, Card, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

// BUS Tapu Bulu-GX 130 (https://limitlesstcg.com/cards/BUS/130)
export class TapuBuluGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 180;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Horn Attack',
      cost: [CardType.GRASS],
      damage: 30,
      text: ''
    },
    {
      name: 'Nature\'s Judgement',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 120,
      text: 'You may discard all Energy from this Pokémon. If you do, this attack does 60 more damage.'
    },
    {
      name: 'Tapu Wilderness-GX',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 150,
      text: 'Heal all damage from this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'BUS';

  public setNumber = '130';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Tapu Bulu-GX';

  public fullName: string = 'Tapu Bulu-GX BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jet Punch
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          state = store.reduceEffect(state, checkProvidedEnergy);

          const cards: Card[] = [];
          checkProvidedEnergy.energyMap.forEach(em => {
            cards.push(em.card);
          });

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          effect.damage += 60;
        }
      });
    }

    // Absorption GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const healTargetEffect = new HealTargetEffect(effect, 990);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }

    return state;
  }
}