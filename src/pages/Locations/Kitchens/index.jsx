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
const Kitchens = () => {
  const [totalRows, setTotalRows] = useState(0);

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
  //   if (KitchenId) {
  //     getKitchens({ search: KitchenId });
  //   }
  // }, [KitchenId]);
  useEffect(() => {
    getKitchens();
  }, []);

  useEffect(() => {
    setTotalRows(kitchens?.length || 0);
    console.log(kitchens);
  }, [kitchens]);
  const columns = [
    //add id column
    {
      name: t("ID"),
      // width: "100px",
      selector: (row) => row?.kitchen_id,
      sortable: true,
      wrap: true,
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
      width: "100px",
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
            {row?.isWeeklyTimingOn ? "Opening Hours" : "No Opening Hours"}
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
            {<i className="ri-external-link-line"></i>} View Token
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
  return (
    <>
      <DataTableBase
        tableTitle={"KitchenS"}
        data={kitchens}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={totalRows}
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
        showSearch={true}
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
                showConfirm(() => {
                  deleteKitchenFun(row.kitchen_id);
                });
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
      />
      {showAddKitchenModal && (
        <AddKitchen
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
          toggleEditKitchenModal={toggleEditKitchenModal}
          showEditKitchenModal={showEditKitchenModal}
          info={selectedRow}
        />
      )}
    </>
  );
};

export default Kitchens;
