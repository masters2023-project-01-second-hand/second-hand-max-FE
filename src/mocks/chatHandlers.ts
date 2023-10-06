import { rest } from 'msw';
import { API_ENDPOINT } from '../api/endPoint';
import { ChatRoomType } from '../page/chat/ChatRoom';
import { ChattingItemType } from '../page/chat/ChattingItem';

export const chatHandlers = [
  rest.get(API_ENDPOINT.CHAT_ROOMS, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ chatRooms }));
  }),

  rest.get(`${API_ENDPOINT.CHAT_ROOMS}/:id`, (req, res, ctx) => {
    const { id } = req.params;

    return res(ctx.status(200), ctx.json(chatRoom[Number(id)]));
  }),

  rest.post(API_ENDPOINT.CHAT_ROOMS, (_, res, ctx) => {
    return res(ctx.status(201), ctx.json({ chatRoomId: 1 }));
  }),
];

const chatRooms: ChattingItemType[] = [
  {
    id: 0,
    chatMember: {
      id: 1,
      profileImageUrl: 'https://avatars.githubusercontent.com/u/97204689?v=4',
      nickname: '지안',
    },
    recentMessage:
      '안녕하세요! 한 가지 궁금한 점이 있어서 챗 드려요~~~~~~~~~~~~~~~~~',
    unreadCount: 1,
    updatedAt: new Date('2023-07-30T14:22:23'),
    item: {
      id: 1,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
  },
  {
    id: 1,
    chatMember: {
      id: 2,
      profileImageUrl: 'https://avatars.githubusercontent.com/u/76121068?v=4',
      nickname: 'fuze',
    },
    recentMessage: '애눌좀 해주세요',
    unreadCount: 3,
    updatedAt: new Date('2023-07-30T14:22:23'),
    item: {
      id: 2,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
  },
];

const chatRoom: ChatRoomType[] = [
  {
    item: {
      id: 1,
      title: '얼마 안 쓴 가방팝니다.',
      price: 169000,
      status: '판매중',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
    chatMember: {
      nickname: '지안',
    },
    messages: [
      {
        id: 124,
        isSent: false,
        content:
          '안녕하세요! 한 가지 궁금한 점이 있어서 챗 드려요~~~~~~~~~~~~~~~~~',
      },
    ],
    nextCursor: 1,
  },
  {
    item: {
      id: 1,
      title: '얼마 안 쓴 가방팝니다.',
      price: null,
      status: '판매중',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
    chatMember: {
      nickname: 'fuze',
    },
    messages: [
      {
        id: 124,
        isSent: false,
        content: '팔렸나요?',
      },
      {
        id: 125,
        isSent: true,
        content: '아니요 아직 안 팔렸습니다.',
      },
      {
        id: 126,
        isSent: true,
        content: '직거래로 구매 하시나요?',
      },
      {
        id: 127,
        isSent: false,
        content: '넵 직거래 하려고 합니다.',
      },
      {
        id: 128,
        isSent: false,
        content: '근데 조금 비싼거 같은데',
      },
      {
        id: 129,
        isSent: false,
        content: '애눌좀 해주세요',
      },
      {
        id: 130,
        isSent: false,
        content: '팔렸나요?',
      },
      {
        id: 131,
        isSent: true,
        content: '아니요 아직 안 팔렸습니다.',
      },
      {
        id: 132,
        isSent: true,
        content: '직거래로 구매 하시나요?',
      },
      {
        id: 133,
        isSent: false,
        content: '넵 직거래 하려고 합니다.',
      },
      {
        id: 134,
        isSent: false,
        content: '근데 조금 비싼거 같은데',
      },
      {
        id: 135,
        isSent: false,
        content: '애눌좀 해주세요',
      },
      {
        id: 136,
        isSent: false,
        content: '팔렸나요?',
      },
      {
        id: 137,
        isSent: true,
        content: '아니요 아직 안 팔렸습니다.',
      },
      {
        id: 138,
        isSent: true,
        content: '직거래로 구매 하시나요?',
      },
      {
        id: 139,
        isSent: false,
        content: '넵 직거래 하려고 합니다.',
      },
      {
        id: 140,
        isSent: false,
        content: '근데 조금 비싼거 같은데',
      },
      {
        id: 141,
        isSent: false,
        content: '애눌좀 해주세요',
      },
    ],
    nextCursor: 1,
  },
  {
    item: {
      id: 1,
      title: '얼마 안 쓴 가방팝니다.',
      price: 0,
      status: '판매중',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
    chatMember: {
      nickname: 'fuze',
    },
    messages: [
      {
        id: 124,
        isSent: false,
        content: '팔렸나요?',
      },
      {
        id: 125,
        isSent: true,
        content: '아니요 아직 안 팔렸습니다.',
      },
      {
        id: 126,
        isSent: true,
        content: '직거래로 구매 하시나요?',
      },
      {
        id: 127,
        isSent: false,
        content: '넵 직거래 하려고 합니다.',
      },
      {
        id: 128,
        isSent: false,
        content: '근데 조금 비싼거 같은데',
      },
      {
        id: 129,
        isSent: false,
        content: '애눌좀 해주세요',
      },
    ],
    nextCursor: 1,
  },
];
