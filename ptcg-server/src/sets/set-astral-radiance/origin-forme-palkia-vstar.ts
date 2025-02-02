import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils,
  GameError, GameMessage, EnergyCard, PlayerType, SlotType,
  CardTarget
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';

export class OriginFormePalkiaVSTAR extends PokemonCard {

  public tags = [CardTag.POKEMON_VSTAR];

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Origin Forme Palkia V';

  public cardType: CardType = CardType.WATER;

  public hp: number = 280;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Star Portal',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may attach up to 3 W Energy cards from your discard pile to your W Pokémon in any way you like. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [
    {
      name: 'Subspace Swell',
      cost: [CardType.WATER, CardType.WATER],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each Benched ' +
        'Pokémon (both yours and your opponent\'s).'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Origin Forme Palkia VSTAR';

  public fullName: string = 'Origin Forme Palkia VSTAR ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.WATER);
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.cardType !== CardType.WATER) {
          blocked2.push(target);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: false, min: 1, max: 3, blockedTo: blocked2 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
          player.usedVSTAR = true;
        }
      });

      return state;
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = playerBenched + opponentBenched;

      effect.damage = 60 + totalBenched * 20;
    }
    return state;
  }

}

