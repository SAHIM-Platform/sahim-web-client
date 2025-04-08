function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
}

export default getApiBaseUrl;
