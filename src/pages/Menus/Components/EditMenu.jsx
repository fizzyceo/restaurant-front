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
import { RenderFormikInput } from "../../../Components/Common/Forms/FormikInputHelper";

const EditMenu = ({
  siteList,
  rowData,
  showEditMenuModal,
  toggleEditMenuModal,
}) => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { updateMenu, isLoading } = useMenuStore((state) => state);
  const [selectedSiteId, setSelectedSiteId] = useState(
    siteList[0]?.site_id || null
  );
  useEffect(() => {
    if (rowData) {
      // Set initial values if rowData changes
      formik.setValues({
        name: rowData?.name || "",
        name_ar: rowData?.name_ar || "",
        ask_for_table: rowData?.ask_for_table,
        ask_for_name: rowData?.ask_for_name,
        ask: rowData?.ask || "",
        ask_ar: rowData?.ask_ar || "",
        VAT: rowData?.VAT || 0,

        currency: rowData?.currency || "",
        currency_ar: rowData?.currency_ar || "",
        site_id: rowData?.sites?.length > 0 ? rowData?.sites[0]?.site_id : null,
      });
    }
  }, [rowData]);

  const formik = useFormik({
    initialValues: {
      name: rowData?.name || "",
      name_ar: rowData?.name_ar || "",
      currency: rowData?.currency || "",
      currency_ar: rowData?.currency_ar || "",
      ask: rowData?.ask || "",
      ask_ar: rowData?.ask_ar || "",
      VAT: rowData?.VAT || 0,

      ask_for_table: rowData?.ask_for_table,
      ask_for_name: rowData?.ask_for_name,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required")),
      name_ar: Yup.string().optional(),
      currency: Yup.string().required(t("Required")),
      VAT: Yup.number().optional(),

      ask_ar: Yup.string().optional(),
      ask: Yup.string().optional(),
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
        site_id: selectedSiteId,
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
          <div className="d-flex gap-2">
            {" "}
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "name",
                label: "Menu Name",
                fullWidth: true,
              })}
            </div>
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "name_ar",
                label: "Menu Name (AR)",
                fullWidth: true,
              })}
            </div>
          </div>
          <div className="flex-fill mb-2">
            <Label for="site">{t("Select Site")}</Label>
            <select
              id="site"
              onChange={(e) => setSelectedSiteId(e.target.value)}
              value={selectedSiteId}
              className="form-control"
            >
              {siteList.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.site_id} - {site.name}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex gap-2">
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "currency",
                label: "Currency",
                fullWidth: true,
              })}
            </div>
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "currency_ar",
                label: "Currency (AR)",
                fullWidth: true,
              })}
            </div>
          </div>
          <div className="flex-fill mb-2 w-100">
            {RenderFormikInput(formik, {
              fieldName: "VAT",
              label: "VAT",
              fullWidth: true,
            })}
          </div>
          <div className="d-flex gap-2">
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "ask",
                label: "Ask",
                fullWidth: true,
              })}
            </div>
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "ask_ar",
                label: "Ask (AR)",
                fullWidth: true,
              })}
            </div>
          </div>
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
