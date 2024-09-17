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
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Input,
  Spinner,
} from "reactstrap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useOptionStore } from "../../../stores/Assets/ItemOptions";

const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
});

export const OptionsModal = ({ isOpen, toggle, itemId }) => {
  const [defaultChoice, setDefaultChoice] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [optionList, setOptionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { getOptions, options, createOption } = useOptionStore(
    (state) => state
  );

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        await getOptions(itemId);
      } catch (error) {
        console.error("Failed to fetch options", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) {
      fetchOptions();
    }
  }, [itemId, isOpen, getOptions]);

  useEffect(() => {
    setOptionList(options);
  }, [options]);

  const formik = useFormik({
    initialValues: {
      name: "",
      choices: [""],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Option name is required"),
      choices: Yup.array()
        .of(Yup.string().required("Choice is required"))
        .min(1, "At least one choice is required"),
    }),
    onSubmit: async (values) => {
      setCreating(true);
      try {
        const formattedOption = {
          name: values.name,
          choices: values.choices.map((choice) => ({ name: choice })),
          default_choice: { name: defaultChoice },
        };
        await createOption(itemId, formattedOption);
        // onAddOption(formattedOption); // Uncomment if needed
        // toggle(); // Uncomment if you want to close the modal on submit
        // setIsFormVisible(false); // Uncomment if you want to hide the form on submit
      } catch (error) {
        console.error("Failed to create option", error);
      } finally {
        setCreating(false);
      }
    },
  });

  const handleAddChoice = () => {
    if (formik.values.choices.every((choice) => choice.trim() !== "")) {
      formik.setFieldValue("choices", [...formik.values.choices, ""]);
    }
  };

  const handleChangeChoice = (index, value) => {
    const updatedChoices = formik.values.choices.slice();
    updatedChoices[index] = value;
    formik.setFieldValue("choices", updatedChoices);
  };

  const handleSetDefaultChoice = (choice) => {
    setDefaultChoice(choice);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>{t("View Options")}</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
            <p>{t("Loading options...")}</p>
          </div>
        ) : (
          <>
            {/* Display current options */}
            <div className="d-flex flex-column gap-4 mb-2">
              {optionList.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {optionList.map((opt, indx) => (
                    <Card
                      key={opt?.option_id}
                      className="shadow-sm mb-0"
                      style={{ border: "1px solid #ddd" }}
                    >
                      <CardBody>
                        <div className="d-flex flex-row align-items-center justify-content-between">
                          <CardTitle tag="h6" className="mb-2">
                            {opt?.name}
                          </CardTitle>
                          <div className="d-flex flex-row flex-wrap gap-2">
                            {opt?.choices.map((choice) => (
                              <Button
                                key={choice?.choice_id}
                                color={
                                  opt?.defaultChoice?.choice_id ===
                                  choice?.choice_id
                                    ? "success"
                                    : "info"
                                }
                                outline
                                className={`m-1 ${
                                  opt?.defaultChoice?.choice_id ===
                                  choice?.choice_id
                                    ? "bg-success text-light"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSetDefaultChoice(choice?.name)
                                }
                              >
                                {choice?.name}
                              </Button>
                            ))}
                          </div>
                          <CardSubtitle tag="h6" className="text-muted mb-2">
                            {t("Option")}
                          </CardSubtitle>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p>{t("No Options for this Item...")}</p>
                </div>
              )}
            </div>

            {/* Form to add new options */}
            {isFormVisible && (
              <div className="d-flex flex-column gap-3">
                <h5>{t("Add New Option")}</h5>
                <form
                  onSubmit={formik.handleSubmit}
                  className="d-flex flex-column gap-3"
                >
                  <div className="d-flex flex-row gap-3">
                    <div className="flex-fill">
                      <Label for="name">{t("Option Name")}</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        {...formik.getFieldProps("name")}
                        invalid={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        placeholder={t("Enter option name")}
                      />
                    </div>
                    <div className="flex-fill">
                      <Label for="choices" className="d-block">
                        {t("Choices")}
                      </Label>
                      {formik.values.choices.map((choice, index) => (
                        <div
                          key={index}
                          className="d-flex gap-2 align-items-center"
                        >
                          <Input
                            type="text"
                            value={choice}
                            onChange={(e) =>
                              handleChangeChoice(index, e.target.value)
                            }
                            placeholder={t("Enter choice")}
                            className="mb-2"
                          />
                          <Button
                            color="info"
                            outline
                            onClick={() => handleSetDefaultChoice(choice)}
                            className={`ml-2 ${
                              defaultChoice === choice
                                ? "bg-success text-light"
                                : ""
                            }`}
                          >
                            {defaultChoice === choice
                              ? t("Default")
                              : t("Default")}
                          </Button>
                        </div>
                      ))}
                      <Button
                        color="secondary"
                        outline
                        onClick={handleAddChoice}
                        disabled={
                          formik.values.choices[
                            formik.values.choices.length - 1
                          ].trim() === ""
                        }
                      >
                        {t("Add Choice")}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    color="success"
                    outline
                    className="mt-3 w-100"
                    disabled={formik.values.name.trim() === "" || creating}
                  >
                    {creating ? <Spinner size="sm" /> : t("Create Option")}
                  </Button>
                </form>
              </div>
            )}

            <Button
              color="primary"
              outline
              className="mt-3"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              {isFormVisible ? t("Cancel") : t("Add New Option")}
            </Button>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={() => toggle()}>
          {t("Cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
