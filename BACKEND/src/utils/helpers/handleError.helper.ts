
import { AppError } from "../../appError";
import { ERROR_MESSAGES } from "../../constants/messages";
import { STATUS_CODE } from "../../constants/statusCodes";


export const handleErrorResponse = (error: any) => {
    console.log("Error: ", error);
    if (error instanceof AppError) {
        throw error;
    }
    throw new AppError(
        ERROR_MESSAGES.SERVER_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR
    );
};