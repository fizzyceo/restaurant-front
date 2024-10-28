import React, { useEffect, useState } from "react";
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
import { FormControlLabel, Switch } from "@mui/material";
import { useStaffStore } from "../../../stores/Staffs";

const EditUser = ({ rowData, showEditUserModal, toggleEditUserModal }) => {
  const { updateUser, isLoading } = useStaffStore((state) => state);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (rowData) {
      // Set initial values if rowData changes
      formik.setValues({
        name: rowData?.name || "",
        email: rowData?.email || "",
        phone: rowData?.phone || "",
        role: rowData?.role || "",
        canCallTeaboy: rowData?.canCallTeaboy || false,
        isVerified: rowData?.isVerified || false,
        signedUp: rowData?.signedUp || false,
      });
      setIsVerified(rowData?.isVerified || false);
    }
  }, [rowData]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      canCallTeaboy: false,
      isVerified: false,
      signedUp: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required")),
      email: Yup.string().email(t("Invalid email")).required(t("Required")),
      phone: Yup.string().optional(),
      role: Yup.string().required(t("Required")),
      canCallTeaboy: Yup.boolean(),
      isVerified: Yup.boolean(),
      signedUp: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const json = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        canCallTeaboy: values.canCallTeaboy,
        isVerified: values.isVerified,
        signedUp: values.signedUp,
      };
      console.log(json);

      try {
        await updateUser(rowData?.user_id, json);
        formik.resetForm();
        toggleEditUserModal();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
  });

  return (
    <Modal isOpen={showEditUserModal} toggle={toggleEditUserModal}>
      <ModalHeader toggle={toggleEditUserModal}>
        {t("Edit User: ", rowData?.name)}
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column gap-1"
        >
          <Label for="name">{t("Name")}</Label>
          <Input
            type="text"
            id="name"
            name="name"
            {...formik.getFieldProps("name")}
            invalid={formik.touched.name && Boolean(formik.errors.name)}
            placeholder={t("Enter name")}
          />
          <Label for="email">{t("Email")}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            {...formik.getFieldProps("email")}
            invalid={formik.touched.email && Boolean(formik.errors.email)}
            placeholder={t("Enter email")}
          />
          <Label for="phone">{t("Phone")}</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            {...formik.getFieldProps("phone")}
            invalid={formik.touched.phone && Boolean(formik.errors.phone)}
            placeholder={t("Enter phone number")}
          />
          <Label for="role">{t("Role")}</Label>
          <Input
            type="text"
            id="role"
            name="role"
            {...formik.getFieldProps("role")}
            invalid={formik.touched.role && Boolean(formik.errors.role)}
            placeholder={t("Enter role")}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formik.values.canCallTeaboy}
                onChange={(event) =>
                  formik.setFieldValue("canCallTeaboy", event.target.checked)
                }
              />
            }
            label={t("Can Call Teaboy")}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isVerified}
                onChange={(event) =>
                  formik.setFieldValue("isVerified", event.target.checked)
                }
              />
            }
            label={t("Verified")}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.signedUp}
                onChange={(event) =>
                  formik.setFieldValue("signedUp", event.target.checked)
                }
              />
            }
            label={t("signedUp")}
          />

          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
              {isLoading ? <Spinner size={"sm"} /> : <span>{t("Save")}</span>}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleEditUserModal();
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

export default EditUser;
