import { BarChart, GaugeChart, LineChart, MapChart, PieChart, ScatterChart, EffectScatterChart, LinesChart } from 'echarts/charts'
import {
  GeoComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  MapChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GeoComponent,
  VisualMapComponent,
  CanvasRenderer,
])

export default echarts
