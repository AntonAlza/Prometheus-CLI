import { AnimalNutrition } from "../AnimalNutrition";
import { cargaCombo } from "../cargaCombo";
import { Physical } from "../Physical";
import { HumanConsumption } from "./HumanConsumption";

export class objInitGestionOperacion{

    public nuevoID: number;
    public comboProveedor: cargaCombo[];
    public comboEmbarque: cargaCombo[];
    public comboFuturo: cargaCombo[];
    public comboTipoPrecio: cargaCombo[];
    public comboPuerto: cargaCombo[];
    public comboNivelProteina: cargaCombo[];
    public comboDestino: cargaCombo[];
    public comboNutricionAnimal: cargaCombo[];
    public comboLocacion: cargaCombo[];
    public comboIncoterms: cargaCombo[];
    public comboTipoSubyacenete: cargaCombo[];
    public comboBolsa: cargaCombo[];
    public comboContratos: cargaCombo[];
    public contrato: string;
    public fisico: Physical;
    public nutricionAnimal: AnimalNutrition;
    public consumoHumano: HumanConsumption;
    public comboConsumoHumano: cargaCombo[];
    
    constructor(){}
}