const fetch = require('node-fetch');
const { AutoRefreshOnExpireAuth0Client } = require('@guildeducationinc/ta-shared/lib/clients');
const { FALSE, TRUE } = require('pg-format/lib/reserved');

class GraphqlError extends Error {}

class GraphQlClient {
  constructor(authStrategy, host) {
    this.authStrategy = authStrategy;
    this.host = host;
  }

  async request(query) {
    const token = await this.authStrategy.requestToken();
    let response;
    try {
      response = await fetch(this.host, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ query }),
      });
    } catch (error) {
      throw new GraphqlError(`Error integrating with Graphql Api: ${error}.`);
    }
    const responseBody = await response.json();
    if (!response.ok || containsErrors(responseBody))
      throw new GraphqlError(
        `Error in response from Graphql. Status: ${response.status}, body: ${JSON.stringify(
          responseBody
        )}`
      );
    return responseBody.data;
  }
}

function containsErrors(responseBody) {
  if (responseBody.errors !== undefined) if (responseBody.errors.length > 0) return true;
  return false;
}

function GraphQlQueryReponse(query) {
  const host = process.env.APPSYNC_HOST;
  const clientId = process.env.FUNDING_ADMIN_CLIENT_ID;
  const clientSecret = process.env.FUNDING_ADMIN_CLIENT_SECRET;
  const audience = process.env.FUNDING_AUDIENCE;
  const domain = process.env.AUTH0_DOMAIN;
  const publicKey = process.env.AUTH0_GUILD_JWT_PEM;
  const auth0Client = new AutoRefreshOnExpireAuth0Client(
    { clientId, clientSecret, audience, domain, publicKey },
    fetch
  );
  const client = new GraphQlClient(auth0Client, host);
  let response;
  try {
    response = client.request(query);
  } catch (error) {
    console.log('Query request failed.');
    throw error;
  }
  return response;
}

async function compareGraphQlQueryResponse(query, expectedResponse) {
  const expectedResponseJson = JSON.parse(expectedResponse);
  response = await GraphQlQueryReponse(query);
  if (JSON.stringify(response) != JSON.stringify(expectedResponseJson)) {
    return FALSE;
  }
  return TRUE;
}

module.exports = { GraphQlClient, GraphQlQueryReponse, compareGraphQlQueryResponse };
