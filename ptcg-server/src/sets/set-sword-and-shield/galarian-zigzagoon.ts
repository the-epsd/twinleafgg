import {
  ChoosePokemonPrompt, CoinFlipPrompt, PlayerType,
  PowerType,
  SlotType,
  State,
  StateUtils,
  StoreLike
} from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class GalarianZigzagoon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Headbutt Tantrum',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may put 1 damage counter on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Surprise Attack',
      cost: [ CardType.DARK, CardType.COLORLESS ],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'SSH';

  public name: string = 'Galarian Zigzagoon';

  public fullName: string = 'Galarian Zigzagoon SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 10;
          store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, damage: 10, target: target.getPokemonCard()!.name, effect: this.powers[0].name });        
        });        
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
      ], heads => {
        if (heads) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }

}
