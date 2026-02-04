import { 
    useContext,
    createContext 
} from 'react';

import type { ConfirmFn } from '@typedef/ConfirmOptions';

export const ConfirmContext = createContext<ConfirmFn | null>(null);

export const useConfirm = () => {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used within ConfirmProvider');
  return confirm;
};
