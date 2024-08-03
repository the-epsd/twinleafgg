import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 120;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Vulpix';

  public attacks = [{
    name: 'Will-O-Wisp',
    cost: [CardType.FIRE],
    damage: 20,
    text: ''
  },
  {
    name: 'Nine-Tailed Dance',
    cost: [CardType.FIRE, CardType.FIRE],
    damage: 0,
    text: 'Put 9 damage counters on 1 of your opponent\'s Pokémon.During your next turn, this Pokémon can\'t attack.'
  }];

  public set = 'OBF';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name = 'Ninetales';
  public fullName = 'Ninetales OBF';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const putCountersEffect = new PutCountersEffect(effect, 90);
        putCountersEffect.target = targets[0];
        store.reduceEffect(state, putCountersEffect);

      });
    }

    return state;
  }
}