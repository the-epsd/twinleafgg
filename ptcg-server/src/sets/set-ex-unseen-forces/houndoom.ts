import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, GameError, StateUtils } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { Card } from '../../game';
import { PlayItemEffect, AttachPokemonToolEffect, PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Houndoom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Houndour';
  public cardType: CardType = R;
  public hp: number = 70;
  public retreat = [C];
  public weakness = [{ type: W }];
  public powers = [{
    name: 'Lonesome',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have less Pokémon in play than your opponent, your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand.'
  }];
  public attacks = [
    {
      name: 'Tight Jaw',
      cost: [C, C],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Flamethrower',
      cost: [R, R, C],
      damage: 70,
      text: 'Discard a [R] Energy attached to Houndoom.'
    }
  ];
  public set: string = 'UF';
  public name: string = 'Houndoom';
  public fullName: string = 'Houndoom UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof PlayItemEffect || effect instanceof AttachPokemonToolEffect || effect instanceof PlayStadiumEffect) &&
      StateUtils.isPokemonInPlay(StateUtils.getOpponent(state, effect.player), this)) {
      const player = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.player !== opponent) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      // If owner has less Pokémon, block the trainer card
      if (playerBench < opponentBench) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.FIRE],
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
