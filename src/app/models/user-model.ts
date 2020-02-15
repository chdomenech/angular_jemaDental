
export interface Roles {
  administrador?: boolean;
  secretaria?: boolean;
}
export interface UserInterface {
  id?: string;
  imagen?: any;
  telefono?: number;
  cedula?: number;
  email?: string;
  nombre?: string;
  roles?: Roles;
}
