import { ColumnasIFD } from "./ColumnasIFD";
import { ConsultaIFDsFret } from "./ConsultaIFDsFret"

export class ListaConsultaIFD{
    dataIFD: ConsultaIFDsFret[];
    cabecera: ColumnasIFD[];
    tipoIFD:string;
    totalCAKs:number;
    totalDelta:number;
    sort: any;

    constructor(){}
}