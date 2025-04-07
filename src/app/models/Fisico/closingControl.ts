export class ClosingControl{

    T165_Underlying: number;
    T165_Society: number;
    T165_Date: number;
    T165_ClosingConcept: number;
    T165_Hour: string;
    T165_User: string;
    T165_Status: number;

    constructor(jsonStr: string){
        let jsonObj: any = JSON.parse(jsonStr);
        for (let prop in jsonObj) {
            this[prop] = jsonObj[prop];
        }
    }

    
    
}