import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, set } from "react-hook-form";
import { useNavigate } from "react-router";
import { getServiceCategoryList } from "../../../service/serviceCategory";
import { listPayload, showToast } from "../../../utils/helper";
import {
  createService,
  getServiceById,
  updateService,
} from "../../../service/service";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditService = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const [serviceCategories, setServiceCategories] = useState([]);
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, getValues, setValue, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      category: "",
      minutes: "",
      displayName: "",
      description: "",
      webPrice: "",
      featureList: [{
        index: 0,
        value: ""
      }],
      slug: "",
      video: "",
      thumbnilImage: "",
      images: [],
      backgrandImage: "",

    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "featureList",
    control: control,
  });

  const addRow = () => {
    const index = getValues("featureList").length;
    append({
      index: index,
      value: ""
    });
  }

  const removeRow = (index) => {
    remove(index);
  }

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {
        ...data,
        service_category_id: data.category.value,
      };
      delete payload['category'];
      const formData = new FormData();
      if (tag === "add") {
        formData.append("createdBy", "" + loggedInUser?.id);
      } else {
        formData.append("updatedBy", "" + loggedInUser?.id);
      }
      (Object.keys(payload)).forEach(key => {
        if(!['thumbnilImage', 'backgrandImage', 'video', 'images', 'featureList'].includes(key)) {
          formData.append(key, payload[key]);
        }
      });
      if(payload && payload.video) {
        formData.append('video', payload.video[0]);
      }
      if(payload && payload.thumbnilImage) {
        formData.append('thumbnilImage', payload.thumbnilImage[0]);
      }
      if(payload && payload.backgrandImage) {
        formData.append('backgrandImage', payload.backgrandImage[0]);
      }
      if(payload && payload.images && Array.isArray(payload.images)){
        payload.images.filter((image) => typeof image === 'object').forEach((image) => {
          formData.append('images', image);
        });
        const stringImgs = payload.images.filter((image) => typeof image === 'string');
        if(stringImgs.length > 0) {
          formData.append('images', JSON.stringify(stringImgs));
        }
      }
      if(payload && payload.featureList && Array.isArray(payload.featureList)){
        formData.append('featureList', JSON.stringify(payload.featureList.map((feature) => feature.value)));
      }

      const response =
        tag === "add"
          ? await createService(formData)
          : await updateService(formData, id);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/service");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const cancelHandler = () => {
    navigate("/service");
  };

  const fetchEditServiceData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getServiceById(id);
        if (response?.statusCode === 200) {
          const category = {
            value: response.data.px_service_category.id,
            label: response.data.px_service_category.name,
          };
          setValue("name", response.data.name);
          setValue("amount", response.data.amount);
          setValue("category", category);
          setValue("minutes", response.data.minutes);
          setValue("displayName", response.data.displayName);
          setValue("description", response.data.description);
          setValue("webPrice", response.data.webPrice);
          setValue("slug", response.data.slug);
          setValue("video", [response.data.video]);
          setValue("thumbnilImage", [response.data.thumbnilImage]);
          setValue("backgrandImage", [response.data.backgrandImage]);
          setValue("images", response.data.images);
          setValue("featureList", response.data.featureList.map((feature, index) => ({index, value: feature})));
        } else {
          showToast(response?.message, false);
        }
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    tag === "edit" && fetchEditServiceData();
  }, [tag, fetchEditServiceData]);

  // gemrate service category options for drop down
  const categoryOptions = useMemo(() => {
    const data = serviceCategories.map((item) => {
      return { value: item.id, label: item.name };
    });
    return data;
  }, [serviceCategories]);

  useEffect(() => {
    try {
      const fetchServiceCategoryData = async () => {
        const body = listPayload(0, { isActive: true }, 1000);

        const response = await getServiceCategoryList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setServiceCategories(payload);
        } else if (response?.statusCode === 404) {
          const payload = [];
          setServiceCategories(payload);
        }
      };
      fetchServiceCategoryData();
    } catch (error) {
      showToast(error?.message, false);
    }
  }, []);

  return {
    fields,
    control,
    categoryOptions,
    addRow,
    onSubmit,
    setValue,
    removeRow,
    handleSubmit,
    cancelHandler,
  };
};
