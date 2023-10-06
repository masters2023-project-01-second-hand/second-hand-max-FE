import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChatRoomType } from '../../page/chat/ChatRoom';
import { ChattingItemType } from '../../page/chat/ChattingItem';
import { getChatRoom, getChatRooms } from '../fetchers/chatFetcher';

const CHAT_ROOMS_KEY = 'chatRooms';
const CHAT_ROOM_KEY = 'chatRoom';

type ChatRoomsDataType = {
  chatRooms: ChattingItemType[];
};

export const useGetChatRooms = (itemId?: number) => {
  return useQuery<ChatRoomsDataType>([CHAT_ROOMS_KEY], () =>
    getChatRooms(itemId)
  );
};

export const useGetChatRoom = (chatRoomId: number) => {
  return useInfiniteQuery<ChatRoomType>(
    [CHAT_ROOM_KEY],
    ({ pageParam }) => getChatRoom({ pageParam, chatRoomId }),
    {
      getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    }
  );
};

// export const useGetChatRoom = (chatRoomId: number) => {
//   return useQuery<ChatRoomType>([CHAT_ROOM_KEY], () => getChatRoom(chatRoomId));
// };
