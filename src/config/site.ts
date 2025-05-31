export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CommunityPulse",
  description:
    "Report incidents and improve your community with CommunityPulse.",
  mainNav: [
    {
      title: "Map",
      href: "/",
    },
    {
      title: "New Report",
      href: "/report/new",
    },
    {
      title: "My Reports",
      href: "/reports/mine", // Example protected route
    },
  ],
};
