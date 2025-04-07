import { Contrato } from "./Contrato";
import { PoBo_Paper } from "./PoBo_Paper";
import { Bolsa } from "./bolsa";
import { Broker } from "./broker";
import { Descripcion } from "./descripcion";
import { MesExpiracion } from "./mesExpiracion";
import { SellBuy } from "./sellbuy";
import { Sociedad } from "./sociedad";
import { TipoContrato } from "./tipoContrato";

export class objInitPoBo{
    
    public poBoPaper: PoBo_Paper;
    public listaSellBuy: SellBuy[];
    public listaSociedad: Sociedad[];


    public listaTipoContrato: TipoContrato[];

    public comboBolsa: Bolsa[];
    public comboContrato: Contrato[];
    public tipoContrato_SQL: Descripcion;
    public bolsa_SQL: Descripcion;
    public comboBroker: Broker[];
    public ticker_Contrato: Descripcion;
    public comboMesExpiracion: MesExpiracion[];
    public factorUnitMeasure: number;
    public contractInMetricTons: number;
    public descUnidadMedida: Descripcion;
    constructor(){}
}