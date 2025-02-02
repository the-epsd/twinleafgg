import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, SlotType,
  ChoosePokemonPrompt,
  ConfirmPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

// GRI Lycanroc-GX 74 (https://limitlesstcg.com/cards/GRI/74)
export class LycanrocGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rockruff';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 200;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Bloodthirsty Eyes',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Claw Slash',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 110,
      text: ''
    },

    {
      name: 'Dangerous Rogue-GX',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 50,
      gxAttack: true,
      text: 'This attack does 50 damage for each of your opponent\'s Benched Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'GRI';

  public name: string = 'Lycanroc-GX';

  public fullName: string = 'Lycanroc-GX GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bloodthirsty Eyes
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];

            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
              if (cardList.getPokemonCard() === this) {
                cardList.addBoardEffect(BoardEffect.ABILITY_USED);
              }
            });

            opponent.switchPokemon(cardList);
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage = 50 * benched;
    }
    return state;
  }
}