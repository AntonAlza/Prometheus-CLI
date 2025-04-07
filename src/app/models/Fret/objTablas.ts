import { listaDataEntry } from "./listaDataEntry";
import { MatTableDataSource } from "@angular/material/table";

export class objTablas{
    data: listaDataEntry[];
    nombreTabla: string;
    flgReplicar: boolean;
    dataSource: MatTableDataSource<listaDataEntry>;
    flgReplicarData: number;
    codTrigo: number;

}