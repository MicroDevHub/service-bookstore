import { SchemaRegistryAPIClientArgs } from '@kafkajs/confluent-schema-registry/dist/api/index'

interface Config {
  port: number,
  kafkaClientId: string,
  kafkaBrokers: string[],
  kafkaSchemaRegistry: SchemaRegistryAPIClientArgs,
}

const config: Config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3080,
  kafkaClientId: process.env.KAFKA_CLIENT_ID ?? 'bookstore_services',
  kafkaBrokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:19092'],
  kafkaSchemaRegistry: process.env.KAFKA_SCHEMA_REGISTRY ? { host: process.env.KAFKA_SCHEMA_REGISTRY } : { host: 'http://localhost:8081' }
}

export default config;