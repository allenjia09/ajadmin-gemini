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
  NStatistic,
  NAlert,
  NTag,
  useMessage,
  NDivider,
} from 'naive-ui'
import { SolarTime } from 'tyme4ts'

const message = useMessage()

const birthDate = ref<number | null>(Date.now())
const birthTime = ref<number | null>(Date.now())
const isCalculating = ref(false)
const showResult = ref(false)

// 结果数据结构
const baziResult = ref({
  solarDate: '',
  lunarDate: '',
  year: { gan: '', zhi: '', shx: '', wx: '', naYin: '' },
  month: { gan: '', zhi: '', wx: '', naYin: '' },
  day: { gan: '', zhi: '', wx: '', naYin: '' },
  hour: { gan: '', zhi: '', wx: '', naYin: '' },
  summary: '',
  scores: { jin: 0, mu: 0, shui: 0, huo: 0, tu: 0 },
})

const handleCalculate = () => {
  if (!birthDate.value) {
    message.error('请选择出生日期')
    return
  }

  isCalculating.value = true
  message.loading('正在通过 Tyme 高级历法库排盘...', { duration: 1000 })

  setTimeout(() => {
    try {
      const d = new Date(birthDate.value!)
      const t = birthTime.value ? new Date(birthTime.value) : new Date()

      // 使用 Tyme4ts 排盘
      const solarTime = SolarTime.fromYmdHms(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        t.getHours(),
        t.getMinutes(),
        0,
      )

      const lunarHour = solarTime.getLunarHour()
      const lunarDay = lunarHour.getLunarDay()
      const eightChar = lunarHour.getEightChar()

      const getPillarData = (sixtyCycle: any) => ({
        gan: sixtyCycle.getHeavenStem().getName(),
        zhi: sixtyCycle.getEarthBranch().getName(),
        wx:
          sixtyCycle.getHeavenStem().getElement().getName() +
          sixtyCycle.getEarthBranch().getElement().getName(),
        naYin: sixtyCycle.getSound().getName(),
      })

      // 数据填充
      baziResult.value.solarDate = solarTime.toString()
      baziResult.value.lunarDate = lunarDay.toString()

      // 获取生肖：从年干支的地支获取
      const yearSixtyCycle = eightChar.getYear()
      const shengXiao = yearSixtyCycle.getEarthBranch().getZodiac().getName()

      baziResult.value.year = {
        ...getPillarData(yearSixtyCycle),
        shx: shengXiao,
      }
      baziResult.value.month = getPillarData(eightChar.getMonth())
      baziResult.value.day = getPillarData(eightChar.getDay())
      baziResult.value.hour = getPillarData(eightChar.getHour())

      // 真实五行分数统计 (天干4 + 地支4 = 8项)
      const pillars = [
        eightChar.getYear(),
        eightChar.getMonth(),
        eightChar.getDay(),
        eightChar.getHour(),
      ]

      type WxKey = 'jin' | 'mu' | 'shui' | 'huo' | 'tu'
      const scores: Record<WxKey, number> = { jin: 0, mu: 0, shui: 0, huo: 0, tu: 0 }
      const keyMap: Record<string, WxKey> = {
        金: 'jin',
        木: 'mu',
        水: 'shui',
        火: 'huo',
        土: 'tu',
      }

      pillars.forEach((p) => {
        const gWx = p.getHeavenStem().getElement().getName()
        const zWx = p.getEarthBranch().getElement().getName()
        const gKey = keyMap[gWx]
        const zKey = keyMap[zWx]
        if (gKey) scores[gKey]++
        if (zKey) scores[zKey]++
      })

      const total = 8
      baziResult.value.scores = {
        jin: Math.round((scores.jin / total) * 100),
        mu: Math.round((scores.mu / total) * 100),
        shui: Math.round((scores.shui / total) * 100),
        huo: Math.round((scores.huo / total) * 100),
        tu: Math.round((scores.tu / total) * 100),
      }

      // 生成命理简评
      const sortedWx = Object.entries(scores).sort((a, b) => b[1] - a[1])
      if (sortedWx.length > 0) {
        const primaryWxKey = sortedWx[0]![0]
        const weakestWxKey = sortedWx[sortedWx.length - 1]![0]
        const labelMap: Record<string, string> = {
          jin: '金',
          mu: '木',
          shui: '水',
          huo: '火',
          tu: '土',
        }

        baziResult.value.summary = `此命局为${baziResult.value.year.naYin}命。日主${baziResult.value.day.gan}${eightChar.getDay().getHeavenStem().getElement().getName()}，生于${eightChar.getMonth().getEarthBranch().getName()}月。整体格局中${labelMap[primaryWxKey] || ''}气最旺，建议起名或日常调理多参考${labelMap[weakestWxKey] || ''}属性以求中和。`
      }

      isCalculating.value = false
      showResult.value = true
      message.success('Tyme 历法排盘成功')
    } catch (err) {
      console.error(err)
      message.error('排盘解析异常，请检查 Tyme 库集成')
      isCalculating.value = false
    }
  }, 1000)
}

