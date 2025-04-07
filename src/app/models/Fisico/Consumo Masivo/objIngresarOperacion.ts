import { AnimalNutrition } from "../AnimalNutrition";
import { Physical } from "../Physical";
import { cargaCombo } from "../cargaCombo";
import { HumanConsumption } from "./HumanConsumption";

export class objIngresarOperacion{
    public fisico: Physical;
    public nutricionAnimal: AnimalNutrition;
    public consumoHumano: HumanConsumption;
    public comboConsumoHumano: cargaCombo[];
}