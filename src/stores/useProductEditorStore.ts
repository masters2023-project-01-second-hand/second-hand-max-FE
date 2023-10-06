import { create } from 'zustand';

export type ProductData = {
  images: {
    id: number;
    url: string;
  }[];
  title: string;
  categories: { id: number; name: string; isSelected: boolean }[];
  price: number | null;
  content: string;
  locations: { id: number; name: string; isSelected: boolean }[];
};

type OpenPanelParams =
  | { mode: 'edit'; data: ProductData; id: number }
  | { mode: 'add'; data?: never; id?: never };

type ProductEditorState = {
  editorMode: 'add' | 'edit';
  isOpen: boolean;
  productId?: number;
  productData?: ProductData;
  openPanel: (params: OpenPanelParams) => void;
  closePanel: () => void;
};

export const useProductEditorStore = create<ProductEditorState>(set => ({
  editorMode: 'add',
  isOpen: false,
  productId: undefined,
  productData: undefined,
  openPanel: params => {
    if (params.mode === 'edit') {
      set({
        isOpen: true,
        productData: params.data,
        productId: params.id,
        editorMode: params.mode,
      });
    } else if (params.mode === 'add') {
      set({ isOpen: true, productData: undefined, editorMode: params.mode });
    }
  },
  closePanel: () => {
    set({ isOpen: false, productData: undefined, editorMode: 'add' });
  },
}));
