import React, { useEffect, useState } from "react";
import DataTableBase from "../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import AddOrder from "./Components/AddOrder";
import EditOrder from "./Components/EditOrder";
import { useLocation } from "react-router-dom";
import { useConfirmDialogStore } from "../../stores/Modal/ConfirmDialogStore";
import { useOrderStore } from "../../stores/Orders";
const Orders = () => {
  const title = "BASSEER | OrderS";
  const [totalRows, setTotalRows] = useState(0);

  document.title = title; // API Call
  const { getOrders, isLoading, orders, deleteOrder } = useOrderStore(
    (state) => state
  );
  const ShowItemsModel = (Order_id) => {
    console.log("display items");
  };
  // useEffect(() => {
  //   if (OrderId) {
  //     getOrders({ search: OrderId });
  //   }
  // }, [OrderId]);
  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    console.log(orders);

    setTotalRows(orders?.length || 0);
  }, [orders]);
  const columns = [
    {
      name: t("ID"),
      // width: "100px",
      selector: (row) => row?.order_number,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.order_number}</span>
        </div>
      ),
    },
    {
      name: t("Space ID"),
      // width: "100px",
      selector: (row) => row?.spaceId,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.spaceId}</span>
        </div>
      ),
    },
    {
      name: t("Customer"),
      // width: "100px",
      selector: (row) => row?.customer_name,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.customer_name}</span>
        </div>
      ),
    },
    {
      name: t("User ID"),
      // width: "100px",
      selector: (row) => row?.user_id,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.user_id}</span>
        </div>
      ),
    },
    {
      name: t("Table Number"),
      // width: "100px",
      selector: (row) => row?.table_number,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.table_number}</span>
        </div>
      ),
    },
    {
      name: t("Items"),
      // width: "95px",
      // selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <a
          href={`/order-items/${row?.order_id}`}
          className="cursor-pointer"
          id={`anchor-${row?.order_id}`}
        >
          <span
            style={{ fontSize: "14px" }}
            className={`badge bg-soft-info cursor-pointer text-success text-uppercase`}
          >
            <i className="ri-external-link-line"></i>
            Check
          </span>
          <UncontrolledTooltip
            placement="top"
            target={`anchor-${row?.order_id}`}
          >
            {" "}
            check Associated Items
          </UncontrolledTooltip>
        </a>
      ),
    },
  ];

  const searchHandler = (searchText) => {
    // getOrders({
    //   search: searchText,
    // });
  };
  const { showConfirm } = useConfirmDialogStore((state) => state);

  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const toggleAddOrderModal = () => {
    setShowAddOrderModal(!showAddOrderModal);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const toggleEditOrderModal = (row) => {
    setSelectedRow(row);
    setShowEditOrderModal(!showEditOrderModal);
  };

  const onChangePage = (page) => {
    getOrders({
      page: page,
    });
  };

  const deleteOrderFun = async (id) => {
    try {
      await deleteOrder(id);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <DataTableBase
        tableTitle={"ORDERS"}
        data={orders}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={totalRows}
        onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        onHeaderAddBtnClick={toggleAddOrderModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={toggleEditOrderModal}
        // onRowDeleteBtnClick={toggleDeleteOrderModal}
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
                toggleEditOrderModal(row);
              }}
              title="Edit"
            >
              <i className="ri-edit-fill"></i>{" "}
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                showConfirm(() => {
                  deleteOrderFun(row.order_id);
                });
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
      />
      {showAddOrderModal && (
        <AddOrder
          toggleAddOrderModal={toggleAddOrderModal}
          showAddOrderModal={showAddOrderModal}
        />
      )}

      {selectedRow && (
        <EditOrder
          toggleEditOrderModal={toggleEditOrderModal}
          showEditOrderModal={showEditOrderModal}
          rowData={selectedRow}
        />
      )}
    </>
  );
};

export default Orders;
