import { render, screen } from '@testing-library/react';
import StatusChip from './StatusChip';

test('renders a configured status label', () => {
  render(<StatusChip status="DISPONIVEL" config={{ label: 'Disponível', color: 'success' }} />);
  expect(screen.getByText('Disponível')).toBeInTheDocument();
});

test('does not render without configuration', () => {
  const { container } = render(<StatusChip status="DESCONHECIDO" />);
  expect(container).toBeEmptyDOMElement();
});
