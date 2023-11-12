export class PageOptions {
  constructor(readonly page: number, readonly take: number) {}

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

export class PageMeta {
  readonly page: number;
  readonly take: number;
  readonly itemsCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ page, take }: PageOptions, itemsCount: number) {
    this.page = page;
    this.take = take;
    this.itemsCount = itemsCount;
    this.pageCount = Math.ceil(this.itemsCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class Page<T> {
  constructor(readonly data: T[], readonly meta: PageMeta) {}
}
