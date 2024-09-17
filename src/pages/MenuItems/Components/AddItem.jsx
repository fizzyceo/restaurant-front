import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { t } from "i18next";
import { RenderFormikInput } from "./../../../Components/Common/Forms/FormikInputHelper";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { useMenuItemsStore } from "../../../stores/Assets/menuItems";
import { CustomToggleSwitch } from "../../../Components/Common/CustomSwitch";
import { FormControlLabel, Switch } from "@mui/material";

const AddItem = ({ menuId, showAddItemModal, toggleAddItemModal }) => {
  const [images, setImages] = useState([]);
  const { createItem, isLoading } = useMenuItemsStore((state) => state);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      available: false,
      menu_id: menuId,
      item_images: [], // To handle multiple files
    },
    validationSchema: Yup.object({
      title: Yup.string().required(t("Required")),
      description: Yup.string().required(t("Required")),
      price: Yup.number().required(t("Required")),
      available: Yup.boolean().required(t("Required")),
      menu_id: Yup.number().required(t("Required")),
      item_images: Yup.array()
        .of(Yup.mixed().required(t("Required")))
        .required(t("Required")),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);
      // Prepare formData
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("available", values.available);
      formData.append("menu_id", menuId);

      // Append images
      values.item_images.forEach((image, index) => {
        formData.append("item_images", image);
      });

      // Debug log to see formData contents
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Call the API with formData
      const result = await createItem(menuId, formData);
      if (result.success) {
        formik.resetForm();
        toggleAddItemModal();
      }

      // Your submission logic here
    },
  });
  const fieldsToRender = [
    { fieldName: "title", label: "Title", fullWidth: true },
    {
      fieldName: "description",
      label: "Description",
      fullWidth: true,
    },
    { fieldName: "price", label: "Price", fullWidth: true },
  ];
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    formik.setFieldValue("item_images", files);
    setImages(files); // Update local state
  };

  return (
    <Modal isOpen={showAddItemModal} toggle={toggleAddItemModal}>
      <ModalHeader toggle={toggleAddItemModal}>{t("Add New Item")}</ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap">
          <div className="flex-fill mb-2">
            {fieldsToRender.map((field) => (
              <div
                key={field.fieldName}
                className={`flex-fill mb-2 ${field.fullWidth ? "w-100" : ""}`}
                style={field.fullWidth ? {} : { width: "48%", marginRight: 2 }}
              >
                {RenderFormikInput(formik, field)}
              </div>
            ))}
            <FormControlLabel
              onChange={(checked) => formik.setFieldValue("available", checked)}
              value={formik.values.available}
              required
              control={<Switch />}
              label="Available"
            />
          </div>

          <Label htmlFor="item_images" className="w-100 form-label mt-1">
            {t("Item Images")}
          </Label>
          <input
            type="file"
            id="item_images"
            name="item_images"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ padding: "0.5rem", width: "100%" }}
            className="bg-gradient rounded-3"
          />
          <div>
            {images.length > 0 && (
              <div className="mt-2">
                <h6>Selected Images:</h6>
                <ul>
                  {images.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : <span>{t("Add")}</span>}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleAddItemModal();
                formik.resetForm();
                setImages([]);
              }}
              disabled={isLoading}
            >
              {t("Cancel")}
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>{/* Additional footer content can go here */}</ModalFooter>
    </Modal>
  );
};

export default AddItem;
