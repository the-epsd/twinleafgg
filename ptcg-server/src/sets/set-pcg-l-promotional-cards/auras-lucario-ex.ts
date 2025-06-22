import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, TrainerCard, StateUtils, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlaySupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_HAS_SPECIAL_CONDITION, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class AurasLucarioex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.AURAS, CardTag.POKEMON_ex]
  public cardType: CardType = CardType.METAL;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Aura\'s Guidance',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, if Aura\'s Lucario ex is your Active Pokémon, you may use this Power. If your opponent used a Supporter card last turn, you may use the effect of that card as the effect of this Power(the Supporter card remains in your opponent\'s discard pile). This Power can\'t be used if Aura\'s Lucario ex is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Battle Blast',
    cost: [M, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Does 50 damage plus 10 more damage for each Fighting Energy attached to Aura\'s Lucario ex.'
  }];

  public set: string = 'PCGL';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aura\'s Lucario ex';
  public fullName: string = 'Aura\'s Lucario ex PCGL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlaySupporterEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (!opponent.supportersForDetour.cards.includes(effect.trainerCard)) {
        opponent.supportersForDetour.cards.push(effect.trainerCard);
      }
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.supportersForDetour.cards.length == 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_COPY_EFFECT,
        player.supportersForDetour,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        const trainerCard = cards[0] as TrainerCard;
        player.supporterTurn -= 1;
        const playTrainerEffect = new TrainerEffect(player, trainerCard);
        store.reduceEffect(state, playTrainerEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.provides.includes(CardType.FIGHTING) || em.provides.includes(CardType.ANY)) {
          energyCount += em.provides.length;
        }
      });

      for (let i = 0; i < energyCount; i++) {
        effect.damage += 10;
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.supportersForDetour.cards = [];
    }

    return state;
  }
} 