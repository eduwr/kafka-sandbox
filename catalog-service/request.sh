#!/bin/bash
curl -X POST http://localhost:8000/product \
  -H "Content-Type: application/json" \
  -d '{"name": "Product name"}'
