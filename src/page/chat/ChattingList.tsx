import { useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import { useGetChatRooms } from '../../api/queries/useChatQuery';
import { Error } from '../../components/Error';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { ChattingItem } from './ChattingItem';

export function ChattingList() {
  const location = useLocation();
  const itemId = location.state?.itemId;
  const { data, isLoading, isError } = useGetChatRooms(itemId);

  return (
    <Container>
      <Header title="채팅" />
      <Body>
        {isLoading ? (
          <Loader />
        ) : (
          data?.chatRooms.map((chat, index) => (
            <ChattingItem key={index} {...chat} />
          ))
        )}
        {isError && <Error message="채팅방 목록을 가져오지 못 했습니다." />}
      </Body>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const Body = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 56px;
  box-sizing: border-box;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.neutralBorderStrong};
    border-radius: 10px;
  }
`;
