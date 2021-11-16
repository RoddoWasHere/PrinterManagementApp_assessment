import { checkPropTypes } from "prop-types";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { IPrinterData } from "../Components/AddPrinterForm";

import { Subject } from "rxjs";

const subject = new Subject();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});

const obsBSet = {
    next: (v: any) => console.log(`observerB: ${v}`)
};
const subscriptionTp = subject.subscribe(obsBSet);

subject.next(1);
subject.next(2);

subscriptionTp.unsubscribe();

class EventListener{
    subscription: any;
    constructor(subject: any, name: string, func:(event:any)=>void){
        this.subscription = subject.subscribe({
            next: func
        });
    }
    unsubscribe(){
        this.subscription.unsubscribe();
    }

}

export class EventHandler {
    events: any = {};
    createEvent(name: string){
        //if(events) remove event (complete event)

        this.events[name] = new Subject();
    }
    addEventListener(name: string, func:(event:any)=>void): EventListener{
        if(this.events[name] === undefined) this.createEvent(name);
        const subject = this.events[name];

        return new EventListener(subject, name, func);
    }
    dispatch(name:string, event: any){
        if(this.events[name] !== undefined) this.events[name].next(event);
    }
    terminate(name:string){
        if(this.events[name] !== undefined) this.events[name].complete();
        this.events[name] = undefined;
    }
    terminateAll(){
        for(var key in this.events){
            this.events[key].complete();
            this.events[key] = undefined;
        }
    }
}


interface IPriterContextState {
    printerData: IPrinterData
    eventHandler: EventHandler
}

const initialContextState = {
    printerData: {}
};

const PrinterContext = createContext(initialContextState as IPriterContextState);

interface IPrinterProviderProps{
    children: ReactNode 
    printerData: IPrinterData
}

export const PrinterProvider = (props: IPrinterProviderProps) => {
    const initialState: IPriterContextState = {
        printerData: props.printerData,
        eventHandler: new EventHandler()
    };
    
    useEffect(()=>{
        //unmount
        return ()=> initialState.eventHandler.terminateAll();
    },[]);

    return (
        <PrinterContext.Provider value={initialState}>
            {props.children}
        </PrinterContext.Provider>
    );
};

export function usePrinterState(): IPriterContextState{
    return useContext<IPriterContextState>(PrinterContext);
}

// export const SomeConsumer = (props) => {
//   return <SomeContext.Consumer>{props.children}</SomeContext.Consumer>;
// };
