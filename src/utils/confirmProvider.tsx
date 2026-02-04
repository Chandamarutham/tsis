import type { ReactNode } from 'react';
import { 
    useState, 
    useRef, 
    useCallback 
} from 'react';

import type { 
    ConfirmOptions, 
    ConfirmFn 
} from '@typedef/ConfirmOptions';

import { ConfirmContext } from '@utils/useConfirm';

import ConfirmModal from '@components/ConfirmModal';

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState({ isOpen: false, options: {} as ConfirmOptions });
  const resolveRef = useRef<(value: boolean) => void>(() => {});

  const confirm: ConfirmFn = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ isOpen: true, options });
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setState({ isOpen: false, options: {} });
    resolveRef.current(true);
  };

  const handleReject = () => {
    setState({ isOpen: false, options: {} });
    resolveRef.current(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.isOpen && (
        <ConfirmModal
          {...state.options}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      )}
    </ConfirmContext.Provider>
  );
};

