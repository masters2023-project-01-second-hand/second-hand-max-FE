import { styled } from 'styled-components';
import { usePanelStore } from '../../stores/usePanelStore';
import { getElapsedSince } from '../../utils/getElapsedSince';
import { ChatRoom } from './ChatRoom';

export type ChattingItemType = {
  id: number;
  chatMember: {
    id: number;
    profileImageUrl: string;
    nickname: string;
  };
  recentMessage: string;
  unreadCount: number;
  updatedAt: Date;
  item: {
    id: number;
    thumbnailUrl: string;
  };
};

export function ChattingItem({
  id,
  chatMember,
  recentMessage,
  unreadCount,
  updatedAt,
  item,
}: ChattingItemType) {
  const { openPanel } = usePanelStore(state => ({
    openPanel: state.openPanel,
  }));

  const onClick = () => {
    openPanel(<ChatRoom chatRoomId={id} />);
  };

  return (
    <Container onClick={onClick}>
      <ImageWrapper>
        <ProfileImage src={chatMember.profileImageUrl} />
      </ImageWrapper>
      <ChatInfo>
        <NameAndTimestamp>
          <Name>{chatMember.nickname}</Name>
          <Timestamp>{getElapsedSince(updatedAt)}</Timestamp>
        </NameAndTimestamp>
        <RecentMessage>{recentMessage}</RecentMessage>
      </ChatInfo>
      {unreadCount > 0 && (
        <UnreadCount>
          <UnreadBadge>{unreadCount}</UnreadBadge>
        </UnreadCount>
      )}
      <ImageWrapper>
        <ProductImage src={item.thumbnailUrl} />
      </ImageWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 18px;
  border-bottom: 0.8px solid ${({ theme }) => theme.color.neutralBorder};
`;

const ImageWrapper = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50px;
`;

const ChatInfo = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  table-layout: fixed;
`;

const NameAndTimestamp = styled.div`
  width: 100%;
  display: flex;
  height: 24px;
  align-items: center;
  gap: 4px;
`;

const Name = styled.div`
  color: ${({ theme }) => theme.color.neutralTextStrong};
  font: ${({ theme }) => theme.font.displayStrong16};
`;

const Timestamp = styled.div`
  color: ${({ theme }) => theme.color.neutralTextWeak};
  font: ${({ theme }) => theme.font.displayDefault12};
`;

const RecentMessage = styled.div`
  width: 90%;
  color: ${({ theme }) => theme.color.neutralText};
  font: ${({ theme }) => theme.font.displayDefault12};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UnreadCount = styled.div`
  width: 20px;
  height: 100%;
`;

const UnreadBadge = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.color.accentPrimary};
  color: ${({ theme }) => theme.color.accentText};
  font: ${({ theme }) => theme.font.displayDefault12};
  border-radius: 50%;
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
`;
