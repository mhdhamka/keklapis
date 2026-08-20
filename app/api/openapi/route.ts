// OpenAPI specification for CariAir API
import { NextResponse } from 'next/server';

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CariAir API',
    description: 'Malaysia Mineral & Drinking Water Source Registry API',
    version: '1.0.0',
    contact: {
      name: 'CariAir Support',
      url: 'https://github.com/cariair/cariair',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Current server',
    },
  ],
  tags: [
    { name: 'Products', description: 'Water product management' },
    { name: 'Brands', description: 'Brand management' },
    { name: 'Sources', description: 'Water source locations' },
    { name: 'Export', description: 'Data export functionality' },
    { name: 'System', description: 'Health and system endpoints' },
  ],
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List all products',
        description: 'Retrieve a paginated list of water products with optional filtering',
        parameters: [
          {
            name: 'q',
            in: 'query',
            description: 'Search query for product name, brand, or barcode',
            schema: { type: 'string' },
          },
          {
            name: 'brand',
            in: 'query',
            description: 'Filter by brand slug',
            schema: { type: 'string', example: 'spritzer' },
          },
          {
            name: 'type',
            in: 'query',
            description: 'Filter by water source type',
            schema: { type: 'string', enum: ['Underground', 'Spring', 'Municipal', 'Oxygenated'] },
          },
          {
            name: 'min_ph',
            in: 'query',
            description: 'Minimum pH level (0-14)',
            schema: { type: 'number', minimum: 0, maximum: 14 },
          },
          {
            name: 'max_ph',
            in: 'query',
            description: 'Maximum pH level (0-14)',
            schema: { type: 'number', minimum: 0, maximum: 14 },
          },
          {
            name: 'min_tds',
            in: 'query',
            description: 'Minimum TDS in mg/L',
            schema: { type: 'number', minimum: 0 },
          },
          {
            name: 'max_tds',
            in: 'query',
            description: 'Maximum TDS in mg/L',
            schema: { type: 'number', minimum: 0 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page (default: 50)',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of items to skip (default: 0)',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
        ],
        responses: {
          '200': {
            description: 'List of products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: { '$ref': '#/components/schemas/Product' },
                    },
                    total: { type: 'integer', description: 'Total number of products matching query' },
                    page: { type: 'integer', description: 'Current page number' },
                    perPage: { type: 'integer', description: 'Items per page' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        description: 'Retrieve detailed information about a specific water product',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product brand/type slug',
            schema: { type: 'string', example: 'spritzer-mineral-water' },
          },
        ],
        responses: {
          '200': {
            description: 'Product details',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/Product' },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/brands': {
      get: {
        tags: ['Brands'],
        summary: 'List all brands',
        description: 'Retrieve all water brands in the registry',
        responses: {
          '200': {
            description: 'List of brands',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    brands: {
                      type: 'array',
                      items: { '$ref': '#/components/schemas/Brand' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/sources': {
      get: {
        tags: ['Sources'],
        summary: 'List all water sources',
        description: 'Retrieve all water sources with location data',
        parameters: [
          {
            name: 'map',
            in: 'query',
            description: 'Include only sources with coordinates (for map display)',
            schema: { type: 'boolean' },
          },
        ],
        responses: {
          '200': {
            description: 'List of sources',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    sources: {
                      type: 'array',
                      items: { '$ref': '#/components/schemas/Source' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/sources/{id}': {
      get: {
        tags: ['Sources'],
        summary: 'Get source by ID',
        description: 'Retrieve detailed information about a specific water source',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Source slug',
            schema: { type: 'string', example: 'taiping-underground-water' },
          },
        ],
        responses: {
          '200': {
            description: 'Source details',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/Source' },
              },
            },
          },
          '404': {
            description: 'Source not found',
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/export/products': {
      get: {
        tags: ['Export'],
        summary: 'Export products as CSV',
        description: 'Download all products as a CSV file',
        responses: {
          '200': {
            description: 'CSV file containing product data',
            content: {
              'text/csv': {
                schema: { type: 'string' },
              },
            },
          },
        },
      },
    },
    '/export/products/json': {
      get: {
        tags: ['Export'],
        summary: 'Export products as JSON',
        description: 'Download all products as a JSON file',
        responses: {
          '200': {
            description: 'JSON file containing product data',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Check API and database health status',
        responses: {
          '200': {
            description: 'System is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    database: { type: 'string', example: 'connected' },
                    stats: {
                      type: 'object',
                      properties: {
                        brands: { type: 'integer', example: 14 },
                        sources: { type: 'integer', example: 13 },
                        products: { type: 'integer', example: 15 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'spritzer-mineral-water', description: 'Stable brand/type slug' },
          brandId: { type: 'string', example: 'spritzer', description: 'Brand slug' },
          manufacturerId: { type: 'string', example: 'chuan-sin', description: 'Manufacturer slug' },
          sourceId: { type: 'string', example: 'taiping-underground-water', description: 'Water source slug' },
          productName: { type: 'string', nullable: true, description: 'Product name' },
          barcode: { type: 'string', nullable: true, description: 'Product barcode' },
          phLevel: { type: 'number', nullable: true, description: 'pH level (0-14)' },
          tds: { type: 'number', nullable: true, description: 'Total Dissolved Solids in mg/L' },
          mineralsJson: { type: 'object', nullable: true, description: 'Mineral composition as JSON' },
          status: { type: 'string', enum: ['pending', 'approved', 'rejected'], description: 'Product status' },
          createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
          updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
          brand: { '$ref': '#/components/schemas/Brand' },
          source: { '$ref': '#/components/schemas/Source' },
          manufacturer: { '$ref': '#/components/schemas/Manufacturer' },
        },
      },
      Brand: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'spritzer', description: 'Brand slug' },
          brandName: { type: 'string', description: 'Brand name' },
          parentCompany: { type: 'string', nullable: true, description: 'Parent company name' },
          websiteUrl: { type: 'string', format: 'uri', nullable: true, description: 'Website URL' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Source: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'taiping-underground-water', description: 'Source slug' },
          sourceName: { type: 'string', nullable: true, description: 'Source name' },
          type: { type: 'string', enum: ['Underground', 'Spring', 'Municipal', 'Oxygenated'], nullable: true, description: 'Water source type' },
          locationAddress: { type: 'string', nullable: true, description: 'Physical address' },
          lat: { type: 'number', format: 'decimal', nullable: true, description: 'Latitude' },
          lng: { type: 'number', format: 'decimal', nullable: true, description: 'Longitude' },
          kkmApprovalNumber: { type: 'string', nullable: true, description: 'KKM approval number' },
          country: { type: 'string', description: 'Country' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Manufacturer: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'chuan-sin', description: 'Manufacturer slug' },
          name: { type: 'string', description: 'Manufacturer name' },
          address: { type: 'string', nullable: true, description: 'Physical address' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Error message' },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec);
}
