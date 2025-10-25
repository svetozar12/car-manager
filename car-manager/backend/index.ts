import express from 'express';

export function run() {
  const app = express();
  const port = process.env.PORT || 3000;

  /**
   * learn more on the express docs:
   * https://expressjs.com/en/starter/hello-world.html
   */
  app.get('/', async (req, res) => {
    res.send('Hello');
  });

  const server = app.listen(port, () => {
    console.log(`🚀  Server ready at: http://localhost:${port}`);
  });

  return {
    port,
    // implement stop to support HMR.
    stop: async () => {
      server.closeAllConnections();
      server.close();
    },
  };
}
