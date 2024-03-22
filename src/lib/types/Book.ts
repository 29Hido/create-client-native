import ApiResource from "./ApiResource";

export default interface Book extends ApiResource {
    name?: string;
    author?: string;
    rating?: number;
    deleted?: boolean;
}