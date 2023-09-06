import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Home } from '../page/home/Home';
import { designSystem } from '../styles/designSystem';
jest.useFakeTimers();
test('Renders main element', async () => {
  const { getByText } = render(
    <ThemeProvider theme={designSystem}>
      <Home />
    </ThemeProvider>
  );

  const textElement = getByText('hi');
  expect(textElement).toBeInTheDocument();
});
