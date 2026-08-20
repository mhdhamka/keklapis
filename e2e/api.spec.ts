// ==========================================
// API E2E Tests
// ==========================================

import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('health endpoint should return OK', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
  });

  test('products endpoint should return data', async ({ request }) => {
    const response = await request.get('/api/products');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.items)).toBe(true);
  });

  test('sources endpoint should return data', async ({ request }) => {
    const response = await request.get('/api/sources');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('sources');
    expect(Array.isArray(body.sources)).toBe(true);
  });
});
