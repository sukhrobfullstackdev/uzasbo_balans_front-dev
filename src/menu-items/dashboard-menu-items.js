const menuItems = {
    items: [
      //Dashboard
      {
        id: "navigation",
        title: "Navigation",
        type: "group",
        icon: "icon-navigation",
        children: [
          {
            id: "dashboard",
            title: "Dashboard",
            type: "item",
            url: "/dashboard/default",
            icon: "feather icon-home",
            role: 'Dashboard'
          },
        ],
      },
      //Dashboard end
    ],
  };
  
  export default menuItems;
  