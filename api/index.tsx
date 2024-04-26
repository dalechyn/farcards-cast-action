import { Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/hubs'
import { neynar as neynarMiddleware } from 'frog/middlewares'
import { handle } from 'frog/vercel'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
}).use(
    neynarMiddleware({
      apiKey: 'NEYNAR_FROG_FM',
      features: ['interactor', 'cast'],
    }),
  )

app.castAction('/', (c) => {
  c.var
  return c.frame({action:`https://far.cards/${c.var.interactor?.fid}`})
}, {
  name: 'Buy farcard',
  icon: 'image',
  description: 'Buy far.cards card of a user that casted this cast.'
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
