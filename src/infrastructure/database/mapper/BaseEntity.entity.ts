export class BaseEntity {
  static defaultRandomId = () => 'gen_random_uuid()';
  constructor(arg: any = null) {
    if (arg) {
      Object.keys(arg).forEach((key) => {
        this[key] = arg[key];
      });
    }
  }
}
