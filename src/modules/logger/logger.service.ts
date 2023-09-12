import { LoggerService } from "@nestjs/common";

export class MyLogger implements LoggerService{
    
    
    private logWithMetadata(infoObject: any) {
        console.log(infoObject);
      }

      log(message: string, context?: string) {
        const logObject = {
          message,
          context,
        };
        this.logWithMetadata(logObject);
      }

    info(message: string, className:string,fileName:string) {
        const infoObject = {
            message,
            className,
            fileName,
          };
          this.logWithMetadata(infoObject);
    }
  
    
    error(message: string,className:string,fileName:string ) {
        const errorObject = {
            message,
            className,
            fileName,
        };
        this.logWithMetadata(errorObject);
    }
  
    
    warn(message: string,className:string,fileName:string) {
        const warnObject = {
            message,
            className,
            fileName,
        }
        this.logWithMetadata(warnObject);
    }
  
    
    debug?(message: string,className:string,fileName:string) {
        const debugObject = {
            message,
            className,
            fileName,
        }
        this.logWithMetadata(debugObject)
    }
  
   
    verbose?(message: string, className:string,fileName:string ) {
        const verboseObject ={
            message,
            className,
            fileName,
        }
        this.logWithMetadata(verboseObject)
    }
  }