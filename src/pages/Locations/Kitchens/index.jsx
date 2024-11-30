import React, { useEffect, useState } from "react";
import DataTableBase from "../../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useKitchenStore } from "../../../stores/Assets/kitchen";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import AddKitchen from "./Components/AddKitchen";
import EditKitchen from "./Components/EditKitchen";
import { useLocation } from "react-router-dom";
import { useConfirmDialogStore } from "../../../stores/Modal/ConfirmDialogStore";
import { OpeningHours } from "./Components/OpeningHours";
import ShowToken from "./Components/ShowToken";
import { useSiteStore } from "../../../stores/Assets/site";
import { Pagination } from "../../../Components/Common/DataTableBase/Pagination";

// const Pagination = ({ currentPage, totalRows, rowsPerPage, onPageChange }) => {
//   const totalPages = Math.ceil(totalRows / rowsPerPage);

//   const handlePageClick = (page) => {
//     onPageChange(page);
//   };

//   const renderPageNumbers = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageNumbers.push(
//         <li
//           key={i}
//           className={`page-item ${currentPage === i ? "active" : ""}`}
//           onClick={() => handlePageClick(i)}
//         >
//           <span className="page-link">{i}</span>
//         </li>
//       );
//     }
//     return pageNumbers;
//   };

//   return (
//     <div className="pagination-container">
//       <ul className="pagination">{renderPageNumbers()}</ul>
//     </div>
//   );
// };

