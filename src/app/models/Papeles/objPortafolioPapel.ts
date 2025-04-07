import { cargaCombo } from "../Fisico/cargaCombo";
import { PortafolioPapelesAbiertos } from "./PortafolioPapelesAbiertos";

export class objPortafolioPapel{
    
    public portafolioPapelesAbiertos: PortafolioPapelesAbiertos[]
    public m2m: number;
    public listaSociedades: cargaCombo[];

    constructor(){}

}