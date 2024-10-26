import { ECSComponent } from '../ECSComponent';

export class Matcher {
  types: Array<new () => ECSComponent>;

  constructor(types: Array<new () => ECSComponent>) {
    this.types = types;
  }
}
