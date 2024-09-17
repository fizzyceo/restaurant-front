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
const Menu = () => {
  const title = "BASSEER | ITEMS";
  const [totalRows, setTotalRows] = useState(0);
  const { menuid } = useParams();

  document.title = title; // API Call
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(null);

  const { getItems, isLoading, items, deleteItem } = useMenuItemsStore(
    (state) => state
  );
  const ShowItemsModel = (menu_id) => {
    console.log("display items");
  };
  // useEffect(() => {
  //   if (menuId) {
  //     getMenus({ search: menuId });
  //   }
  // }, [menuId]);
  useEffect(() => {
    getItems(menuid);
  }, [menuid]);

  useEffect(() => {
    setTotalRows(items?.length || 0);
  }, [items]);

  const handleOptionsClick = (id) => {
    setSelectedOptions(id);
    setShowOptionsModal(true);
  };

  const columns = [
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
      name: t("Options"),
      selector: (row) => row?.menuItem_options.length,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="cursor-pointer" id={`anchor-${row?.menu_item_id}`}>
          <span
            style={{ fontSize: "14px" }}
            className={`badge bg-soft-${
              row?.menuItem_options?.length > 0 ? "info" : "warning"
            } cursor-pointer text-${
              row?.menuItem_options?.length > 0 ? "success" : "warning"
            } text-uppercase`}
            onClick={() => handleOptionsClick(row.menu_item_id)}
          >
            {row?.menuItem_options?.length > 0 && (
              <i className="ri-external-link-line"></i>
            )}{" "}
            {row?.menuItem_options?.length > 0 ? "Check" : "No Options"}
          </span>
          <UncontrolledTooltip
            placement="top"
            target={`anchor-${row?.menu_item_id}`}
          >
            {row?.menuItem_options?.length > 0
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
      cell: (row) => <span>${row?.price?.toFixed(2)}</span>,
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
        row?.item_images?.[0]?.image_url ? (
          <img
            src={row.item_images[0].image_url}
            alt="Item"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    // {
    //   name: t("Actions"),
    //   cell: (row) => (
    //     <div className="d-flex gap-2">
    //       <a href={`/menu-items/${row?.menu_item_id}`} className="btn btn-sm btn-info">
    //         <i className="ri-eye-fill"></i>
    //       </a>
    //       <button
    //         className="btn btn-sm btn-warning"
    //         onClick={() => toggleEditItemModal(row)}
    //         title="Edit"
    //       >
    //         <i className="ri-edit-fill"></i>
    //       </button>
    //       <button
    //         className="btn btn-sm btn-danger"
    //         onClick={() => {
    //           showConfirm(() => deleteMenuFun(row.menu_item_id));
    //         }}
    //         title="Delete"
    //       >
    //         <i className="ri-delete-bin-line"></i>
    //       </button>
    //     </div>
    //   ),
    // },
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
  return (
    <>
      <DataTableBase
        tableTitle={"Menu-Items"}
        data={items}
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
        showSearch={true}
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
                showConfirm(() => {
                  deleteItemFun(row?.menu_item_id);
                });
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
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
