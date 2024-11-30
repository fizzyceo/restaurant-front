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
import Flatpickr from "react-flatpickr";

import { useConfirmDialogStore } from "../../stores/Modal/ConfirmDialogStore";
import { useOrderStore } from "../../stores/Orders";
import moment from "moment";
import { useSiteStore } from "../../stores/Assets/site";
import { useKitchenStore } from "../../stores/Assets/kitchen";
const Orders = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [filteredOrderList, setFilteredOrderList] = useState([]);

  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  ); // 24 hours ago
  const [endDate, setEndDate] = useState(new Date()); // current time

  document.title = "ClickOrder Admin";
  const { getOrders, isLoading, orders, deleteOrder } = useOrderStore(
    (state) => state
  );

  const [kitchenList, setKitchenList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("All");
  const [selectedKitchenId, setSelectedKitchenId] = useState("All");
  const { getSites } = useSiteStore((state) => state);
  const { getKitchens, kitchens } = useKitchenStore((state) => state);
  const handleKitchenChange = (e) => {
    setSelectedKitchenId(e.target.value);
  };

  const handleSiteChange = (e) => {
    setSelectedSiteId(e.target.value);
  };
  useEffect(() => {
    const fetchSites = async () => {
      const siteList = await getSites(); // Fetch sites
      setSiteList(siteList);
    };

    fetchSites(); // Call the fetch function

    getKitchens(); // Fetch kitchens
  }, [getSites]);
  useEffect(() => {
    if (kitchens.length > 0) {
      setKitchenList(kitchens);
    }
  }, [kitchens]);

  useEffect(() => {
    const filterOrderList = () => {
      if (selectedSiteId === "All") {
        setFilteredOrderList(orderList);
      } else {
        const filtered = orderList.filter(
          (order) => order?.space?.site_id === parseInt(selectedSiteId)
        );

        setFilteredOrderList(filtered);
      }
      setTotalRows(filteredOrderList.length);
    };

    filterOrderList();
  }, [orderList, selectedSiteId]);
  useEffect(() => {
    const filterOrderList = () => {
      if (selectedKitchenId === "All") {
        setFilteredOrderList(orderList);
      } else {
        const filtered = orderList.filter(
          (order) => order?.space?.kitchen_id === parseInt(selectedKitchenId)
        );

        setFilteredOrderList(filtered);
      }
      setTotalRows(filteredOrderList.length);
    };

    filterOrderList();
  }, [orderList, selectedKitchenId]);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    console.log(orders);
    let organizedOrders = orders.flatMap((order) =>
      order.order_items.map((item) => ({
        ...item,
        ...order,
      }))
    );
    console.log(organizedOrders);

    setOrderList(organizedOrders);
    setTotalRows(organizedOrders?.length || 0);
  }, [orders]);

  const statusColor = (status) => {
    if (status === "PENDING") {
      return "warning";
    }
    if (status === "DELIVERED") {
      return "success";
    }
    if (status === "CANCELED") {
      return "danger";
    }
    if (status === "IN_PROGRESS") {
      return "secondary";
    }
    if (status === "READY") {
      return "info";
    }
  };

  const statusOptions = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELED", label: "Canceled" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "READY", label: "Ready" },
  ];

  // Function to handle status change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    const filtered = orderList.filter((order) => {
      const orderDate = new Date(order.created_at);
      const isWithinDateRange =
        (startDate
          ? orderDate >= new Date(startDate.setHours(0, 0, 0, 0))
          : true) &&
        (endDate
          ? orderDate <= new Date(endDate.setHours(23, 59, 59, 999))
          : true);
      return (
        (selectedStatus === "ALL" || order.status === selectedStatus) &&
        isWithinDateRange
      );
    });
    setFilteredOrderList(filtered);
  }, [orderList, selectedStatus, startDate, endDate]);

  function processingTime(createdAt, updatedAt) {
    // Ensure both dates are valid
    if (!createdAt || !updatedAt) {
      return "Invalid dates";
    }

    const createdTime = new Date(createdAt);
    const updatedTime = new Date(updatedAt);

    // Calculate the time difference in milliseconds
    const timeDiff = updatedTime - createdTime;

    // Convert time difference into readable format
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Build the result string
    let result = "";
    if (days > 0) result += `${days} D, `;
    if (hours > 0) result += `${hours} H, `;
    if (minutes > 0) result += `${minutes} m, `;
    if (seconds > 0) result += `${seconds} s`;

    return result || "N/A";
  }

  const columns = [
    {
      name: t("ID"),
      width: "80px",
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
      name: t("Space"),
      // width: "100px",
      selector: (row) => row?.spaceId,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>
            {row?.space?.name} (id: {row?.space?.space_id})
          </span>
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
    // {
    //   name: t("User ID"),
    //   // width: "100px",
    //   selector: (row) => row?.userId,
    //   sortable: true,
    //   wrap: true,
    //   cell: (row) => (
    //     <div className="d-flex flex-row justify-content-center align-items-center gap-2">
    //       <span>{row?.user_id}</span>
    //     </div>
    //   ),
    // },
    {
      name: t("Quantity"),
      width: "110px",
      selector: (row) => row?.quantity,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.quantity}</span>
        </div>
      ),
    },

    {
      name: t("Item"),
      // width: "100px",
      selector: (row) => row?.menu_item?.title,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          {/* <img
            src={row?.menu_item?.item_images[0].image_url}
            width={48}
            alt=""
          /> */}
          <span>{row?.menu_item?.title}</span>
        </div>
      ),
    },
    {
      name: t("Status"),
      // width: "100px",
      selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div
          style={{ fontSize: "14px" }}
          className={`badge   bg-soft-${statusColor(
            row?.status
          )} text-${statusColor(row?.status)}`}
        >
          <span>{row?.status}</span>
        </div>
      ),
    },
    {
      name: t("Source"),
      width: "100px",
      selector: (row) => row?.userId,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div
          style={{ fontSize: "14px" }}
          className={`badge cursor-normal bg-soft-${
            row.userId ? "success" : "danger"
          } text-${row.userId ? "success" : "secondary"}`}
        >
          {row.userId ? "Mobile" : "QR"}
        </div>
      ),
    },
    {
      name: t("Time"),
      // width: "100px",
      selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div>{moment(row?.created_at).format("YY/MM/DD hh:ss")}</div>
      ),
    },

    {
      name: t("Processing Time"),
      // width: "100px",
      selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div>{processingTime(row?.created_at, row?.updated_at)}</div>
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
        data={filteredOrderList}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={totalRows}
        onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        // onHeaderAddBtnClick={toggleAddOrderModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={toggleEditOrderModal}
        // onRowDeleteBtnClick={toggleDeleteOrderModal}
        onSearchIconClick={searchHandler}
        actionColWidth="100px"
        showSearch={false}
        // showSubHeader={true}
        // showActionButtons={true}
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
                showConfirm(
                  () => {
                    deleteOrderFun(row.order_id);
                  },
                  () => {
                    console.log("Cancelled");
                  },
                  "Confirmation", // Title of the confirmation dialog
                  `Are you sure you want to delete the order ${row.order_id}?` // Question displayed in the dialog
                );
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
      >
        <div className="d-flex align-items-center justify-content-start gap-2 w-100">
          {statusOptions.length > 0 && (
            <div className="d-flex align-items-center mb-3 justify-content-start gap-2 w-25">
              <h5 className="">Status </h5>
              <select
                className="form-control"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                {statusOptions.map((status, indx) => (
                  <option key={indx} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {siteList.length > 0 && (
            <div className="d-flex align-items-center mb-3 justify-content-start gap-2 w-25">
              <h5 className="">Site </h5>
              <select
                className="form-control"
                value={selectedSiteId}
                onChange={handleSiteChange}
              >
                <option key={"all"} value={"All"}>
                  {"All"}
                </option>
                {siteList.map((site, indx) => (
                  <option key={indx} value={site.value}>
                    {site.site_id} - {site.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {kitchenList.length > 0 && (
            <div className="d-flex align-items-center mb-3 justify-content-start gap-2 w-25">
              <h5 className="">Kitchen </h5>
              <select
                className="form-control"
                value={selectedKitchenId}
                onChange={handleKitchenChange}
              >
                <option key={"all"} value={"All"}>
                  {"All"}
                </option>
                {kitchenList.map((kitchen, indx) => (
                  <option key={indx} value={kitchen.value}>
                    {kitchen.kitchen_id} -{kitchen.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="d-flex align-items-center mb-3 justify-content-start gap-2 w-50">
            <h5 className="">Date(s) </h5>

            <Flatpickr
              options={{
                mode: "range",
                dateFormat: "Y-m-d",
              }}
              className="p-2 w-50"
              value={[startDate, endDate]}
              onChange={(date) => {
                setStartDate(date[0]);
                setEndDate(date[1]);
              }}
            />
          </div>
        </div>
      </DataTableBase>
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
