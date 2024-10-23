import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { t } from "i18next";
import { RenderFormikInput } from "./../../../../Components/Common/Forms/FormikInputHelper";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { useLinksStore } from "../../../../stores/Assets/links"; // Assuming you have a store for links

const AddLink = ({ showAddLinkModal, toggleAddLinkModal }) => {
  const { createLink, isLoading } = useLinksStore((state) => state); // Update this line to match your store

  const formik = useFormik({
    initialValues: {
      user_email: "", // New field for user email
      space_id: "", // New field for space ID
    },
    validationSchema: Yup.object({
      user_email: Yup.string()
        .email(t("Invalid email"))
        .required(t("Required")),
      space_id: Yup.string().required(t("Required")),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);

      // Prepare JSON object
      const json = {
        email: values.user_email,
        space_id: values.space_id,
      };

      // Debug log to see JSON contents
      console.log("JSON to send:", JSON.stringify(json, null, 2));

      // Call the API with JSON object
      const result = await createLink(json); // Adjust based on your actual API call
      if (result) {
        formik.resetForm();
        toggleAddLinkModal();
      }
    },
  });

  return (
    <Modal isOpen={showAddLinkModal} toggle={toggleAddLinkModal}>
      <ModalHeader toggle={toggleAddLinkModal}>{t("Add New Link")}</ModalHeader>
      <ModalBody>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column flex-wrap"
        >
          <div className="flex-fill mb-2">
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "user_email",
                label: t("User Email"), // Updated label for user email
                fullWidth: true,
              })}
            </div>
            <div className="flex-fill mb-2 w-100">
              {RenderFormikInput(formik, {
                fieldName: "space_id",
                label: t("Space ID"), // Updated label for space ID
                fullWidth: true,
              })}
            </div>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : <span>{t("Add")}</span>}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleAddLinkModal();
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

export default AddLink;
