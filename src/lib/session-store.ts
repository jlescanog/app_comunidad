
import type { Report } from '@/types';

// Este array almacenará los reportes creados durante la sesión actual del navegador.
// No es una solución persistente. Los datos se perderán al cerrar/recargar la página.
let sessionReports: Report[] = [];

export function addSessionReport(report: Report) {
  // Añadir al principio para que los más nuevos aparezcan primero
  sessionReports.unshift(report);
}

export function getSessionReportsByUserId(userId: string): Report[] {
  return sessionReports.filter(report => report.userId === userId);
}

export function getAllSessionReports(): Report[] {
  return [...sessionReports];
}
