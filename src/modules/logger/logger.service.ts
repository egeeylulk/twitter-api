import { LoggerService } from "@nestjs/common";
import { DATE } from "sequelize";

export class MyLogger implements LoggerService{
    
    
    private logWithMetadata(infoObject: any) {
        console.log(infoObject);
      }

      log(message: string, context?: string) {
        const date = new Date();
        const logObject = {
          date,
          message,
          context,
        };
        this.logWithMetadata(logObject);
      }

    info(message: string, className:string,fileName:string) {
        const date = new Date();
        const infoObject = {
            date,
            message,
            className,
            fileName,
          };
          this.logWithMetadata(infoObject);
    }
  
    
    error(message: string,className:string,fileName:string ) {
        const date = new Date();
        const errorObject = {
            date,
            message,
            className,
            fileName,
        };
        this.logWithMetadata(errorObject);
    }
  
    
    warn(message: string,className:string,fileName:string) {
        const date = new Date();
        const warnObject = {
            date,
            message,
            className,
            fileName,
        }
        this.logWithMetadata(warnObject);
    }
  
    
    debug?(message: string,className:string,fileName:string) {
        const date= new Date();
        const debugObject = {
            date,
            message,
            className,
            fileName,
        }
        this.logWithMetadata(debugObject)
    }
  
   
    verbose?(message: string, className:string,fileName:string ) {
        const date = new Date();
        const verboseObject ={
            date,
            message,
            className,
            fileName,
        }
        this.logWithMetadata(verboseObject)
    }
  }