const Kitchens = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Display 5 rows per page
  document.title = "ClickOrder Admin";
  const location = useLocation();
  // const KitchenId = new URLSearchParams(location.search).get("KitchenId");
  const [showOpeningHoursModal, setshowOpeningHoursModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedInfo, setselectedInfo] = useState("");
  const [selectedToken, setselectedToken] = useState("");
  const [kitchenId, setKitchenID] = useState("");
  const { getKitchens, isLoading, kitchens, deleteKitchen } = useKitchenStore(
    (state) => state
  );
  const { getSites } = useSiteStore((state) => state);
  const [sites, setSites] = useState([]); // State to hold sites
  const [selectedSiteId, setSelectedSiteId] = useState("All"); // State for selected site
  const [filteredKitchens, setFilteredKitchens] = useState([]); // State for filtered kitchens

  useEffect(() => {
    const fetchSites = async () => {
      const siteList = await getSites(); // Fetch sites
      setSites(siteList);

      // if (siteList.length > 0) {
      //   console.log(siteList);

      //   setSelectedSiteId(siteList[0].site_id); // Set the first site as selected by default
      // }
    };

    fetchSites(); // Call the fetch function

    getKitchens(); // Fetch kitchens
  }, [getKitchens, getSites]);

  useEffect(() => {
    const filterKitchens = () => {
      if (selectedSiteId === "All") {
        setFilteredKitchens(kitchens);
      } else {
        const filtered = kitchens.filter(
          (kitchen) => kitchen.site_id === parseInt(selectedSiteId)
        );

        setFilteredKitchens(filtered);
      }
      setTotalRows(filteredKitchens.length);
    };

    filterKitchens();
  }, [kitchens, selectedSiteId]);

  const handleScheduleClick = (row) => {
    setselectedInfo(row);
    setshowOpeningHoursModal(!showOpeningHoursModal);
  };
  const handleTokenClick = (row) => {
    setselectedToken(row?.token);
    setKitchenID(row?.kitchen_id);
    setShowTokenModal(!showTokenModal);
  };

  // useEffect(() => {
  //   setTotalRows(kitchens?.length || 0);
  //   console.log(kitchens);
  // }, [kitchens]);
  const columns = [
    //add id column
    {
      name: t("ID"),
      width: "80px",
      selector: (row) => row?.kitchen_id,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Site"),
      // width: "100px",
      selector: (row) => row?.site_id,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>
            {row?.site?.name} (id: {row?.site?.site_id})
          </span>
        </div>
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
      // width: "100px",
      selector: (row) => row?.name,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.name_ar}</span>
        </div>
      ),
    },
    {
      name: t("isOpen"),
      width: "90px",
      selector: (row) => row?.isOpen,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div
          style={{ fontSize: "14px" }}
          className={`badge cursor-normal bg-soft-${
            row.isOpen ? "success" : "danger"
          } text-${row.isOpen ? "success" : "danger"}`}
        >
          {row.isOpen ? "Open" : "Closed"}
        </div>
      ),
    },

    {
      name: t("OpeningHours"),
      width: "150px",

      selector: (row) => row?.isWeeklyTimingOn,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="cursor-pointer" id={`anchor-${row?.kitchen_id}`}>
          <span
            style={{ fontSize: "14px" }}
            className={`badge bg-soft-${
              row?.isWeeklyTimingOn ? "info" : "warning"
            } cursor-pointer text-${
              row?.isWeeklyTimingOn ? "success" : "warning"
            } text-uppercase`}
            onClick={() => handleScheduleClick(row)}
          >
            {<i className="ri-external-link-line"></i>}{" "}
            {row?.isWeeklyTimingOn ? "Hours" : "None"}
          </span>
          <UncontrolledTooltip
            placement="top"
            target={`anchor-${row?.kitchen_id}`}
          >
            {row?.menuItem_options?.length > 0
              ? "Check Associated Options"
              : "No options available"}
          </UncontrolledTooltip>
        </div>
      ),
    },
    {
      name: t("Token"),
      width: "110px",

      selector: (row) => row?.token,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="cursor-pointer" id={`anchor-${row?.token}`}>
          <span
            style={{ fontSize: "14px" }}
            className={`badge bg-soft-success cursor-pointer text-success text-uppercase`}
            onClick={() => handleTokenClick(row)}
          >
            {<i className="ri-external-link-line"></i>} Token
          </span>
          <UncontrolledTooltip placement="top" target={`anchor-${row?.token}`}>
            Check Associated Token
          </UncontrolledTooltip>
        </div>
      ),
    },
  ];

  const searchHandler = (searchText) => {
    // getKitchens({
    //   search: searchText,
    // });
  };
  const { showConfirm } = useConfirmDialogStore((state) => state);

  const [showAddKitchenModal, setShowAddKitchenModal] = useState(false);
  const [showEditKitchenModal, setShowEditKitchenModal] = useState(false);
  const [currentKitchens, setCurrentKitchens] = useState([]);
  const toggleAddKitchenModal = () => {
    setShowAddKitchenModal(!showAddKitchenModal);
  };
  const toggleShowTokenModal = () => {
    setShowTokenModal(!showTokenModal);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const toggleEditKitchenModal = (row) => {
    setSelectedRow(row);
    setShowEditKitchenModal(!showEditKitchenModal);
  };

  const onChangePage = (page) => {
    getKitchens({
      page: page,
    });
  };

  const deleteKitchenFun = async (id) => {
    try {
      await deleteKitchen(id);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSiteSelect = (e) => {
    setSelectedSiteId(e.target.value);
  };

  useEffect(() => {
    if (filteredKitchens.length > 0) {
      const curr = filteredKitchens.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
      setCurrentKitchens(curr);
    } else {
      setCurrentKitchens([]);
    }
  }, [currentPage, filteredKitchens]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <DataTableBase
        tableTitle={"KitchenS"}
        data={currentKitchens} // Display current paginated data
        columns={columns}
        loading={isLoading}
        paginationTotalRows={filteredKitchens.length}
        onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        onHeaderAddBtnClick={toggleAddKitchenModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={toggleEditKitchenModal}
        // onRowDeleteBtnClick={toggleDeleteKitchenModal}
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
                toggleEditKitchenModal(row);
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
                    deleteKitchenFun(row.kitchen_id);
                  },
                  () => {
                    console.log("Cancelled");
                  },
                  "Confirmation", // Title of the confirmation dialog
                  `Are you sure you want to delete kitchen with ID ${row.kitchen_id}?` // Question displayed in the dialog
                );
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
      >
        {sites.length > 0 && (
          <div className="d-flex align-items-center mb-3 justify-content-center gap-2">
            <h5 className="text-nowrap">For Site: </h5>
            <select
              className="form-control"
              value={selectedSiteId}
              onChange={handleSiteSelect}
            >
              <option key={"all"} value={"All"}>
                {"All"}
              </option>
              {sites.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </DataTableBase>

      <Pagination
        currentPage={currentPage}
        totalRows={filteredKitchens.length}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />

      {showAddKitchenModal && (
        <AddKitchen
          siteList={sites}
          toggleAddKitchenModal={toggleAddKitchenModal}
          showAddKitchenModal={showAddKitchenModal}
        />
      )}
      {showOpeningHoursModal && (
        <OpeningHours
          isOpen={showOpeningHoursModal}
          toggle={() => setshowOpeningHoursModal(!showOpeningHoursModal)}
          kitchenId={selectedInfo}
        />
      )}
      {showTokenModal && (
        <ShowToken
          kitchenId={kitchenId}
          showTokenModal={showTokenModal}
          toggleShowTokenModal={() => setShowTokenModal(!showTokenModal)}
          selectedToken={selectedToken}
        />
      )}
      {selectedRow && (
        <EditKitchen
          siteList={sites}
          toggleEditKitchenModal={toggleEditKitchenModal}
          showEditKitchenModal={showEditKitchenModal}
          info={selectedRow}
        />
      )}
    </>
  );
};

export default Kitchens;
