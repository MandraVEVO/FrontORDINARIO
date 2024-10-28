import axios from "axios";

const url = "MiapiXDXDXD"

export const getAll = async () => 
{
    const response = await axios.get(url);
    console.log(response.data.results)
    return response.data.results
}