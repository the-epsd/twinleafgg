import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsSneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [D],
      damage: 20,
      text: ''
    },
    {
      name: 'Backstab',
      cost: [D, D],
      damage: 0,
      text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon for each damage counter already on that Pokémon (Don\'t apply Weakness or Resistance for Benched Pokémon).'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '128';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Sneasel';
  public fullName: string = 'Team Rocket\'s Sneasel DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      const targets = opponent.bench.filter(b => b.cards.length > 0);
      if (targets.length === 0) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const target = selected[0];
        const damageEffect = new PutDamageEffect(effect, (target.damage * 2));
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
} 