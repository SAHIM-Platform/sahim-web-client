export const routesData = [
  {
    name: "الرئيسية",
    path: "/explore",
  },
  {
    name: "ابدأ مناقشة",
    path: "/discussions/new",
  },
  {
    name: "المحفوظات",
    path: "/discussions/bookmarked",
  },
  {
    name: "الملخصات والمراجع",
    path: "/resources",
  },
  {
    name: "الأسئلة الشائعة",
    path: "/faq",
  },
  {
    name: "الدعم الفني",
    path: "/support",
  },
];

export enum FrontendRoutes {
  EXPLORE = "/explore",
  DISCUSSIONS = "/discussions",
  NEW_DISCUSSION = "/discussions/new",
  BOOKMARKED_DISCUSSIONS = "/discussions/bookmarked",
  RESOURCES = "/resources",
  FAQ = "/faq",
  SUPPORT = "/support",
  CATEGORIES = "/categories",
  ADMINS = "/admins",
}