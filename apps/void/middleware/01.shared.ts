import { defineMiddleware } from "void";
import { getUser, type AuthUser } from "void/auth";

declare module "void" {
	interface CloudContextVariables {
		shared: { auth: { user: AuthUser | null } };
	}
}

/**
 * Applies the `.dark` class before first paint, using the same `theme` key the
 * ThemeSwitcher writes. Matches the shadcn `@custom-variant dark` convention.
 */
const THEME_SCRIPT = `!function(){try{var t=localStorage.getItem("theme")||"system";var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}}()`;

/**
 * Void runs Better Auth before app middleware, so the current user is already
 * resolved. Expose it to every page through `useShared()`.
 */
export default defineMiddleware(async (c, next) => {
	c.set("shared", { auth: { user: getUser() } });
	c.set("headDefaults", { script: [{ innerHTML: THEME_SCRIPT }] });
	await next();
});
