import React, { useEffect, useState } from "react";
import DataTableBase from "../../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useSiteStore } from "../../../stores/Assets/site";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import { AddSite } from "./Components/AddSite";
import EditSite from "./Components/EditSite";
import { useLocation } from "react-router-dom";
const Sites = () => {
  const title = "BASSEER | SITES";
  const [totalRows, setTotalRows] = useState(0);

  document.title = title; // API Call
  const location = useLocation();
  const siteId = new URLSearchParams(location.search).get("siteId");
  const { getSites, isLoading, sites } = useSiteStore((state) => state);

  useEffect(() => {
    if (siteId) {
      getSites({ search: siteId });
    }
  }, [siteId]);
  useEffect(() => {
    getSites();
  }, []);

  useEffect(() => {
    setTotalRows(sites?.length || 0);
  }, [sites]);
  const columns = [
    {
      name: t("Name"),
      // width: "100px",
      selector: (row) => row?.name,
      sortable: true,
      wrap: true,
    },

    {
      name: t("location"),
      // width: "100px",
      selector: (row) => row?.location,
      sortable: true,
      wrap: true,
    },
    {
      name: t("GPS"),
      // width: "190px",
      selector: (row) => row?.coordinates[0],
      sortable: true,
      wrap: true,
      // format: (row) =>
      //   `lat: ${row?.location?.coordinates[0]} lng: ${row?.location?.coordinates[1]}`,
      cell: (row) => (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${row?.location?.coordinates[0]?.toFixed(
            6
          )},${row?.location?.coordinates[1]?.toFixed(6)}`}
          target="_blank"
          className="link-style"
          rel="noopener noreferrer"
        >
          <strong>
            {row?.location?.coordinates[0]?.toFixed(6)},{" "}
            {row?.location?.coordinates[1]?.toFixed(6)}
          </strong>
        </a>
        //  <span>
        //     {row?.location?.coordinates[0]?.toFixed(6)},
        //     {row?.location?.coordinates[1]?.toFixed(6)}
        //   </span>
      ),
    },
    {
      name: t("Kitchens"),
      // width: "95px",
      // selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="cursor-normal" id={`anchor-${row?.code}`}>
          <span
            className={`badge   bg-soft-success text-success text-uppercase`}
          >
            x
          </span>
          <UncontrolledTooltip placement="top" target={`anchor-${row?.code}`}>
            {" "}
            check Associated Kitchens
          </UncontrolledTooltip>
        </div>
      ),
    },
    {
      name: t("Spaces"),
      // width: "95px",
      // selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="cursor-normal" id={`anchor-${row?.code}`}>
          <span className={`badge bg-soft-success text-success text-uppercase`}>
            x
          </span>
          <UncontrolledTooltip placement="top" target={`anchor-${row?.code}`}>
            {" "}
            check Associated Spaces
          </UncontrolledTooltip>
        </div>
      ),
    },
  ];

  const searchHandler = (searchText) => {
    getSites({
      search: searchText,
    });
  };

  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [showEditSiteModal, setShowEditSiteModal] = useState(false);
  const toggleAddSiteModal = () => {
    setShowAddSiteModal(!showAddSiteModal);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const toggleEditSiteModal = (row) => {
    setSelectedRow(row);
    setShowEditSiteModal(!showEditSiteModal);
  };

  const onChangePage = (page) => {
    getSites({
      page: page,
    });
  };
  return (
    <>
      <DataTableBase
        tableTitle={"SITES"}
        data={sites}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={totalRows}
        onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        onHeaderAddBtnClick={toggleAddSiteModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        onRowEditBtnClick={toggleEditSiteModal}
        // onRowDeleteBtnClick={deleteDevice}
        onSearchIconClick={searchHandler}
        actionColWidth="100px"
        showSearch={true}
        showSubHeader={true}
        showActionButtons={true}
      />

      <AddSite
        toggleAddSiteModal={toggleAddSiteModal}
        showAddSiteModal={showAddSiteModal}
      />
      {selectedRow && (
        <EditSite
          toggleModal={toggleEditSiteModal}
          showModal={showEditSiteModal}
          rowData={selectedRow}
        />
      )}
    </>
  );
};

export default Sites;
