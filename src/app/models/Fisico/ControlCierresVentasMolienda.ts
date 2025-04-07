import { Underlying } from "./underlying";

export class ControlCierresVentasMolienda{
    
    idSociedad: string;
    idSubyacente: string;
    desc_Subyacente: string;
    flgCerrar: boolean;
    flgEstado: boolean;
    horacierreString: string;
    horacierreDate: Date;
    usuarioRegistra: string;


    constructor(productos: Underlying){
        this.idSubyacente = productos["t001_ID"].toString();
        this.desc_Subyacente=productos["t001_Description"];
        this.flgCerrar= false;
        this.flgEstado=true;
    }

}