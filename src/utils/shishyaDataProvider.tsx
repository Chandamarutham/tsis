import { useState, useMemo } from 'react';
import type { ShishyaDataType } from '@typedef/ShishyaData';
import { 
    initialState,
    type ShishyaState, 
} from '@utils/useShishyaData';

import { ShishyaDataContext } from "@utils/useShishyaData";

export const ShishyaDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ShishyaState>(initialState);

    const updateData = (payload: Partial<ShishyaDataType>) => {
        setState((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                ...payload
            }
        }));
    };

    const contextValue = useMemo(() => ({
        data: state.data,
        updateData
    }), [state.data]);

    return (
        <ShishyaDataContext.Provider value={contextValue}>
            {children}
        </ShishyaDataContext.Provider>
    );
};