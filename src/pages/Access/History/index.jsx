import React, { useEffect } from "react";
import { t } from "i18next";
import { useStaffStore } from "../../../stores/Staffs";
import { useAccessHistoryStore } from "../../../stores/AccessHistory";
import HistoryTable from "./HistoryTable";

const History = () => {
  const title = "EASYVAM | History";
  // API Call

  useEffect(() => {
    document.title = title;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = "/logo-sm.png";
    } else {
      // If no favicon link exists, create a new one
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.type = "image/png";
      newFavicon.href = "/logo-sm.png";
      document.head.appendChild(newFavicon);
    }
  }, []);

  const { getAccessHistory, history, isLoading } = useAccessHistoryStore(
    (state) => state
  );

  useEffect(() => {
    getAccessHistory();
  }, []);

  const columns = [
    {
      name: t("#"),
      // width: "100px",
      selector: (row) => row.code,
      sortable: false,
      wrap: true,
    },
    {
      name: t("Action"),
      // width: "100px",
      selector: (row) => row.firstName,
      sortable: false,
      wrap: true,
      format: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      name: t("Date"),
      // width: "100px",
      selector: (row) => row.email,
      sortable: false,
      wrap: true,
    },
    {
      name: t("Transporteur"),
      // width: "100px",
      selector: (row) => row.roles,
      sortable: false,
      wrap: true,
      format: (row) => row.roles.join(",")?.toUpperCase(),
    },
    {
      name: t("Chauffeur"),
      // width: "100px",
      selector: (row) => row.about,
      sortable: false,
      wrap: true,
    },
    {
      name: t("NP"),
      // width: "100px",
      selector: (row) => row.status,
      sortable: false,
      wrap: true,
    },
    {
      name: t("Imm. Remorque"),
      // width: "100px",
      selector: (row) => row.permissions,
      sortable: false,
      wrap: true,
      format: (row) => row.permissions.join(" , ")?.toUpperCase(),
    },
    {
      name: t("Imm. Tracteur"),
      // width: "100px",
      selector: (row) => row.permissions,
      sortable: false,
      wrap: true,
      format: (row) => row.permissions.join(" , ")?.toUpperCase(),
    },
    {
      name: t("Chargé"),
      // width: "100px",
      selector: (row) => row.permissions,
      sortable: false,
      wrap: true,
      format: (row) => row.permissions.join(" , ")?.toUpperCase(),
    },
    {
      name: t("N. Plamb"),
      // width: "100px",
      selector: (row) => row.permissions,
      sortable: false,
      wrap: true,
      format: (row) => row.permissions.join(" , ")?.toUpperCase(),
    },
    {
      name: t("Dest./Prov."),
      // width: "100px",
      selector: (row) => row.permissions,
      sortable: false,
      wrap: true,
      format: (row) => row.permissions.join(" , ")?.toUpperCase(),
    },
  ];

  return (
    <>
      <HistoryTable />
    </>
  );
};
export default History;
