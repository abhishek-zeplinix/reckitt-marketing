import React from 'react';
import { Button } from 'primereact/button';

const SubmitResetButtons = ({ onSubmit, label, loading}: { onSubmit: () => void; label: string; loading?: boolean }) => {
    return (
        <div className="flex justify-content-end gap-3 mt-1 p-1">
            {/* <Button label="Reset" style={{ backgroundColor: '#ffff', color: '#DF1740', border: 'none' }} onClick={onReset} /> */}
            <Button label={label} style={{ backgroundColor: '#DF1740', border: 'none' }} className="hover:text-white" onClick={onSubmit} loading={loading}/>
        </div>
    );
};

export default SubmitResetButtons;
