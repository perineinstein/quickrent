// hooks/useSnackbar.js
import { useState } from 'react';

export const useSnackbar = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const show = (msg) => {
    setMessage(msg);
    setVisible(true);
  };

  const hide = () => setVisible(false);

  return { visible, message, show, hide };
};
