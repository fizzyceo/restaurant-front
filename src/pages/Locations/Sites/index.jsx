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
import { EditSite } from "./Components/EditSite";
import { useLocation } from "react-router-dom";
import { useConfirmDialogStore } from "../../../stores/Modal/ConfirmDialogStore";
import { Pagination } from "../../../Components/Common/DataTableBase/Pagination";
const Sites = () => {
  const [totalRows, setTotalRows] = useState(0);

  document.title = "ClickOrder Admin";
  const location = useLocation();
  const siteId = new URLSearchParams(location.search).get("siteId");
  const { getSites, isLoading, sites, deleteSite } = useSiteStore(
    (state) => state
  );

  useEffect(() => {
    if (siteId) {
      getSites({ search: siteId });
    }
  }, [siteId]);
  useEffect(() => {
    getSites();
  }, []);

  useEffect(() => {
    console.log(sites);

    setTotalRows(sites?.length || 0);
  }, [sites]);
  const columns = [
    {
      name: t("ID"),
      width: "80px",
      selector: (row) => row?.site_id,
      sortable: true,
      wrap: true,
    },

    {
      name: t("LOGO"),
      // width: "100px",
      selector: (row) => row.image_url,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <img
          src={row.image_url}
          style={{ borderRadius: "100%" }}
          width={28}
          alt=""
        />
      ),
    },

    {
      name: t("Name"),
      // width: "100px",
      selector: (row) => row?.name,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.name}</span>
        </div>
      ),
    },

    {
      name: t("Name (AR)"),
      // width: "100px", //row?.name
      selector: (row) => row?.name_ar,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.name_ar}</span>
        </div>
      ),
    },
    {
      name: t("City"),
      // width: "100px",
      selector: (row) => row?.address,
      sortable: true,
      wrap: true,
    },
    {
      name: t("City (AR)"),
      // width: "100px",
      selector: (row) => row?.address_ar,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Phone"),
      // width: "100px",
      selector: (row) => row?.phone,
      sortable: true,
      wrap: true,
    },
    {
      name: t("GPS"),
      // width: "190px",
      selector: (row) => row?.lat,
      sortable: true,
      wrap: true,
      // format: (row) =>
      //   `lat: ${row?.location?.coordinates[0]} lng: ${row?.location?.lon}`,
      cell: (row) => (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${row?.latitude?.toFixed(
            6
          )},${row?.longitude?.toFixed(6)}`}
          target="_blank"
          className="link-style"
          rel="noopener noreferrer"
        >
          <strong>
            {row?.latitude?.toFixed(6)}, {row?.longitude?.toFixed(6)}
          </strong>
        </a>
        //  <span>
        //     {row?.location?.lat?.toFixed(6)},
        //     {row?.location?.lon?.toFixed(6)}
        //   </span>
      ),
    },
    // {
    //   name: t("Kitchens"),
    //   // width: "95px",
    //   // selector: (row) => row?.status,
    //   sortable: true,
    //   wrap: true,
    //   cell: (row) => (
    //     <div className="cursor-normal" id={`anchor-${row?.code}`}>
    //       <span
    //         style={{ fontSize: "14px" }}
    //         className={`badge bg-soft-info  cursor-pointer text-success text-uppercase`}
    //       >
    //         <i className="ri-external-link-line"></i>{" "}
    //       </span>
    //       <UncontrolledTooltip placement="top" target={`anchor-${row?.code}`}>
    //         {" "}
    //         check Associated Kitchens
    //       </UncontrolledTooltip>
    //     </div>
    //   ),
    // },
    {
      name: t("Spaces"),
      // width: "95px",
      // selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <a
          href={`/spaces?siteId=${row?.site_id}`}
          className="cursor-normal"
          id={`anchor-${row?.site_id}`}
        >
          <span
            style={{ fontSize: "14px" }}
            className={`badge bg-soft-info cursor-pointer text-success text-uppercase`}
          >
            <i className="ri-external-link-line"></i>
          </span>
          <UncontrolledTooltip
            placement="top"
            target={`anchor-${row?.site_id}`}
          >
            {" "}
            check Associated Spaces
          </UncontrolledTooltip>
        </a>
      ),
    },
  ];

  const searchHandler = (searchText) => {
    // getSites({
    //   search: searchText,
    // });
  };
  const { showConfirm } = useConfirmDialogStore((state) => state);

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

  const deleteSiteFun = async (id) => {
    try {
      await deleteSite(id);
    } catch (e) {
      console.log(e);
    }
  };

  const [currentSites, setCurrentSites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Display 5 rows per page
  useEffect(() => {
    if (sites.length > 0) {
      const curr = sites.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
      setCurrentSites(curr);
    }
  }, [currentPage, sites]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <DataTableBase
        tableTitle={"SITES"}
        data={currentSites}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={totalRows}
        onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        onHeaderAddBtnClick={toggleAddSiteModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={toggleEditSiteModal}
        // onRowDeleteBtnClick={toggleDeleteSiteModal}
        onSearchIconClick={searchHandler}
        actionColWidth="100px"
        showSearch={false}
        showSubHeader={true}
        showActionButtons={true}
        customActionBtns={(row) => (
          <>
            <button
              className="btn btn-sm btn-warning"
              onClick={() => {
                toggleEditSiteModal(row);
              }}
              title="Edit"
            >
              <i className="ri-edit-fill"></i>{" "}
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                showConfirm(() => {
                  deleteSiteFun(row.site_id);
                });
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
      />
      <Pagination
        currentPage={currentPage}
        totalRows={sites.length}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
      <AddSite
        toggleAddSiteModal={toggleAddSiteModal}
        showAddSiteModal={showAddSiteModal}
      />
      {selectedRow && (
        <EditSite
          toggleEditSiteModal={toggleEditSiteModal}
          showEditSiteModal={showEditSiteModal}
          rowData={selectedRow}
        />
      )}
    </>
  );
};

export default Sites;
