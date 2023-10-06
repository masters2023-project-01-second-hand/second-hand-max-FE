import { rest } from 'msw';
import { API_ENDPOINT } from '../api/endPoint';

type PatchFavoriteRequestBody = {
  isFavorite: boolean;
};

type PatchStatusRequestBody = {
  statusName: '판매중' | '예약중' | '판매완료';
};

export const itemDetailsHandlers = [
  rest.get(`${API_ENDPOINT.ITEMS}/:itemId`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(ItemDetailsData));
  }),

  rest.patch<PatchFavoriteRequestBody>(
    `${API_ENDPOINT.ITEMS}/:itemId/favorites`,
    (req, res, ctx) => {
      ItemDetailsData = {
        ...ItemDetailsData,
        isFavorite: req.body.isFavorite,
      };

      return res(
        ctx.status(200),
        ctx.json({ isFavorite: req.body.isFavorite })
      );
    }
  ),

  rest.patch<PatchStatusRequestBody>(
    `${API_ENDPOINT.ITEMS}/:itemId/status`,
    (req, res, ctx) => {
      const statusName = req.body.statusName;

      ItemDetailsData = {
        ...ItemDetailsData,
        status: ItemDetailsData.status.map(status => {
          return {
            ...status,
            isSelected: status.name === statusName,
          };
        }),
      };

      return res(ctx.status(200), ctx.json({ statusName }));
    }
  ),

  rest.get(`${API_ENDPOINT.ITEMS}/:itemId/edit`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(itemDetailsEditData));
  }),
];

let ItemDetailsData = {
  isSeller: true,
  images: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1591534577302-1696205bb2bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
  ],
  seller: 'fusefuse',
  status: [
    { name: '판매중', isSelected: true },
    { name: '예약중', isSelected: false },
    { name: '판매완료', isSelected: false },
  ],
  title: '얼마 안 쓴 가방팝니다.',
  categoryName: '남성패션/잡화',
  createdAt: '2023-07-14T23:05:33',
  content:
    '안녕하세요! 저는 중고 백팩을 판매하고 있습니다. 이 백팩은 특별한 이야기가 담겨 있어요. 몇 년 전, 이 백팩은 제게 가장 믿음직한 친구처럼 함께 여행하고 모험을 나누었습니다. 이 백팩과 함께 저는 국내외 다양한 여행을 떠나며 산과 바다, 도시와 숲을 넘나들었습니다. 이 백팩은 언제나 편안하고 믿음직스러웠죠. 하지만 지금은 새로운 모험을 찾아 떠나야 할 때입니다. 그래서 제 친구인 이 백팩을 새로운 주인을 찾고자 합니다. 이 백팩은 여행의 기억과 함께 다른 사람의 모험을 돕기 위해 준비되어 있습니다.',
  countData: {
    chat: 0,
    favorite: 3,
    view: 5,
  },
  isFavorite: false,
  price: 99000,
};

const itemDetailsEditData = {
  images: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1591534577302-1696205bb2bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    },
  ],
  title: '얼마 안 쓴 가방팝니다.',
  categories: [
    {
      id: 9,
      name: '남성패션/잡화',
      isSelected: true,
    },
    {
      id: 8,
      name: '여성잡화',
      isSelected: false,
    },
    {
      id: 7,
      name: '여성의류',
      isSelected: false,
    },
  ],
  content:
    '안녕하세요! 저는 중고 백팩을 판매하고 있습니다. 이 백팩은 특별한 이야기가 담겨 있어요. 몇 년 전, 이 백팩은 제게 가장 믿음직한 친구처럼 함께 여행하고 모험을 나누었습니다. 이 백팩과 함께 저는 국내외 다양한 여행을 떠나며 산과 바다, 도시와 숲을 넘나들었습니다. 이 백팩은 언제나 편안하고 믿음직스러웠죠. 하지만 지금은 새로운 모험을 찾아 떠나야 할 때입니다. 그래서 제 친구인 이 백팩을 새로운 주인을 찾고자 합니다. 이 백팩은 여행의 기억과 함께 다른 사람의 모험을 돕기 위해 준비되어 있습니다.',
  price: 99000,
  locations: [
    {
      id: 1,
      name: '서울 강남구 역삼1동',
      isSelected: true,
    },
    {
      id: 2,
      name: '서울 강남구 역삼2동',
      isSelected: false,
    },
  ],
};
