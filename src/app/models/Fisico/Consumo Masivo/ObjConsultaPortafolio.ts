import { LibroFisicoOpenShipments } from "./LibroFisicoOpenShipments";
import { PortafolioInventario } from "./PortafolioInventario";

export class ObjConsultaPortafolio{
    
    public portafolioOpen: LibroFisicoOpenShipments[];
    public portafolioTransito: LibroFisicoOpenShipments[];
    public portafolioInventarios: PortafolioInventario[];

    constructor(){}
}