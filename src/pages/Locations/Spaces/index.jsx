import React, { useEffect, useState } from "react";
import DataTableBase from "../../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { Button, UncontrolledTooltip } from "reactstrap";
import { useLocation } from "react-router-dom";
import { useConfirmDialogStore } from "../../../stores/Modal/ConfirmDialogStore";
import { useSpaceStore } from "../../../stores/Assets/space";
import AddSpace from "./Components/AddSpace";
import EditSpace from "./Components/EditSpace";
import { useSiteStore } from "../../../stores/Assets/site";
import { useMenuStore } from "../../../stores/Assets/menu";
import { useKitchenStore } from "../../../stores/Assets/kitchen";
import { QRCode } from "react-qrcode-logo";
import QRmodal from "./Components/QRmodal";
import { Pagination } from "../../../Components/Common/DataTableBase/Pagination";

const Spaces = () => {
  const title = "BASSEER | SPACES";
  const [totalRows, setTotalRows] = useState(0);
  const [sites, setSites] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [selectedKitchenId, setSelectedKitchenId] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedRowQR, setselectedRowQR] = useState(false);
  const { getSites } = useSiteStore((state) => state);
  const { getMenus } = useMenuStore((state) => state);
  const { getKitchens } = useKitchenStore((state) => state);
  const { getSpaces, isLoading, spaces, deleteSpace } = useSpaceStore(
    (state) => state
  );
  const location = useLocation();

  useEffect(() => {
    const fetchSites = async () => {
      const siteList = await getSites();
      setSites(siteList);

      // Extract siteId from the URL query parameters
      const urlParams = new URLSearchParams(location.search);
      const siteIdFromUrl = urlParams.get("siteId");

      if (siteIdFromUrl) {
        // If siteId is in the URL, set it as selected
        setSelectedSiteId(siteIdFromUrl);
        getSpaces(siteIdFromUrl);
      } else if (siteList.length > 0) {
        // Set default to first site if no siteId in URL
        setSelectedSiteId(siteList[0].site_id);
        getSpaces(siteList[0].site_id);
      }
    };

    fetchSites();

    const fetchMenus = async () => {
      const menuList = await getMenus();
      setMenus(menuList);
      console.log(menuList);

      // Extract siteId from the URL query parameters
      if (menuList.length > 0) {
        // Set default to first site if no siteId in URL
        setSelectedMenuId(menuList[0].menu_id);
      }
      console.log(menuList);
    };

    fetchMenus();

    const fetchKitchens = async () => {
      const kitchenList = await getKitchens();
      setKitchens(kitchenList);
      console.log(kitchenList);

      if (kitchenList?.length > 0) {
        // Set default to first site if no siteId in URL
        setSelectedKitchenId(kitchenList[0].kitchen_id);
      }
    };

    fetchKitchens();
  }, [getSites, location.search, getSpaces]);

  const handleQRClick = (row) => {
    console.log(row);

    setselectedRowQR(row);

    setShowQRCode(!showQRCode);
  };
  const columns = [
    {
      name: t("ID"),
      selector: (row) => row?.space_id,
      width: "70px",
      sortable: true,
      wrap: true,
    },
    {
      name: t("Site"),
      width: "150px",
      selector: (row) => `${row?.site_name} (id: ${row?.site_id})`, // Assuming `site_name` is the property
      sortable: true,
      wrap: true,
    },
    {
      name: t("Name"),
      selector: (row) => row?.name,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Name (AR)"),
      selector: (row) => row?.name_ar,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Order Distance"),
      // width: "100px",
      selector: (row) => row?.allowedOrderDistance,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Type"),
      selector: (row) => row?.type,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Default LANG"),
      selector: (row) => row?.default_lang,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Menu "),
      selector: (row) => row?.menu_id, // Assuming `menu_name` is the property

      sortable: true,
      wrap: true,
      cell: (row) => (
        <div>{row.menu_id && `${row.menu_name} (id: ${row.menu_id})`}</div>
      ),
    },

    {
      name: t("Kitchen "),
      selector: (row) => row?.kitchen_id,

      sortable: true,
      wrap: true,
      cell: (row) => (
        <div>
          {row.kitchen_id && `${row.kitchen_name} (id: ${row.kitchen_id})`}
        </div>
      ),
    },

    {
      name: t("QR Code"),
      // width: "95px",
      // selector: (row) => row?.status,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div className="cursor-pointer">
          <span
            style={{ fontSize: "14px" }}
            className={`badge bg-soft-success cursor-pointer text-success text-uppercase`}
            onClick={() => handleQRClick(row)}
          >
            {<i className="ri-external-link-line"></i>} View
          </span>
        </div>
      ),
      // cell: (row) => (
      //   <a
      //     href={`/menu/${row?.encrypted}`}
      //     className="cursor-pointer"
      //     id={`anchor-${row?.space_id}`}
      //   >
      //     <QRCode
      //       value={`https://qa.teaboy.io/menu/${row?.encrypted}`}
      //       size={45}
      //       eyeRadius={10}
      //       ecLevel="H"
      //       logoPaddingStyle="circle"
      //       bgColor="#0000"
      //       logoImage={row?.site_image_url}
      //     />
      //     <UncontrolledTooltip
      //       placement="top"
      //       target={`anchor-${row?.space_id}`}
      //     >
      //       {" "}
      //       Scan or Click
      //     </UncontrolledTooltip>
      //   </a>
      // ),
    },
  ];

  const { showConfirm } = useConfirmDialogStore((state) => state);
  const [showAddSpaceModal, setShowAddSpaceModal] = useState(false);
  const [showEditSpaceModal, setShowEditSpaceModal] = useState(false);
  const toggleAddSpaceModal = () => {
    setShowAddSpaceModal(!showAddSpaceModal);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const toggleEditSpaceModal = (row) => {
    setSelectedRow(row);
    setShowEditSpaceModal(!showEditSpaceModal);
  };
  useEffect(() => {
    console.log(spaces);
  }, [spaces]);
  const deleteSpaceFun = async (id) => {
    try {
      await deleteSpace(id);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    console.log(spaces);
  }, [spaces]);
  const handleSiteSelect = (e) => {
    const id = e.target.value;
    setSelectedSiteId(id);
    getSpaces(id);
  };

  const [currentSpaces, setCurrentSpaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Display 5 rows per page
  useEffect(() => {
    if (spaces.length > 0) {
      const curr = spaces.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
      setCurrentSpaces(curr);
    }
  }, [currentPage, spaces]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      {selectedSiteId && (
        <DataTableBase
          tableTitle={"SPACES"}
          data={currentSpaces}
          columns={columns}
          loading={isLoading}
          paginationTotalRows={totalRows}
          onChangePage={() => {}}
          onHeaderAddBtnClick={toggleAddSpaceModal}
          onSearchIconClick={() => {}}
          actionColWidth="100px"
          showSearch={false}
          showSubHeader={true}
          showActionButtons={true}
          customActionBtns={(row) => (
            <>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => toggleEditSpaceModal(row)}
                title="Edit"
              >
                <i className="ri-edit-fill"></i>
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  showConfirm(() => {
                    deleteSpaceFun(row.space_id);
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
                {sites.map((site) => (
                  <option key={site.site_id} value={site.site_id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </DataTableBase>
      )}
      <Pagination
        currentPage={currentPage}
        totalRows={spaces.length}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
      {showAddSpaceModal && (
        <AddSpace
          siteID={selectedSiteId}
          siteList={sites}
          menuList={menus}
          kitchenList={kitchens}
          toggleAddSpaceModal={toggleAddSpaceModal}
          showAddSpaceModal={showAddSpaceModal}
        />
      )}
      {selectedRow && (
        <EditSpace
          toggleEditSpaceModal={toggleEditSpaceModal}
          showEditSpaceModal={showEditSpaceModal}
          rowData={selectedRow}
        />
      )}
      {selectedRowQR && (
        <QRmodal
          info={selectedRowQR}
          showQRCode={showQRCode}
          toggleQRModal={() => setShowQRCode(!showQRCode)}
        />
      )}
    </>
  );
};

export default Spaces;
