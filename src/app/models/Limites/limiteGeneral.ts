import { DetalleLimiteCM } from "./detalleLimite";
import { LimiteConsumo } from "./limiteConsumo";

export class LimiteGeneral{
    detalleLimiteConsumo:LimiteConsumo[];
    detalleLimiteCM:DetalleLimiteCM[];
    totalConsumo:number;
    usuario:string;
    fecha:number;

}