import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isAssets, setisAssets] = useState(true);
  const [isMenus, setIsMenus] = useState(false);
  const [isStaffs, setIsStaffs] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [isOrders, setIsOrders] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  // const [isVisitors, setIsVisitors] = useState(false);
  // const [isVisitorsPasses, setIsVisitorsPasses] = useState(false);
  // const [isMaintenance, setIsMaintenance] = useState(false);
  // const [isVenues, setIsVenues] = useState(false);

  const [isCurrentState, setIsCurrentState] = useState("Dashboard");

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
    if (isCurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (isCurrentState !== "Assets") {
      setisAssets(false);
    }
    if (isCurrentState !== "Menus") {
      setIsMenus(false);
    }
    if (isCurrentState !== "Orders") {
      setIsOrders(false);
    }
    if (isCurrentState !== "Settings") {
      setIsSettings(false);
    }
    if (isCurrentState !== "Staffs") {
      setIsStaffs(false);
    }
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
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIsCurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "Assets",
      label: "Assets",
      icon: "ri-map-pin-2-fill",
      link: "",
      stateVariables: isAssets,
      click: function (e) {
        e.preventDefault();
        setisAssets(!isAssets);
        setIsCurrentState("Assets");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "Sites",
          label: "Sites",
          link: "/sites",
          icon: "ri-building-4-fill",
          parentId: "Assets",
        },
        {
          id: "Menus",
          label: "Menus",
          link: "/menus",
          parentId: "Assets",
        },
        {
          id: "Kitchens",
          label: "Kitchens",
          link: "/kitchens",
          parentId: "Assets",
        },
        {
          id: "Spaces",
          label: "Spaces",
          link: "/spaces",
          parentId: "Assets",
        },
        {
          id: "Users",
          label: "Users",
          link: "/staffs",
          parentId: "Assets",
        },
      ],
    },
    // {
    //   id: "Menus",
    //   label: "Menus",
    //   icon: "ri-book-open-fill",
    //   link: "/menus",
    //   stateVariables: isMenus,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsMenus(!isMenus);
    //     setIsCurrentState("Menus");
    //     updateIconSidebar(e);
    //   },
    // },
    {
      id: "Orders",
      label: "Orders",
      icon: "ri-ticket-2-line",
      link: "/orders",
      stateVariables: isOrders,
      click: function (e) {
        e.preventDefault();
        setIsOrders(!isOrders);
        setIsCurrentState("Orders");
        updateIconSidebar(e);
      },
    },
    // {
    //   id: "Staffs",
    //   label: "Staffs",
    //   icon: "ri-group-line",
    //   link: "/staffs",
    //   stateVariables: isStaffs,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsStaffs(!isStaffs);
    //     setIsCurrentState("Staffs");
    //     updateIconSidebar(e);
    //   },
    // },
    {
      id: "Settings",
      label: "Settings",
      icon: "ri-settings-2-line",
      link: "/settings",
      stateVariables: isSettings,
      click: function (e) {
        e.preventDefault();
        setIsSettings(!isSettings);
        setIsCurrentState("Settings");
        updateIconSidebar(e);
      },
    },
  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