const fortuneGrade = computed(() => {
  if (!showResult.value) return '-'
  const fireWood = baziResult.value.scores.huo + baziResult.value.scores.mu
  if (fireWood > 60) return '生机盎然'
  if (fireWood > 30) return '中规中矩'
  return '内敛潜藏'
})
</script>

<template>
  <div class="bazi-page">
    <n-grid :cols="24" :x-gap="24">
      <n-grid-item :span="8">
        <n-card title="八字测算" hoverable>
          <n-form label-placement="left" label-width="80">
            <n-form-item label="出生日期">
              <n-date-picker v-model:value="birthDate" type="date" style="width: 100%" />
            </n-form-item>
            <n-form-item label="出生时间">
              <n-time-picker v-model:value="birthTime" format="HH:mm" style="width: 100%" />
            </n-form-item>
            <n-divider />
            <n-button
              type="primary"
              block
              size="large"
              :loading="isCalculating"
              @click="handleCalculate"
            >
              立即测算
            </n-button>
          </n-form>
        </n-card>
      </n-grid-item>

      <n-grid-item :span="16">
        <n-card
          :title="
            showResult
              ? '精确推演结果：' + baziResult.year.shx + '年 [' + baziResult.year.naYin + ']'
              : '待测算'
          "
          embedded
        >
          <div v-if="showResult" class="result-content">
            <n-space vertical style="margin-bottom: 20px">
              <n-tag :bordered="false" type="warning" size="large"
                >公历时刻：{{ baziResult.solarDate }}</n-tag
              >
              <n-tag :bordered="false" type="success" size="large"
                >农历日期：{{ baziResult.lunarDate }}</n-tag
              >
            </n-space>

            <n-grid :cols="4" :x-gap="12" class="bazi-box">
              <n-grid-item
                v-for="(val, key) in {
                  年柱: baziResult.year,
                  月柱: baziResult.month,
                  日柱: baziResult.day,
                  时柱: baziResult.hour,
                }"
                :key="key"
              >
                <div class="pillar-column shadow-sm">
                  <div class="pillar-header">{{ key }}</div>
                  <div class="gan-text">{{ val.gan }}</div>
                  <div class="zhi-text">{{ val.zhi }}</div>
                  <div class="pillar-footer">
                    <n-tag
                      size="small"
                      round
                      :bordered="false"
                      :type="key === '日柱' ? 'error' : 'default'"
                      >{{ val.wx }}</n-tag
                    >
                    <div class="nayin">{{ val.naYin }}</div>
                  </div>
                </div>
              </n-grid-item>
            </n-grid>

            <n-divider title-placement="left">命理深度解析</n-divider>
            <blockquote class="analysis-quote">{{ baziResult.summary }}</blockquote>

            <n-divider title-placement="left">能量占比分析</n-divider>
            <n-grid :cols="5" :x-gap="12">
              <n-grid-item
                v-for="(val, name) in {
                  金: baziResult.scores.jin,
                  木: baziResult.scores.mu,
                  水: baziResult.scores.shui,
                  火: baziResult.scores.huo,
                  土: baziResult.scores.tu,
                }"
                :key="name"
              >
                <n-statistic :label="name" :value="val">
                  <template #suffix>%</template>
                </n-statistic>
              </n-grid-item>
            </n-grid>

            <div class="fortune-status">
              <n-statistic label="运势气场评价" :value="fortuneGrade" />
            </div>
          </div>
          <div v-else class="empty-state">
            <p>请点击左侧按钮进行测算</p>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.bazi-page {
  padding: 0;
}

.result-content {
  padding: 10px 0;
}

.bazi-box {
  margin-bottom: 32px;
}

.pillar-column {
  background: #f8f9fb;
  border: 1px solid #e5e8ed;
  border-radius: 12px;
  padding: 20px 12px;
  text-align: center;
  transition: all 0.3s;
}

.pillar-column:hover {
  background: #fff;
  border-color: #18a058;
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.pillar-header {
  color: #888;
  font-size: 13px;
  margin-bottom: 15px;
  font-weight: 500;
}

.gan-text {
  font-size: 40px;
  font-weight: 900;
  color: #e03131;
  font-family: 'LXGW WenKai', sans-serif;
}

.zhi-text {
  font-size: 40px;
  font-weight: 900;
  color: #1971c2;
  font-family: 'LXGW WenKai', sans-serif;
  margin-top: -10px;
}

.pillar-footer {
  margin-top: 15px;
}

.nayin {
  font-size: 11px;
  color: #51cf66;
  margin-top: 6px;
}

.analysis-quote {
  margin: 0;
  padding: 20px;
  background: #fdfaf5;
  border-left: 6px solid #f08c00;
  font-size: 16px;
  line-height: 1.8;
  color: #5c5c5c;
  border-radius: 4px;
}

.fortune-status {
  margin-top: 40px;
  background: linear-gradient(135deg, #18a058 0%, #008148 100%);
  padding: 30px;
  border-radius: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(24, 160, 88, 0.3);
}

.fortune-status :deep(.n-statistic .n-statistic-label) {
  color: rgba(255, 255, 255, 0.9);
}

.fortune-status :deep(.n-statistic .n-statistic-value) {
  color: #fff;
  font-size: 36px;
  font-weight: 800;
}

.empty-state {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 18px;
  font-weight: 300;
}
</style>
