import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { createChatRoom } from '../../api/fetchers/chatFetcher';
import { Header } from '../../components/Header';
import { Button } from '../../components/button/Button';
import { Icon } from '../../components/icon/Icon';
import { useInput } from '../../hooks/useInput';
import { useStomp } from '../../hooks/useWebSocket';
import { usePanelStore } from '../../stores/usePanelStore';
import { priceToString } from '../../utils/priceToString';
import { MessageType } from './ChatRoom';
import { Message } from './Message';

type NewChatRoomDataProps = {
  item: {
    id: number;
    title: string;
    price: number | null;
    status: string;
    thumbnailUrl: string;
  };
  chatMember: {
    nickname: string;
  };
};

export function NewChatRoom({
  chatroomData,
}: {
  chatroomData: NewChatRoomDataProps;
}) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatroomId, setChatroomId] = useState<number>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { closePanel } = usePanelStore();
  const message = useInput('');

  const onMessage = useCallback((message: MessageType) => {
    setMessages(prev => [
      ...(prev || []),
      { id: message.id, isSent: message.isSent, content: message.content },
    ]);
  }, []);

  const { connectWS, closeWS, sendMessage, stompClient } = useStomp(onMessage);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const createWebSocket = async () => {
    try {
      // 채팅방 생성 요청
      const { chatRoomId } = await createChatRoom(chatroomData.item.id);

      await connectWS(chatRoomId);

      if (message.value === undefined) return;

      sendMessage(message.value, chatRoomId);
      setChatroomId(chatRoomId);
    } catch (error) {
      console.error('채팅방 생성 요청 중 오류 발생:', error);
    }
  };

  const onSend = async () => {
    if (!message.value) return;

    if (!stompClient) {
      await createWebSocket();
      return;
    }

    if (!chatroomId) return;
    sendMessage(message.value, chatroomId);
    message.clearValue();
  };

  const onClose = () => {
    closePanel();
    closeWS();
  };

  const onKeydownEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSend();
    }
  };

  return (
    <Container>
      <Header
        leftButton={
          <Button styledType="text" onClick={onClose}>
            <Icon name="chevronLeft" color="neutralTextStrong" />
            <span>뒤로</span>
          </Button>
        }
        title={chatroomData?.chatMember.nickname}
      />
      <Body>
        <ProductInfoBanner>
          <ProductImage src={chatroomData?.item.thumbnailUrl} />
          <div>
            <Title>{chatroomData?.item.title}</Title>
            <Price>{priceToString(chatroomData?.item.price)}</Price>
          </div>
        </ProductInfoBanner>
        <Messages ref={messagesEndRef}>
          {messages?.map((message, index) => (
            <Message
              key={index}
              content={message.content}
              isSent={message.isSent}
            />
          ))}
        </Messages>
        <ChatBar>
          <StyledInput
            placeholder="내용을 입력하세요"
            onKeyUp={onKeydownEnter}
            onChange={message.onChange}
            value={message.value}
          />
          <Button
            size="M"
            styledType="circle"
            color="accentPrimary"
            onClick={onSend}
          >
            <Icon size={16} name="send" color="accentText" />
          </Button>
        </ChatBar>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-top: 56px;
`;

const ProductInfoBanner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 8px;
  border-bottom: 0.8px solid ${({ theme }) => theme.color.neutralBorder};
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  color: ${({ theme }) => theme.color.neutralTextStrong};
  font: ${({ theme }) => theme.font.displayDefault16};
`;

const Price = styled.div`
  align-self: stretch;
  color: ${({ theme }) => theme.color.neutralTextStrong};
  font: ${({ theme }) => theme.font.displayStrong16};
`;

const Messages = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 12px 16px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.neutralBorderStrong};
    border-radius: 10px;
  }
`;

const ChatBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 16px;
  gap: 10px;
  border-top: 1px solid ${({ theme }) => theme.color.neutralBorder};
  background: ${({ theme }) => theme.color.neutralBackgroundWeak};
`;

const StyledInput = styled.input`
  min-height: 32px;
  max-height: 104px;
  display: flex;
  align-items: flex-end;
  flex: 1;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  background: ${({ theme }) => theme.color.neutralBackground};
  color: ${({ theme }) => theme.color.neutralTextWeak};
  font: ${({ theme }) => theme.font.availableDefault16};
`;
