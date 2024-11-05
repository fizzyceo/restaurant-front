import React, { useState } from "react";
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
} from "reactstrap";
import { FormControlLabel, Switch } from "@mui/material";
import { useKitchenStore } from "../../../../stores/Assets/kitchen";

const AddKitchen = ({
  siteList,
  menuId,
  showAddKitchenModal,
  toggleAddKitchenModal,
}) => {
  const [openingHours, setOpeningHours] = useState([
    { dayOfWeek: "MONDAY", openTime: "", closeTime: "", timezone: "+00:00" },
  ]);
  const { createKitchen, isLoading } = useKitchenStore((state) => state);
  const [selectedSiteId, setSelectedSiteId] = useState(
    siteList[0]?.site_id || null
  );
  const formik = useFormik({
    initialValues: {
      name: "",
      name_ar: "",
      isOpen: true,
      isWeeklyTimingOn: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required")),
      name_ar: Yup.string().optional(),
      isOpen: Yup.boolean().required(t("Required")),
      isWeeklyTimingOn: Yup.boolean().required(t("Required")),
    }),
    onSubmit: async (values) => {
      // if (
      //   values.isWeeklyTimingOn &&
      //   openingHours.every(
      //     (hour) => !hour.dayOfWeek || !hour.openTime || !hour.closeTime
      //   )
      // ) {
      //   return; // Prevent submission if no opening hours are filled
      // }
      console.log(values);

      let kitchenData = {
        name: values.name,
        name_ar: values.name_ar,
        site_id: selectedSiteId,
        isOpen: true,
        isWeeklyTimingOn: false,
        openingHours: values.isWeeklyTimingOn ? openingHours : [],
      };
      // console.log(values.isWeeklyTimingOn);

      // if (values.isWeeklyTimingOn)
      //   kitchenData = { ...kitchenData, openingHours: [] };
      // // Call the API to create the kitchen

      console.log(kitchenData);

      const result = await createKitchen(kitchenData);
      if (result) {
        formik.resetForm();
        setOpeningHours([
          {
            dayOfWeek: "MONDAY",
            openTime: "",
            closeTime: "",
            timezone: "+00:00",
          },
        ]); // Reset opening hours
        toggleAddKitchenModal();
      }
    },
  });

  // const addOpeningHour = () => {
  //   if (
  //     openingHours.some(
  //       (hour) => !hour.dayOfWeek || !hour.openTime || !hour.closeTime
  //     )
  //   ) {
  //     return; // Prevent adding a new opening hour if the current one is incomplete
  //   }
  //   setOpeningHours([
  //     ...openingHours,
  //     { dayOfWeek: "TUESDAY", openTime: "", closeTime: "", timezone: "+00:00" },
  //   ]);
  // };

  // const handleOpeningHourChange = (index, field, value) => {
  //   const newOpeningHours = [...openingHours];
  //   newOpeningHours[index][field] = value;
  //   setOpeningHours(newOpeningHours);
  // };

  // const removeOpeningHour = (index) => {
  //   const newOpeningHours = openingHours.filter((_, i) => i !== index);
  //   setOpeningHours(newOpeningHours);
  // };

  return (
    <Modal isOpen={showAddKitchenModal} toggle={toggleAddKitchenModal}>
      <ModalHeader toggle={toggleAddKitchenModal}>
        {t("Add New Kitchen")}
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column flex-wrap"
        >
          <div className="flex-fill mb-2">
            <Label for="name">{t("Name")}</Label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="form-control"
            />
            {formik.errors.name && (
              <div className="text-danger">{formik.errors.name}</div>
            )}
          </div>
          <div className="flex-fill mb-2">
            <Label for="name_ar">{t("Name (AR)")}</Label>
            <input
              type="text"
              id="name_ar"
              name="name_ar"
              onChange={formik.handleChange}
              value={formik.values.name_ar}
              className="form-control"
            />
            {formik.errors.name && (
              <div className="text-danger">{formik.errors.name_ar}</div>
            )}
          </div>
          <div className="flex-fill mb-2">
            <Label for="site_id">{t("Select Site")}</Label>
            <select
              id="site_id"
              onChange={(e) => setSelectedSiteId(e.target.value)}
              value={selectedSiteId}
              className="form-control"
            >
              {formik.errors.name && (
                <div className="text-danger">{formik.errors.site_id}</div>
              )}
              {siteList.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          {/* <FormControlLabel
            control={
              <Switch
                checked={formik.values.isOpen}
                onChange={(event) =>
                  formik.setFieldValue("isOpen", event.target.checked)
                }
              />
            }
            label={t("Is Open")}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isWeeklyTimingOn}
                onChange={(event) =>
                  formik.setFieldValue("isWeeklyTimingOn", event.target.checked)
                }
              />
            }
            label={t("Apply Weekly Opening Time")}
          />

          {formik.values.isWeeklyTimingOn && (
            <>
              <Label className="mt-3">{t("Opening Hours")}</Label>
              {openingHours.map((hour, index) => (
                <div key={index} className="d-flex mb-2 align-items-center">
                  <select
                    value={hour.dayOfWeek}
                    onChange={(e) =>
                      handleOpeningHourChange(
                        index,
                        "dayOfWeek",
                        e.target.value
                      )
                    }
                    className="form-control me-2"
                  >
                    {[
                      "MONDAY",
                      "TUESDAY",
                      "WEDNESDAY",
                      "THURSDAY",
                      "FRIDAY",
                      "SATURDAY",
                      "SUNDAY",
                    ].map((day) => (
                      <option key={day} value={day}>
                        {t(day)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={hour.openTime}
                    onChange={(e) =>
                      handleOpeningHourChange(index, "openTime", e.target.value)
                    }
                    className="form-control me-2"
                    required
                  />
                  <input
                    type="time"
                    value={hour.closeTime}
                    onChange={(e) =>
                      handleOpeningHourChange(
                        index,
                        "closeTime",
                        e.target.value
                      )
                    }
                    className="form-control me-2"
                    required
                  />
                  <Button
                    color="danger"
                    outline
                    onClick={() => removeOpeningHour(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                color="primary"
                outline
                onClick={addOpeningHour}
                disabled={openingHours.some(
                  (hour) => !hour.dayOfWeek || !hour.openTime || !hour.closeTime
                )}
              >
                Add Opening Hour
              </Button>
            </>
          )} */}

          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button
              type="submit"
              color="success"
              disabled={
                isLoading ||
                (formik.values.isWeeklyTimingOn &&
                  openingHours.every(
                    (hour) =>
                      !hour.dayOfWeek || !hour.openTime || !hour.closeTime
                  ))
              }
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <span>{t("Add Kitchen")}</span>
              )}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleAddKitchenModal();
                formik.resetForm();
                setOpeningHours([
                  {
                    dayOfWeek: "MONDAY",
                    openTime: "",
                    closeTime: "",
                    timezone: "+00:00",
                  },
                ]);
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

export default AddKitchen;
