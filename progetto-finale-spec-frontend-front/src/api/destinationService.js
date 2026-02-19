import axios from "axios";

//cambia la porta se il bkend gira su unaltra
const API_URL = "http://localhost:3001";

export const getDestinations = async (search = "", category = "") => {
  try {
    const response = await axios.get(`${API_URL}/destinations`, {
      params: { search, category }
    });
    return response.data;
  } catch (error) {
    console.error("Errore fetch destinazioni:", error);
    return [];
  }
};

export const getDestinationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/destinations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Errore fetch dettaglio destinazione:", error);
    return null;
  }
};