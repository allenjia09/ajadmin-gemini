<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NDatePicker,
  NTimePicker,
  NButton,
  NGrid,
  NGridItem,
  NSpace,
  NInputNumber,
  NAlert,
  NSelect,
  useMessage,
} from 'naive-ui'

const message = useMessage()

// 城市预设
const cityOptions = [
  { label: '北京', value: '116.4,39.9' },
  { label: '上海', value: '121.5,31.2' },
  { label: '广州', value: '113.3,23.1' },
  { label: '深圳', value: '114.1,22.5' },
  { label: '成都', value: '104.1,30.7' },
  { label: '杭州', value: '120.2,30.3' },
  { label: '武汉', value: '114.3,30.6' },
  { label: '西安', value: '108.9,34.3' },
  { label: '南京', value: '118.8,32.1' },
]

const selectedCity = ref<string | null>(null)
const birthDate = ref<number | null>(Date.now())
const birthTime = ref<number | null>(Date.now())
const longitude = ref(116.4)
const latitude = ref(39.9)
const refreshKey = ref(0)
const isComputing = ref(false)

const handleCityChange = (value: string) => {
  const [lng, lat] = value.split(',').map(Number)
  longitude.value = lng
  latitude.value = lat
}

const handleCompute = () => {
  isComputing.value = true
  message.loading('正在根据星等计算星盘位置...', { duration: 1500 })
  setTimeout(() => {
    refreshKey.value++ // 触发重新计算
    isComputing.value = false
    message.success('星盘测算完成')
  }, 1500)
}

// 星座数据
const zoidiacs = [
  { name: '白羊座', symbol: '♈', color: '#FF4D4F' },
  { name: '金牛座', symbol: '♉', color: '#52C41A' },
  { name: '双子座', symbol: '♊', color: '#FADB14' },
  { name: '巨蟹座', symbol: '♋', color: '#13C2C2' },
  { name: '狮子座', symbol: '♌', color: '#FA8C16' },
  { name: '处女座', symbol: '♍', color: '#A0D911' },
  { name: '天秤座', symbol: '♎', color: '#1890FF' },
  { name: '天蝎座', symbol: '♏', color: '#722ED1' },
  { name: '射手座', symbol: '♐', color: '#EB2F96' },
  { name: '摩羯座', symbol: '♑', color: '#595959' },
  { name: '水瓶座', symbol: '♒', color: '#2F54EB' },
  { name: '双鱼座', symbol: '♓', color: '#FAAD14' },
]

// 行星数据模拟
const planets = [
  { name: '太阳', symbol: '☉', color: '#FFD700' },
  { name: '月亮', symbol: '☽', color: '#C0C0C0' },
  { name: '水星', symbol: '☿', color: '#8E44AD' },
  { name: '金星', symbol: '♀', color: '#E91E63' },
  { name: '火星', symbol: '♂', color: '#E74C3C' },
  { name: '木星', symbol: '♃', color: '#E67E22' },
  { name: '土星', symbol: '♄', color: '#F1C40F' },
]

// 计算每个行星在星盘上的随机角度（模拟计算）
const planetPositions = computed(() => {
  // 基于输入种子生成确定性伪随机
  const k = refreshKey.value
  const seed =
    ((birthDate.value ?? 0) + (birthTime.value ?? 0) + longitude.value + latitude.value + k) % 360
  return planets.map((p, i) => ({
    ...p,
    angle: (seed * (i + 1) * 1.5) % 360,
  }))
})

// SVG 中心点和半径
const cx = 300
const cy = 300
const rOuter = 260
const rInner = 180
const rCenter = 150

// 获取坐标
const getPoint = (angle: number, radius: number) => {
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}
</script>

