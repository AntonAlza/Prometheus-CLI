import { ControlBasesFlatsCM } from "./ControlBasesFlatsCM";
import { ControlCierresCM } from "./ControlCierresCM";
import { listaValidacionBaseConsumoInventario } from "./listaValidacionBaseConsumoInventario";

export class ObjInitCierreCM{
    public listaCierre: ControlCierresCM[];
    public listaBases: ControlBasesFlatsCM[];
    public estadoConsumo: boolean;
    public estadoInventario: boolean;
    public flgCerrarConsumo: boolean;
    public flgCerrarInventario: boolean;
    public horaCierreConsumo: string;
    public horaCierreInventario: string;
    public listaBenchmarkConsumo: listaValidacionBaseConsumoInventario[];
    public listaBenchmarkInventario: listaValidacionBaseConsumoInventario[];
    
    public flgCierrePrecios: boolean;

    constructor(){}
}