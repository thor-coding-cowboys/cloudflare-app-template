import { betterAuth } from "better-auth";
import { type DB, drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { hashPassword, verifyPassword } from "./password";

import { defaultStatements, adminAc } from "better-auth/plugins/organization/access";

const statement = {
	...defaultStatements,
	match: ["create", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const owner = ac.newRole({
	...adminAc.statements,
	match: ["create", "update", "delete"],
});

const editor = ac.newRole({
	...adminAc.statements,
	match: ["create", "update", "delete"],
});

const member = ac.newRole({
	match: ["create", "update", "delete"],
});

const viewer = ac.newRole({
	match: [],
});

export function createAuth({
	db,
	betterAuthSecret,
	origin,
}: {
	db: DB;
	betterAuthSecret: string;
	origin?: string;
}) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "sqlite",
		}),
		secret: betterAuthSecret,
		emailAndPassword: {
			enabled: true,
			password: {
				hash: async (password) => {
					return await hashPassword(password);
				},
				verify: async ({ password, hash }) => {
					return await verifyPassword(hash, password);
				},
			},
		},
		trustedOrigins: origin ? [origin] : ["http://localhost:5173"],
		plugins: [
			organization({
				ac,
				roles: {
					owner,
					editor,
					member,
					viewer,
				},
				async sendInvitationEmail(data, _request) {
					const { email, organization, invitation } = data;
					const invitationAcceptLink = `${origin}/accept-invitation/${invitation.id}`;
					console.log(
						`Invitation for organization ${organization.name} to ${email}: ${invitationAcceptLink}`
					);
				},
			}),
		],
		modelName: "cloudflare-worker-app",
	});
}
