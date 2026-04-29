/**
 * api.js — 数据加载适配器
 *
 * 职责：
 *   1. 从后端 API 拉取运动配置（exercises + encouragements）
 *   2. API 失败时降级到 FALLBACK_DATA（data.js 中定义）
 *
 * WeChat MP 迁移：
 *   将此文件中的 fetch() 替换为 wx.request() 即可，其余代码零改动。
 */

// eslint-disable-next-line no-unused-vars
const API = {
  _exercises: null,
  _encouragements: null,

  /**
   * 加载数据。优先从 API 获取，失败则使用降级数据。
   * @returns {Promise<{exercises: Array, encouragements: Array}>}
   */
  async load() {
    try {
      const data = await this._fetch('/api/exercises');
      this._exercises = data.exercises;
      this._encouragements = data.encouragements;
      console.log('[API] 数据加载成功，来源：后端 API');
    } catch (err) {
      console.warn('[API] 后端不可用，使用降级数据:', err.message);
      this._exercises = FALLBACK_DATA.exercises;
      this._encouragements = FALLBACK_DATA.encouragements;
    }
    return { exercises: this._exercises, encouragements: this._encouragements };
  },

  getExercises() {
    return this._exercises;
  },

  getEncouragements() {
    return this._encouragements;
  },

  /**
   * 网络请求封装。
   * WeChat MP 迁移点：替换为 wx.request。
   */
  _fetch(url) {
    /* ---- 当前实现：浏览器 fetch ---- */
    return fetch(url).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });

    /* ---- WeChat MP 替换版（取消注释即可） ----
    return new Promise((resolve, reject) => {
      wx.request({
        url: YOUR_API_BASE + url,
        success: res => {
          if (res.statusCode === 200) resolve(res.data);
          else reject(new Error('HTTP ' + res.statusCode));
        },
        fail: reject
      });
    });
    */
  }
};
