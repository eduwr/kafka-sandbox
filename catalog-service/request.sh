#!/bin/bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Product name", "description": "desc", "price": 10, "stock": 10}'
