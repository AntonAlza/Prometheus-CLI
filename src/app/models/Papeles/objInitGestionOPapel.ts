import { cargaCombo } from "../Fisico/cargaCombo";
import { Paper } from "./Paper";

export class objInitGestionOPapel{
    
    public comboTipoOperacion: cargaCombo[];
    public comboContraparte: cargaCombo[];
    public comboBolsa: cargaCombo[];
    public comboContrato: cargaCombo[];
    public comboOrigen: cargaCombo[];
    public comboIndice: cargaCombo[];
    public comboTipoPrecio: cargaCombo[];
    public comboIncoterm: cargaCombo[];
    public comboCampania: cargaCombo[];
    public comboMesCobertura: cargaCombo[];
    
    public papelGestionado: Paper;
    public flgIngresarPapel: boolean;
    public bolsaSeleccionada: number;

    constructor(){}

}