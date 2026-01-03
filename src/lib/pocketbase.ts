import PocketBase from 'pocketbase'

// 默认指向本地 PocketBase 服务
// 如果生产环境不同，可以换成环境变量 import.meta.env.VITE_PB_URL
export const pb = new PocketBase('http://127.0.0.1:8090')
