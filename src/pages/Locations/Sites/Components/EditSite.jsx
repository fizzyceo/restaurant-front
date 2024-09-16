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

export const EditSite = ({ rowData, showEditSiteModal, toggleEditSiteModal }) => {
  const [image, setImage] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: -3.745,
    lon: -38.523,
  });

  const { updateSite, isLoading } = useSiteStore((state) => state);

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
  ];

  const formik = useFormik({
    initialValues: {
      site_id: rowData?.site_id || "", // Include the id in the initial values

      name: rowData?.name || "",
      address: rowData?.address || "",
      phone: rowData?.phone || "",
      lat: rowData?.lat || "",
      lon: rowData?.lon || "",
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().optional(),
      address: Yup.string().optional(),
      phone: Yup.string().optional(),
      lat: Yup.number().optional(),
      lon: Yup.number().optional(),
      file: Yup.mixed().optional(),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);
      // Your submission logic here
    },
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(formik.values);
    
  //   if (formik.isValid) {
  //     console.log("Submitting form manually with values:", formik.values);
  //         const formData = new FormData();
  //     formData.append("name", formik.values.name);
  //     formData.append("address", formik.values.address);
  //     formData.append("phone", formik.values.phone);
  //     formData.append("lat", formik.values.lat);
  //     formData.append("lon", formik.values.lon);
  //     formData.append("file",  formik.values.file); // Note: Ensure image is a file object, not base64 string

  //     // Debug log to see formData contents
    
  //     // Call the API with formData
  //     const result = await updateSite(formik.values.site_id,formData);
  //       formik.resetForm();
  //       toggleEditSiteModal();
  //       resetStates();
      
  //     // Your submission logic here
  //   } else {
  //     console.log("Form is invalid or not dirty");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formik.values);

  if (formik.isValid) {
    const formData = new FormData();

    // Conditionally append values that are not null or empty
    if (formik.values.name) {
      formData.append("name", formik.values.name);
    }
    if (formik.values.address) {
      formData.append("address", formik.values.address);
    }
    if (formik.values.phone) {
      formData.append("phone", formik.values.phone);
    }
    if (formik.values.lat) {
      formData.append("lat", String(formik.values.lat)); // Convert to string if necessary
    }
    if (formik.values.lon) {
      formData.append("lon", String(formik.values.lon)); // Convert to string if necessary
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("file", file); // Set the file object in Formik
  };
  

  return (
    <Modal isOpen={showEditSiteModal} toggle={toggleEditSiteModal}>
      <ModalHeader toggle={toggleEditSiteModal}>{t("Modify Site: ", rowData?.name)}</ModalHeader>
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
          <Button
            type="submit"
            color="success"
            disabled={isLoading}
          >
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
      <ModalFooter>
       
      </ModalFooter>
    </Modal>
  );
};
