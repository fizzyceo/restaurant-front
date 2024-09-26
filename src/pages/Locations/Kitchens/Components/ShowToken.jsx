import React, { useState } from "react";
import { t } from "i18next";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Alert,
  Input,
} from "reactstrap";
import { useKitchenStore } from "../../../../stores/Assets/kitchen";

const ShowToken = ({
  kitchenId,
  showTokenModal,
  toggleShowTokenModal,
  selectedToken,
}) => {
  const [token, setToken] = useState(selectedToken);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const { updateKitchen } = useKitchenStore((state) => state);
  const generateToken = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newToken = "";
    for (let i = 0; i < 6; i++) {
      newToken += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return newToken;
  };

  const regenerateToken = () => {
    setIsRegenerating(true);
    // Simulate token regeneration
    setTimeout(() => {
      const newToken = generateToken();
      setToken(newToken);
      setIsRegenerating(false);
      setShowSaveButton(true);
      setIsSaved(false);
    }, 1000);
  };

  const saveToken = async () => {
    await updateKitchen(kitchenId, { token: token });
    // Logic to save the token (e.g., to local storage or server)
    setIsSaved(true);
    // Optionally reset after a few seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(token)}`, "_blank");
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=Token Sharing&body=${encodeURIComponent(token)}`,
      "_blank"
    );
  };

  return (
    <Modal isOpen={showTokenModal} toggle={toggleShowTokenModal}>
      <ModalHeader toggle={toggleShowTokenModal}>{t("Token")}</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <Label>{t("Current Token")}</Label>
          <div className="token-display  d-flex align-items-center justify-content-between ">
            <Input
              name="token"
              className="form-control rounded-pill w-75"
              placeholder="Enter token"
              type="token"
              value={token || ""}
            />
            <Button
              color="primary"
              onClick={regenerateToken}
              disabled={isRegenerating}
            >
              {isRegenerating ? <Spinner size="sm" /> : t("Regenerate")}
            </Button>
          </div>
        </div>

        {showSaveButton && (
          <Button color="success" onClick={saveToken} className="ml-2">
            {isSaved ? t("Saved!") : t("Save")}
          </Button>
        )}
        {isSaved && (
          <Alert color="success" className="mt-2">
            {t("Token saved successfully!")}
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-between w-100">
          <div>
            <Button color="info" onClick={shareViaWhatsApp} className="mr-2">
              {t("Share via WhatsApp")}
            </Button>
            <Button color="info" onClick={shareViaEmail}>
              {t("Share via Email")}
            </Button>
          </div>
          <Button color="secondary" onClick={toggleShowTokenModal}>
            {t("Close")}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ShowToken;
