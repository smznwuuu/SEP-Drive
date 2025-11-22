export interface CompletedRequest{
    requestId?: number
    customerId: number
    driverId: number
    customerName: string
    rating: number
    ratingFromCustomer : number
    ratingFromDriver : number
    vehicleClass : string
    startLatitude : number
    startLongitude : number
    destinationLatitude : number
    destinationLongitude : number
    time: string
    distance: number
    duration : number
    price: number
}
