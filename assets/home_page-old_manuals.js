import { serviceClasses, roleClasses } from "getClasses";

document.addEventListener("DOMContentLoaded", function () {
  const manuals = [
    {
      fileName: "00M01",
      title: "管理者マニュアル 設定編",
      description: "サスケ共通の管理者向け設定マニュアルです。\nアカウントの作成方法や権限の設定方法等を解説しています。",
      service: "サスケ全般",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "07M01",
      title: "管理者マニュアル 設定編",
      description: "サスケLeadの管理者向け設定マニュアルです。\nサスケLeadの運用に向けての初期設定や運用フローに合わせた設定方法を解説しています。",
      service: "サスケLead",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "07M02",
      title: "管理者マニュアル 操作編",
      description: "サスケLeadの管理者向け操作マニュアルです。\n実際にサスケLeadを運用していく上で必要な操作方法を解説しています。",
      service: "サスケLead",
      role: "管理者",
      type: "操作",
    },
    {
      fileName: "07M03",
      title: "ユーザーマニュアル",
      description: "ユーザー権限の利用者がサスケLeadを利用する上で必要な操作方法を解説しています。",
      service: "サスケLead",
      role: "ユーザー",
      type: "操作",
    },
    {
      fileName: "05M01",
      title: "管理者マニュアル 設定編",
      description: "サスケSalesの管理者向け設定マニュアルです。\nサスケSalesの運用に向けての初期設定や運用フローに合わせた設定方法を解説しています。",
      service: "サスケSales",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "04M01",
      title: "管理者マニュアル 設定編",
      description: "テレアポ職人の管理者向け設定マニュアルです。\nテレアポ職人の運用に向けての初期設定や運用フローに合わせた設定方法を解説しています。",
      service: "テレアポ職人",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "04M02",
      title: "管理者マニュアル 操作編",
      description: "テレアポ職人の管理者向け操作マニュアルです。\n実際にテレアポ職人を運用していく上で必要な操作方法を解説しています。",
      service: "テレアポ職人",
      role: "管理者",
      type: "操作",
    },
    {
      fileName: "04M10",
      title: "対応履歴インポートマニュアル",
      description: "テレアポ職人の管理者向け操作マニュアルです。\n本機能はインターパークにお問い合わせいただくことで利用出来ます。",
      service: "テレアポ職人",
      role: "管理者",
      type: "インポート",
    },
    {
      fileName: "04M03",
      title: "ユーザーマニュアル",
      description: "ユーザー権限の利用者がテレアポ職人を利用する上で必要な操作方法を解説しています。",
      service: "テレアポ職人",
      role: "ユーザー",
      type: "操作",
    },
    {
      fileName: "08M01",
      title: "管理者マニュアル 設定編",
      description: "Webフォームの管理者向け設定マニュアルです。\nWebフォームの運用に向けての初期設定や各サービスとの連携方法を解説しています。",
      service: "Webフォーム",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "09M01",
      title: "管理者マニュアル 設定編",
      description: "Web行動解析の管理者向け設定マニュアルです。\nWeb行動解析の運用に向けての初期設定や運用フローに合わせた設定方法を解説しています。",
      service: "Web行動解析",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "09M02",
      title: "ユーザーマニュアル",
      description: "ユーザー権限の利用者がWeb行動解析を利用する上で必要な操作方法を解説しています。",
      service: "Web行動解析",
      role: "ユーザー",
      type: "操作",
    },
    {
      fileName: "10M01",
      title: "管理者マニュアル 設定編",
      description: "Cloud CTIの管理者向け設定マニュアルです。\nCloud CTIの運用に向けての初期設定や運用フローに合わせた設定方法を解説しています。",
      service: "Cloud CTI",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "10M02",
      title: "ユーザーマニュアル",
      description: "ユーザー権限の利用者がCloud CTIを利用する上で必要な操作方法を解説しています。",
      service: "Cloud CTI",
      role: "ユーザー",
      type: "操作",
    },
    {
      fileName: "11M01",
      title: "管理者マニュアル 設定編",
      description: "Cloud Scanの管理者向け設定マニュアルです。\nCloud Scanの運用に向けての初期設定や運用フローに合わせた設定方法を解説しています。",
      service: "Cloud Scan",
      role: "管理者",
      type: "設定",
    },
    {
      fileName: "11M05",
      title: "ユーザーマニュアル iOS版",
      description: "ユーザー権限の利用者がCloud Scanを利用する上で必要な操作方法を解説しています。",
      service: "Cloud Scan",
      role: "ユーザー",
      type: "スマホ アプリ",
    },
    {
      fileName: "11M03",
      title: "ユーザーマニュアル タブレット版",
      description: "ユーザー権限の利用者がCloud Scanを利用する上で必要な操作方法を解説しています。",
      service: "Cloud Scan",
      role: "ユーザー",
      type: "タブレット アプリ",
    },
    {
      fileName: "11M02",
      title: "タブレットマニュアル",
      description: "Cloud Scanアプリで使用するタブレット端末の操作・設定方法を解説しています。",
      service: "Cloud Scan",
      role: "ユーザー",
      type: "タブレット操作",
    },
  ]
  const htmlAry = manuals.map(manual => {
    const { fileName, title, description, service, role, type } = manual
    const url = `https://www.saaske.com/document/${fileName}.pdf`
    const serviceColor = serviceClasses(service, ['bg', 'text']) || "";
    const roleColor = roleClasses(role, ['bg', 'text']) || "";
    return `
      <a href="${url}" role="_blank" class="grid grid-cols-1 gap-2 lg:flex p-4 hover:bg-gray-50 no-underline">
        <div class="flex flex-col sm:flex-row lg:items-center gap-2 sm:gap-4">
          <div class="w-60 lg:w-30 grid grid-cols-2 lg:grid-cols-1 gap-2">
            <p class="flex items-center justify-center text-xs px-2.5 py-0.5 rounded-sm ${serviceColor}">${service}</p>
            <p class="flex items-center justify-center text-xs px-2.5 py-0.5 rounded-sm ${roleColor}">${role}</p>
          </div>
          <p class="font-bold text-xl text-gray-700 w-90">${title}</p>
        </div>
        <div class="flex items-center text-gray-500 lg:flex-1 sm:whitespace-pre-line">${description}</div>
      </a>
    `
  })
  document.getElementById("old_manuals").innerHTML = htmlAry.join('')
})