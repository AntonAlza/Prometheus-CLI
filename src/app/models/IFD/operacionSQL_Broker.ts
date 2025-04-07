import { OperacionesSQL } from "./operacionSQL";
import { Pricing } from "./pricing";

export class OperacionSQL_Broker {

    public idbroker:string;
    public brokercode:string;
    public cuentaBroker:string
    public descuentaBroker:string
    public codEmpresa:string;
    public usuario:string
    public operacionesSQL:OperacionesSQL;
    public pricing:Pricing;
    public precioBarrera:number;
    public precioBinary:number;
    public precioDailyBinary:number;
    public esNuevaOperacionT:Boolean;
    public ticker:string;
    public fechaVcto:string;
    public idTipoContrato:number;
    public idAsianOption:number;
    public pNuevaFechaAvg:number;
    
    

    constructor(){

    }

    

    

}
