import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveDamagePrompt, DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';


export class RadiantAlakazam extends PokemonCard {

  public tags = [ CardTag.RADIANT ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 130;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Painful Spoons',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may move up to 2 damage ' +
      'counters from 1 of your opponent\'s Pokémon to another of ' +
      'their Pokémon.'
  }];

  public attacks = [{
    name: 'Shadow Punch',
    cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
    damage: 20,
    text: 'This attack does 20 damage for each card in your ' +
    'opponent\'s hand.'
  }];

  public set: string = 'SIT';

  public name: string = 'Radiant Alakazam';

  public fullName: string = 'Radiant Alakazam SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });
      
      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        maxAllowedDamage,
        { allowCancel: true }
      ), transfers => {
        if (transfers === null) {
          return;
        }
      
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 20) {
            source.damage -= 20;
            target.damage += 20;
          }
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      return state;
    }

    return state;
  }

}
