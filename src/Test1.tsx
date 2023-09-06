import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { useScreenConfigStore } from './stores/useScreenConfigStore';

export function Test1() {
  const [test, setTest] = useState('');
  const { screenWidth } = useScreenConfigStore();

  useEffect(() => {
    setTest('hi');
  }, []);

  return (
    <Div>
      {test}
      <div>{screenWidth}</div>
    </Div>
  );
}

const Div = styled.div`
  background: red;
`;
