import { getGenRange, getMonsList } from './utils';

test('getGenRange to return generations between the provided values (inclusive)', () => {
  expect(getGenRange([1, 4])).toStrictEqual([1, 2, 3, 4]);
});
test('returns 151 for the OG generation', () => {
  expect(getMonsList([1, 1])).toHaveLength(151);
});
test('returns 81 for the fully-evolved OG generation', () => {
  expect(getMonsList([1, 1], true)).toHaveLength(81);
});
test('Onix should be fully evolved in gen 1 only', () => {
  expect(getMonsList([1, 1], true)).toContain('Onix');
});
test('Onix should not be fully evolved in gens 1 to 2', () => {
  expect(getMonsList([1, 2], true)).not.toContain('Onix');
});
