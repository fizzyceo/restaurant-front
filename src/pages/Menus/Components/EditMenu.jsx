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
} from "reactstrap";
import { useMenuItemsStore } from "../../../stores/Assets/menuItems";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import { FormControlLabel, Switch } from "@mui/material";
import { useMenuStore } from "../../../stores/Assets/menu";

const EditMenu = ({ rowData, showEditMenuModal, toggleEditMenuModal }) => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { updateMenu, isLoading } = useMenuStore((state) => state);

  useEffect(() => {
    if (rowData) {
      // Set initial values if rowData changes
      formik.setValues({
        name: rowData?.name || "",
        name_ar: rowData?.name_ar || "",
        ask_for_table: rowData?.ask_for_table,
        ask_for_name: rowData?.ask_for_name,
        currency: rowData?.currency || "",
        currency_ar: rowData?.currency_ar || "",
      });
    }
  }, [rowData]);

  const formik = useFormik({
    initialValues: {
      name: rowData?.name || "",
      name_ar: rowData?.name_ar || "",
      currency: rowData?.currency || "",
      currency_ar: rowData?.currency_ar || "",
      ask_for_table: rowData?.ask_for_table,
      ask_for_name: rowData?.ask_for_name,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required")),
      name_ar: Yup.string().optional(),
      currency: Yup.string().required(t("Required")),
      currency_ar: Yup.string().optional(),
      ask_for_table: Yup.boolean(),
      ask_for_name: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const json = {
        name: values.name,
        name_ar: values.name_ar,
        currency: values.currency,
        currency_ar: values.currency_ar,
        ask_for_table: values.ask_for_table,
        ask_for_name: values.ask_for_name,
      };
      console.log(json);

      try {
        await updateMenu(rowData?.menu_id, json);
        formik.resetForm();
        toggleEditMenuModal();
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
  });

  const next = () => {
    if (activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const previous = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const goToIndex = (newIndex) => {
    setActiveIndex(newIndex);
  };

  return (
    <Modal isOpen={showEditMenuModal} toggle={toggleEditMenuModal}>
      <ModalHeader toggle={toggleEditMenuModal}>
        {t("Modify Item: ", rowData?.name)}
      </ModalHeader>
      <ModalBody>
        {/* Carousel for displaying images */}

        <form
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column gap-1"
        >
          <Label for="name">{t("Menu Name")}</Label>
          <Input
            type="text"
            id="name"
            name="name"
            {...formik.getFieldProps("name")}
            invalid={formik.touched.name && Boolean(formik.errors.name)}
            placeholder={t("Enter menu name")}
          />
          <Label for="name">{t("Menu Name (AR)")}</Label>
          <Input
            type="text"
            id="name_ar"
            name="name_ar"
            {...formik.getFieldProps("name_ar")}
            invalid={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
            placeholder={t("Enter menu name (ar)")}
          />
          <Label for="currency">{t("Currency")}</Label>
          <Input
            type="text"
            id="currency"
            name="currency"
            {...formik.getFieldProps("currency")}
            invalid={formik.touched.currency && Boolean(formik.errors.currency)}
            placeholder={t("Enter currency")}
          />
          <Label for="currency_ar">{t("Currency (AR)")}</Label>
          <Input
            type="text"
            id="currency_ar"
            name="currency_ar"
            {...formik.getFieldProps("currency_ar")}
            invalid={
              formik.touched.currency_ar && Boolean(formik.errors.currency_ar)
            }
            placeholder={t("Enter Currency (ar)")}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formik.values.ask_for_table}
                onChange={(event) =>
                  formik.setFieldValue("ask_for_table", event.target.checked)
                }
              />
            }
            label={t("Ask for Table")}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.ask_for_name}
                onChange={(event) =>
                  formik.setFieldValue("ask_for_name", event.target.checked)
                }
              />
            }
            label={t("Ask for Name")}
          />
          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
              {isLoading ? <Spinner size={"sm"} /> : <span>{t("Save")}</span>}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleEditMenuModal();
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

export default EditMenu;
