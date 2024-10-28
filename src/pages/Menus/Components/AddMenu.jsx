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
import { useMenuStore } from "../../../stores/Assets/menu";
import { FormControlLabel, Switch } from "@mui/material";

const AddMenu = ({ showAddMenuModal, toggleAddMenuModal }) => {
  const { createMenu, isLoading } = useMenuStore((state) => state);

  const formik = useFormik({
    initialValues: {
      name: "",
      name_ar: "",
      currency: "",
      currency_ar: "",
      ask_for_table: false,
      ask_for_name: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required")),
      name_ar: Yup.string().optional(),
      currency: Yup.string().required(),
      currency_ar: Yup.string().optional(),
      ask_for_table: Yup.boolean().required(t("Required")),
      ask_for_name: Yup.boolean().required(t("Required")),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);

      // Prepare JSON object
      const json = {
        name: values.name,
        name_ar: values.name_ar,
        currency: values.currency,
        currency_ar: values.currency_ar,
        ask_for_table: values.ask_for_table,
        ask_for_name: values.ask_for_name,
      };

      // Debug log to see JSON contents
      console.log("JSON to send:", JSON.stringify(json, null, 2));

      // Call the API with JSON object
      const result = await createMenu(json);
      if (result) {
        formik.resetForm();
        toggleAddMenuModal();
      }

      // Your submission logic here
    },
  });

  return (
    <Modal isOpen={showAddMenuModal} toggle={toggleAddMenuModal}>
      <ModalHeader toggle={toggleAddMenuModal}>{t("Add New Menu")}</ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap">
          <div className="flex-fill mb-2">
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
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : <span>{t("Add")}</span>}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleAddMenuModal();
                formik.resetForm();
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

export default AddMenu;
