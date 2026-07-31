#!/usr/bin/env bash
# Render build script for NestNode Django backend

set -e  # Exit immediately on any error

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Collecting static files ==="
python manage.py collectstatic --noinput

echo "=== Build complete ==="
