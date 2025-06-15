
import { Copycat } from "../set-ex-dragon-frontiers/copycat";
import { ProfessorElmsTrainingMethod } from "../set-ex-unseen-forces/professors-elm-training-method";
import { ProfessorOaksResearch } from "../set-ex-dragon-frontiers/professor-oaks-research";

export class CopycatEX extends Copycat {
  public fullName = 'Copycat EX';
  public set = 'EX';
  public setNumber = '138';
  public text = 'Shuffle your hand into your deck. Then, count the number of cards in your opponent\'s hand and draw that many cards.';
}

export class ProfessorElmsTrainingMethodEX extends ProfessorElmsTrainingMethod {
  public fullName = 'Professor Elm\'s Training Method EX';
  public set = 'EX';
  public setNumber = '148';
  public text = 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
}

export class ProfessorOaksResearchEX extends ProfessorOaksResearch {
  public fullName = 'Professor Oak\'s Research EX';
  public set = 'EX';
  public setNumber = '149';
  public text = 'Shuffle your hand into your deck, then draw 5 cards.'
}