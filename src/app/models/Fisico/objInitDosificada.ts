import { ConsultaDosificadas } from "./ConsultaDosificadas";

export class objInitDosificada{

    public portafolioDosificadas: ConsultaDosificadas[];
    public portafolioDespachadas: ConsultaDosificadas[];
    public portafoliopendiente: ConsultaDosificadas[];
    public inicioPeriodo: string;
    public finPeriodo: string;
    
    constructor(){}

}