<template>
  <div class="astrolabe-container">
    <n-grid :cols="24" :x-gap="24">
      <!-- 输入表单 -->
      <n-grid-item :span="8">
        <n-card title="出生信息" embedded>
          <n-form label-placement="left" label-width="80">
            <n-form-item label="出生城市">
              <n-select
                v-model:value="selectedCity"
                :options="cityOptions"
                placeholder="请选择城市"
                @update:value="handleCityChange"
              />
            </n-form-item>
            <n-form-item label="出生日期">
              <n-date-picker v-model:value="birthDate" type="date" style="width: 100%" />
            </n-form-item>
            <n-form-item label="出生时间">
              <n-time-picker v-model:value="birthTime" format="HH:mm" style="width: 100%" />
            </n-form-item>
            <n-form-item label="经度">
              <n-input-number v-model:value="longitude" :step="0.1" style="width: 100%" />
            </n-form-item>
            <n-form-item label="纬度">
              <n-input-number v-model:value="latitude" :step="0.1" style="width: 100%" />
            </n-form-item>
            <n-button
              type="primary"
              block
              style="margin-top: 12px"
              :loading="isComputing"
              @click="handleCompute"
            >
              立即测算个人星盘
            </n-button>
          </n-form>

          <n-alert title="提示" type="info" style="margin-top: 24px">
            星盘是一个人出生时星体的投影图。请输入准确的信息以获取精准的图表。如果没有经纬度，请选择对应的出生城市。
          </n-alert>
        </n-card>
      </n-grid-item>

      <!-- 星盘展示 -->
      <n-grid-item :span="16">
        <n-card class="chart-card">
          <svg viewBox="0 0 600 600" class="astrolabe-svg">
            <!-- 外圆 -->
            <circle :cx="cx" :cy="cy" :r="rOuter" fill="none" stroke="#2c3e50" stroke-width="2" />
            <circle :cx="cx" :cy="cy" :r="rInner" fill="none" stroke="#2c3e50" stroke-width="1" />
            <circle
              :cx="cx"
              :cy="cy"
              :r="rCenter"
              fill="none"
              stroke="#bdc3c7"
              stroke-width="0.5"
              stroke-dasharray="4"
            />

            <!-- 十二宫位分割线 -->
            <line
              v-for="i in 12"
              :key="'line-' + i"
              :x1="getPoint((i - 1) * 30, rInner).x"
              :y1="getPoint((i - 1) * 30, rInner).y"
              :x2="cx"
              :y2="cy"
              stroke="#bdc3c7"
              stroke-width="1"
            />

            <!-- 星座图标和文字 -->
            <g v-for="(z, i) in zoidiacs" :key="'zodiac-' + i">
              <path
                :d="`M ${getPoint(i * 30, rOuter).x} ${getPoint(i * 30, rOuter).y} A ${rOuter} ${rOuter} 0 0 1 ${getPoint((i + 1) * 30, rOuter).x} ${getPoint((i + 1) * 30, rOuter).y} L ${getPoint((i + 1) * 30, rInner).x} ${getPoint((i + 1) * 30, rInner).y} A ${rInner} ${rInner} 0 0 0 ${getPoint(i * 30, rInner).x} ${getPoint(i * 30, rInner).y} Z`"
                :fill="i % 2 === 0 ? '#f8f9fa' : '#ffffff'"
                stroke="#bdc3c7"
                stroke-width="0.5"
              />
              <text
                :x="getPoint(i * 30 + 15, (rOuter + rInner) / 2).x"
                :y="getPoint(i * 30 + 15, (rOuter + rInner) / 2).y"
                text-anchor="middle"
                alignment-baseline="middle"
                font-size="12"
                :fill="z.color"
              >
                {{ z.symbol }}
              </text>
            </g>

            <!-- 行星位置 -->
            <g v-for="p in planetPositions" :key="'planet-' + p.name">
              <line
                :x1="cx"
                :y1="cy"
                :x2="getPoint(p.angle, rCenter).x"
                :y2="getPoint(p.angle, rCenter).y"
                stroke="#ecf0f1"
                stroke-width="1"
              />
              <circle
                :cx="getPoint(p.angle, rCenter).x"
                :cy="getPoint(p.angle, rCenter).y"
                r="12"
                fill="white"
                stroke="#34495e"
                stroke-width="1"
              />
              <text
                :x="getPoint(p.angle, rCenter).x"
                :y="getPoint(p.angle, rCenter).y"
                text-anchor="middle"
                alignment-baseline="middle"
                font-size="14"
                :fill="p.color"
              >
                {{ p.symbol }}
              </text>
              <text
                :x="getPoint(p.angle, rCenter + 25).x"
                :y="getPoint(p.angle, rCenter + 25).y"
                text-anchor="middle"
                alignment-baseline="middle"
                font-size="10"
                fill="#7f8c8d"
              >
                {{ p.name }}
              </text>
            </g>

            <!-- 中心点 -->
            <circle :cx="cx" :cy="cy" r="4" fill="#2c3e50" />
            <text
              :x="cx"
              :y="cy + 30"
              text-anchor="middle"
              font-size="16"
              font-weight="bold"
              fill="#2c3e50"
            >
              EARTH
            </text>
          </svg>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.astrolabe-container {
  padding: 0;
}

.chart-card {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #ffffff 0%, #f0f2f5 100%);
}

.astrolabe-svg {
  width: 100%;
  max-width: 600px;
  max-height: 600px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
}

text {
  user-select: none;
  cursor: default;
}
</style>
