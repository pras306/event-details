const BASE_URL = process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

export const EVENTS_URL = `${BASE_URL}/api/events`;