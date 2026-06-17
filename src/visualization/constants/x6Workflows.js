const STATUS_STYLE = {
  done: { fill: '#e6fffb', stroke: '#13c2c2' },
  warn: { fill: '#fff7e6', stroke: '#faad14' },
  idle: { fill: '#ffffff', stroke: '#c9cdd4' },
  online: { fill: '#f6ffed', stroke: '#52c41a' },
}

export function createWorkflowNode(id, x, y, label, status = 'idle') {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.idle
  return {
    id,
    shape: 'rect',
    x,
    y,
    width: 128,
    height: 48,
    label,
    data: { status, label },
    attrs: {
      body: {
        fill: style.fill,
        stroke: style.stroke,
        strokeWidth: 2,
        rx: 8,
        ry: 8,
      },
      label: {
        fill: '#1d2129',
        fontSize: 13,
        fontWeight: 500,
      },
    },
    ports: {
      groups: {
        in: {
          position: 'left',
          attrs: {
            circle: { r: 4, magnet: true, stroke: '#13c2c2', fill: '#ffffff', strokeWidth: 2 },
          },
        },
        out: {
          position: 'right',
          attrs: {
            circle: { r: 4, magnet: true, stroke: '#13c2c2', fill: '#ffffff', strokeWidth: 2 },
          },
        },
      },
      items: [
        { id: 'in', group: 'in' },
        { id: 'out', group: 'out' },
      ],
    },
  }
}

export function createWorkflowEdge(source, target) {
  return {
    source: { cell: source, port: 'out' },
    target: { cell: target, port: 'in' },
    attrs: {
      line: {
        stroke: '#91d5ff',
        strokeWidth: 2,
        targetMarker: {
          name: 'block',
          width: 8,
          height: 8,
        },
      },
    },
  }
}

export const WORKFLOW_TEMPLATES = {
  approval: {
    key: 'approval',
    label: '营销活动审批流',
    description: '草稿 → 待审批 → 已通过 → 已下发 → 已完成',
    graph: {
      nodes: [
        createWorkflowNode('draft', 80, 180, '草稿', 'done'),
        createWorkflowNode('pending', 280, 180, '待审批', 'warn'),
        createWorkflowNode('approved', 480, 180, '已通过', 'idle'),
        createWorkflowNode('dispatched', 680, 180, '已下发', 'idle'),
        createWorkflowNode('done', 880, 180, '已完成', 'idle'),
      ],
      edges: [
        createWorkflowEdge('draft', 'pending'),
        createWorkflowEdge('pending', 'approved'),
        createWorkflowEdge('approved', 'dispatched'),
        createWorkflowEdge('dispatched', 'done'),
      ],
    },
  },
  marketing: {
    key: 'marketing',
    label: 'AI 营销任务流',
    description: 'AI 生成 → 审批 → 下发门店 → 执行反馈 → 效果追踪',
    graph: {
      nodes: [
        createWorkflowNode('ai', 80, 180, 'AI 生成', 'done'),
        createWorkflowNode('review', 280, 180, '内容审批', 'warn'),
        createWorkflowNode('dispatch', 480, 180, '下发门店', 'idle'),
        createWorkflowNode('execute', 680, 180, '执行反馈', 'idle'),
        createWorkflowNode('track', 880, 180, '效果追踪', 'idle'),
      ],
      edges: [
        createWorkflowEdge('ai', 'review'),
        createWorkflowEdge('review', 'dispatch'),
        createWorkflowEdge('dispatch', 'execute'),
        createWorkflowEdge('execute', 'track'),
      ],
    },
  },
  pipeline: {
    key: 'pipeline',
    label: '数据接入链路',
    description: 'POS / 外卖 / CRM → 指标中心 → 报表 / 大屏',
    graph: {
      nodes: [
        createWorkflowNode('pos', 80, 120, 'POS', 'online'),
        createWorkflowNode('waimai', 80, 220, '外卖', 'online'),
        createWorkflowNode('crm', 80, 320, 'CRM', 'online'),
        createWorkflowNode('hub', 420, 220, '指标中心', 'warn'),
        createWorkflowNode('report', 760, 160, '报表中心', 'idle'),
        createWorkflowNode('screen', 760, 280, '经营大屏', 'idle'),
      ],
      edges: [
        createWorkflowEdge('pos', 'hub'),
        createWorkflowEdge('waimai', 'hub'),
        createWorkflowEdge('crm', 'hub'),
        createWorkflowEdge('hub', 'report'),
        createWorkflowEdge('hub', 'screen'),
      ],
    },
  },
}

export const WORKFLOW_TEMPLATE_LIST = Object.values(WORKFLOW_TEMPLATES)
