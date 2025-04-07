import { MatTableDataSource } from "@angular/material/table";
import { cargaCombo } from "../Fisico/cargaCombo";
import { columnasDataEntry } from "./columnasDataEntry";
import { listaDataEntry } from "./listaDataEntry";
import { objTablas } from "./objTablas";

export class objInitFormDataEntry{
    data: listaDataEntry[];
    listaData: objTablas[];
    columnas: columnasDataEntry[];
    flgReplica: boolean;
    diaReplica: string;
    comboSociedades: cargaCombo[];

    listaTrigosDisponibles: string[];


    constructor(){}
}