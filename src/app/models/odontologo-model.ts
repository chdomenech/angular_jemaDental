export interface Roles {
  odontologo?: boolean;
}
export interface OdontologoInterface {
  id?: string;
  foto?: any;
  telefono?: string;
  cedula?: string;
  email?: string;
  nombre?: string;
  especialidad: string;
  jornadaLaboral?: string;
  horario?: {};
  rol?: Roles;
}
