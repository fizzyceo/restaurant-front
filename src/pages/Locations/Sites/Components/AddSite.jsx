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
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useSiteStore } from "../../../../stores/Assets/site";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { convertToBase64 } from "../../../../Components/Common/convertToBase64";

const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
});

export const AddSite = ({ showAddSiteModal, toggleAddSiteModal }) => {
  const [image, setImage] = useState("");
  const validationSchema = Yup.object({
    name: Yup.string().required(t("Required")),
    address: Yup.string().required(t("Required")),
    phone: Yup.string()
      .required(t("Required"))
      .length(10, t("Phone number must be exactly 10 characters long"))
      .matches(/^\d+$/, t("Phone number must be numeric")),
    lat: Yup.number().required(t("Required")).typeError(t("Must be a number")),
    lon: Yup.number().required(t("Required")).typeError(t("Must be a number")),
    file: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      lat: "",
      lon: "",
      file: null, // Ensure this is null, not an empty string
    },
    validationSchema,
    onSubmit: async (values) => {
      // Prepare form data for multipart/form-data
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("phone", values.phone);
      formData.append("lat", values.lat);
      formData.append("lon", values.lon);
      formData.append("file", image);
      console.log(formData, values);

      // Call the API with formData
      const result = await createSite(formData);
      if (result) {
        formik.resetForm();
        toggleAddSiteModal();
        resetStates();
      }
    },
  });

  const [markerPosition, setMarkerPosition] = useState({
    lat: -3.745,
    lon: -38.523,
  });

  const { createSite, isLoading } = useSiteStore((state) => state);

  const fieldsToRender = [
    { fieldName: "name", label: "Name", fullWidth: false },
    { fieldName: "address", label: "Address", fullWidth: false },
    {
      fieldName: "phone",
      label: "Phone",
      fullWidth: false,
      inputProps: {
        maxLength: 10,
      },
    },
    { fieldName: "lat", label: "Latitude", fullWidth: false },
    { fieldName: "lon", label: "Longitude", fullWidth: false },
    // {
    //   fieldName: "file",
    //   label: "File",
    //   type: "file",
    //   fullWidth: false,
    //   inputProps: {
    //     onChange: (event) => {
    //       const file = event.target.files[0];
    //       formik.setFieldValue("file", file);
    //     },
    //   },
    // },
  ];

  const resetStates = () => {
    setMarkerPosition({ lat: -3.745, lon: -38.523 });
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lon: lng });
        formik.setFieldValue("lat", lat);
        formik.setFieldValue("lon", lng);
      },
      dragend(e) {
        const { lat, lng } = e.target.getLatLng();
        setMarkerPosition({ lat, lon: lng });
        formik.setFieldValue("lat", lat);
        formik.setFieldValue("lon", lng);
      },
    });

    return markerPosition ? (
      <Marker
        icon={customIcon}
        position={[markerPosition.lat, markerPosition.lon]}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            setMarkerPosition({ lat, lon: lng });
            formik.setFieldValue("lat", lat);
            formik.setFieldValue("lon", lng);
          },
        }}
      />
    ) : null;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setImage(base64);
  };
  return (
    <Modal isOpen={showAddSiteModal} toggle={toggleAddSiteModal}>
      <ModalHeader toggle={toggleAddSiteModal}>{t("Add New Site")}</ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap">
          {fieldsToRender.map((field) => (
            <div
              key={field.fieldName}
              className={`flex-fill mb-2 ${field.fullWidth ? "w-100" : ""}`}
              style={field.fullWidth ? {} : { width: "48%", marginRight: 2 }}
            >
              {RenderFormikInput(formik, field)}
            </div>
          ))}

          <Label htmlFor={"image"} className="w-100 form-label mt-1">
            {t("Image")}
          </Label>
          <input
            style={{
              padding: "0.5rem",
              // border: "1px black solid",
              width: "100%",
            }}
            className="bg-gradient rounded-3 "
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e)}
          />
          <Label htmlFor={"location"} className="w-100 form-label mt-1">
            {t("Location")}
          </Label>
          <MapContainer
            center={[markerPosition.lat, markerPosition.lon]}
            zoom={10}
            style={{ height: "200px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="success"
          onClick={formik.handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size={"sm"} /> : <span>{t("Add")}</span>}
        </Button>
        <Button
          color="danger"
          onClick={() => {
            toggleAddSiteModal();
            formik.resetForm();
            resetStates();
          }}
          disabled={isLoading}
        >
          {t("Cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
