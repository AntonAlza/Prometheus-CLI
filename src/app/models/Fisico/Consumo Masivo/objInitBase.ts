import { cargaCombo } from "../cargaCombo";
import { ClosingBasis } from "../ClosingBasis";

export class objInitBase{
    public codFisico: number;
    public nuevoID: number;
    public comboContrato: cargaCombo[];
    public crossCompany: number;
    public baseModificar: ClosingBasis;
    public saldo: number;
    public comentario: string;
}