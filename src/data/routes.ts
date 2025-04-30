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
  Explore = "/explore",
  NewDiscussion = "/discussions/new",
  BookmarkedDiscussions = "/discussions/bookmarked",
  Resources = "/resources",
  FAQ = "/faq",
  Support = "/support",
}