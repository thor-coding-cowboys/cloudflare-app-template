import { QueryClient } from "@tanstack/react-query";

// Singleton query client for use across the app
// This is created once and reused
export const queryClient = new QueryClient();
