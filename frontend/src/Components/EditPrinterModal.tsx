import * as React from 'react';
import Button from '@mui/material/Button';
import { List, ListItem } from '@mui/material';
import { PrinterFieldSet } from './AddPrinterForm';
import { useMutation } from '@apollo/client';
import { usePrinterState } from '../Utilities/PrinterProvider';
import PopupModal, { useModalState } from './PopupModal';
import EditPrinterForm from './EditPrinterForm';


export default function EditPrinterModal(props: any) {
    const modalState = useModalState();
    const closeDialog = () =>{
        modalState.setOpen(false);
    }

    return (
        <PopupModal title="Update Printer">
            <EditPrinterForm onCancel={closeDialog} onUpdate={closeDialog}/>
        </PopupModal>
    );
}

// export function EditPrinterModal_prev(props: any) {
//     const printerState = usePrinterState();
//     //const printerData = printerState.printerData;

//     console.log("in modal", printerState);

//     const [open, setOpen] = React.useState(props.open);
    
//     //const open = props.open;
//     const [mutateUpdatePrinter, { data, loading, error }] = useMutation(updatePrinterQuery);

//     //const [printerData, setPrinterData] = React.useState<IPrinterData>(props.printerData);

//     const setPrinterData = (newData: any) =>{
//         //const stateToSet = {...printerData, ...newData};
//         //setPrinterDataAux(stateToSet);
//     };
//     React.useEffect(()=>{
//         if(props.open != open) setOpen(props.open);
//     },[]);  

//     const onUpdate = async() => {
//         console.log("got new data", printerState.printerData);
//         const {name, ipAddress, isActive} = printerState.printerData;

//         await mutateUpdatePrinter({variables:{
//             id: printerState.printerData.id,
//             newData: { name, ipAddress, isActive },
//         }});

//         console.log("mutation complete")
//         setOpen(false);
//         //props.onClose();
//         printerState.eventHandler.dispatch("change", null);
//         if(props.onUpdate) props.onUpdate(false);
//     };

//     return (
//         <PopupModal title="Update Printer">
//             <List>
//                 <PrinterFieldSet/>
//                 <ListItem>
//                     <Button 
//                         variant="contained"
//                         onClick={() => onUpdate()}
//                     >Update</Button>
//                     <Button 
//                         variant="contained"
//                         onClick={() => props.onCancel()}
//                     >Cancel</Button>
//                 </ListItem>
//             </List>
//         </PopupModal>
//     );
// }

