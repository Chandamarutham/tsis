// Interface for India Post Office data
export interface IndiaPostOffice {
    circlename: string;
    regionname: string;
    divisionname: string;
    officename: string;
    pincode: number;
    officetype: string;
    delivery: string;
    district: string;
    statename: string;
    latitude?: string;
    longitude?: string;
};

// This is the as received format from India Post API
export interface IndiaPostResponse {
    message: string;
    status: string;
    total: number;
    count: number;
    records: IndiaPostOffice[];
}