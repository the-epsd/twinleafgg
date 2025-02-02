import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { Card, EnergyCard } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';


export class ShiningLugia extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Argent Wing',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'If your opponent\'s Active Pokémon has an Ability, this attack does 60 more damage. '
  }, {
    name: 'Aero Force',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 130,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'SMP';

  public setNumber = 'SM82';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Shining Lugia';

  public fullName: string = 'Shining Lugia SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const target = opponent.active.getPokemonCard();

      if (target !== undefined && target.powers.length > 0)
        if (!IS_ABILITY_BLOCKED(store, state, player, target))
          effect.damage += 60;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (!player.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
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
      });

    }

    return state;
  }

}
