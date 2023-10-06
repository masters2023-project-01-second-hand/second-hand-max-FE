import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import {
  useGetItemDetails,
  useGetItemDetailsEdit,
  usePatchFavorite,
  usePatchStatus,
} from '../api/queries/useItemDetailsQuery';
import { useDeleteItem } from '../api/queries/useItemQuery';
import { Alert } from '../components/Alert';
import { Badge } from '../components/Badge';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loader } from '../components/Loader';
import { Button } from '../components/button/Button';
import { Dropdown } from '../components/dropdown/Dropdown';
import { MenuItem } from '../components/dropdown/MenuItem';
import { Icon } from '../components/icon/Icon';
import { Slider } from '../components/itemDetails/Slider';
import { usePanelStore } from '../stores/usePanelStore';
import { useProductEditorStore } from '../stores/useProductEditorStore';
import { useToastStore } from '../stores/useToastStore';
import { getElapsedSince } from '../utils/getElapsedSince';
import { priceToString } from '../utils/priceToString';
import { ChatRoom } from './chat/ChatRoom';
import { NewChatRoom } from './chat/NewChatRoom';

type DetailsStatus = '판매중' | '예약중' | '판매완료';

export type ItemDetailsData = {
  isSeller: boolean;
  images: { id: number; url: string }[];
  seller: string;
  status: { name: DetailsStatus; isSelected: boolean }[];
  title: string;
  categoryName: string;
  createdAt: Date;
  content: string;
  countData: {
    chat: number;
    favorite: number;
    view: number;
  };
  isFavorite: boolean;
  price: number;
  chatRoomId?: number;
};

export function ItemDetails() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [activeSlidePage, setActiveSlidePage] = useState(1);
  const [isScrollTop, setIsScrollTop] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = /Mobile|Android/i.test(navigator.userAgent);
    const eventName = isMobile ? 'touchmove' : 'wheel';

    window.addEventListener(eventName, onScroll);

    return () => {
      window.removeEventListener(eventName, onScroll);
    };
  }, []);

  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.redirectedFrom.pathname || '/';
  const openEditorPanel = useProductEditorStore(state => state.openPanel);
  const showToast = useToastStore(state => state.showToast);
  const openChatRoomPanel = usePanelStore(state => state.openPanel);

  const {
    data: itemDetailsEditData,
    isError: isErrorEdit,
    isLoading: isLoadingEdit,
    refetch: refetchEdit,
  } = useGetItemDetailsEdit(Number(itemId));

  const {
    data: itemDetailsData,
    isLoading,
    isError,
  } = useGetItemDetails(Number(itemId));

  const favoriteMutation = usePatchFavorite();
  const statusMutation = usePatchStatus();
  const deleteMutation = useDeleteItem('home');

  const onScroll = () => {
    const scrollTop = mainRef.current?.scrollTop === 0;
    setIsScrollTop(scrollTop);
  };

  const plusPageNum = () => {
    setActiveSlidePage(prev => prev + 1);
  };

  const minusPageNum = () => {
    setActiveSlidePage(prev => prev - 1);
  };

  const openEditPanel = () => {
    if (!itemDetailsEditData || isLoadingEdit) {
      showToast({
        mode: 'warning',
        message: '문제가 생겼습니다. 다시 시도해 주세요!',
      });
      return;
    } else if (isErrorEdit || !itemId) {
      showToast({
        mode: 'error',
        message: '에러 발생!',
      });
      return;
    }
    openEditorPanel({
      mode: 'edit',
      data: itemDetailsEditData,
      id: Number(itemId),
    });
  };

  const hoverToFetch = () => {
    if (!itemDetailsEditData && !isErrorEdit) {
      refetchEdit();
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper>
        <Error />
      </Wrapper>
    );
  }

  const toggleFavorites = () => {
    favoriteMutation.mutate({
      itemId: Number(itemId),
      isFavorite: !itemDetailsData.isFavorite,
    });
  };

  const editStatus = (statusName: DetailsStatus) => {
    const prevStatusName = itemDetailsData.status.find(item => item.isSelected)
      ?.name;
    if (prevStatusName === statusName) return;

    statusMutation.mutate({
      itemId: Number(itemId),
      statusName,
    });
  };

  const onClickDelete = () => {
    setIsAlertOpen(true);
  };

  const deleteItem = () => {
    deleteMutation.mutate(Number(itemId));
    navigate(from);
  };

  const getChatRooms = () => {
    if (itemDetailsData.countData.chat === 0) {
      showToast({
        mode: 'warning',
        message: '개설된 채팅방이 없습니다.',
      });
      return;
    }

    navigate('/chat', { state: { itemId: itemId } });
  };

  const moveToChatRoom = (chatroomId: number) => {
    openChatRoomPanel(<ChatRoom chatRoomId={chatroomId} />);
  };

  const createChatRoom = () => {
    const chatroomData = {
      item: {
        id: Number(itemId),
        title: itemDetailsData.title,
        price: itemDetailsData.price,
        status: itemDetailsData.status.find(item => item.isSelected)!.name,
        thumbnailUrl: itemDetailsData.images[0].url,
      },
      chatMember: {
        nickname: itemDetailsData.seller,
      },
    };

    openChatRoomPanel(<NewChatRoom chatroomData={chatroomData} />);
  };

  return (
    <Container>
      <Header
        type={isScrollTop ? 'transparent' : 'default'}
        leftButton={
          <Button styledType="text" onClick={() => navigate('/')}>
            <Icon name="chevronLeft" color="neutralText" />
            뒤로
          </Button>
        }
        rightButton={
          itemDetailsData.isSeller ? (
            <div onMouseOver={hoverToFetch}>
              <Dropdown iconName="dots" align="right">
                <MenuItem onAction={openEditPanel}>게시글 수정</MenuItem>
                <MenuItem color="systemWarning" onAction={onClickDelete}>
                  삭제
                </MenuItem>
              </Dropdown>
            </div>
          ) : undefined
        }
      />

      <Main ref={mainRef}>
        <SliderWrapper>
          <Slider
            imageList={itemDetailsData.images}
            pagination={{ plusPageNum, minusPageNum }}
          />
          <PageNav>
            <Badge
              fontColor="neutralTextWeak"
              badgeColor="neutralBackgroundBlur"
              text={`${activeSlidePage} / ${itemDetailsData.images.length}`}
              size="M"
              type="container"
            />
          </PageNav>
        </SliderWrapper>
        <Body>
          <SellerInfo>
            <Button color="neutralBackgroundWeak" align="space-between">
              <InfoText>판매자 정보</InfoText>
              <span>{itemDetailsData.seller}</span>
            </Button>
          </SellerInfo>
          {itemDetailsData.isSeller && (
            <Status>
              <Dropdown
                btnText={
                  itemDetailsData.status.find(item => item.isSelected)?.name
                }
                iconName="chevronDown"
              >
                {itemDetailsData.status.map((state, index) => {
                  return (
                    <MenuItem
                      key={index}
                      isSelected={state.isSelected}
                      onAction={() => editStatus(state.name)}
                    >
                      {state.name}
                    </MenuItem>
                  );
                })}
              </Dropdown>
            </Status>
          )}
          <Content>
            <ContentHeader>
              <Title>{itemDetailsData.title}</Title>
              <SubInfo>
                <CategoryInfo>{itemDetailsData.categoryName}</CategoryInfo>
                <span>{getElapsedSince(itemDetailsData.createdAt)}</span>
              </SubInfo>
            </ContentHeader>
            <ContentBody>{itemDetailsData.content}</ContentBody>
            <CountData>
              <span>채팅 {itemDetailsData.countData.chat}</span>
              <span>관심 {itemDetailsData.countData.favorite}</span>
              <span>조회 {itemDetailsData.countData.view}</span>
            </CountData>
          </Content>
        </Body>
      </Main>

      <Footer>
        <FooterLeft>
          <IconButton styledType="text" onClick={toggleFavorites}>
            <Icon
              name="heart"
              color={
                itemDetailsData.isFavorite
                  ? 'systemWarning'
                  : 'neutralTextStrong'
              }
            />
          </IconButton>
          <Price>{priceToString(itemDetailsData.price)}</Price>
        </FooterLeft>
        <div>
          <Button
            size="M"
            color="accentPrimary"
            fontColor="accentText"
            onClick={
              itemDetailsData.isSeller
                ? getChatRooms
                : itemDetailsData.chatRoomId === null
                ? createChatRoom
                : () => moveToChatRoom(itemDetailsData.chatRoomId!)
            }
          >
            {itemDetailsData.isSeller
              ? `대화 중인 채팅방 ${itemDetailsData.countData.chat}`
              : '채팅하기'}
          </Button>
        </div>
      </Footer>
      {isAlertOpen && (
        <Alert
          isOpen={isAlertOpen}
          onClose={() => {
            setIsAlertOpen(false);
          }}
          onAction={deleteItem}
        >
          게시글을 삭제하시겠습니까?
        </Alert>
      )}
    </Container>
  );
}

