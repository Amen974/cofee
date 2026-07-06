import { ChangeEvent, FormEvent, useReducer } from "react";
import {
  FormMenuItemAction,
  FormState,
  ItemForm,
  MenuItemFormProps,
} from "@/types";
import { deleteImage, updateItem, uploadImage } from "./actions";
import { useCartIndicator } from "@/lib/store/useCartIndicator";

const formReducer = (
  state: FormState,
  action: FormMenuItemAction,
): FormState => {
  switch (action.type) {
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_IMAGE_URL":
      return { ...state, imageUrl: action.payload };
    case "SET_IS_SAVING":
      return { ...state, isSaving: action.payload };
    case "SET_IS_UPLOADING_IMAGE":
      return { ...state, isUploadingImage: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_QUANTITY":
      return { ...state, quantity: action.payload };
    default:
      return state;
  }
};

export const useMenuItemForm = (
  item: MenuItemFormProps["item"],
  setIsUpdating: MenuItemFormProps["setIsUpdating"],
) => {
  const [state, dispatch] = useReducer(formReducer, {
    description: item.description,
    imageUrl: item.image_url,
    isSaving: false,
    isUploadingImage: false,
    name: item.name,
    price: item.price.toString(),
    quantity: item.quantity.toString(),
  });

  const {
    description,
    imageUrl,
    isSaving,
    isUploadingImage,
    name,
    price,
    quantity,
  } = state;

  const { setCartState, reset } = useCartIndicator()

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setCartState('Saving')
    dispatch({ type: "SET_IS_SAVING", payload: true });

    const formData: ItemForm = {
      name: state.name,
      description: state.description,
      price: Number(state.price),
      quantity: Number(state.quantity),
      image_url: state.imageUrl,
      is_available: item.is_available,
    };

    try {
      await updateItem(item.id, formData);
      if (imageUrl !== item.image_url) {
        await deleteImage(item.image_url);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsUpdating(false);
      dispatch({ type: "SET_IS_SAVING", payload: false });
      reset();
    }
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) return;

    dispatch({ type: "SET_IS_UPLOADING_IMAGE", payload: true });
    setCartState('Uploading')

    try {
      const uploadResult = await uploadImage(file);

      if (!uploadResult.success) {
        console.error("Image upload failed:", uploadResult.error);
        return;
      }

      if (uploadResult.url) {
        dispatch({ type: "SET_IMAGE_URL", payload: uploadResult.url });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      dispatch({ type: "SET_IS_UPLOADING_IMAGE", payload: false });
      reset();
    }
  };

  const handleCancel = async (): Promise<void> => {
  if (imageUrl && imageUrl !== item.image_url) {
    try {
      setCartState('Deleting')
      await deleteImage(imageUrl);
    } catch (error) {
      console.error("Error deleting orphaned image:", error);
      reset();
    }
  }
  setIsUpdating(false);
  reset();
};

  return {
    state,
    dispatch,
    description,
    imageUrl,
    isSaving,
    isUploadingImage,
    name,
    price,
    quantity,
    handleSubmit,
    handleImageChange,
    handleCancel,
  };
};

export default useMenuItemForm;
