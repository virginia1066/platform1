const swaggerJsdoc = require('swagger-jsdoc');
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const spec = swaggerJsdoc({
    apis: ['./src/**/*.ts'],
    definition: {
        swagger: '2.0',
        info: {
            title: 'Swagger Documentation',
            version: '1.0.0'
        }
    }
});

writeFile(join(__dirname, 'swagger-spec.json'), JSON.stringify(spec, null, 4));