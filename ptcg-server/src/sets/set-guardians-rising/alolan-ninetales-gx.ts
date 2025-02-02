import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { ChooseEnergyPrompt } from '../../game';
import { StoreLike, State, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, EnergyCard, Card } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

// GRI Alolan Ninetales-GX 22 (https://limitlesstcg.com/cards/GRI/22)
export class AlolanNinetalesGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.BASIC;
  public evolvesFrom = 'Alolan Vulpix';
  public cardType: CardType = CardType.WATER;
  public hp: number = 210;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    {
      name: 'Ice Blade',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },

    {
      name: 'Blizzard Edge',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 160,
      text: 'Discard 2 Energy from this Pokémon.'
    },

    {
      name: 'Ice Path-GX',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Move all damage counters from this Pokémon to your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];
  public set: string = 'GRI';
  public name: string = 'Alolan Ninetales-GX';
  public fullName: string = 'Alolan Ninetales-GX GRI';
  public setNumber = '22';
  public cardImage = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ice Blade
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 50);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Blizzard Edge
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
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    // Ice Path-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      /*      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true; */

      opponent.active.damage += player.active.damage;
      player.active.damage = 0;
    }
    return state;
  }
} 