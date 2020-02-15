export interface Roles {
  paciente?: boolean;
}
export interface PacienteInterface {
  id?: string;
  hClinica?: string;
  cedula?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  seguro?: string;
  foto?: string;
  rol?: Roles;
}
