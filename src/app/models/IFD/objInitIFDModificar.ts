import { Benchmark } from "./benchmark";
import { Bolsa } from "./bolsa";
import { Broker } from "./broker";
import { CargarCombo } from "./cargarCombo";
import { Contrato } from "./Contrato";
import { Descripcion } from "./descripcion";
import { MesExpiracion } from "./mesExpiracion";
import { OperacionesSQL } from "./operacionSQL";
import { SellBuy } from "./sellbuy";
import { Sociedad } from "./sociedad";
import { SubordinateAccount } from "./subordinateAccount";
import { TipoContrato } from "./tipoContrato";
import { TipoLiquidacion } from "./tipoLiquidacion";
import { TypeOperation } from "./TypeOperation";

export class ObjInitIFDModificar{

    public subordinateAccount_SQL: Descripcion;
    public tipoContrato_SQL: Descripcion;
    public bolsa_SQL: Descripcion;
    public operacion_SQL: OperacionesSQL;
    public contractInMetricTons: number;
    public factorUnitMeasure: number;
    public descUnidadMedida: Descripcion;
    public comboTipoLiquidacion: TipoLiquidacion[];
    public comboSellBuy: SellBuy[];
    public comboBroker: Broker[];
    public comboInstrumento: CargarCombo[];
    public comboSociedad: Sociedad[];
    public comboSubordinateAccount: SubordinateAccount[];
    public comboBenckmark: Benchmark[];
    public comboTypeOperation: TypeOperation[];
    public ticker_Contrato: Descripcion;
    public comboContrato: Contrato[];
    public comboMesExpiracion: MesExpiracion[];
    public comboTipoContrato: TipoContrato[];
    public comboBolsa: Bolsa[];
    
    
    constructor(){}
}