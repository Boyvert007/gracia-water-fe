import {
  FormatListBulleted,
  GroupWork,
  Workspaces,
  HistoryToggleOff,
  Summarize,
  Business,
  Paid,
  Assessment,
  Analytics,
  Dashboard,
  CenterFocusStrong,
  Balance,
  DeveloperBoard,
} from "@mui/icons-material";

export const Routes = [
  {
    path: "/",
    menu: "Dashboard",
    icon: <Dashboard />,
  },
  {
    path: "/pos",
    menu: "POS",
    icon: <Business />,
  },
  {
    path: "/historysales",
    menu: "HISTORY SALES",
    icon: <Business />,
  },
  {
    path: "/polapembeliankonsumen",
    menu: "POLA PEMBELIAN KONSUMEN",
    icon: <Business />,
  },
  {
    path: "/statuspenjualanbarang",
    menu: "STATUS PENJUALAN BARANG",
    icon: <Business />,
  },
];
