import React, { useEffect, useState } from "react";

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

export const OpeningHours = ({ isOpen, toggle, info }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>{t("View Opening Hours")}</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
            <p>{t("Loading Schedule...")}</p>
          </div>
        ) : (
          <>
            {/* Display current options */}
            <div className="d-flex flex-column gap-4 mb-2"></div>
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
