import { AnimalNutrition } from "./AnimalNutrition";
import { HumanConsumption } from "./Consumo Masivo/HumanConsumption";
import { Physical } from "./Physical";
import { SalesContract } from "./SalesContract";

export class ContratoCross{
    
    salesContract: SalesContract;
    physical: Physical;
    animalNutrition: AnimalNutrition;
    consumoHumano: HumanConsumption;
    constructor(){}

}