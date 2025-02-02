import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameMessage } from '../../game/game-message';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';


export class Kilowattrel extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wattrel';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks = [
    {
      name: 'United Thunder',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 10 damage to 1 of your opponent\'s Benched Pokémon for each Pokémon in your discard pile that has the United Wings attack. (Don\'t apply Weakness and Resistance for Benched Pokémon.) '
    },
    {
      name: 'Speed Wing',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: ''
    }
  ];

  public set: string = 'PAF';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public name: string = 'Kilowattrel';

  public fullName: string = 'Kilowattrel PAF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'United Wings')) {
          pokemonCount += 1;
        }
      });

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, pokemonCount * 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
          return;
        });
      });
    }
    return state;
  }
}
