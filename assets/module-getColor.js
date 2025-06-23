function getColor(key) {
  const defaultColor = {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200'
  }
  return {
    // サービス
    'サスケ全般': {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200'
    },
    'サスケLead': {
      bg: 'bg-lime-50',
      text: 'text-lime-700',
      border: 'border-lime-200'
    },
    'サスケSales': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    'テレアポ職人': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    'Works': {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200'
    },
    'Webフォーム': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200'
    },
    'Web行動解析': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200'
    },
    'Cloud CTI': {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200'
    },
    'Cloud Scan': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    'API': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200'
    },
    // ロール
    '管理者': {
      bg: 'bg-pink-50',
      text: 'text-pink-700',
      border: 'border-pink-200'
    },
    'ユーザ': {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200'
    }
  }[key] || defaultColor;
}

function getCategoryIcon(key) {
  return {
    'サスケ全般': 'top-[2px] right-0 rotate-0 text-6xl fa-saaske',
    'サスケLead': 'top-[2px] right-0 rotate-0 text-6xl fa-saaske',
    'サスケSales': 'top-[2px] right-0 rotate-0 text-6xl fa-saaske',
    'テレアポ職人': 'top-[2px] right-0 rotate-0 text-6xl fa-saaske',
    'Works': '',
    'Webフォーム': 'top-0 -right-3 -rotate-10 text-7xl fa-table-columns',
    'Web行動解析': 'top-1 -right-3 rotate-253 text-6xl fa-shoe-prints',
    'Cloud CTI': 'top-0 -right-3 -rotate-10 text-7xl fa-phone-volume',
    'Cloud Scan': 'top-0 -right-3 -rotate-10 text-7xl fa-address-card',
    'API': 'top-0 right-0 -rotate-10 text-[4rem] fa-plug',
  }[key] || '';
}