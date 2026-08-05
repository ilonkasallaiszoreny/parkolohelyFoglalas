export enum SpotType {
  STANDARD = "STANDARD",
  EV_CHARGING = "EV_CHARGING",
  HANDICAPPED = "HANDICAPPED",
  VIP = "VIP"
}

export enum ReservationStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED"
}

export interface CreateReservationDTO {
  spotId: string;
  requesterName: string;
  licensePlate?: string;
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
}

export interface CreateSpotDTO {
  code: string;
  name: string;
  type?: SpotType;
  location: string;
}

export interface QueryReservationsDTO {
  spotId?: string;
  from?: string;
  to?: string;
  status?: ReservationStatus;
}
