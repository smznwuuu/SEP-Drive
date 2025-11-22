export type Role = 'DRIVER' | 'CUSTOMER';

export interface UserProfile {
  username: string;
  role: Role;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: string;
  profilepicture?: string;
  rating: number;
  totalRides: number;
  carClass?: 'SMALL' | 'MEDIUM' | 'DELUXE';
  totalDistance: number   //insgesamt gefahrene distanz
  balance: number;
}
