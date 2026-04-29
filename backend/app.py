"""
app.py — 产后修复后端服务

Flask 应用，提供：
  - GET /                → 前端 index.html
  - GET /api/exercises   → 运动配置 JSON
  - GET /<path>          → 前端静态资源

启动方式：
  cd backend && pip install flask && python app.py
"""

import json
import os
from flask import Flask, jsonify, send_from_directory

# 目录配置
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BACKEND_DIR, '..', 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')


def load_exercises():
    """加载运动配置数据"""
    path = os.path.join(BACKEND_DIR, 'exercises.json')
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


@app.route('/')
def index():
    """返回前端入口页"""
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/api/exercises')
def api_exercises():
    """返回完整运动配置 JSON"""
    return jsonify(load_exercises())


@app.route('/<path:filename>')
def static_files(filename):
    """返回前端静态资源（CSS / JS）"""
    return send_from_directory(FRONTEND_DIR, filename)


if __name__ == '__main__':
    print('产后修复后端启动中...')
    print('浏览器打开: http://localhost:5000')
    print('API 接口:   http://localhost:5000/api/exercises')
    app.run(debug=True, port=5000)
