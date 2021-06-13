const Router = require("express/lib/router")

const router = Router()

/**
 * Binds middleware to endpoints for an instance of the express application router.
 *
 * @function
 * @name createRoutes
 * @param {Object<string, function>} middleware A set of middleware functions which will be bound to routes
 * @param {function} middleware.healthCheck The health check (uptime) middleware
 * @param {function} middleware.unsupportedEndpointHandler The middleware handle to catch unsupported requests/endpoints
 * @returns {Object<string, any>} An instance of the [Express Router](https://expressjs.com/en/api.html#router)
 */
function createRoutes(middleware) {
  const { healthCheck, unsupportedEndpointHandler } = middleware

  return router
    .get("/healthcheck", healthCheck)
    .get("/", unsupportedEndpointHandler)
    .get("*", unsupportedEndpointHandler)
}

module.exports = createRoutes
