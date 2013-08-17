#!/usr/bin/env python
import os
from todos import app

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run('127.0.0.1', port=port)
