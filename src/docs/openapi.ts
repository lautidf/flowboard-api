import swaggerJSDoc from 'swagger-jsdoc';
import { API_URL } from '../config/env.js';

export const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'FlowBoard API',
			version: '1.1.0'
		},
		servers: [
			{ url: API_URL },
		],
		security: [
			{ bearerHttpAuthentication: [] }
		]
	},
	apis: [
    './src/docs/**/*.yaml',
  ],
});

console.log(JSON.stringify(swaggerSpec));