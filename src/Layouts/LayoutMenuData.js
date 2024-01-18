import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isStaffs, setIsStaffs] = useState(false);
  const [isAccess, setIsAccess] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  // const [isVisitors, setIsVisitors] = useState(false);
  // const [isVisitorsPasses, setIsVisitorsPasses] = useState(false);
  // const [isMaintenance, setIsMaintenance] = useState(false);
  // const [isVenues, setIsVenues] = useState(false);

  const [isCurrentState, setIsCurrentState] = useState("Staffs");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    if (isCurrentState !== "Access") {
      setIsAccess(false);
    }
    if (isCurrentState !== "Staffs") {
      setIsStaffs(false);
    }
    // if (isCurrentState !== "Facilities") {
    //   setIsFacilities(false);
    // }
    // if (isCurrentState !== "Visitors") {
    //   setIsVisitors(false);
    // }
    // if (isCurrentState !== "VisitorsPasses") {
    //   setIsVisitorsPasses(false);
    // }
    // if (isCurrentState !== "Maintenance") {
    //   setIsMaintenance(false);
    // }
    // if (isCurrentState !== "Staffs") {
    //   setIsStaffs(false);
    // }
    // if (isCurrentState !== "Venues") {
    //   setIsVenues(false);
    // }
  }, [isCurrentState, history]);

  const menuItems = [
    {
      label: t("Menu"),
      isHeader: true,
    },

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIsCurrentState("Dashboard");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "dashboard1",
          label: t("Dashboard") + "1",
          link: "/dashboard",
          parentId: "dashboard",
        },
      ],
    },
    {
      id: "Staffs",
      label: "Staffs",
      icon: "ri-group-line",
      link: "",
      stateVariables: isStaffs,
      click: function (e) {
        e.preventDefault();
        setIsStaffs(!isStaffs);
        setIsCurrentState("Staffs");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "staffs",
          label: "Staffs",
          link: "/staffs",
          parentId: "Staffs",
        },
      ],
    },
    {
      id: "Access",
      label: "Access",
      icon: "ri-group-line",
      link: "",
      stateVariables: isAccess,
      click: function (e) {
        e.preventDefault();
        setIsAccess(!isAccess);
        setIsCurrentState("Access");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "history",
          label: "History",
          link: "/access/history",
          icon: "ri-group-line",

          parentId: "Access",
        },
      ],
    },
  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
