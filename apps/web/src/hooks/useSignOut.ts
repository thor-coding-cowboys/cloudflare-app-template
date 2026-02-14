import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { SESSION_QUERY_KEY } from "./useSession";

export function useSignOut() {
	const queryClient = useQueryClient();

	return async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					queryClient.setQueryData(SESSION_QUERY_KEY, null);
					queryClient.invalidateQueries({ queryKey: ["todo"] });
				},
			},
		});
	};
}
