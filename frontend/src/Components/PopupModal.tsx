import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AppBar, Toolbar } from '@mui/material';

import { createContext, ReactNode } from 'react';
import { EventHandler } from '../Utilities/PrinterProvider';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 0,
};

interface IPopupModalProps{
    title: string
    children: ReactNode
    open?: boolean
    onClose?:() => void
}

interface IModalContextState {
    isOpen: boolean
    eventHandler: EventHandler
    setOpen: (isOpen: boolean) => void
}

const initialContextState = {
    setOpen: (isOpen: boolean) => {}
};

const ModalContext = createContext(initialContextState as IModalContextState);

interface IModalProviderProps{
    children: ReactNode
    //printerData: IPrinterData
}

export const ModalProvider = (props: IModalProviderProps) => {
    const initialState: IModalContextState = {
        //printerData: props.printerData,
        isOpen: false,
        eventHandler: new EventHandler(),
        setOpen: (isOpen: boolean) => {}
    };
    
    React.useEffect(()=>{
        //unmount
        return ()=> initialState.eventHandler.terminateAll();
    },[]);

    return (
        <ModalContext.Provider value={initialState}>
            {props.children}
        </ModalContext.Provider>
    );
};

export function useModalState(): IModalContextState{
    return React.useContext<IModalContextState>(ModalContext);
}

export default function PopupModal(props: IPopupModalProps) {

    const modalState = useModalState();
    //const printerState = usePrinterState();
    //const printerData = printerState.printerData;

    //console.log("in modal", printerState);

    const [open, setOpen] = React.useState(modalState.isOpen);
    
    modalState.setOpen = (isOpen: boolean) => {
        
        modalState.isOpen = isOpen;
        setOpen(isOpen);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <AppBar
                        position="relative"
                    >
                        <Toolbar>
                            <Typography>{ props.title }</Typography>
                        </Toolbar>
                    </AppBar>
                    { props.children }
                </Box>
            </Modal>
        </div>
    );
}
