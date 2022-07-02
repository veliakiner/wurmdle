import { getGenRange, getMonsList } from './utils'
test('getGenRange to return generations between the provided values (inclusive)', () => {
  expect(getGenRange([1, 4])).toStrictEqual([1,2,3,4]);
});
test('returns 151 for the OG generation', () => {
  expect(getMonsList([1, 1])).toHaveLength(151);
});