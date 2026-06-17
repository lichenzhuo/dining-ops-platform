function isEmptySeriesData(data) {
  if (data == null) {
    return true
  }
  if (Array.isArray(data)) {
    return data.length === 0
  }
  return false
}

/**
 * 判断 ECharts option 是否无有效序列数据，供 BaseChart 空状态使用。
 */
export function isEmptyChartOption(option) {
  if (!option || typeof option !== 'object') {
    return true
  }

  const seriesList = Array.isArray(option.series)
    ? option.series
    : option.series
      ? [option.series]
      : []

  if (seriesList.length === 0) {
    return true
  }

  return seriesList.every((series) => isEmptySeriesData(series?.data))
}
