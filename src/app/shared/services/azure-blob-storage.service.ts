import { Injectable } from "@angular/core";
import {BlobServiceClient, BlockBlobClient, ContainerClient, RestError} from '@azure/storage-blob';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AzureBlobStorageService{
    // // DEV
    // accountName = "alieus2stansdevatn01";
    // containerName = "devrrff";
    // sas = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacuptfx&se=2025-06-30T07:28:23Z&st=2025-02-03T23:28:23Z&spr=https,http&sig=890GTWVwkpQD9r%2Fg8bhUta8trs340rxy7VHwGk4wEgQ%3D";

    // //PROD
    accountName = "alieus2stansprdatn01";
    containerName = "prdrrff";
    sas = "sp=racwdl&st=2025-02-18T23:01:02Z&se=2026-02-19T07:01:02Z&spr=https&sv=2022-11-02&sr=c&sig=n5bGsdOz%2Bz4UBQuNE8vzTTbTUOJRC2sjfbXqtCBkKwc%3D";

    constructor(){}

    public async getBlobNames(carpeta) {
        const blobServiceClient = new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${this.sas}`);
        const containerClient = blobServiceClient.getContainerClient(this.containerName);
        let iter = containerClient.listBlobsFlat({ prefix: carpeta });
        let blobItem = await iter.next();
        const fileNames:string[] = [];
        while (!blobItem.done) {
            fileNames.push(blobItem.value.name);
            blobItem = await iter.next();
        }
        return fileNames;
    }

    public async listFiles(): Promise<string[]>{
        let result: string[] = [];
        let blobs = this.containerClient().listBlobsFlat();
        for await(const blob of blobs){
            result.push(blob.name);
        }
        return result;
    }
 
    public uploadFile(content: Blob, name: string, handler: () => void){
            const blockBlobClient = this.containerClient().getBlockBlobClient(name);
            blockBlobClient.uploadData(content, {blobHTTPHeaders:{blobContentType: content.type}}).then(() => handler());

        }
    // public downloadFile(name: string, handler: (blob: Blob) => void){
    //     const blobClient = this.containerClient().getBlobClient(name);
    //     blobClient.download().then(resp => {
    //         resp.blobBody?.then(blob => {
    //             handler(blob);
    //         });
    //     });
    // }


    public downloadFile(name: string, handler: (url: string) => void){
        const blobClient = this.containerClient().getBlobClient(name);
        handler(blobClient.url.substring(0,blobClient.url.indexOf("?")));
    }

    public downloadFileBlob(name: string, handler: (blob: Blob) => void){
        const blobClient = this.containerClient().getBlobClient(name);
        blobClient.download().then(resp => {
            resp.blobBody?.then(blob => {
                handler(blob);
            });
        });
    }

    public deleteFile(name: string, handler: () => void){
        this.containerClient().deleteBlob(name).then(() => {
            handler();
        })
    }



    private containerClient(): ContainerClient{
        return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${this.sas}`).getContainerClient(this.containerName);
    }


    
}