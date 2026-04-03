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
      recommended: [{
        index: 0,
        value: ""
      }],
      scrubs: [{
        index: 0,
        value: ""
      }],
      therapyOptions: [{
        index: 0,
        value: ""
      }],
      faq: [{
        index: 0,
        title: "",
        description: ""
      }],
      hsnCode: "",
      slug: "",
      video: "",
      thumbnilImage: "",
      images: [],
      backgrandImage: "",

    },
    mode: "onBlur",
  });

  const faqFields = useFieldArray({
    name: "faq",
    control: control,
  });

  const recommendedFields = useFieldArray({
    name: "recommended",
    control: control,
  });

  const scrubsFields = useFieldArray({
    name: "scrubs",
    control: control,
  });

  const therapyOptionsFields = useFieldArray({
    name: "therapyOptions",
    control: control,
  });

  const { fields, append, remove } = useFieldArray({
    name: "featureList",
    control: control,
  });

  const addFaqRow = () => {
    const index = getValues("faq").length;
    faqFields.append({
      index: index,
      title: "",
      description: ""
    });
  }

  const removeFaqRow = (index) => {
    faqFields.remove(index);
  }

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

  const addRecommendedRow = () => {
    const index = getValues("recommended").length;
    recommendedFields.append({
      index: index,
      value: ""
    });
  }

  const removeRecommendedRow = (index) => {
    recommendedFields.remove(index);
  }

  const addScrubsRow = () => {
    const index = getValues("scrubs").length;
    scrubsFields.append({
      index: index,
      value: ""
    });
  }

  const removeScrubsRow = (index) => {
    scrubsFields.remove(index);
  }

  const addTherapyOptionsRow = () => {
    const index = getValues("therapyOptions").length;
    therapyOptionsFields.append({
      index: index,
      value: ""
    });
  }

  const removeTherapyOptionsRow = (index) => {
    therapyOptionsFields.remove(index);
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
        if (!['faq', 'recommended', 'scrubs', 'therapyOptions', 'thumbnilImage', 'backgrandImage', 'video', 'images', 'featureList'].includes(key)) {
          formData.append(key, payload[key]);
        }
      });
      if (payload && payload.video) {
        formData.append('video', payload.video);
      }
      if (payload && payload.thumbnilImage) {
        formData.append('thumbnilImage', payload.thumbnilImage);
      }
      if (payload && payload.backgrandImage) {
        formData.append('backgrandImage', payload.backgrandImage);
      }
      if (payload && payload.images && Array.isArray(payload.images)) {
        payload.images.filter((image) => typeof image === 'object').forEach((image) => {
          formData.append('images', image);
        });
        const stringImgs = payload.images.filter((image) => typeof image === 'string');
        if (stringImgs.length > 0) {
          formData.append('images', JSON.stringify(stringImgs));
        }
      }
      if (payload && payload.featureList && Array.isArray(payload.featureList)) {
        formData.append('featureList', JSON.stringify(payload.featureList.map((feature) => feature.value)));
      }
      if (payload && payload.recommended && Array.isArray(payload.recommended)) {
        formData.append('recommended', JSON.stringify(payload.recommended.map((recommended) => recommended.value)));
      }
      if (payload && payload.scrubs && Array.isArray(payload.scrubs)) {
        formData.append('scrubs', JSON.stringify(payload.scrubs.map((scrubs) => scrubs.value)));
      }
      if (payload && payload.therapyOptions && Array.isArray(payload.therapyOptions)) {
        formData.append('therapyOptions', JSON.stringify(payload.therapyOptions.map((therapyOptions) => therapyOptions.value)));
      }
      if (payload && payload.faq && Array.isArray(payload.faq)) {
        const faqData = payload.faq.map((faq) => ({ title: faq.title, description: faq.description }));
        formData.append('faq', JSON.stringify(faqData));
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
            value: response.data.px_service_categorie.id,
            label: response.data.px_service_categorie.name,
          };
          setValue("name", response.data.name);
          setValue("amount", response.data.amount);
          setValue("category", category);
          setValue("minutes", response.data.minutes);
          setValue("displayName", response.data.displayName);
          setValue("description", response.data.description);
          setValue("webPrice", response.data.webPrice);
          setValue("slug", response.data.slug);
          setValue("hsnCode", response.data.hsnCode);
          setValue("video", response.data.video ? [response.data.video] : []);
          setValue("thumbnilImage", response.data.thumbnilImage ? [response.data.thumbnilImage] : []);
          setValue("backgrandImage", response.data.backgrandImage ? [response.data.backgrandImage] : []);
          setValue("images", response.data.images && Array.isArray(response.data.images) ? response.data.images : []);
          setValue("featureList", Array.isArray(response.data.featureList) ? response.data.featureList?.map((feature, index) => ({ index, value: feature })) : [{ index: 0, value: "" }]);
          setValue("recommended", Array.isArray(response.data.recommended) ? response.data.recommended?.map((recommended, index) => ({ index, value: recommended })) : response.data.recommended.length > 0 ? JSON.parse(response.data.recommended).map((recommended, index) => ({ index, value: recommended })) : [{ index: 0, value: "" }]);
          setValue("scrubs", Array.isArray(response.data.scrubs) ? response.data.scrubs?.map((scrubs, index) => ({ index, value: scrubs })) : response.data.scrubs.length > 0 ? JSON.parse(response.data.scrubs).map((scrubs, index) => ({ index, value: scrubs })) : [{ index: 0, value: "" }]);
          setValue("therapyOptions", Array.isArray(response.data.therapyOptions) ? response.data.therapyOptions?.map((therapyOptions, index) => ({ index, value: therapyOptions })) : response.data.therapyOptions.length > 0 ? JSON.parse(response.data.therapyOptions).map((therapyOptions, index) => ({ index, value: therapyOptions })) : [{ index: 0, value: "" }]);
          setValue("faq", Array.isArray(response.data.faq) ? response.data.faq?.map((faq, index) => ({ index, title: faq.title, description: faq.description })) : response.data.faq.length > 0 ? JSON.parse(response.data.faq).map((faq, index) => ({ index, title: faq.title, description: faq.description })) : [{ index: 0, title: "", description: "" }]);
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
    faqFields,
    scrubsFields,
    categoryOptions,
    recommendedFields,
    therapyOptionsFields,
    addRow,
    onSubmit,
    setValue,
    addFaqRow,
    removeRow,
    removeFaqRow,
    handleSubmit,
    cancelHandler,
    addRecommendedRow,
    removeRecommendedRow,
    addScrubsRow,
    removeScrubsRow,
    addTherapyOptionsRow,
    removeTherapyOptionsRow
  };
};
