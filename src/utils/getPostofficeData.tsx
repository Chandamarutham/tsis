{/* ------------------------------------------------------------------------ 
  Created By: Balaji Srinivasa
  Created On: 21 Jan 2026
  Description: API call to Post Office to get address details based on PIN code
  Changes:
    - 21 Jan 2026: Initial creation
  ------------------------------------------------------------------------ */}
import type { IndiaPostResponse } from '@typedef/PostOfficeData';
import { getenv } from '@utils/getenv';


export async function GetPostOfficeData(postalCode: string): Promise<IndiaPostResponse | null> {
    if(!postalCode || postalCode.length !== 6) {
            return null;
        }
    const baseUrl = getenv("VITE_PINCODE_BASEURL");
    const resourceId = getenv("VITE_PINCODE_RES_ID");
    const apiKey = getenv("VITE_PINCODE_APIKEY");
    const url: string = `${baseUrl}${resourceId}?api-key=${apiKey}` 
            + `&filters%5Bpincode%5D=${postalCode}&format=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: IndiaPostResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching post office data:', error);
        return null;
    }
}
