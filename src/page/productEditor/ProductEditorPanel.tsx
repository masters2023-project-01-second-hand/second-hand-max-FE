import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { addItems, editItems } from '../../api/fetchers/itemFetcher';
import {
  useGetRecommendCategoryData,
  useResetRecommendCategory,
} from '../../api/queries/useItemQuery';
import { useGetUserLocation } from '../../api/queries/useLocationQuery';
import { Header } from '../../components/Header';
import { Button } from '../../components/button/Button';
import { useInput } from '../../hooks/useInput';
import { useProductEditorStore } from '../../stores/useProductEditorStore';
import { useScreenConfigStore } from '../../stores/useScreenConfigStore';
import { CategoryContainer } from './CategoryContainer';
import { CategorySelectModal } from './CategorySelectModal';
import { EditorLocationDropdown } from './EditorLocationDropdown';
import { PictureContainer } from './PictureContainer';
import { ProductContent } from './ProductContent';
export const PICTURE_MAX_LENGTH = 10;

export type PictureListType = { id: number; url: string };

export type CategoryData = {
  categories: CategoryItem[];
};

type CategoryItem = {
  id: number;
  name: string;
};

type UserLocation = {
  id: number;
  name: string;
  isSelected: boolean;
};

export function ProductEditorPanel() {
  const navigate = useNavigate();
  const { screenWidth } = useScreenConfigStore();
  const { isOpen, productId, editorMode, productData, closePanel } =
    useProductEditorStore(state => ({
      editorMode: state.editorMode,
      isOpen: state.isOpen,
      productId: state.productId,
      productData: state.productData,
      closePanel: state.closePanel,
    }));

  const { data: userLocationData } = useGetUserLocation();
  const resetRecommendCategory = useResetRecommendCategory();

  const isEdit = editorMode === 'edit';
  const isError = isEdit && (!productData || !productId);

  const [pictureList, setPictureList] = useState<PictureListType[]>(
    productData ? productData.images : []
  );
  const [uploadPictureList, setUploadPictureList] = useState<File[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [recommendCategory, setRecommendCategory] = useState<CategoryData>();
  const [rightPosition, setRightPosition] = useState(-screenWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePictureId, setDeletePictureId] = useState<number[]>([]);
  const [locationData, setLocationData] = useState<UserLocation[]>([]);
  const [selectedUserLocation, setSelectedUserLocation] =
    useState<UserLocation>();

  const title = useInput(isEdit ? productData!.title : '');
  const price = useInput(isEdit ? productData!.price : '');
  const content = useInput(isEdit ? productData!.content : '');

  const { data: recommendCategoryData, refetch } = useGetRecommendCategoryData(
    title.value ?? ''
  );

  const isChanged =
    productData?.title !== title.value ||
    productData?.content !== content.value ||
    productData?.price !== price.value ||
    selectedCategoryId !==
      productData?.categories.filter(data => data.isSelected === true)[0].id ||
    selectedUserLocation?.id !==
      productData?.locations.filter(location => location.isSelected)[0].id ||
    uploadPictureList.length > 0 ||
    deletePictureId.length > 0;

  const isEmpty =
    pictureList.length + uploadPictureList.length === 0 ||
    selectedCategoryId === undefined ||
    selectedUserLocation === undefined ||
    title.value === '' ||
    content.value === '' ||
    userLocationData === undefined;

  const isSubmitDisabled = isEdit ? !isChanged || isEmpty : isEmpty;

  useEffect(() => {
    setRightPosition(isOpen ? 0 : -screenWidth);
  }, [isOpen, screenWidth]);

  useEffect(() => {
    if (!productData) {
      if (!userLocationData) return;
      setLocationData(userLocationData?.locations);
      setSelectedUserLocation(
        userLocationData?.locations.filter(location => location.isSelected)[0]
      );
      return;
    }

    const recommendCategory = {
      categories: productData.categories.map(({ id, name }) => ({
        id,
        name,
      })),
    };
    const selectedCategoryId = productData.categories.find(
      category => category.isSelected
    )?.id;

    setRecommendCategory(recommendCategory);
    setSelectedCategoryId(selectedCategoryId);
    setLocationData(productData?.locations);
  }, [productData, isEdit, userLocationData]);

  useEffect(() => {
    if (!recommendCategoryData) return;

    setSelectedCategoryId(recommendCategoryData.categories[0].id);
    setRecommendCategory(recommendCategoryData);

    return () => {
      resetRecommendCategory();
    };
  }, [recommendCategoryData, resetRecommendCategory]);

  useEffect(() => {
    const changedTitle =
      editorMode === 'add'
        ? title.value !== ''
        : title.value !== productData?.title;

    const handler = setTimeout(() => {
      if (changedTitle && title.value !== '') {
        refetch();
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [editorMode, title.value, productData, refetch]);

  const selectLocation = (selectedLocationId: number) => {
    const currentUserLocation = locationData?.filter(
      location => location.id === selectedLocationId
    )[0];

    setSelectedUserLocation(currentUserLocation);
    setLocationData(prev =>
      prev.map(location => {
        return { ...location, isSelected: location.id === selectedLocationId };
      })
    );
  };

  const addPicture = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (!fileList?.length) return;

    const totalPictureLength = pictureList.length + uploadPictureList.length;
    const validFiles: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file && file.type.startsWith('image/')) {
        if (totalPictureLength + validFiles.length < PICTURE_MAX_LENGTH) {
          validFiles.push(file);
        } else {
          alert('최대 업로드 수를 초과하였습니다.');
          break;
        }
      } else {
        alert('이미지 파일만 업로드 가능합니다.');
        break;
      }
    }

    if (validFiles.length) {
      setUploadPictureList(prev => [...prev, ...validFiles]);
    }

    event.target.value = '';
  };

  const deletePicture = (pictureData: File | PictureListType) => {
    if (pictureData instanceof File) {
      setUploadPictureList(prev =>
        prev.filter(picture => picture !== pictureData)
      );
    } else {
      setDeletePictureId(prev => [...prev, pictureData.id]);
      setPictureList(prev => prev.filter(picture => picture !== pictureData));
    }
  };

  const setPriceFormat = (price: string | null | undefined) => {
    if (price === '' || price === undefined || price === null) {
      return '';
    } else {
      return new Intl.NumberFormat('ko-KR').format(
        Number(price.toString().replaceAll(',', ''))
      );
    }
  };

  const setCategoryId = (id?: number) => {
    setSelectedCategoryId(id);
  };

  const selectCategory = (id: number, name: string) => {
    setCategoryId(id);
    setRecommendCategory(prev => {
      if (!prev) return;

      const categories = prev.categories;
      const isOwned = categories.some(category => category.id === id);

      if (isOwned) return prev;

      const otherCategory = categories.filter(category => {
        return category.id !== selectedCategoryId;
      });

      const newCategory: CategoryData = {
        categories: [{ id, name }, ...otherCategory],
      };

      return newCategory;
    });
  };

  const onChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replaceAll(',', '');

    if (!/^\d*$/.test(value)) return;

    price.onChange(event);
  };

  const onTransitionEndHandler = () => {
    rightPosition !== 0 && closePanel();
  };

  const onClosePanel = () => {
    setRightPosition(-screenWidth);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const submit = async () => {
    const formData = new FormData();
    const convertedPrice = Number(price.value?.toString().replaceAll(',', ''));
    const item = {
      title: title.value,
      categoryId: selectedCategoryId,
      price: price.value === '' ? null : convertedPrice,
      content: content.value,
      myLocationId: selectedUserLocation?.id,
    };

    formData.append(
      'item',
      new Blob([JSON.stringify(item)], { type: 'application/json' }),
      'item'
    );

    uploadPictureList.forEach(file => {
      formData.append(isEdit ? 'newImageFiles' : 'imageFiles', file);
    });

    if (isEdit) {
      const blob = new Blob([JSON.stringify(deletePictureId)], {
        type: 'application/json',
      });
      formData.append('deleteImageIds', blob);
    }

    if (isEdit && !isError) {
      const res = await editItems(formData, productId!);

      if (res.status === 201) {
        onClosePanel();
        navigate(`/items/${productId}`);
      }
    } else {
      const res = await addItems(formData);

      if (res.status === 201) {
        onClosePanel();
        navigate(`/items/${res.data.itemId}`);
      }
    }
  };

  return (
    <Div $right={rightPosition} onTransitionEnd={onTransitionEndHandler}>
      <Header
        leftButton={
          <Button styledType="text" onClick={onClosePanel}>
            닫기
          </Button>
        }
        rightButton={
          <Button
            styledType="text"
            onClick={submit}
            disabled={isSubmitDisabled}
          >
            완료
          </Button>
        }
        title="내물건 팔기"
      />
      <Body>
        <Wrapper>
          <PictureContainer
            addPicture={addPicture}
            deletePicture={deletePicture}
            pictureList={pictureList}
            uploadPictureList={uploadPictureList}
          />
        </Wrapper>
        <Wrapper style={{ display: 'flex', flexDirection: 'column' }}>
          <CustomInput
            placeholder={'내용을 입력하세요'}
            value={title.value}
            onChange={title.onChange}
            maxLength={24}
          />
          {recommendCategory && (
            <CategoryContainer
              openModal={openModal}
              recommendCategory={recommendCategory}
              setCategoryId={setCategoryId}
              selectedCategoryId={selectedCategoryId}
            />
          )}
        </Wrapper>
        <Wrapper>
          <PriceInputWrapper>
            <span>₩</span>
            <CustomInput
              placeholder="가격(선택사항)"
              value={setPriceFormat(price.value?.toString())}
              onChange={onChangePrice}
              maxLength={11}
            />
          </PriceInputWrapper>
        </Wrapper>
        <ProductContent
          placeholder={`${selectedUserLocation?.name}에 올릴 게시물 내용을 작성해주세요.(판매금지 물품은 게시가 제한될 수 있어요.)`}
          value={content.value}
          onChange={content.onChange}
        />
      </Body>
      {isModalOpen && (
        <CategorySelectModal
          isOpen={isModalOpen}
          selectedId={selectedCategoryId}
          selectCategory={selectCategory}
          onClose={closeModal}
        />
      )}
      <Footer>
        {isError || userLocationData === undefined ? (
          <span>Error : 로케이션 정보를 가져오지 못했습니다.</span>
        ) : (
          <EditorLocationDropdown
            UserLocationData={locationData}
            selectLocation={selectLocation}
          />
        )}
      </Footer>
    </Div>
  );
}

const Div = styled.div<{ $right: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: ${({ $right }) => `${$right}px`};
  display: flex;
  align-items: center;
  flex-direction: column;
  border: ${({ theme }) => `0.8px solid ${theme.color.neutralBorder}`};
  background: ${({ theme }) => theme.color.accentText};
  transition: right 0.6s;
  z-index: 10;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  padding: 24px 16px;
  margin: 56px 0;

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.neutralBorderStrong};
    border-radius: 10px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  align-items: flex-start;
  align-self: stretch;
  border-bottom: 0.8px solid ${({ theme }) => theme.color.neutralBorder};
`;

const CustomInput = styled.input`
  width: 100%;
  height: 24px;
  border: none;
  color: ${({ theme }) => theme.color.neutralTextWeak};
  font: ${({ theme }) => theme.font.availableDefault16};
`;

const PriceInputWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 4px;

  & > span {
    color: ${({ theme }) => theme.color.neutralTextStrong};
    font: ${({ theme }) => theme.font.displayStrong16};
  }
`;

const Footer = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  bottom: 0px;
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.color.neutralBorder};
  background: ${({ theme }) => theme.color.neutralBackgroundWeak};
  color: ${({ theme }) => theme.color.neutralTextStrong};
  font: ${({ theme }) => theme.font.availableDefault16};
`;
