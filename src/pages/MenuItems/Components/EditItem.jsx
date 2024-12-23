import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { t } from "i18next";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Input,
  FormGroup,
} from "reactstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMenuItemsStore } from "../../../stores/Assets/menuItems";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import { FormControlLabel, Switch } from "@mui/material";

// Custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
});

const EditItem = ({
  menuId,
  rowData,
  showEditItemModal,
  toggleEditItemModal,
}) => {
  const [images, setImages] = useState([]);
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const { updateItem, isLoading } = useMenuItemsStore((state) => state);

  useEffect(() => {
    if (rowData) {
      console.log(rowData);

      // Set initial values if rowData changes
      formik.setValues({
        title: rowData?.title || "",
        title_ar: rowData?.title_ar || "",
        description: rowData?.description || "",
        price: rowData?.price || "",
        available: rowData?.available,
        file: null,
      });
      setImages(rowData?.item_images || []);
    }
  }, [rowData]);

  const formik = useFormik({
    initialValues: {
      title: rowData?.title || "",
      title_ar: rowData?.title_ar || "",
      description: rowData?.description || "",
      price: rowData?.price || "",
      available: rowData?.available,

      file: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().optional(),
      title_ar: Yup.string().optional(),
      description: Yup.string().optional(),
      price: Yup.number().optional(),
      available: Yup.boolean().optional(),
    }),
    onSubmit: async (values) => {
      // Create a JSON object directly from values
      const json = {
        title: values.title,
        title_ar: values.title_ar,
        description: values.description,
        price: values.price || 0,
        available: values.available,
      };

      // formData.append("description", values.description);
      // formData.append("price", Number(values.price));
      // formData.append("available", Number(values.available));

      try {
        await updateItem(menuId, rowData?.item_id, json);
        formik.resetForm();
        toggleEditItemModal();
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
  });

  const next = () => {
    if (activeIndex === images.length - 1) return;
    setActiveIndex(activeIndex + 1);
  };

  const previous = () => {
    if (activeIndex === 0) return;
    setActiveIndex(activeIndex - 1);
  };

  const goToIndex = (newIndex) => {
    setActiveIndex(newIndex);
  };

  return (
    <Modal isOpen={showEditItemModal} toggle={toggleEditItemModal}>
      <ModalHeader toggle={toggleEditItemModal}>
        {t("Modify Item: ", rowData?.title)}
      </ModalHeader>
      <ModalBody>
        {/* Carousel for displaying images */}
        <Carousel activeIndex={activeIndex} next={next} previous={previous}>
          <CarouselIndicators
            items={images}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <img
                src={image.image_url}
                alt={`Image ${index}`}
                style={{ width: "100%", height: "300px" }}
              />
            </CarouselItem>
          ))}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
          />
        </Carousel>

        <form
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column gap-1"
        >
          <Label for="title">{t("Title")}</Label>
          <Input
            type="text"
            id="title"
            name="title"
            {...formik.getFieldProps("title")}
            invalid={formik.touched.title && Boolean(formik.errors.title)}
            placeholder={t("Enter item title")}
          />
          <Label for="title_ar">{t("Title (AR)")}</Label>
          <Input
            type="text"
            id="title_ar"
            name="title_ar"
            {...formik.getFieldProps("title_ar")}
            invalid={formik.touched.title_ar && Boolean(formik.errors.title_ar)}
            placeholder={t("Enter item title_ar")}
          />
          <Label for="description">{t("Description")}</Label>
          <Input
            type="textarea"
            id="description"
            name="description"
            {...formik.getFieldProps("description")}
            placeholder={t("Enter item description")}
          />
          <Label for="price">{t("Price")}</Label>
          <Input
            type="number"
            id="price"
            name="price"
            {...formik.getFieldProps("price")}
            placeholder={t("Enter item price")}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.available} // Use 'checked' prop instead of 'value'
                onChange={(event) =>
                  formik.setFieldValue("available", event.target.checked)
                }
              />
            }
            label="Available"
          />
          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
              {isLoading ? <Spinner size={"sm"} /> : <span>{t("Save")}</span>}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleEditItemModal();
                formik.resetForm();
              }}
              disabled={isLoading}
            >
              {t("Cancel")}
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

export default EditItem;
