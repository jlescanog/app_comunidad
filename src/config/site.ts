
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PulsoComunitario",
  description:
    "Reporta incidentes y mejora tu comunidad con PulsoComunitario.",
  mainNav: [
    {
      title: "Mapa",
      href: "/",
    },
    {
      title: "Nuevo Reporte",
      href: "/report/new",
    },
    {
      title: "Todos los Reportes", // Changed from "Mis Reportes"
      href: "/reports/mine", 
    },
  ],
};
