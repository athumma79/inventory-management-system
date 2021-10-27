export class Car {
    vin: string | null;
    brand: string | null;
    model: string | null;
    color: string | null;
    year: number | null;
    mileage: number | null;
    price: number | null;
    quantity: number | null;
    image: string | null;
    toDisplaySearch: boolean;
    toDisplayPage: boolean;

    constructor() {
        this.vin = null;
        this.brand = null;
        this.model = null;
        this.color = null;
        this.year = null;
        this.mileage = null;
        this.price = null;
        this.quantity = null;
        this.image = null;
        this.toDisplaySearch = true;
        this.toDisplayPage = true;
    }

    contains(searchValue: string) {
        return this.vin?.toLowerCase().includes(searchValue.toLowerCase()) ||
        this.brand?.toLowerCase().includes(searchValue.toLowerCase()) ||
        this.model?.toLowerCase().includes(searchValue.toLowerCase()) ||
        this.color?.toLowerCase().includes(searchValue.toLowerCase()) ||
        this.year == Number(searchValue) ||
        this.mileage == Number(searchValue.replace(/[,]/g, '')) ||
        this.price == Number(searchValue.replace(/[$,]/g, '')) ||
        this.quantity == Number(searchValue.replace(/[,]/g, ''));
    }
}