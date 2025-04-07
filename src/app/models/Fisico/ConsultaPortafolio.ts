//JORDI
import { ConsultaPortafolioConsumoInventario } from "./ConsultaPortafolioConsumoInventario";
import { ConsultaPortafolioEnTransito } from "./ConsultaPortafolioEnTransito";
import { ConsultaPortafolioPorEmbarcar } from "./ConsultaPortafolioPorEmbarcar";

export interface ConsultaPortafolio{
    consultaPortafolioPorEmbarcar: ConsultaPortafolioPorEmbarcar[];
    consultaPortafolioEnTransito: ConsultaPortafolioEnTransito[];
    consultaPortafolioConsumoInventario: ConsultaPortafolioConsumoInventario[];
}