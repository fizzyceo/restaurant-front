import React, { useEffect, useState } from "react";
import DataTableBase from "../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useStaffStore } from "../../stores/Staffs";
import { useConfirmDialogStore } from "../../stores/Modal/ConfirmDialogStore";
import EditUser from "./components/EditUser";
import AddUser from "./components/AddUser";
import moment from "moment";

export const StaffsPage = () => {
  const title = "Users";
  // API Call
  const { getAllUsers, isLoading, isError, users, deleteUser } = useStaffStore(
    (state) => state
  );
  const { showConfirm } = useConfirmDialogStore((state) => state);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditingModal, setshowEditingModal] = useState(false);
  const [showAddingModal, setshowAddingModal] = useState(false);

  // Pagination State
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableDataPerPage, setTableDataPerPage] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);
  useEffect(() => {
    setTotalRows(users.length);
  }, [users]);

  const displayRole = (role) => {
    let formattedRole = role?.toUpperCase();
    if (formattedRole === "SUPER_ADMIN" || formattedRole === "ROOT") {
      return "ROOT";
    } else if (formattedRole === "ADMIN") {
      return "ADMIN";
    } else if (formattedRole === "NORMAL_USER" || formattedRole === "USER") {
      return "USER";
    }
    return "";
  };

  // Calculate the current data slice

  const columns = [
    {
      name: t("ID"),
      width: "100px",
      selector: (row) => row.user_id,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Created"),
      width: "120px",
      selector: (row) => moment(row?.created_at).format("YY/MM/DD hh:mm"),
      sortable: true,
      wrap: true,
    },
    {
      name: t("Name"),
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Email"),
      width: "250px",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Role"),
      width: "90px",
      selector: (row) => row.role,
      sortable: true,
      wrap: true,
      cell: (row) => <div>{displayRole(row.role)}</div>,
    },
    {
      name: t("Call Teaboy"),
      selector: (row) => row.canCallTeaboy,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div
          style={{ fontSize: "14px" }}
          className={`badge cursor-normal bg-soft-${
            row.canCallTeaboy ? "success" : "danger"
          } text-${row.canCallTeaboy ? "success" : "danger"}`}
        >
          {row.canCallTeaboy ? "Yes" : "No"}
        </div>
      ),
    },
    {
      name: t("Registered"),
      selector: (row) => row.signedUp,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div
          style={{ fontSize: "14px" }}
          className={`badge cursor-normal bg-soft-${
            row.signedUp ? "success" : "danger"
          } text-${row.signedUp ? "success" : "danger"}`}
        >
          {row.signedUp ? "Yes" : "No"}
        </div>
      ),
    },
    {
      name: t("Image"),
      width: "80px",
      selector: (row) => row.image_url,
      sortable: false,
      cell: (row) =>
        row.image_url ? (
          <img src={row.image_url} alt={row.name} width={50} />
        ) : (
          "N/A"
        ),
      wrap: true,
    },
    {
      name: t("Phone"),
      selector: (row) => row.phone,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Verified"),
      selector: (row) => row.isVerified,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div
          style={{ fontSize: "14px" }}
          className={`badge cursor-normal bg-soft-${
            row.isVerified ? "success" : "danger"
          } text-${row.isVerified ? "success" : "danger"}`}
        >
          {row.isVerified ? "Yes" : "No"}
        </div>
      ),
    },
  ];

  const toggleEditUserModal = (row) => {
    setSelectedRow(row);
    setshowEditingModal(!showEditingModal);
  };

  const toggleCreateModal = () => {
    setshowAddingModal(!showAddingModal);
  };

  const deleteUserFun = async (id) => {
    try {
      await deleteUser(id);
    } catch (e) {
      console.log(e);
    }
  };
  const onChangePage = (page) => {};
  useEffect(() => {
    setTotalRows(users.length);
  }, [users]);
  return (
    <>
      <DataTableBase
        tableTitle={title}
        data={users} // Pass only the current slice of data
        columns={columns}
        loading={isLoading}
        paginationTotalRows={users.length}
        onChangePage={onChangePage} // Handle page change
        // onChangeRowsPerPage={onChangeRowsPerPage} // Handle rows per page change
        pagination
        onHeaderAddBtnClick={toggleCreateModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        actionColWidth="100px"
        customActionBtns={(row) => (
          <>
            <button
              className="btn btn-sm btn-warning"
              onClick={() => toggleEditUserModal(row)}
              title="Edit"
            >
              <i className="ri-edit-fill"></i>
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                showConfirm(() => {
                  deleteUserFun(row.user_id);
                });
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
        showSubHeader={true}
        showActionColumn={true}
      />

      {showEditingModal && (
        <EditUser
          rowData={selectedRow}
          showEditUserModal={showEditingModal}
          toggleEditUserModal={() => setshowEditingModal(!showEditingModal)}
        />
      )}
      {showAddingModal && (
        <AddUser
          showAddingModal={showAddingModal}
          toggleCreateModal={() => setshowAddingModal(!showAddingModal)}
        />
      )}
    </>
  );
};
