import React, { useEffect } from "react";
import DataTableBase from "../../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useStaffStore } from "../../../stores/Staffs";
import { useAccessHistoryStore } from "../../../stores/AccessHistory";
import HistoryTable from "./HistoryTable";

const History = () => {
  const title = "Access History";
  // API Call
  const { getStaffs, isLoading, isError, staffs, deleteDevice } = useStaffStore(
    (state) => state
  );
  const { getAccessHistory, history } = useAccessHistoryStore((state) => state);

  useEffect(() => {
    getStaffs();
    getAccessHistory();
    console.log(history);
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
      name: t("Nom Chauffeur"),
      // width: "100px",
      selector: (row) => row.about,
      sortable: false,
      wrap: true,
    },
    {
      name: t("N. P/C"),
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
      name: t("Charger"),
      // width: "100px",
      selector: (row) => row.permissions,
      sortable: false,
      wrap: true,
      format: (row) => row.permissions.join(" , ")?.toUpperCase(),
    },
    {
      name: t("N. plomb"),
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
