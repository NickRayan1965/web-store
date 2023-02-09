import Joi from 'joi';
export enum Environment {
    development = 'development',
    production = 'production',
    test = 'test',
}    
export interface DB_Config {
    host: string,
    username: string,
    password: string,
    port: string,
    database: string,
}
export interface IConfig {
    PORT: string,
    SECRET_KEY: string,
    NODE_ENV: Environment,
    [Environment.production]: DB_Config,
    [Environment.development]: DB_Config
    [Environment.test]: DB_Config,
}
const DB_ConfigSchema = Joi.object<DB_Config>({
    database: Joi.string().trim().required(),
    host: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    port: Joi.string().regex(/^\d+$/).required(),
    username: Joi.string().trim().required(),
})
const envVarsSchema = Joi.object<IConfig>({
    PORT: Joi.string().trim().regex(/^\d+$/).required(),
    SECRET_KEY: Joi.string().trim().default('SecretKey'),
    NODE_ENV: Joi.string().valid(Environment.development, Environment.production, Environment.test).default(Environment.development),
    [Environment.development]: DB_ConfigSchema,
    [Environment.production]: DB_ConfigSchema,
    [Environment.test]: DB_ConfigSchema,

}).unknown();
const env: IConfig = {
    ...process.env as any,
    [Environment.development]: {
        database: process.env.DEV_DB_NAME!,
        host: process.env.DEV_DB_HOST!,
        port: process.env.DEV_DB_PORT!,
        username: process.env.DEV_POSTGRES_USER!,
        password: process.env.DEV_POSTGRES_PASSWORD!,
    },
    [Environment.production]: {
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST!,
        port: process.env.DB_PORT!,
        username: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
    },
    [Environment.test]: {
        database: process.env.TEST_DB_NAME!,
        host: process.env.TEST_DB_HOST!,
        port: process.env.TEST_DB_PORT!,
        username: process.env.TEST_POSTGRES_USER!,
        password: process.env.TEST_POSTGRES_PASSWORD!,
    },
}
const {error, value: EnvConfiguration} = envVarsSchema.validate(env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
export default EnvConfiguration as IConfig;