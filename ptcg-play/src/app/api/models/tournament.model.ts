import { v4 as uuidv4 } from 'uuid';

export class Tournament {
  id: string;
  name: string;
  creator: string;
  startTime: Date;
  participants: string[];
  bracket: any; // This would be a more complex structure in practice
  status: 'pending' | 'active' | 'completed';

  constructor(name: string, creator: string, startTime: Date) {
    this.id = uuidv4();
    this.name = name;
    this.creator = creator;
    this.startTime = startTime;
    this.participants = [];
    this.bracket = null;
    this.status = 'pending';
  }
}