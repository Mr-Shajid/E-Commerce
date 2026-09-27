/**
 * OpenAPI document for the e-commerce API.
 * Import this file wherever Swagger UI or an OpenAPI validator is configured.
 */
const openapi = {
	openapi: '3.0.3',
	info: {
		title: 'MERN E-Commerce API',
		version: '1.0.0',
		description: 'REST API for the MERN e-commerce application.',
	},
	servers: [
		{
			url: process.env.API_URL || 'http://localhost:5000/api',
			description: 'API server',
		},
	],
	tags: [
		{ name: 'Health', description: 'Service health' },
		{ name: 'Authentication', description: 'User authentication' },
	],
	paths: {
		'/health': {
			get: {
				tags: ['Health'],
				summary: 'Check API health',
				responses: {
					200: {
						description: 'API is available',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/HealthResponse' },
							},
						},
					},
				},
			},
		},
	},
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
		schemas: {
			HealthResponse: {
				type: 'object',
				required: ['status'],
				properties: {
					status: { type: 'string', example: 'ok' },
					timestamp: { type: 'string', format: 'date-time' },
				},
			},
			Error: {
				type: 'object',
				required: ['message'],
				properties: {
					message: { type: 'string', example: 'Request failed' },
					errors: {
						type: 'array',
						items: { type: 'string' },
					},
				},
			},
			User: {
				type: 'object',
				properties: {
					_id: { type: 'string', example: '65f1a2b3c4d5e6f789012345' },
					name: { type: 'string', example: 'Jane Doe' },
					email: { type: 'string', format: 'email', example: 'jane@example.com' },
					isAdmin: { type: 'boolean', example: false },
				},
			},
			Product: {
				type: 'object',
				properties: {
					_id: { type: 'string' },
					name: { type: 'string' },
					image: { type: 'string' },
					description: { type: 'string' },
					brand: { type: 'string' },
					category: { type: 'string' },
					price: { type: 'number', format: 'float', minimum: 0 },
					countInStock: { type: 'integer', minimum: 0 },
					rating: { type: 'number', minimum: 0, maximum: 5 },
					numReviews: { type: 'integer', minimum: 0 },
				},
			},
		},
	},
};

module.exports = openapi;
