import React, { useEffect, useState } from "react";
import DataTableBase from "../../../Components/Common/DataTableBase/DataTableBase";
import { t } from "i18next";
import { useLinksStore } from "../../../stores/Assets/links";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import AddLink from "./Components/AddLink";
import { useLocation } from "react-router-dom";
import { useConfirmDialogStore } from "../../../stores/Modal/ConfirmDialogStore";
import { Pagination } from "../../../Components/Common/DataTableBase/Pagination";

const Links = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [formattedLinks, setFormattedLinks] = useState([]);

  document.title = "ClickOrder Admin";
  const location = useLocation();
  const menuId = new URLSearchParams(location.search).get("menuId");
  const { getLinks, isLoading, links, removeLink } = useLinksStore(
    (state) => state
  );

  useEffect(() => {
    getLinks();
  }, []);

  useEffect(() => {
    if (links) {
      // Transforming the data format
      console.log(links);

      const formattedData = links.flatMap((space) =>
        space.users.map((user) => ({
          space_id: space.space_id,
          space_name: space.space_name,
          user_email: user.user_email,
        }))
      );
      setFormattedLinks(formattedData);
      setTotalRows(formattedData.length);
    }
  }, [links]);

  const columns = [
    {
      name: t("Space ID"),
      selector: (row) => row?.space_id,
      sortable: true,
      wrap: true,
    },
    {
      name: t("Space Name"),
      selector: (row) => row?.space_name,
      sortable: true,
      wrap: true,
    },
    {
      name: t("User Email"),
      selector: (row) => row?.user_email,
      sortable: true,
      wrap: true,
    },
  ];

  const { showConfirm } = useConfirmDialogStore((state) => state);

  const [showAddLink, setShowAddLink] = useState(false);
  const toggleAddLinkModal = () => {
    setShowAddLink(!showAddLink);
  };
  const [currentLinks, setCurrentLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 5; // Display 5 rows per page
  useEffect(() => {
    if (formattedLinks.length > 0) {
      const curr = formattedLinks.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
      setCurrentLinks(curr);
    }
  }, [currentPage, formattedLinks]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const deleteLink = async (body) => {
    try {
      await removeLink(body);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <DataTableBase
        tableTitle={"LINKS"}
        data={currentLinks} // Display current paginated data
        columns={columns}
        loading={isLoading}
        paginationTotalRows={formattedLinks.length}
        // onChangePage={onPageChange}
        onHeaderAddBtnClick={toggleAddLinkModal}
        showSearch={false}
        showSubHeader={true}
        showActionButtons={true}
        customActionBtns={(row) => (
          <>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                showConfirm(() => {
                  deleteLink({
                    email: row?.user_email,
                    space_id: row?.space_id,
                  });
                });
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
        totalRows={formattedLinks.length}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
      {showAddLink && (
        <AddLink
          toggleAddLinkModal={toggleAddLinkModal}
          showAddLinkModal={showAddLink}
        />
      )}
    </>
  );
};

export default Links;
