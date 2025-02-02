import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { GameError, PutDamagePrompt } from '../..';

function* useLostMine(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    maxAllowedDamage.push({ target, damage: card.hp + 120 });
  });

  const damage = 120;

  if (player.lostzone.cards.length <= 9) {
    throw new GameError (GameMessage.CANNOT_USE_POWER);  
  }
  
  if (player.lostzone.cards.length >= 10) {

    return store.prompt(state, new PutDamagePrompt(
      effect.player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER,
      [ SlotType.ACTIVE, SlotType.BENCH ],
      damage,
      maxAllowedDamage,
      { allowCancel: false }
    ), targets => {
      const results = targets || [];
      for (const result of results) {
        const target = StateUtils.getTarget(state, player, result.target);
        const putCountersEffect = new PutCountersEffect(effect, result.damage);
        putCountersEffect.target = target;
        store.reduceEffect(state, putCountersEffect);
      }
    });
  }
}

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Scratch',
    cost: [ CardType.COLORLESS ],
    damage: 20,
    text: ''
  }, {
    name: 'Lost Mine',
    cost: [ CardType.PSYCHIC ],
    damage: 0,
    text: 'You can use this attack only if you have 10 or more cards in the Lost Zone. Put 12 damage counters on your opponent\'s Pokémon in any way you like.'
  }];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '70';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useLostMine(() => generator.next(), store, state, effect);
      return generator.next().value;
    }


    return state;
  }
}