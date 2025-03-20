import React, { useState } from 'react';
import ForgeReconciler, {Text, Button, PortalUserMenuAction, ModalDialog, Select} from '@forge/react';
import { invoke } from '@forge/bridge';


const App = () => {
    const [isOpen, setOpen] = useState(true);
    const [options, setOptions] = useState([]);

    invoke('getRequestUrlFromFitId', { fitId: '123' }).then((response) => {
        console.log(response);
        setOptions(response);
    });

    const handleButton = () => {
        console.log('Hello world!');
    }



    if (!isOpen) {
        return null;
    }

    return (
        <ModalDialog header="Hello" onClose={() => setOpen(false)}>
            <Text>Hello world!</Text>
            <Select label="Select" name="select" options={options} />
            <Button text="Click me" onClick={handleButton} />
        </ModalDialog>
    );
};

export const run = ForgeReconciler.render(
    <PortalUserMenuAction>
        <App/>
    </PortalUserMenuAction>
);