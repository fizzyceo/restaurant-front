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
} from "reactstrap";
import { useSpaceStore } from "../../../../stores/Assets/space";

const validTypes = ["MAJLISS", "OFFICE", "DEPARTMENT"];
const languages = [
  {
    label: "ENGLISH",
    value: "EN",
  },
  {
    label: "ARABIC",
    value: "AR",
  },
];
const AddSpace = ({
  kitchenList,
  menuList,
  siteList,
  showAddSpaceModal,
  toggleAddSpaceModal,
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState(
    siteList[0]?.site_id || null
  );

  const [selectedKichenId, setSelectedKichenId] = useState(
    kitchenList[0]?.kitchen_id || null
  );
  const [selectedMenuId, setSelectedMenuId] = useState(
    menuList[0]?.menu_id || null
  );
  const { createSpace, isLoading } = useSpaceStore((state) => state);

  const [currKitchens, setCurrentKitchens] = useState([]);
  const [currMenus, setCurrMenus] = useState([]);
  useEffect(() => {
    if (selectedSiteId) {
      console.log(kitchenList, menuList, selectedSiteId);

      const filteredKitchens = kitchenList.filter(
        (kitchen) => kitchen?.site?.site_id === parseInt(selectedSiteId)
      );
      const filteredMenus = menuList.filter(
        (menu) =>
          menu?.sites.length > 0 &&
          menu?.sites[0].site_id === parseInt(selectedSiteId)
      );
      setCurrMenus(filteredMenus);
      setCurrentKitchens(filteredKitchens);
    }
  }, [selectedSiteId]);
  const formik = useFormik({
    initialValues: {
      name: "",
      name_ar: "",
      default_lang: "",
      type: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required")),
      name_ar: Yup.string().optional(),
      default_lang: Yup.string().required(t("Required")),
      type: Yup.string()
        .oneOf(validTypes, t("Invalid type"))
        .required(t("Required")),
    }),
    onSubmit: async (values) => {
      const spaceData = {
        name: values.name,
        name_ar: values.name_ar,
        default_lang: values.default_lang,
        type: values.type,
      };
      console.log(spaceData);

      const result = await createSpace(
        selectedSiteId,
        spaceData,
        selectedKichenId,
        selectedMenuId
      );
      if (result) {
        formik.resetForm();
        setSelectedSiteId(siteList[0]?.site_id || null); // Reset to first site after submission
        toggleAddSpaceModal();
      }
    },
  });

  return (
    <Modal isOpen={showAddSpaceModal} toggle={toggleAddSpaceModal}>
      <ModalHeader toggle={toggleAddSpaceModal}>
        {t("Add New Space")}
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column flex-wrap"
        >
          <div className="flex-fill mb-2">
            <Label for="site">{t("Select Site")}</Label>
            <select
              id="site"
              onChange={(e) => setSelectedSiteId(e.target.value)}
              value={selectedSiteId}
              className="form-control"
            >
              <option value="">Select</option>
              {siteList.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.site_id} - {site.name}
                </option>
              ))}
            </select>
          </div>
          {selectedSiteId && (
            <>
              <div className="flex-fill mb-2">
                <Label for="Kitchen">{t("Select Kitchen")}</Label>
                <select
                  id="Kitchen"
                  onChange={(e) => setSelectedKichenId(e.target.value)}
                  value={selectedKichenId}
                  className="form-control"
                >
                  {currKitchens.map((kitchen) => (
                    <option key={kitchen.kitchen_id} value={kitchen.kitchen_id}>
                      {kitchen.kitchen_id} - {kitchen.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-fill mb-2">
                <Label for="Menu">{t("Select Menu")}</Label>
                <select
                  id="Menu"
                  onChange={(e) => setSelectedMenuId(e.target.value)}
                  value={selectedMenuId}
                  className="form-control"
                >
                  {currMenus.map((menu) => (
                    <option key={menu.menu_id} value={menu.menu_id}>
                      {menu.menu_id} - {menu.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

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
            {formik.errors.name_ar && (
              <div className="text-danger">{formik.errors.name_ar}</div>
            )}
          </div>
          <div className="flex-fill mb-2">
            <Label for="default_lang">{t("Default Language")}</Label>
            <select
              id="default_lang"
              name="default_lang"
              onChange={formik.handleChange}
              value={formik.values.default_lang}
              className="form-control"
            >
              <option value="" label={t("Select Lang")} />
              {languages.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                  label={type.label}
                />
              ))}
            </select>
            {formik.errors.default_lang && (
              <div className="text-danger">{formik.errors.default_lang}</div>
            )}
          </div>

          <div className="flex-fill mb-2">
            <Label for="type">{t("Type")}</Label>
            <select
              id="type"
              name="type"
              onChange={formik.handleChange}
              value={formik.values.type}
              className="form-control"
            >
              <option value="" label={t("Select type")} />
              {validTypes.map((type) => (
                <option key={type} value={type} label={type} />
              ))}
            </select>
            {formik.errors.type && (
              <div className="text-danger">{formik.errors.type}</div>
            )}
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
            <Button type="submit" color="success" disabled={isLoading}>
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <span>{t("Add Space")}</span>
              )}
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleAddSpaceModal();
                formik.resetForm();
                setSelectedSiteId(siteList[0]?.site_id || null); // Reset to first site on cancel
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

export default AddSpace;
