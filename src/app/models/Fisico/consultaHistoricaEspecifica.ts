import { consultaHistorica } from "./consultaHistorica";
import { FormacionPrecios } from "./FormacionPrecios";
import { listaBaseMolienda } from "./listaBaseMolienda";
import { listaFlatMolienda } from "./listaFlatMolienda";
import { listaFuturoMolienda } from "./listaFuturoMolienda";

export class consultaHistoricaEspecifica{
    
    public consultaBase: consultaHistorica[];
    public listaBases: listaBaseMolienda[];
    public listaFlats: listaFlatMolienda[];
    public listaFuturos: listaFuturoMolienda[];
    public listaFormacionPrecios: FormacionPrecios[];

    constructor(){}

}