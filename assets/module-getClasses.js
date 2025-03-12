export function serviceClasses(key, options = []) {
  const object = {
    'サスケ全般': {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-700',
      hover: 'hover:bg-gray-50',
    },
    'サスケLead': {
      bg: 'bg-lime-50',
      border: 'border-lime-300',
      text: 'text-lime-700',
      hover: 'hover:bg-lime-50',
    },
    'サスケSales': {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      hover: 'hover:bg-blue-50',
    },
    'テレアポ職人': {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      hover: 'hover:bg-emerald-50',
    },
    'Works': {
      bg: 'bg-black-50',
      border: 'border-black-300',
      text: 'text-black-700',
      hover: 'hover:bg-black-50',
    },
    'Webフォーム': {
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      text: 'text-purple-700',
      hover: 'hover:bg-purple-50',
    },
    'Web行動解析': {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
      hover: 'hover:bg-amber-50',
    },
    'Cloud CTI': {
      bg: 'bg-cyan-50',
      border: 'border-cyan-300',
      text: 'text-cyan-700',
      hover: 'hover:bg-cyan-50',
    },
    'Cloud Scan': {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      hover: 'hover:bg-red-50',
    },
    'API': {
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
      text: 'text-indigo-700',
      hover: 'hover:bg-indigo-50',
    },
  }
  const result = options.map(option => object[key][option])
  return result.join(' ')
}
export function roleClasses(key, options = []) {
  const object = {
    '管理者': {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      hover: 'hover:bg-pink-100',
    },
    'ユーザー': {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-700',
      hover: 'hover:bg-gray-200',
    },
  }
  const result = options.map(option => object[key][option])
  return result.join(' ')
}