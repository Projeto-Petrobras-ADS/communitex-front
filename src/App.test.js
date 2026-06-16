import theme from './theme';

test('uses the Communitex CRUD design system', () => {
  expect(theme.palette.primary.main).toBe('#2563a9');
  expect(theme.palette.background.default).toBe('#f4f6f8');
  expect(theme.shape.borderRadius).toBe(8);
});
