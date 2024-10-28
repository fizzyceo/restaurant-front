import React, { useEffect, useState } from "react";
import DataTableBase from "../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useStaffStore } from "../../stores/Staffs";
import { useConfirmDialogStore } from "../../stores/Modal/ConfirmDialogStore";
import EditUser from "./components/EditUser";
import AddUser from "./components/AddUser";

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
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  // role, canCallTeaboy, image_url, name,email,user_id,phone, isVerified,
  const columns = [
    {
      name: t("User ID"),
      width: "100px",
      selector: (row) => row.user_id,
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
      width: "150px",
      selector: (row) => row.role,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Can Call Teaboy"),
      selector: (row) => (row.canCallTeaboy ? t("Yes") : t("No")),
      sortable: true,
      wrap: true,
    },
    {
      name: t("Signup"),
      selector: (row) => (row.signedUp ? t("Yes") : t("No")),
      sortable: true,
      wrap: true,
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
      selector: (row) => (row.isVerified ? t("Verified") : t("Not Verified")),
      sortable: true,
      wrap: true,
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
  return (
    <>
      <DataTableBase
        tableTitle={title}
        data={users}
        columns={columns}
        loading={isLoading}
        // paginationTotalRows={total}
        // onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        onHeaderAddBtnClick={toggleCreateModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={setToFalsePositive}
        // onRowDeleteBtnClick={deleteDevice}
        // onSearchIconClick={searchHandler}
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
        )} // showSearch={true}
        showSubHeader={true}
        // showActionButtons={true}
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
