import { Client } from '@stomp/stompjs';
import { useCallback, useState } from 'react';
import { WS_BASE_URL } from '../api/axios';
import { MessageType } from '../page/chat/ChatRoom';
import { useAuthStore } from '../stores/useAuthStore';

type ResData = {
  id: number;
  nickname: string;
  content: string;
};

export const useStomp = (onMessage: (message: MessageType) => void) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { accessToken, nickname } = useAuthStore();

  const connectWS = useCallback(
    (chatRoomId: number) => {
      return new Promise<void>((resolve, reject) => {
        const client = new Client({
          brokerURL: `${WS_BASE_URL}/api/ws`,
          onConnect: () => {
            client.subscribe(`/sub/chatrooms/${chatRoomId}`, message => {
              const data: ResData = JSON.parse(message.body);
              onMessage({
                id: data.id,
                content: data.content,
                isSent: nickname === data.nickname,
              });
            });
            resolve();
          },

          connectHeaders: {
            Authorization: accessToken,
          },
        });

        client.activate();
        setStompClient(client);
      });
    },
    [onMessage, nickname, accessToken]
  );

  const closeWS = useCallback(() => {
    if (stompClient) {
      stompClient.deactivate();
    }
  }, [stompClient]);

  const sendMessage = useCallback(
    (message: string, chatroomId: number) => {
      if (stompClient) {
        stompClient.publish({
          destination: `/pub/chatrooms/${chatroomId}`,
          body: JSON.stringify({ nickname, content: message }),
        });
      }
    },
    [nickname, stompClient]
  );

  return { connectWS, closeWS, sendMessage, stompClient };
};
