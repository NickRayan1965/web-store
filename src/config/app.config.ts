import Joi from 'joi';
export interface IConfig {
    PORT: string,
    SECRET_KEY: string,
    DB_NAME: string,
    DB_HOST: string,
    DB_PORT: string,
    NODE_ENV: 'development' | 'production',
    POSTGRES_USER: string,
    POSTGRES_PASSWORD: string,
    DEV_DB_HOST: string,
    DEV_DB_PORT: string,
    DEV_DB_NAME: string,
    DEV_POSTGRES_USER: string
    DEV_POSTGRES_PASSWORD: string
}
const envVarsSchema = Joi.object<IConfig>({
    PORT: Joi.string().trim().regex(/^\d+$/).required(),
    DB_PORT: Joi.string().regex(/^\d+$/).required(),
    SECRET_KEY: Joi.string().trim().default('SecretKey'),
    DB_NAME: Joi.string().trim().required(),
    DB_HOST: Joi.string().trim().required(),
    NODE_ENV: Joi.string().valid('development', 'production').default('development'),
    POSTGRES_USER: Joi.string().trim().required(),
    POSTGRES_PASSWORD: Joi.string().trim().required(),
    DEV_DB_PORT: Joi.string().regex(/^\d+$/).required(),
    DEV_DB_HOST: Joi.string().trim().required(),
    DEV_DB_NAME: Joi.string().trim().required(),
    DEV_POSTGRES_USER: Joi.string().trim().required(),
    DEV_POSTGRES_PASSWORD: Joi.string().trim().required()
}).unknown();
const {error, value: EnvConfiguration} = envVarsSchema.validate(process.env);
console.log('config');
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
export default EnvConfiguration as IConfig;