import { listaAsignarFuturo } from "./listaAsignarFuturo";
export class ObjAsignarFuturo{
    public codFisico: number;
    public caks: number;
    public listaFuturos: listaAsignarFuturo[];
    public futuroSeleccionado: number;
    public usuario: string;
    public futuroAsignado: number;
    
    constructor(){}
}