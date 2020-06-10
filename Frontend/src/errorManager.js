import React from 'react';
import { Modal } from 'antd';

const errorMessage = (msg) => {
    Modal.error({
        title: 'Error:',
        content: `${msg}`,
    });
}

const ErrorManager = (msg) => {
    return (<pre>{errorMessage(msg)}</pre>);
}

export default ErrorManager;