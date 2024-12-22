import { RecordType, PaginatedResponse } from "../types/CommonTypes";

const API_URL = "http://localhost:5000/api/records"; // Replace with your backend API URL

export const fetchRecords = async (
  type: string,
  page: number,
  size: number
): Promise<PaginatedResponse<RecordType>> => {
  const response = await fetch(`${API_URL}?entity=${type}&page=${page}&limit=${size}`);
  console.log('response: ', response);
  if (!response.ok) throw new Error("Failed to fetch records");
  return response.json();
};

export const createOrUpdateRecord = async (
  type: "ambulance" | "doctor",
  data: RecordType
): Promise<RecordType> => {
  const { id, ...payload } = data;
  const method = id === 0 ? "POST" : "PUT";
  const response = await fetch(`${API_URL}${id !== 0 ? "/" + id : ''}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, entity: type }),
  });
  if (!response.ok) throw new Error("Failed to save the record");
  return response.json();
};

export const deleteRecord = async (
  type: "ambulance" | "doctor",
  id: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete the record");
};