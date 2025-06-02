import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, GameMessage, CardTarget, PlayerType, SlotType, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsWobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Rocket Mirror',
      cost: [P, C],
      damage: 0,
      text: 'Move all damage counters from 1 of your Benched Team Rocket\'s Pokemon to your opponent\'s Active Pokemon.'
    },
    {
      name: 'Jet Headbutt',
      cost: [P, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Team Rocket\'s Wobbuffet';
  public fullName: string = 'Team Rocket\'s Wobbuffet DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rocket Mirror
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // checking for a damaged rockets pokemon on the bench
      const blockedTo: CardTarget[] = [];
      let isRocketDamaged = false;
      player.bench.forEach((cardList, index) => {
        if (cardList.cards.length > 0 && cardList.getPokemonCard()?.tags.includes(CardTag.TEAM_ROCKET) && cardList.damage > 0) {
          isRocketDamaged = true;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index
          };
          blockedTo.push(target);
        }
      });
      if (!isRocketDamaged) { return state; }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false, blocked: blockedTo }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageOnRocket = targets[0].damage;

        targets[0].damage = 0;
        effect.opponent.active.damage += damageOnRocket;
      });
    }

    return state;
  }
}
