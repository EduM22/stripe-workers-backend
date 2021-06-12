import dotenv from 'dotenv'
dotenv.config()
import nodeFetch from 'node-fetch'

// @ts-expect-error error
global.fetch = nodeFetch

// @ts-expect-error error
global.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY_TEST
// @ts-expect-error error
global.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY_TEST
// @ts-expect-error error
global.DOMAIN = process.env.DOMAIN_TEST
