import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { typography } from "@mui/system";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPrinterModal from "./EditPrinterModal";
import { IPrinterData } from "./AddPrinterForm";
import { PrinterProvider, usePrinterState } from "../Utilities/PrinterProvider";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ModalProvider, useModalState } from "./PopupModal";
import ConfirmDialog from "./ConfirmDialog";

const getAllPrintersQuery = gql`
    query {
        printers {
            id
            name
            ipAddress
            isActive
        }
    }  
`;

const deletePrinterQuery = gql`
    mutation DeletePrinterMutation($id: String!) {
        deletePrinter(id: $id) {
            id
        }
    }
`;

interface IPrinterListingItemProps {
    data: IPrinterData
    onChange?: () => void
}

export const PrinterListingItem = (props: IPrinterListingItemProps) => {
    //EditPrinterModal
    const printerState = usePrinterState();
    const modalState = useModalState();

    const [mutateDeletePrinter, { data, loading, error }] = useMutation(deletePrinterQuery);

    const [modalOpen, setModalOpen] = useState(false);
    const printerData = printerState.printerData;

    const [currentModal, setCurrentModal] = useState(<></>);

    useEffect(()=>{
        const listener = printerState.eventHandler.addEventListener("change",()=>{
            console.log("got change event", printerState.printerData, printerData);
            
            if(props.onChange != null) props.onChange();
        });
        console.log("listing has subbed: ", printerState.printerData.name)
        //unmount
        return () => {
            console.log("->listing has un-subbed:", printerState.printerData.name)
            listener.unsubscribe();
        }
    });



    const openUpdateModal = () => {
        //setModalOpen(true);
        
        setCurrentModal(<EditPrinterModal/>);
        
    };

    const closeModal = () => {
        setModalOpen(false);
        console.log("got modal close?");
        //if(props.onChange != null) props.onChange();
        printerState.eventHandler.dispatch("change", null);
    };
    console.log("rerender?");


    const deletePrinter = async() => {
        await mutateDeletePrinter({variables:{
            id: printerState.printerData.id
        }});
        console.log("delete mutate completed");
        //if(props.onChange != null) props.onChange();

        printerState.eventHandler.dispatch("change", null);
    };

    const confirmDelete = () => {
        setCurrentModal(<ConfirmDialog message="Are you sure you want to delete this item"/>);
        modalState.setOpen(true);
    };
    //const editPrinterModal = modalOpen ? <EditPrinterModal open={modalOpen} onClose={closeModal}/> : <></>;

    //modalState.setOpen(modalOpen);
    modalState.setOpen(true);

    return (<>
        {/* { editPrinterModal } */}
        {/* <EditPrinterModal/> */}
        { currentModal }
        {/* <ConfirmDialog message="Are you sure you want to delete this item"/> */}
        {/* <EditPrinterModal open={modalOpen} onClose={closeModal} printerData={printerData}/> */}
        <TableRow hover 
            // onClick={openModal}
        >
            <TableCell>{printerData.name}</TableCell>
            <TableCell>{printerData.ipAddress}</TableCell>
            <TableCell>{printerData.isActive + ""}</TableCell>
            <TableCell>
                <Button
                    variant="outlined" 
                    size="small" 
                    startIcon={(<EditIcon/>)}
                    onClick={openUpdateModal}
                >Edit</Button>
                <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={(<DeleteIcon/>)}
                    onClick={confirmDelete}
                >Delete</Button>
            </TableCell>
        </TableRow>
    </>);
}


const PrinterListing = () => {
    const { loading, error, data, refetch } = useQuery(getAllPrintersQuery,{
        fetchPolicy: "network-only"//prevent local caching...
    });
    //const [getAllPrinters, { loading, error, data }] = useLazyQuery(getAllPrintersQuery);
    //const [state, setState] = useState<any>({searchText:"", page:0});

    //if(props.setOnStateCreate) props.setOnStateCreate([state, setState]);
    const [wtf, refresh] = useState(0);

    const refetchData = async() => {
        console.log("got refetch");
        await refetch();
        //refresh(wtf+1);
    };
  
    useEffect(()=>{//on mounted
        console.log("has mounted");
        //getAllPrinters();
    },[])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log("rerender PrinterListing: data?", data);
    const printers = data && data.printers ? data.printers : null;
    if(!printers) return <p>No data</p>;


    return (<>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>IP Address</TableCell>
                        <TableCell>Is Active</TableCell>
                        <TableCell>Modify</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        printers.map((p: IPrinterData) => (
                            <ModalProvider>
                                <PrinterProvider printerData={p}>
                                    <PrinterListingItem data={p} onChange={refetchData}/>
                                </PrinterProvider>
                            </ModalProvider>
                        ))
                    }
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Button
                                variant="outlined" 
                                size="small" 
                                startIcon={(<AddCircleIcon/>)}
                                //onClick={openModal}
                            >Add New Printer</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </>);


    return (
        <div>
            {
                printers.map((p: any) => 
                    <Typography>{p.name}</Typography>)
            }
        </div>
    );
}

export default PrinterListing;