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
import { QRCode } from "react-qrcode-logo";
import { Pagination } from "../../Components/Common/DataTableBase/Pagination";
import { useSiteStore } from "../../stores/Assets/site";

const Menu = () => {
  const [totalRows, setTotalRows] = useState(0);

  document.title = "ClickOrder Admin";
  const location = useLocation();
  const menuId = new URLSearchParams(location.search).get("menuId");
  const { getMenus, isLoading, menus, deleteMenu } = useMenuStore(
    (state) => state
  );
  const { getSites } = useSiteStore((state) => state);
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("All");
  const [filteredMenus, setFilteredMenus] = useState([]);
  const ShowItemsModel = (menu_id) => {
    console.log("display items");
  };
  useEffect(() => {
    const fetchSites = async () => {
      const siteList = await getSites();
      setSites(siteList);
    };
    fetchSites();
  }, [getSites]);
  useEffect(() => {
    getMenus();
  }, []);

  useEffect(() => {
    console.log(menus);

    setTotalRows(menus?.length || 0);
  }, [menus]);
  const columns = [
    {
      name: t("ID"),
      width: "70px",
      selector: (row) => row?.menu_id,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.menu_id}</span>
        </div>
      ),
    },
    {
      name: t("Site"),
      // width: "100px",
      selector: (row) => row?.sites.length > 0 && row?.sites[0]?.site_id,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>
            {row?.sites.length > 0 &&
              `${row?.sites[0]?.name} (id: ${row?.sites[0]?.site_id}) `}
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
      selector: (row) => row?.name_ar,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>{row?.name_ar}</span>
        </div>
      ),
    },
    {
      name: t("Ask"),
      selector: (row) => row?.ask,
      sortable: true,
      wrap: true,
      cell: (row) => {
        const truncatedAsk = row?.ask
          ? row?.ask?.slice(0, 25) + (row?.ask?.length > 25 ? "..." : "")
          : ""; // Truncate to first 5 characters with ellipsis if longer

        return (
          <div
            className="d-flex flex-row justify-content-center align-items-center gap-2"
            // id={`anchor-${row?.ask}`} // Unique ID for the tooltip
          >
            <span>{truncatedAsk}</span>
            {/* <UncontrolledTooltip placement="top" target={`anchor-${row?.ask}`}>
              {row?.ask}
            </UncontrolledTooltip> */}
          </div>
        );
      },
    },
    {
      name: t("Ask (AR)"),
      // width: "100px",
      selector: (row) => row?.ask_ar,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Currency"),
      // width: "100px",
      selector: (row) => row?.currency,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <span>
            {row?.currency} {row?.currency_ar && `(${row?.currency_ar})`}
          </span>
        </div>
      ),
    },

    // {
    //   name: t("Ask For Table"),
    //   // width: "100px",
    //   selector: (row) => row?.ask_for_table,
    //   sortable: true,
    //   wrap: true,
    //   cell: (row) => (
    //     <div className="d-flex flex-row justify-content-center align-items-center gap-2">
    //       <span>
    //         {row?.ask_for_table ? (
    //           <i
    //             className="ri-checkbox-circle-fill text-success "
    //             style={{ fontSize: "28px" }}
    //           ></i>
    //         ) : (
    //           <i
    //             className="ri-close-circle-fill text-danger"
    //             style={{ fontSize: "28px" }}
    //           ></i>
    //         )}
    //       </span>
    //     </div>
    //   ),
    // },
    {
      name: t("VAT"),
      width: "80px",
      selector: (row) => row?.VAT,
      sortable: true,
      wrap: true,
    },
    // {
    //   name: t("Ask For Name"),
    //   // width: "100px",
    //   selector: (row) => row?.ask_for_name,
    //   sortable: true,
    //   wrap: true,
    //   cell: (row) => (
    //     <div className="d-flex flex-row justify-content-center align-items-center gap-2">
    //       <span>
    //         {row?.ask_for_name ? (
    //           <i
    //             className="ri-checkbox-circle-fill text-success "
    //             style={{ fontSize: "28px" }}
    //           ></i>
    //         ) : (
    //           <i
    //             className="ri-close-circle-fill text-danger"
    //             style={{ fontSize: "28px" }}
    //           ></i>
    //         )}
    //       </span>
    //     </div>
    //   ),
    // },

    {
      name: t("Items"),
      // width: "95px",
      // selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <a
          href={`/menu-items/${row?.menu_id}`}
          className="cursor-pointer"
          id={`anchor-${row?.menu_id}`}
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
            target={`anchor-${row?.menu_id}`}
          >
            {" "}
            check Associated Items
          </UncontrolledTooltip>
        </a>
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

  const deleteMenuFun = async (id) => {
    try {
      await deleteMenu(id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSiteSelect = (e) => {
    const id = e.target.value;
    setSelectedSiteId(id);
  };

  const [currentMenus, setCurrentMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Display 5 rows per page
  useEffect(() => {
    if (filteredMenus.length > 0) {
      const curr = filteredMenus.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
      setCurrentMenus(curr);
    } else {
      setCurrentMenus([]);
    }
  }, [currentPage, filteredMenus]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filterMenus = () => {
      if (selectedSiteId === "All") {
        setFilteredMenus(menus);
      } else {
        const filtered = menus.filter(
          (menu) =>
            menu?.sites.length > 0 &&
            menu?.sites[0].site_id === parseInt(selectedSiteId)
        );
        console.log(filtered);

        setFilteredMenus(filtered);
      }
      setTotalRows(filteredMenus.length);
    };

    filterMenus();
  }, [menus, selectedSiteId]);
  return (
    <>
      <DataTableBase
        tableTitle={"menus"}
        data={currentMenus}
        columns={columns}
        loading={isLoading}
        paginationTotalRows={filteredMenus.length}
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
        showSearch={false}
        showSubHeader={true}
        showActionButtons={true}
        customActionBtns={(row) => (
          <>
            <button
              className="btn btn-sm btn-warning"
              onClick={() => {
                toggleEditMenuModal(row);
              }}
              title="Edit"
            >
              <i className="ri-edit-fill"></i>{" "}
            </button>

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
        totalRows={filteredMenus.length}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
      {showAddMenuModal && (
        <AddMenu
          siteList={sites}
          toggleAddMenuModal={toggleAddMenuModal}
          showAddMenuModal={showAddMenuModal}
        />
      )}

      {selectedRow && (
        <EditMenu
          siteList={sites}
          toggleEditMenuModal={toggleEditMenuModal}
          showEditMenuModal={showEditMenuModal}
          rowData={selectedRow}
        />
      )}
    </>
  );
};

export default Menu;
