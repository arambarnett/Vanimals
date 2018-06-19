# Vanimals
The repo for the Vanimals project

## Development

### Enviornment

First you'll want to copy the `sample.env` into `.env` and then add your enviornment variables

Make sure to set `REDIS_URL` to the address of a redis server and `DATABASE_URL` to the address of a postgres server.

You will also need to run a ethereum testnet. Use the following command
```bash
npm run truffle develop
```

### Running

Before starting the server you need to deploy the smart contracts to the blockchain and migrate any changes or updates
to the database. Use the following command
```bash
npm run migrate
```

Now you can start the application with the following command
```bash
npm start
```

You can now visit `http://localhost:4001`

### Web Client

We are using [next.js](https://nextjs.org/docs) as the frontend framework. The `/pages` folder is the root of the next.js application. 
