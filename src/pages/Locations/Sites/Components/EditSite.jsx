import React, { useEffect, useState } from "react";
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

export const EditSite = ({
  rowData,
  showEditSiteModal,
  toggleEditSiteModal,
}) => {
  const [image, setImage] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 25.3915064012387,
    lon: 51.52052143438087,
  });

  const { updateSite, isLoading } = useSiteStore((state) => state);

  const fieldsToRender = [
    { fieldName: "name", label: "Name", fullWidth: false },
    { fieldName: "name_ar", label: "Name (AR)", fullWidth: false },
    { fieldName: "address", label: "City", fullWidth: false },
    { fieldName: "address_ar", label: "City (AR)", fullWidth: false },
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
  ];
  useEffect(() => {
    if (rowData) {
      console.log(rowData);

      // Set initial values if rowData changes
      formik.setValues({
        name: rowData?.name || "",
        name_ar: rowData?.name_ar || "",
        address: rowData?.address || "",
        address_ar: rowData?.address_ar || "",
        phone: rowData?.phone || "",
        lat: rowData?.latitude || "",
        lon: rowData?.longitude || "",
      });

      setMarkerPosition({
        lat: rowData.latitude || 25.39,
        lon: rowData.longitude || 51.52,
      });
    }
  }, [rowData]);
  const formik = useFormik({
    initialValues: {
      site_id: rowData?.site_id || "", // Include the id in the initial values

      name: rowData?.name || "",
      name_ar: rowData?.name_ar || "",
      address: rowData?.address || "",
      address_ar: rowData?.address_ar || "",
      phone: rowData?.phone || "",
      latitude: rowData?.latitude || "",
      longitude: rowData?.longitude || "",
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().optional(),
      name_ar: Yup.string().optional(),
      address: Yup.string().optional(),
      address_ar: Yup.string().optional(),
      phone: Yup.string().optional(),
      latitude: Yup.number().optional(),
      longitude: Yup.number().optional(),
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
      const formData = new FormData();

      // Conditionally append values that are not null or empty
      if (formik.values.name) {
        formData.append("name", formik.values.name);
      }
      if (formik.values.name_ar) {
        formData.append("name_ar", formik.values.name_ar);
      }
      if (formik.values.address) {
        formData.append("address", formik.values.address);
      }
      if (formik.values.address_ar) {
        formData.append("address_ar", formik.values.address_ar);
      }
      if (formik.values.phone) {
        formData.append("phone", formik.values.phone);
      }
      if (formik.values.latitude) {
        formData.append("latitude", String(formik.values.latitude)); // Convert to string if necessary
      }
      if (formik.values.longitude) {
        formData.append("longitude", String(formik.values.longitude)); // Convert to string if necessary
      }
      if (formik.values.file) {
        formData.append("file", formik.values.file); // Ensure this is a File object
      }

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      try {
        // Call updateSite with id and formData
        await updateSite(formik.values.site_id, formData);
        formik.resetForm();
        resetStates();
        toggleEditSiteModal();
      } catch (error) {
        console.error("Error updating site:", error);
      }
    } else {
      console.log("Form is invalid or not dirty");
    }
  };

  const resetStates = () => {
    setMarkerPosition({ lat: 21.39, lon: 51.52 });
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
    <Modal isOpen={showEditSiteModal} toggle={toggleEditSiteModal}>
      <ModalHeader toggle={toggleEditSiteModal}>
        {t("Modify Site: ", rowData?.name, " - ", rowData?.name_ar)}
      </ModalHeader>
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
            zoom={8}
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
              {isLoading ? <Spinner size={"sm"} /> : <span>{t("Edit")}</span>}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleEditSiteModal();
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
