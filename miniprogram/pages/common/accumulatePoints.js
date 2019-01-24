// 军转积分器
! function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.accumulatePoints = factory();
  }
}(typeof window !== 'undefined' ? window : this, function () {
  // 服役年限计分
  let year = year => (year <= 8 && year * 8) || (year > 8 && year <= 15 && 64 + (year - 8)*10) || (year > 15 && 64 + 70 + (year - 15) * 12) || 0
  return (function (obj) {
    let yearPoints = year(obj.year)/10
    return {
      yearPoints,
    }
  })
})