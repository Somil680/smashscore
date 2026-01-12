export interface Fixture {
  playerA: string
  playerB: string
}
export function rearrangeObjects(arr: Fixture[]) {
  let left = 0
  let right = arr.length - 1
  let result = []

  while (left <= right) {
    if (left === right) {
      result.push(arr[left])
    } else {
      result.push(arr[left])
      result.push(arr[right])
    }
    left++
    right--
  }

  return result
}
