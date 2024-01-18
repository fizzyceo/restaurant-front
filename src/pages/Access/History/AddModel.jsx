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
import Stepper from "./components/Stepper";
import StepperControl from "./components/StepperControl";
// import "./tailwindsupp.css";
const AddModel = ({ showAddModel, toggleAddModal }) => {
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [selectedAccess, setSelectedAccess] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isOutsider, setIsOutsider] = useState(null);
  const { getDrivers, drivers } = useDriverStore((state) => state);
  const { getCompanies, companies } = useCompanyStore((state) => state);
  const [formattedCompanies, setFormattedCompanies] = useState([]);
  const [formattedDrivers, setFormattedDrivers] = useState([]);

  useEffect(() => {
    // getDrivers && getDrivers();
    // getCompanies && getCompanies();
  }, []);

  // useEffect(() => {
  //   console.log(companies);

  //   const displayedCompanies = companies.map((comapny) => {
  //     return {
  //       label: `${comapny.name}`,
  //       value: comapny._id,
  //     };
  //   });
  //   //
  //   setFormattedCompanies(displayedCompanies);
  // }, [companies]);
  // useEffect(() => {
  //   console.log(drivers);
  //   const displayedDrivers = drivers.map((driver) => {
  //     return {
  //       label: `${driver.firstname}-${driver.lastname}`,
  //       value: driver._id,
  //     };
  //   });
  //   //
  //   setFormattedDrivers(displayedDrivers);
  //   console.log(formattedDrivers);
  // }, [drivers]);

  const formik = useFormik({
    initialValues: {
      charger: "",
      NumPC: "",
      transporter: "NUMILOG",
      driverName: "",
      drivingLicenseNumber: "",
      immatriculationRemorque: "",
      immatriculationTracteur: "",
      NumPlomb: "",
      DestProv: "",
      outsider: false,
      date: "",
      access: "",
    },
    validationSchema: Yup.object({
      charger: Yup.string().required(t("Required!")),
      NumPC: Yup.string().required(t("Required!")),
      // driverId: Yup.string().required(t("Required!")),
      // companyId: Yup.string().required(t("Required!")),
      transporter: Yup.string().required(t("Required!")),
      outsider: Yup.boolean().required(t("Required!")),
      drivingLicenseNumber: Yup.string().required(t("Required!")),
      driverName: Yup.string().required(t("Required!")),
      immatriculationRemorque: Yup.string().required(t("Required!")),
      immatriculationTracteur: Yup.string().required(t("Required!")),
      NumPlomb: Yup.string().required(t("Required!")),
      DestProv: Yup.string(),
      // region: Yup.string().required(t("Required!")),
      date: Yup.date().required(t("Required!")),
      access: Yup.string().required(t("Required!")),
    }),
    onSubmit: async (values) => {
      //
      console.log(values);

      const body = {
        ...values,
      };

      if (body.outsider === false) {
        body.transporter = "NUMILOG";
      }
      const result = await CreateHistory(body);
      toggleAddModal();
      if (result) {
        formik.resetForm();
        toggleAddModal();

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

    {
      fieldName: "driverName",
      label: "Nom Chauffeur",
      placeholder: t("Chauffeur..."),
    },
    {
      fieldName: "drivingLicenseNumber",
      label: "Numero Permit",
      placeholder: t("identifiant..."),
    },
    {
      fieldName: "outsider",
      label: "Transporteur",
      placeholder: t("Select"),
      type: "select",
      options: [
        { value: false, label: "NUMILOG" },
        { value: true, label: "Autres" },
      ],
      onChange: (option) => {
        setIsOutsider(option.value);
        if (!option.value) {
          formik.setFieldValue("transporter", "NUMILOG");
        }
      },
      // preSelectedValue: isOutsider,
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

  const { CreateHistory, isLoading } = useAccessHistoryStore((state) => state);
  const resetStates = () => {
    // setSelectedDriver(null);
    // setSelectedCompany(null);
    toggleAddModal();
  };
  return (
    <Modal isOpen={showAddModel} toggle={toggleAddModal}>
      <ModalHeader toggle={toggleAddModal}>
        {t("Add History Record")}
      </ModalHeader>
      <ModalBody>
        {/**Stepper component */}
        {/* <Stepper /> */}
        <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap">
          {fieldsToRender.map((field) => (
            <div
              key={field.fieldName}
              className={`flex-fill mb-2 ${field.fullWidth ? "w-100" : ""}`}
              style={field.fullWidth ? {} : { width: "48%", marginRight: 2 }}
            >
              {field.fieldName !== "transporter"
                ? RenderFormikInput(formik, field)
                : formik.values.outsider && RenderFormikInput(formik, field)}
            </div>
          ))}
        </form>
        {/* <StepperControl /> */}
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={formik.handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size={"sm"} /> : <span>{t("Create")}</span>}
        </Button>
        <Button
          color="danger"
          onClick={() => {
            toggleAddModal();
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

export default AddModel;
