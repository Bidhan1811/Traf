import { useState } from "react";
import { useFormState } from "react-hook-form";
import { toast } from "sonner";


const useFetch = (cb) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fn = async(...args) => {
        setLoading(true);
        setError(null);

        try {
            console.log("Calling API with args:", args);
            const response = await cb(...args);
            setData(response);
            setError(null);
            return response;
        } catch (error) {
            setError(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    return {data, loading, error, fn, setData}
}

export default useFetch