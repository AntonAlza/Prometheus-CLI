import { cargaCombo } from "../cargaCombo";
import { ClosingPrice } from "../ClosingPrice";

export class objComprarFuturo{
    public nuevoClosingPrice: ClosingPrice;
    public comboFuturosCM: cargaCombo[];
    public precio: number;
    public underlyingID: number;
    public comentario: string;
    
    constructor(){}
}