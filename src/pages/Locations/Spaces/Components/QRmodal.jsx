import { t } from "i18next";
import React from "react";
import { QRCode } from "react-qrcode-logo";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./styling.css";
const QRmodal = ({ info, showQRCode, toggleQRModal }) => {
  return (
    <Modal isOpen={showQRCode} toggle={toggleQRModal}>
      <ModalHeader toggle={toggleQRModal}>{t("QR CODE")}</ModalHeader>
      <ModalBody className="d-flex align-items-center justify-content-center">
        <div
          className="d-flex flex-column align-items-center justify-content-center shadow-lg p-4 rounded"
          style={{ backgroundColor: "#fff" }}
        >
          {info?.encrypted ? (
            <>
              <QRCode
                value={`https://prod.teaboy.io/menu/${info?.encrypted}`}
                size={300}
                eyeRadius={10}
                ecLevel="H"
                logoPaddingStyle="circle"
                bgColor="#0000"
                logoImage={info?.menu_site_image}
              />
              <h3 className="cursor-pointer mt-3 hover-underline">
                {info?.menu_name} - {info?.space_name}
              </h3>
            </>
          ) : (
            <div>Not linked to any menu...</div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default QRmodal;
