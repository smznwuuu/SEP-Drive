/**
 * Speichern globale Variablen
 */
export class Global {
  public static backendUrl: string = "http://localhost:8080/api";
  public static authServiceUrl: string = this.backendUrl + "/auth";

  public static rideHistoryServiceUrl: string = "http://localhost:8080/history";
  public static driverStatsUrl: string = "http://localhost:8080/driver-stats";
}
