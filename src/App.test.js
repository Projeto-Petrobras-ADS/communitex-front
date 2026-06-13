import theme from './theme';

test('uses the Communitex sustainable design system', () => {
  expect(theme.palette.primary.main).toBe('#176b68');
  expect(theme.palette.background.default).toBe('#f7f3ea');
  expect(theme.shape.borderRadius).toBe(12);
});
