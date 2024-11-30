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
import { toast } from "react-toastify";
import { useConfirmDialogStore } from "../../../stores/Modal/ConfirmDialogStore";

const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
});

export const OptionsModal = ({ isOpen, toggle, itemId }) => {
  const [defaultChoice, setDefaultChoice] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [optionList, setOptionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const { getOptions, options, createOption, updateOption, deleteOption } =
    useOptionStore((state) => state);
  const { showConfirm } = useConfirmDialogStore((state) => state);

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
      name_ar: "",
      choices: [{ name: "", name_ar: "" }],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Option name is required"),
      name_ar: Yup.string().optional(),
      choices: Yup.array()
        .of(
          Yup.object({
            name: Yup.string().required("Choice name is required"),
            name_ar: Yup.string().optional(),
          })
        )
        .min(1, "At least one choice is required"),
    }),
    onSubmit: async (values) => {
      setCreating(true);
      console.log(defaultChoice);

      if (
        !defaultChoice?.name ||
        (editingOptionId && !defaultChoice.menu_item_option_choice_id)
      ) {
        toast.error("Select a default choice please.");
        setCreating(false);
        return;
      }

      try {
        const formattedOption = {
          menu_item_option_id: editingOptionId || null, // Include ID if editing
          name: values.name,
          name_ar: values.name_ar,
          choices: values.choices.map((choice, index) => ({
            menu_item_option_choice_id:
              choice.menu_item_option_choice_id || null, // Include ID if available
            name: choice.name,
            name_ar: choice.name_ar,
          })),
          default_choice: defaultChoice,
        };

        if (editingOptionId) {
          await updateOption(itemId, formattedOption, editingOptionId);
        } else {
          await createOption(itemId, formattedOption);
        }

        setEditingOptionId(null);
        formik.resetForm();
        setDefaultChoice(null);
      } catch (error) {
        console.error("Failed to create or update option", error);
      } finally {
        setCreating(false);
      }
    },
  });

  const handleAddChoice = () => {
    if (
      formik.values.choices.every(
        (choice) => choice.name.trim() !== "" && choice.name_ar.trim() !== ""
      )
    ) {
      formik.setFieldValue("choices", [
        ...formik.values.choices,
        { name: "", name_ar: "", menu_item_option_choice_id: null }, // Temporary ID
      ]);
    }
  };

  const handleChangeChoice = (index, field, value) => {
    const updatedChoices = formik.values.choices.slice();
    updatedChoices[index][field] = value;
    formik.setFieldValue("choices", updatedChoices);
  };

  const handleRemoveChoice = (index) => {
    const removedChoice = formik.values.choices[index];
    const updatedChoices = formik.values.choices.filter((_, i) => i !== index);

    formik.setFieldValue("choices", updatedChoices);

    // Check if the removed choice was the default choice
    if (
      defaultChoice &&
      removedChoice.menu_item_option_choice_id ===
        defaultChoice.menu_item_option_choice_id
    ) {
      // Reset default choice
      if (updatedChoices.length > 0) {
        // Optionally, set the first choice as the new default
        setDefaultChoice(updatedChoices[0]);
      } else {
        setDefaultChoice(null); // No choices left
      }
    }
  };

  const handleSetDefaultChoice = (choice) => {
    console.log(choice);

    setDefaultChoice(choice);
  };

  const handleEditOption = (option) => {
    setEditingOptionId(option.menu_item_option_id);
    formik.setValues({
      name: option.name,
      name_ar: option.name_ar,
      choices: option.choices.map((choice) => ({
        name: choice.name,
        name_ar: choice.name_ar,
        menu_item_option_choice_id: choice.menu_item_option_choice_id, // Save the choice ID for editing
      })),
    });
    console.log(option);

    console.log(defaultChoice);
    setDefaultChoice(option.default_choice);
    console.log(option.default_choice);
    setIsFormVisible(true);
  };

  const handleDeleteOption = async (optionId) => {
    await deleteOption(itemId, optionId);
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
            <div className="d-flex flex-column gap-4 mb-2">
              {optionList.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {optionList.map((opt) => (
                    <Card
                      key={opt?.menu_item_option_id}
                      className="shadow-sm mb-0"
                      style={{ border: "1px solid #ddd" }}
                    >
                      <CardBody>
                        <div className="d-flex flex-row align-items-end justify-content-end gap-2 ">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              handleEditOption(opt);
                            }}
                            title="Edit"
                          >
                            <i className="ri-edit-fill"></i>{" "}
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              showConfirm(
                                () => {
                                  handleDeleteOption(opt?.menu_item_option_id);
                                },
                                () => {
                                  console.log("Cancelled");
                                },
                                "Confirmation", // Title of the confirmation dialog
                                `Are you sure you want to delete the option?` // Question displayed in the dialog
                              );
                            }}
                            title="Delete"
                          >
                            <i className="ri-delete-bin-fill"></i>{" "}
                          </button>
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-between">
                          <CardTitle tag="h6" className="mb-2">
                            {opt?.name} {opt?.name_ar && "-"} {opt?.name_ar}
                          </CardTitle>
                          <div className="d-flex flex-row align-items-center gap-2">
                            <div className="d-flex flex-row flex-wrap gap-2">
                              {opt?.choices.map((choice) => (
                                <Button
                                  key={choice?.menu_item_option_choice_id}
                                  color={
                                    opt?.default_choice
                                      ?.menu_item_option_choice_id ===
                                    choice?.menu_item_option_choice_id
                                      ? "success"
                                      : "info"
                                  }
                                  outline
                                  className={`m-1 ${
                                    opt?.default_choice
                                      ?.menu_item_option_choice_id ===
                                    choice?.menu_item_option_choice_id
                                      ? "bg-success text-light"
                                      : ""
                                  }`}
                                  // onClick={() => handleSetDefaultChoice(choice)}
                                >
                                  {choice?.name} {choice?.name_ar && "-"}{" "}
                                  {choice?.name_ar}
                                </Button>
                              ))}
                            </div>
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

            {/* Form to add or edit options */}
            {isFormVisible && (
              <div className="d-flex flex-column gap-3">
                <h5>
                  {editingOptionId ? t("Edit Option") : t("Add New Option")}
                </h5>
                <form
                  onSubmit={formik.handleSubmit}
                  className="d-flex flex-column gap-3"
                >
                  <div className="d-flex flex-row gap-3">
                    <div className="flex-fill">
                      <Label for="name">{t("Title")}</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        {...formik.getFieldProps("name")}
                        invalid={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        placeholder={t("Ex. Sugar")}
                      />
                    </div>
                    <div className="flex-fill">
                      <Label for="name_ar">{t("(AR)")}</Label>
                      <Input
                        type="text"
                        id="name_ar"
                        name="name_ar"
                        {...formik.getFieldProps("name_ar")}
                        invalid={
                          formik.touched.name_ar &&
                          Boolean(formik.errors.name_ar)
                        }
                        placeholder={t("Ex. السكر")}
                      />
                    </div>
                    <div className="flex-fill">
                      <div
                        style={{ gap: "110px" }}
                        className="d-flex align-items-center"
                      >
                        <Label for="choice" className="d-block">
                          {t("Choices")}
                        </Label>
                        <Label for="choice_ar" className="mx- d-block">
                          {t("(AR)")}
                        </Label>
                      </div>
                      {formik.values.choices.map((choice, index) => (
                        <div
                          key={index}
                          className="d-flex gap-2 align-items-center justify-content-center"
                        >
                          <Input
                            type="text"
                            name="choice"
                            value={choice.name}
                            onChange={(e) =>
                              handleChangeChoice(index, "name", e.target.value)
                            }
                            placeholder={t("Ex. Yes")}
                            className="mb-2"
                          />
                          <Input
                            type="text"
                            name="choice_ar"
                            value={choice.name_ar}
                            onChange={(e) =>
                              handleChangeChoice(
                                index,
                                "name_ar",
                                e.target.value
                              )
                            }
                            placeholder={t("Ex. نعم")}
                            className="mb-2"
                          />
                          <Button
                            color="danger"
                            className="rounded-5 py-0 px-1"
                            onClick={() => handleRemoveChoice(index)}
                          >
                            <i className="ri-subtract-line"></i>{" "}
                          </Button>
                          <Button
                            color="info"
                            outline
                            onClick={() => handleSetDefaultChoice(choice)}
                            className={`ml-2 ${
                              defaultChoice?.name === choice.name
                                ? "bg-success text-light"
                                : ""
                            }`}
                          >
                            {defaultChoice?.name === choice.name
                              ? t("Default")
                              : t("Set as Default")}
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
                          ].name === "" ||
                          formik.values.choices[
                            formik.values.choices.length - 1
                          ].name_ar === ""
                        }
                      >
                        {t("Add Choice")}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {!isFormVisible && (
          <Button color="primary" onClick={() => setIsFormVisible(true)}>
            {t("Create Option")}
          </Button>
        )}
        {isFormVisible && (
          <Button
            color="success"
            onClick={formik.handleSubmit}
            disabled={creating}
          >
            {creating ? <Spinner size="sm" color="light" /> : t("Save")}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};
