import { IFDSinEstrategia } from "./ifdSinEstrategia";

export class Estrategia {

    public codEstrategia:number;
    public idTipoEstrategia:number;
    public idPortafolio:number;
    public idFicha:number;
    public nuevaFicha:string;
    public idTipoCobertura:number;
    public idCampanha:number;
    public idClaseOpcion:number;
    public idLimiteEspecifico:number;
    public tmCubrir:number;
    public usuario:string;
    public fecha:number;
    public ifdSinEstrategia:IFDSinEstrategia[];
    public modificacionT:Boolean=false; 

    constructor(){

    }

    

    

}
