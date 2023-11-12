import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseVM<T> {
  @ApiProperty({
    description: 'Total count of elements in current query.',
  })
  total: number;

  @ApiProperty({
    description: 'Cursor pagination. Use this in find to get more results.',
  })
  cursor?: { [_ in keyof T]?: any };

  @ApiProperty({
    description: 'Results of the current query in the current page.',
  })
  results: T[];
}
