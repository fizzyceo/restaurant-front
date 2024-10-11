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

const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
});

export const AddSite = ({ showAddSiteModal, toggleAddSiteModal }) => {
  const [image, setImage] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: -3.745,
    lon: -38.523,
  });

  const { createSite, isLoading } = useSiteStore((state) => state);

  const fieldsToRender = [
    { fieldName: "name", label: "Name", fullWidth: false },
    { fieldName: "name_ar", label: "Name (AR)", fullWidth: false },
    { fieldName: "address", label: "Address", fullWidth: false },
    { fieldName: "address_ar", label: "Address (AR)", fullWidth: false },
    {
      fieldName: "phone",
      label: "Phone",
      fullWidth: false,
      inputProps: {
        maxLength: 10,
      },
    },
    { fieldName: "latitude", label: "Latitude", fullWidth: false },
    { fieldName: "longitude", label: "Longitude", fullWidth: false },
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      name_ar: "",
      address: "",
      address_ar: "",
      phone: "",
      latitude: "",
      longitude: "",
      file: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required")),
      name_ar: Yup.string().required(t("Required")),
      address: Yup.string().required(t("Required")),
      address_ar: Yup.string().required(t("Required")),
      phone: Yup.string().required(t("Required")),
      latitude: Yup.number().required(t("Required")),
      longitude: Yup.number().required(t("Required")),
      file: Yup.mixed().optional(),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);
      // Your submission logic here
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formik.values);

    if (formik.isValid) {
      console.log("Submitting form manually with values:", formik.values);
      const formData = new FormData();
      formData.append("name", formik.values.name);
      formData.append("name_ar", formik.values.name_ar);
      formData.append("address", formik.values.address);
      formData.append("address_ar", formik.values.address_ar);
      formData.append("phone", formik.values.phone);
      formData.append("latitude", formik.values.latitude);
      formData.append("longitude", formik.values.longitude);
      formData.append("file", formik.values.file); // Note: Ensure image is a file object, not base64 string

      // Debug log to see formData contents
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Call the API with formData
      const result = await createSite(formData);
      formik.resetForm();
      toggleAddSiteModal();
      resetStates();

      // Your submission logic here
    } else {
      console.log("Form is invalid or not dirty");
    }
  };

  const resetStates = () => {
    setMarkerPosition({ lat: -3.745, lon: -38.523 });
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lon: lng });
        formik.setFieldValue("latitude", lat);
        formik.setFieldValue("longitude", lng);
      },
      dragend(e) {
        const { lat, lng } = e.target.getLatLng();
        setMarkerPosition({ lat, lon: lng });
        formik.setFieldValue("latitude", lat);
        formik.setFieldValue("longitude", lng);
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
            formik.setFieldValue("latitude", lat);
            formik.setFieldValue("longitude", lng);
          },
        }}
      />
    ) : null;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("file", file); // Set the file object in Formik
  };

  return (
    <Modal isOpen={showAddSiteModal} toggle={toggleAddSiteModal}>
      <ModalHeader toggle={toggleAddSiteModal}>{t("Add New Site")}</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="d-flex flex-wrap">
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
            style={{ padding: "0.5rem", width: "100%" }}
            className="bg-gradient rounded-3"
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
          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
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
          </div>
        </form>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
