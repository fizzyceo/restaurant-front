import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { t } from "i18next";
import { RenderFormikInput } from "../../../Components/Common/Forms/FormikInputHelper";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { useAccessHistoryStore } from "../../../stores/AccessHistory";
import { useDriverStore } from "../../../stores/driver";
import { useCompanyStore } from "../../../stores/company";

const EditModel = ({ selectedRow, showEditModel, toogleEditModel }) => {
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [selectedAccess, setSelectedAccess] = useState(null);
  const [selectedisOutsider, setSelectedisOutsider] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const { getDrivers, drivers } = useDriverStore((state) => state);
  const { getCompanies, companies } = useCompanyStore((state) => state);
  const [formattedCompanies, setFormattedCompanies] = useState([]);
  const [formattedDrivers, setFormattedDrivers] = useState([]);

  useEffect(() => {
    getDrivers && getDrivers();
    getCompanies && getCompanies();
  }, []);

  useEffect(() => {
    console.log(companies);

    const displayedCompanies = companies.map((comapny) => {
      return {
        label: `${comapny.name}`,
        value: comapny._id,
      };
    });
    //
    setFormattedCompanies(displayedCompanies);
  }, [companies]);
  useEffect(() => {
    console.log(drivers);
    const displayedDrivers = drivers.map((driver) => {
      return {
        label: `${driver.firstname}-${driver.lastname}`,
        value: driver._id,
      };
    });
    //
    setFormattedDrivers(displayedDrivers);
    console.log(formattedDrivers);
  }, [drivers]);

  useEffect(() => {
    console.log(selectedRow);
    if (selectedRow) {
      setSelectedisOutsider(selectedRow?.outsider);
      setSelectedCharger(selectedRow?.charger);
      setSelectedCompany(selectedRow?.transporter);
      setSelectedAccess(selectedRow?.access);
    }
  }, [selectedRow]);
  const formik = useFormik({
    initialValues: {
      charger: selectedRow?.charger,
      NumPC: selectedRow?.NumPC,
      driverName: selectedRow?.driverName,
      drivingLicenseNumber: selectedRow?.drivingLicenseNumber,
      transporter: selectedRow?.transporter,
      immatriculationRemorque: selectedRow?.immatriculationRemorque,
      immatriculationTracteur: selectedRow?.immatriculationTracteur,
      NumPlomb: selectedRow?.NumPlomb,
      DestProv: selectedRow?.DestProv,
      date: selectedRow?.date,
      access: selectedRow?.access,
    },
    validationSchema: Yup.object({
      charger: Yup.string().optional(),
      NumPC: Yup.string().optional(),
      driverId: Yup.string().optional(),
      transporter: Yup.string().optional(),
      outsider: Yup.bool().optional(),
      immatriculationRemorque: Yup.string().optional(),
      immatriculationTracteur: Yup.string().optional(),
      NumPlomb: Yup.string().optional(),
      DestProv: Yup.string(),
      // region: Yup.string().optional(),
      date: Yup.date().optional(),
      access: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      //

      const body = {
        ...values,
      };
      if (body.outsider === false) {
        body.transporter = "NUMILOG";
      }
      console.log(body, selectedRow._id);
      const result = await editHistory(selectedRow._id, body);
      // console.log(result);
      toogleEditModel();
      if (result) {
        formik.resetForm();
        toogleEditModel();
        resetStates();
      }
    },
  });

  const fieldsToRender = [
    {
      fieldName: "charger",
      label: "Charger",
      placeholder: t("Select"),
      type: "select",
      options: [
        { value: true, label: "Chargee" },
        { value: false, label: "Vide" },
      ],
      onChange: (option) => {
        console.log(option.value);
        setSelectedCharger(option.value);
      },
      preSelectedValue: selectedCharger,
    },
    {
      fieldName: "access",
      label: "Access",
      placeholder: t("Select"),
      type: "select",
      options: [
        { value: "IN", label: "Entrer" },
        { value: "OUT", label: "Sortir" },
      ],
      onChange: (option) => {
        setSelectedAccess(option.value);
      },
      preSelectedValue: selectedAccess,
    },

    // {
    //   fieldName: "driverId",
    //   label: "Driver",
    //   placeholder: t("Select"),
    //   type: "select",
    //   options: formattedDrivers,
    //   preSelectedValue: selectedDriver,
    //   onChange: (option) => {
    //     setSelectedDriver(option);
    //   },
    // },
    {
      fieldName: "driverName",
      label: "Nom Chauffeur",
      placeholder: t("Chauffeur..."),
    },

    {
      fieldName: "drivingLicenseNumber",
      label: "Numero Permit",
      placeholder: t("identifiant..."),
      preSelectedValue: selectedRow?.drivingLicenseNumber,
    },
    {
      fieldName: "outsider",
      label: "Transporter",
      placeholder: t("Select"),
      type: "select",
      options: [
        { value: false, label: "NUMILOG" },
        { value: true, label: "Autres" },
      ],
      preSelectedValue: setSelectedisOutsider,
    },
    {
      //this will only appear if the user select outsider in the feild above
      fieldName: "transporter",
      label: "Nom transporteur",
    },
    {
      fieldName: "immatriculationTracteur",
      label: "Imm. Tracteur",
      fullWidth: true,
    },
    {
      fieldName: "immatriculationRemorque",
      label: "Imm. Remorque",
      fullWidth: true,
    },
    { fieldName: "DestProv", label: "Dest. /Prov", fullWidth: true },
    { fieldName: "NumPC", label: "Num P/C", fullWidth: true },
    { fieldName: "NumPlomb", label: "NumPlomb", fullWidth: false },
    {
      fieldName: "date",
      label: "Date",
      type: "datetime-local",
    },
  ];

  const { editHistory, isLoading } = useAccessHistoryStore((state) => state);
  const resetStates = () => {
    setSelectedCompany(null);
    toogleEditModel();
  };

  return (
    <Modal isOpen={showEditModel} toggle={toogleEditModel}>
      <ModalHeader toggle={toogleEditModel}>{t("Edit History")}</ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap">
          {fieldsToRender.map((field) => (
            <div
              key={field.fieldName}
              className={`flex-fill mb-2 ${field.fullWidth ? "w-100" : ""}`}
              style={field.fullWidth ? {} : { width: "48%", marginRight: 2 }}
            >
              {field.fieldName !== "transporter"
                ? RenderFormikInput(formik, field)
                : formik.values.outsider &&
                  RenderFormikInput(formik, field)}{" "}
            </div>
          ))}
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={formik.handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size={"sm"} /> : <span>{t("Edit")}</span>}
        </Button>
        <Button
          color="danger"
          onClick={() => {
            toogleEditModel();
            formik.resetForm();
          }}
          disabled={isLoading}
        >
          {t("Cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModel;
