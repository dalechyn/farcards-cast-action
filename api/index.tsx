import { Button, Frog } from 'frog'
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


app.frame('/install', (c) => {
return c.res({image:(
        <div
          tw="flex"
          style={{
            alignItems: 'center',
            background: 'linear-gradient(to right, #432889, #17101F)',
            backgroundSize: '100% 100%',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
        Install "Buy farcard" action (mobile only).
          </div>
        </div>
      ),
    intents: [<Button.AddCastAction action='/'>Install</Button.AddCastAction>]
  })
})
app.castAction('/', (c) => {
  return c.frame({action:`https://far.cards/${c.var.cast?.author.fid}`})
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
