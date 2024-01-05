import { toast } from "react-toastify";

const errorHandling = (error: string) => {
	toast.error(error);
};

export default errorHandling;
