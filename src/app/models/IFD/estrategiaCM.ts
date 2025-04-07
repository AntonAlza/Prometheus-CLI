import { ConsumoACubrir } from "./ConsumoCubrir";
import { EmbarquePricingACubrir } from "./EmbarquePricingACubrir";
import { IFDSinEstrategia } from "./ifdSinEstrategia";
import { InventarioTransitoACubrir } from "./InventarioTransitoACubrir";

export class EstrategiaCM {

    public codEstrategia:number;
    public idTipoEstrategia:number;
    public idPortafolio:number;
    public idTipoCobertura:number;
    public idEstadio:number;
    public idFicha:number;
    public nuevaFicha:string;
    public usuario:string;
    public fecha:number;
    public operacionesSQL:IFDSinEstrategia[];
    public coberturaEmbarque:EmbarquePricingACubrir[];
    public coberturaInventario:InventarioTransitoACubrir[];
    public coberturaConsumo:ConsumoACubrir[];
    
    public modificacionT:Boolean=false;
    constructor(){

    }

    

    

}
