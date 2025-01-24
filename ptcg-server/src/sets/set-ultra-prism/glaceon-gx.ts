import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, PlayerType, SlotType, GameError, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';

export class GlaceonGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = CardType.WATER;

  public hp: number = 200;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Freezing Gaze',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Pokémon-GX and Pokémon-EX in play, in their hand, and in their discard pile have no Abilities, except for Freezing Gaze.'
  }];

  public attacks = [
    {
      name: 'Frost Spear',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },

    {
      name: 'Polar Spear-GX',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'This attack does 50 damage for each damage counter on your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'UPR';

  public setNumber = '39';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Glaceon-GX';

  public fullName: string = 'Glaceon-GX UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Freezing Gaze
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Freezing Gaze') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // checking if this is the active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // checking if the effect is one you own
      let doesPlayerOwn = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          doesPlayerOwn = true;
        }
      });
      if (doesPlayerOwn) {
        return state;
      }

      if (effect.card.tags.includes(CardTag.POKEMON_GX) || effect.card.tags.includes(CardTag.POKEMON_EX)) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Frost Spear
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Polar Spear-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const opponent = StateUtils.getOpponent(state, player);

      effect.damage = 5 * opponent.active.damage;
    }

    return state;
  }
}