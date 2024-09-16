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
import AddMenu from "./Components/AddMenu";
import EditMenu from "./Components/EditMenu";
import { useLocation } from "react-router-dom";
import { useConfirmDialogStore } from "../../stores/Modal/ConfirmDialogStore";
const Menu = () => {
  const title = "BASSEER | MENUS";
  const [totalRows, setTotalRows] = useState(0);

  document.title = title; // API Call
  const location = useLocation();
  const menuId = new URLSearchParams(location.search).get("menuId");
  const { getMenus, isLoading, menus,deleteMenu } = useMenuStore((state) => state);
  const ShowItemsModel =(menu_id)=>{
    console.log("display items");
    
  }
  // useEffect(() => {
  //   if (menuId) {
  //     getMenus({ search: menuId });
  //   }
  // }, [menuId]);
  useEffect(() => {
    getMenus(); 
  }, []);

  useEffect(() => {
    setTotalRows(menus?.length || 0);
  }, [menus]);
  const columns = [
    
    {
      name: t("Name"),
      // width: "100px",
      selector: (row) => row?.name,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
           <span>
          
              {row?.name}
            </span>
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
        <div onClick={()=>ShowItemsModel(row?.menu_id)} className="cursor-normal" id={`anchor-${row?.menu_id}`}>
          <span style={{fontSize:"14px"}} className={`badge bg-soft-info cursor-pointer text-success text-uppercase`}>

          <i className="ri-external-link-line"></i>
          Check
          </span>
          <UncontrolledTooltip placement="top" target={`anchor-${row?.menu_id}`}>
            {" "}
            check Associated Items
          </UncontrolledTooltip>
        </div>
      ),
    },
  ];

  const searchHandler = (searchText) => {
    // getMenus({
    //   search: searchText,
    // });
  };
  const { showConfirm } = useConfirmDialogStore((state) => state);

  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const toggleAddMenuModal = () => {
    setShowAddMenuModal(!showAddMenuModal);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const toggleEditMenuModal = (row) => {
    setSelectedRow(row);
    setShowEditMenuModal(!showEditMenuModal);
  };


  const onChangePage = (page) => {
    getMenus({
      page: page,
    });
  };

  const deleteMenuFun = async (id)=>{
    try{


    await deleteMenu(id)
  }catch(e){
    console.log(e);
    
  }
  }
  return (
    <>
      <DataTableBase
        tableTitle={"menus"}
        data={menus}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={totalRows}
        onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        onHeaderAddBtnClick={toggleAddMenuModal}
        onHeaderDeleteBtnClick={() => {
          alert("Soon");
        }}
        // onRowEditBtnClick={toggleEditMenuModal}
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
                 toggleEditMenuModal(row)
                }}
                title="Edit"
              >
<i className="ri-edit-fill"></i>              </button>
     
           
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                showConfirm(() => {
                  deleteMenuFun(row.menu_id);
                });
              }}
              title="Delete"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </>
        )}
      />
   
      <AddMenu
        toggleAddMenuModal={toggleAddMenuModal}
        showAddMenuModal={showAddMenuModal}
      />
      {selectedRow && (
        <EditMenu
        toggleEditMenuModal={toggleEditMenuModal}
          showEditMenuModal={showEditMenuModal}
          rowData={selectedRow}
        />
      )}
    </>
  );
};

export default Menu;
