import { ColumnasIFD } from "./ColumnasIFD";
import { ConsultaIFDsFret } from "./ConsultaIFDsFret";
import { Fret_ObtenerDatosCRM } from "./Fret_ObtenerDatosCRM";
import { ListaConsultaIFD } from "./ListaConsultaIFD";
import { listaDataEntry } from "./listaDataEntry";
import { objTablas } from "./objTablas";

export class objInitTabPosicion{
    data: listaDataEntry[];
    listaData: objTablas[];
    columnas: Object[];


    listaDataResumen: Object[];
    columnasResumen: Object[];

    listaDataResumenComparativo: Object[];
    columnasResumenComparativo: Object[];

    listaDataMercado: Object[];
    listaFOBPalma: Object[];
    columnasMercado: Object[];

    listaDataResultado: objTablas[];
    columnasResultado: Object[];

    ifds: ListaConsultaIFD[];


    dataPapelesLiquid: Object[];
    columnasPapelesLiquid: Object[];

    listaCRMIndividual: Fret_ObtenerDatosCRM[];
    listaCRMAgrupada: Fret_ObtenerDatosCRM[];

    factor: number;
    factorPrice: number;

    unidadMedida: string;

    listaDataTipoTrigo: objTablas[];
    

    constructor(){}
}