import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DataTableBase from "../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useMenuStore } from "../../stores/Assets/menu";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import AddItem from "./Components/AddItem";
import EditItem from "./Components/EditItem";
import { useLocation } from "react-router-dom";
import { useConfirmDialogStore } from "../../stores/Modal/ConfirmDialogStore";
import { useMenuItemsStore } from "../../stores/Assets/menuItems";
import { OptionsModal } from "./Components/OptionsModal";
import { Pagination } from "../../Components/Common/DataTableBase/Pagination";
const Menu = () => {
  const [totalRows, setTotalRows] = useState(0);
  const { menuid } = useParams();

  document.title = "ClickOrder Admin";
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(null);

  const { getItems, isLoading, items, deleteItem, currency, image_url } =
    useMenuItemsStore((state) => state);

  useEffect(() => {
    getItems(menuid);
  }, [menuid]);

  useEffect(() => {
    setTotalRows(items?.length || 0);
    console.log(items);
  }, [items]);

  const handleOptionsClick = (id) => {
    setSelectedOptions(id);
    setShowOptionsModal(true);
  };

  const columns = [
    {
      name: t("ID"),
      selector: (row) => row?.item_id,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Title"),
      selector: (row) => row?.title,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.title}</span>
        </div>
      ),
    },
    {
      name: t("Title (AR)"),
      selector: (row) => row?.title_ar,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.title_ar}</span>
        </div>
      ),
    },
    {
      name: t("Options"),
      selector: (row) => row?.options?.length,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="cursor-pointer" id={`anchor-${row?.item_id}`}>
          <span
            style={{ fontSize: "14px" }}
            className={`badge bg-soft-${
              row?.options?.length > 0 ? "info" : "warning"
            } cursor-pointer text-${
              row?.options?.length > 0 ? "success" : "warning"
            } text-uppercase`}
            onClick={() => handleOptionsClick(row.item_id)}
          >
            {row?.options?.length > 0 && (
              <i className="ri-external-link-line"></i>
            )}{" "}
            {row?.options?.length > 0 ? "Check" : "No Options"}
          </span>
          <UncontrolledTooltip
            placement="top"
            target={`anchor-${row?.item_id}`}
          >
            {row?.options?.length > 0
              ? "Check Associated Options"
              : "No options available"}
          </UncontrolledTooltip>
        </div>
      ),
    },
    {
      name: t("Price"),
      selector: (row) => row?.price,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <span>
          {row?.price?.toFixed(2)} {currency}
        </span>
      ),
    },
    {
      name: t("Available"),
      selector: (row) => row?.available,
      sortable: true,
      wrap: true,
      cell: (row) => <span>{row?.available ? "Yes" : "No"}</span>,
    },
    {
      name: t("Image"),
      cell: (row) =>
        row?.images.length ? (
          <img
            src={image_url + row.images[0]}
            alt="Item"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
  ];

  const searchHandler = (searchText) => {
    // getMenus({
    //   search: searchText,
    // });
  };
  const { showConfirm } = useConfirmDialogStore((state) => state);

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setshowEditItemModal] = useState(false);
  const toggleAddItemModal = () => {
    setShowAddItemModal(!showAddItemModal);
    console.log(showAddItemModal);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const toggleEditItemModal = (row) => {
    setSelectedRow(row);
    setshowEditItemModal(!showEditItemModal);
  };

  const onChangePage = (page) => {
    getItems({
      page: page,
    });
  };

  const deleteItemFun = async (id) => {
    try {
      await deleteItem(menuid, id);
    } catch (e) {
      console.log(e);
    }
  };

  const [currenItems, setCurrenItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Display 5 rows per page
  useEffect(() => {
    if (items?.length > 0) {
      const curr = items.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );

      setCurrenItems(curr);
    }
  }, [currentPage, items]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <DataTableBase
        tableTitle={"Menu-Items"}
        data={currenItems}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={totalRows}
        onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        onHeaderAddBtnClick={toggleAddItemModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={toggleEditItemModal}
        // onRowDeleteBtnClick={toggleDeleteMenuModal}
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
                toggleEditItemModal(row);
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
                    deleteItemFun(row?.item_id);
                  },
                  () => {
                    console.log("Cancelled");
                  },
                  "Confirmation", // Title of the confirmation dialog
                  `Are you sure you want to delete the menu Item?` // Question displayed in the dialog
                );
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
        totalRows={items?.length || 0}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
      {showAddItemModal && (
        <AddItem
          toggleAddItemModal={toggleAddItemModal}
          showAddItemModal={showAddItemModal}
          menuId={menuid}
        />
      )}

      {selectedRow && (
        <EditItem
          toggleEditItemModal={toggleEditItemModal}
          showEditItemModal={showEditItemModal}
          rowData={selectedRow}
          menuId={menuid}
        />
      )}
      {showOptionsModal && (
        <OptionsModal
          isOpen={showOptionsModal}
          toggle={() => setShowOptionsModal(!showOptionsModal)}
          toggleEdit={showEditItemModal}
          itemId={selectedOptions}
        />
      )}
    </>
  );
};

export default Menu;
