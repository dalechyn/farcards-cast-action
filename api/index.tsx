import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { neynar as neynarMiddleware } from "frog/middlewares";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
	assetsPath: "/",
	basePath: "/api",
	// Supply a Hub to enable frame verification.
	hub: neynar({ apiKey: process.env.NEYNAR_API_KEY! }),
}).use(
	neynarMiddleware({
		apiKey: process.env.NEYNAR_API_KEY!,
		features: ["interactor", "cast"],
	}),
);

app.frame("/install", (c) => {
	return c.res({
		image:
			"https://github.com/dalechyn/farcards-cast-action/blob/main/img.png?raw=true",
		imageAspectRatio: "1:1",
		imageOptions: {
			height: 1071,
			width: 1071,
		},
		intents: [<Button.AddCastAction action="/">Install</Button.AddCastAction>],
	});
});
app.castAction(
	"/",
	async (c) => {
		const holdersData = await fetch(
			`https://far.cards/api/holders/${c.var.cast?.author.fid}`,
		).then((r) => r.json());
		if (holdersData.error === "User did not mint a farcard")
			return c.error({
				message: `${c.var.cast?.author.username} did not mint a farcard.`,
			});
		return c.frame({ path: `https://far.cards/${c.var.cast?.author.fid}` });
	},
	{
		name: "Trade far.cards",
		icon: "image",
		description: "Trade Farcard of a user that casted this cast.",
	},
);

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
