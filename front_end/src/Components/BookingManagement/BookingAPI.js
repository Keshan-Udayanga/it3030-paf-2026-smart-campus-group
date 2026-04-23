import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/bookings";

export const createBooking = async (bookingData) => {
  const response = await axios.post(API_BASE_URL, bookingData);
  return response.data;
};

export const getMyBookings = async (email) => {
  const response = await axios.get(`${API_BASE_URL}/my`, {
    params: { email }
  });
  return response.data;
};

export const getAllBookings = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const reviewBooking = async (id, reviewData) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/review`, reviewData);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/${id}/cancel`);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};