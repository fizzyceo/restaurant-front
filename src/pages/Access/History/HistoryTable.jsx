import React, { useEffect, useState } from "react";
import DataTableBase from "../../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useStaffStore } from "../../../stores/Staffs";
import { useAccessHistoryStore } from "../../../stores/AccessHistory";
import cocher from "../../../assets/images/coche.png";
import faux from "../../../assets/images/faux.png";
import { HistoryTableFilters } from "./HistoryTableFilters";
import EditModel from "./EditModel";
import AddModel from "./AddModel";
import { useAuth } from "../../../stores";
import { useConfirmDialogStore } from "../../../stores/Modal/ConfirmDialogStore";
import moment from "moment";

const HistoryTable = () => {
  const title = "Access History";
  const user = useAuth((state) => state.user);
  const { showConfirm } = useConfirmDialogStore((state) => state);
  const [generalSearch, setGeneralSearch] = useState("");

  // API Call
  const { getStaffs, isLoading, isError, staffs, deleteDevice } = useStaffStore(
    (state) => state
  );
  const { getAccessHistory, history, deleteHistory, filters, setFilters } =
    useAccessHistoryStore((state) => state);

  useEffect(() => {
    getStaffs();
    getAccessHistory && getAccessHistory();
  }, []);
  useEffect(() => {
    console.log(history);
  }, [history]);
  const cancelFilter = () => {
    getAccessHistory({});
    setFilters({});
  };
  const columns = [
    {
      name: t("Date"),
      // width: "100px",
      selector: (row) => moment(row.date).format("DD.MM.YYYY HH:mm"),
      sortable: false,
      wrap: true,
    },
    {
      name: t("Action"),
      // width: "100px",
      selector: (row) => row.access,
      sortable: false,
      wrap: true,
      cell: (row) => (
        <strong
          style={{
            margin: "0 auto",
            color: row.access == "IN" ? "green" : "red",
          }}
        >
          {row.access === "IN" ? "Entrée" : "Sortie"}
        </strong>
      ),
    },

    {
      name: t("Transporteur"),
      // width: "100px",
      selector: (row) => row.transporter,
      sortable: false,
      wrap: true,
      cell: (row) => (
        <strong
          style={{
            margin: "0 auto",
            color: row.transporter === "NUMILOG" && "#7FC7D9",
          }}
        >
          {row.transporter}
        </strong>
      ),
    },
    {
      name: t("Chauffeur"),
      // width: "100px",
      selector: (row) => row.driverName,
      sortable: false,
      wrap: true,
    },
    {
      name: t("NP"),
      // width: "100px",
      selector: (row) => row.NumPC,
      sortable: false,
      wrap: true,
    },
    {
      name: t("Imm. Remorque"),
      // width: "100px",
      selector: (row) => row.immatriculationRemorque,
      sortable: false,
      wrap: true,
    },
    {
      name: t("Imm. Tracteur"),
      // width: "100px",
      selector: (row) => row.immatriculationTracteur,
      sortable: false,
      wrap: true,
    },
    {
      name: t("Chargé"),
      // width: "100px",
      selector: (row) => row.charger,
      sortable: false,
      wrap: true,
      cell: (row) => (
        <strong
          style={{
            margin: "0 auto",
            color: row.charger == true ? "green" : "red",
          }}
        >
          {row.charger === true ? "Chargé" : "Vide"}
        </strong>
      ),
    },
    {
      name: t("N. Plamb"),
      // width: "100px",
      selector: (row) => row.NumPlomb,
      sortable: false,
      wrap: true,
    },
    {
      name: t("Dest./Prov."),
      // width: "100px",
      selector: (row) => row.DestProv,
      sortable: false,
      wrap: true,
      // format: (row) => row.permissions.join(" , ")?.toUpperCase(),
    },
  ];

  const fillInFilters = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;

    if (inputName === "general") {
      // If the inputName is "general", update the filter for general search
      setFilters({
        ...filters,
        search: inputValue,
      });
      setGeneralSearch(inputValue);
    } else {
      // For other filters, update normally
      setFilters({ ...filters, [inputName]: inputValue });
    }
  };
  const columnsFilters = [
    {
      name: "general",
      label: t("Par Identifiant"),
      onChange: fillInFilters,
      value: generalSearch,
      type: "text",
    },

    {
      name: "charger",
      label: t("Chargé"),
      onChange: fillInFilters,
      selectOptions: [
        { value: true, displayText: "oui" },
        { value: false, displayText: "non" },
      ],
      type: "select",
    },
    {
      name: "date",
      label: t("Date"),
      onChange: (e) => {
        console.log(filters);
        setFilters({ ...filters, dateFrom: e[0], dateTo: e[1] });
      },
      value: filters.date,

      type: "date",
    },
    // {
    //   name: "access",
    //   label: t("Action"),
    //   onChange: fillInFilters,
    //   selectOptions: [
    //     { value: "IN", displayText: "Entrée" },
    //     { value: "OUT", displayText: "Sortir" },
    //   ],
    //   type: "select",
    // },
  ];
  const filterData = () => {
    console.log(filters);
    getAccessHistory(filters);
  };
  const [showAddModel, setShowAddModel] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const toggleAddModal = () => {
    setShowAddModel((state) => !state);
  };
  const [selectedRow, setSelectedRow] = useState(null);

  const toggleEditModal = (row) => {
    setSelectedRow(row);
    setShowEditModel((state) => !state);
  };

  return (
    <>
      <DataTableBase
        tableTitle={
          <div className="d-flex align-items-center justify-content-between ">
            <h5>{title}</h5>
            {user?.roles?.includes("superAdmin") && (
              <button
                onClick={toggleAddModal}
                className="border-0 p-2 rounded-2 bg-secondary text-bg-secondary"
              >
                Ajouter
              </button>
            )}
          </div>
        }
        data={history}
        columns={columns}
        loading={isLoading}
        // paginationTotalRows={total}
        // onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        // onHeaderAddBtnClick={toggleCreateModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={setToFalsePositive}
        // onRowDeleteBtnClick={deleteHistory}
        // onSearchIconClick={searchHandler}
        actionColWidth="100px"
        // showSearch={true}
        // showSubHeader={true}
        // showActionButtons={true}
        onHeaderAddBtnClick={toggleAddModal}
        onRowEditBtnClick={toggleEditModal}
        onRowDeleteBtnClick={deleteHistory}
        showActionColumn={user?.roles?.includes("superAdmin") ? true : false}
        // customActionBtns={(row) => (
        //   <>

        //     <button
        //       className="btn btn-sm btn-danger"
        //       onClick={() => {
        //         showConfirm(() => {
        //           deleteHistory(row._id);
        //         });
        //       }}
        //       title="Delete"
        //     >
        //       <i className="ri-delete-bin-line"></i>
        //     </button>
        //   </>
        // )}
      >
        <HistoryTableFilters
          filters={columnsFilters}
          onFilterButtonClick={filterData}
          onCancelButtonClick={cancelFilter}
        />
      </DataTableBase>
      <EditModel
        showEditModel={showEditModel}
        toogleEditModel={toggleEditModal}
        selectedRow={selectedRow}
      />
      <AddModel showAddModel={showAddModel} toggleAddModal={toggleAddModal} />
    </>
  );
};
export default HistoryTable;
