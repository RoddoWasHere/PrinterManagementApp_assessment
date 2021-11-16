import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AppBar, List, ListItem, Stack, Toolbar } from '@mui/material';

import { PrinterFieldSet } from "./AddPrinterForm";
import PopupModal from './PopupModal';

const mainBoxStyle = {
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
    textAlign: "center",
};

//const 

const ConfirmDialog = (props: any) => {
    return (
        <PopupModal title="Confirm" open={true}>
            <List>
                <ListItem>
                    <Typography id="modal-modal-title" component="p" textAlign="center">
                        {props.message}
                    </Typography>
                </ListItem>
                <ListItem>
                    <Stack direction="row" spacing={2} justifyContent="center" flexBasis="100%">
                        <Button 
                            variant="contained"
                            onClick={() => props.onConfirm(true)}
                        >Yes</Button>
                        <Button 
                            variant="contained"
                            onClick={() => props.onConfirm(false)}
                        >No</Button>
                    </Stack>
                </ListItem>
            </List>
        </PopupModal>
    );
}

export default ConfirmDialog;