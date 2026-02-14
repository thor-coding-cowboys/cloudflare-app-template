import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const SESSION_QUERY_KEY = ["auth", "session"] as const;

export function useSession() {
	return useQuery({
		queryKey: SESSION_QUERY_KEY,
		queryFn: async () => {
			const { data } = await authClient.getSession();
			return data;
		},
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		refetchOnWindowFocus: true,
		retry: false,
	});
}

export function useSessionInvalidate() {
	const queryClient = useQueryClient();
	return () => {
		return queryClient.refetchQueries({ queryKey: SESSION_QUERY_KEY });
	};
}

export async function fetchSessionForRoute(queryClient: QueryClient) {
	return queryClient.fetchQuery({
		queryKey: SESSION_QUERY_KEY,
		queryFn: async () => {
			const { data } = await authClient.getSession();
			return data;
		},
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
}
