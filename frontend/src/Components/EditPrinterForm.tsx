import { gql, useMutation } from "@apollo/client";
import { List, ListItem, Button, Stack } from "@mui/material";
import { usePrinterState } from "../Utilities/PrinterProvider";
import { PrinterFieldSet } from "./AddPrinterForm";

const updatePrinterQuery = gql`
    mutation UpdatePrinterMutation($id: String!, $newData: PrinterUpdate!) {
        updatePrinter(id: $id, newData: $newData) {
            id
        }
    }
`;

export default function EditPrinterForm(props: any) {
    const printerState = usePrinterState();
    //const printerData = printerState.printerData;

    console.log("in modal", printerState);

    //const [open, setOpen] = React.useState(props.open);
    
    //const open = props.open;
    const [mutateUpdatePrinter, { data, loading, error }] = useMutation(updatePrinterQuery);

    //const [printerData, setPrinterData] = React.useState<IPrinterData>(props.printerData);

    const setPrinterData = (newData: any) =>{
        //const stateToSet = {...printerData, ...newData};
        //setPrinterDataAux(stateToSet);
    };
    // React.useEffect(()=>{
    //     if(props.open != open) setOpen(props.open);
    // },[]);  

    const onUpdate = async() => {
        console.log("got new data", printerState.printerData);
        const {name, ipAddress, isActive} = printerState.printerData;

        await mutateUpdatePrinter({variables:{
            id: printerState.printerData.id,
            newData: { name, ipAddress, isActive },
        }});

        console.log("mutation complete")
        //setOpen(false);
        //props.onClose();
        printerState.eventHandler.dispatch("change", null);
        if(props.onUpdate) props.onUpdate(false);
    };

    return (
        <List>
            <PrinterFieldSet/>
            <ListItem>
                <Stack direction="row" spacing={2} justifyContent="center" flexBasis="100%">
                    <Button 
                        variant="contained"
                        onClick={() => onUpdate()}
                    >Update</Button>
                    <Button 
                        variant="contained"
                        onClick={() => props.onCancel()}
                    >Cancel</Button>
                </Stack>
            </ListItem>
        </List>
    );
}