const Wrapper = styled.div`
  flex: 1;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  background-color: ${({ theme }) => theme.color.neutralBackground};
`;

const Main = styled.div`
  height: calc(100% - 64px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SliderWrapper = styled.div`
  width: 100%;
  height: 62%;
  position: relative;
`;

const PageNav = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const SellerInfo = styled.div`
  width: 361px;
`;

const InfoText = styled.span`
  font: ${({ theme }) => theme.font.displayDefault16};
`;

const Status = styled.div`
  width: 112px;
  border: 1px solid ${({ theme }) => theme.color.neutralBorder};
  border-radius: 8px;
  position: relative;

  button {
    width: 100%;
    height: 32px;
    padding: 0px 16px;
  }

  button > span {
    font: ${({ theme }) => theme.font.availableDefault12};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const ContentHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

const Title = styled.span`
  font: ${({ theme }) => theme.font.displayStrong20};
  color: ${({ theme }) => theme.color.neutralTextStrong};
`;

const SubInfo = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  font: ${({ theme }) => theme.font.displayDefault12};
  color: ${({ theme }) => theme.color.neutralTextWeak};
`;

const CategoryInfo = styled.span`
  &::after {
    content: '•';
    padding: 0 4px;
    font: ${({ theme }) => theme.font.displayDefault12};
    color: ${({ theme }) => theme.color.neutralTextWeak};
  }
`;

const ContentBody = styled.div`
  font: ${({ theme }) => theme.font.displayDefault16};
  color: ${({ theme }) => theme.color.neutralText};
`;

const CountData = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  font: ${({ theme }) => theme.font.displayDefault12};
  color: ${({ theme }) => theme.color.neutralTextWeak};
`;

const Footer = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-top: ${({ theme }) => `0.8px solid ${theme.color.neutralBorder}`};
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.color.neutralBackgroundWeak};
`;

const FooterLeft = styled.div`
  display: flex;
  height: 32px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled(Button)`
  padding: 0;
`;

const Price = styled.p`
  height: 28px;
  font: ${({ theme }) => theme.font.displayDefault16};
  color: ${({ theme }) => theme.color.neutralTextStrong};
`;
