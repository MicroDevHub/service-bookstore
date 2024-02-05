interface Config {
  port: number,
}

const config: Config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3080,
}

export default config;