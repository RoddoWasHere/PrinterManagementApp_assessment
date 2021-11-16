import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, List, ListItem, TextField } from "@mui/material";
import gql from "graphql-tag";
import { useState } from "react";
import { PrinterProvider, usePrinterState } from "../Utilities/PrinterProvider";
import ConfirmDialog from "./ConfirmDialog";
import { ModalProvider, useModalState } from "./PopupModal";




const AddNewPrinter = gql`
    mutation Mutation($name: String!, $ipAddress: String!, $isActive: Boolean!) {
        addPrinter(name: $name, ipAddress: $ipAddress, isActive: $isActive) {
            id
        }
    }
`;



export interface IPrinterData {
    id: number
    name: string
    ipAddress: string
    isActive: boolean
}

export class PrinterData implements IPrinterData{
    id: number = -1
    name: string = ""
    ipAddress: string = ""
    isActive: boolean = false
}

export interface IPrinterDataChange {
    id?: number
    name?: string
    ipAddress?: string
    isActive?: boolean
}

interface IPrinterFieldSetProps{
    //printerData: IPrinterData
    //onChange?: (printerData: IPrinterData) => void
}




export const PrinterFieldSet = (props: IPrinterFieldSetProps) => {
    const printerState = usePrinterState();
    const printerData = printerState.printerData;
    // const [name, setName] = useState("");
    // const [ipAddress, setIpAddress] = useState("");
    // const [isActive, setIsActive] = useState(false);

    //const [_, setPrinterDataAux] = useState<IPrinterData>(props.printerData);
    //const onChange = props.onChange ? props.onChange : (data: IPrinterData) => {};

    const setPrinterData = (newData: IPrinterDataChange) => {
        const newState = {...printerState.printerData, ...newData};
        //setPrinterDataAux(newState);
        //onChange(newState);
        console.log("new state?", newState)
        printerState.printerData = newState;

        printerState.eventHandler.dispatch("change", null);
    };

    

    return (<>
        <ListItem>
            <TextField 
                id="standard-basic" 
                label="Printer name" 
                variant="standard"
                onChange={(event)=>{setPrinterData({name: event.target.value})}}
                defaultValue={printerData.name}
            />
        </ListItem>
        <ListItem>
            <TextField 
                id="standard-basic" 
                label="IP Address" 
                variant="standard"
                onChange={(event)=>{setPrinterData({ipAddress: event.target.value})}}
                defaultValue={printerData.ipAddress}
            />
        </ListItem>
        <ListItem>
            <FormControlLabel
                control={<Checkbox 
                    defaultChecked={printerData.isActive} 
                    onChange={(event)=>{setPrinterData({isActive: event.target.checked})}}
                />} 
                label="Is Active"
            />
        </ListItem>
    </>);
};


const AddPrinterForm = (props: any) => {
    const initialPrinterData = new PrinterData();
    //return <AddPrinterFormInner {...props}/>;
    return (
        <ModalProvider>
            <PrinterProvider printerData={initialPrinterData}>
                <AddPrinterFormInner {...props}/>
            </PrinterProvider>
        </ModalProvider>   
    );
}

const AddPrinterFormInner = (props: any) => {
    const modalState = useModalState();
    const printerState = usePrinterState();

    const [mutateAddNewPrinter, { data, loading, error }] = useMutation(AddNewPrinter);

    const onShowConfirm = () => {
        modalState.setOpen(true);
    };

    const onSubmit = () => {
        const {name, ipAddress, isActive} = printerState.printerData;

        console.log("form data?", {name, ipAddress, isActive});
        //validate...
        const addedResult = mutateAddNewPrinter({variables:{name, ipAddress, isActive}});
        console.log("addedResult", addedResult);

        if(props.onComplete) props.onComplete();
    };

    console.log("data?", data);

    const confirmMessage = "Are you sure you'd like to create a printer with the provided properties?\nx,y,z";
    const onConfirm = (hasAccepted: boolean) => {
        if(hasAccepted){
            onSubmit();
        }
        modalState.setOpen(false);
    }

    return (<>
        <ConfirmDialog onConfirm={onConfirm} message={confirmMessage}/>
        <List>
            <PrinterFieldSet/>
            <ListItem>
                <Button variant="contained" onClick={onShowConfirm}>Add</Button>
            </ListItem>
        </List>
    </>);
};

export default AddPrinterForm;