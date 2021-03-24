const components = [
  'layout',
  'row',
  'button',
  'form',
  'input',
  'divider',
  'page-header',
  'affix',
  'menu',
  'drawer',
  'card',
  'avatar',
  'typography',
  'popover',
  'carousel',
  'result',
  'auto-complete',
  'select',
  'date-picker',
  'input-number',
  'tag',
  'upload',
  'message',
  'comment',
  'notification',
  'alert',
  'back-top',
  'badge',
  'calendar',
  'checkbox',
  'col',
  'divider',
  'dropdown',
  'empty',
  'grid',
  'icon',
  'list',
  'modal',
  'pagination',
  'popconfirm',
  'radio',
  'skeleton',
  'space',
  'spin',
  'table',
  'tag',
  'time-picker',
  'tooltip'
]

const styles = components.map(component => import(`antd/es/${component}/style`))

export default { ...styles }
