import { Vector } from './Vector'

describe("Vector class", () => {

  const wasMutated = (vector: Vector, input: number[]): boolean => {
    return vector.getSelf() !== input
  }

  test("Can be initialized empty", () => {
    const emptyVector = new Vector()
    expect(emptyVector.getSelf()).toEqual([])
    expect(emptyVector.numDimensions()).toBe(0)
  })

  test("Can be initialized with values", () => {
    const v1 = new Vector([1, 2, 3, 4])
    expect(v1.getSelf()).toEqual([1, 2, 3, 4])
    expect(v1.numDimensions()).toBe(4)
  })

  test("Can be compared to another vector", () => {
    const v1 = new Vector([1, 2, 3, 4])
    const v2 = new Vector([1, 2, 3, 4])
    expect(Vector.isEqual(v1, v2)).toBe(true)
    expect(v1.isEqual(v2)).toBe(true)
  })

  test("Set operation", () => {
    const v1 = new Vector([1, 2, 5, 4])
    const value = 3
    const index = 2
    const output = [1, 2, 3, 4]

    expect(v1.set(index, value).getSelf()).toEqual(output)
    expect(v1.getSelf()).toEqual(output)
  })

  test("Get operation", () => {
    const v1 = new Vector([1, 45, 2, 41, 28])
    const index = 3
    const output = 41

    expect(v1.get(index)).toBe(output)
  })

  test("Push operation", () => {
    const value = 5
    const output = [5]
    const v1 = new Vector()

    v1.push(value)
    expect(v1.getSelf()).toEqual(output)
  })

  test("Vector addition", () => {
    const nums1 = [2, 4, 3, 1]
    const nums2 = [3, 5, 1, 1]
    const output = [5, 9, 4, 2]

    const v1 = new Vector(nums1)
    const v2 = new Vector(nums2)
    // Check static function
    expect(Vector.add(v1, v2).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1) && wasMutated(v2, nums2)).toBe(false)
    // Check in-place method
    expect(v1.add(v2).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1) && !wasMutated(v2, nums2)).toBe(true)
  })

  test("Vector subtraction", () => {
    const nums1 = [6, 7, 3, 22, 8, 12]
    const nums2 = [3, 1, 2, 17, 10, 15]
    const output = [3, 6, 1, 5, -2, -3]

    const v1 = new Vector(nums1)
    const v2 = new Vector(nums2)
    // Check static function
    expect(Vector.sub(v1, v2).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1) && wasMutated(v2, nums2)).toBe(false)
    // Check in-place method
    expect(v1.sub(v2).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1) && !wasMutated(v2, nums2)).toBe(true)
  })

  test("Vector scaling", () => {
    const nums1 = [2, 5, 18, 2, 5, 11, 34]
    const output = [6, 15, 54, 6, 15, 33, 102]
    const scalar = 3

    const v1 = new Vector(nums1)
    // Check static function
    expect(Vector.scale(scalar, v1).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1)).toBe(false)
    // Check in-place method
    expect(v1.scale(scalar).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1)).toBe(true)
  })

  test("Axpy operation", () => {
    const nums1 = [3, 4, 7, 1, 2]
    const nums2 = [4, 2, 1, 7, 5]
    const scalar = 5
    const output = [19, 22, 36, 12, 15]

    const v1 = new Vector(nums1)
    const v2 = new Vector(nums2)
    // Check static function
    expect(Vector.axpy(scalar, v1, v2).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1) && wasMutated(v2, nums2)).toBe(false)
    // Check in-place method
    expect(v1.axpy(scalar, v2).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1) && !wasMutated(v2, nums2)).toBe(true)
  })

  test("Dot product operation", () => {
    const nums1 = [3, 1, 6, 7, 4, 2, 8]
    const nums2 = [2, 5, 1, 3, 8, 11, 4]
    const output = 124

    const v1 = new Vector(nums1)
    const v2 = new Vector(nums2)
    // Check static function
    expect(Vector.dot(v1, v2)).toBe(output)
    expect(wasMutated(v1, nums1)).toBe(false)
  })

  test("Vector length function", () => {
    const nums1 = [6, 4]
    const output = Math.sqrt(52)

    const v1 = new Vector(nums1)
    // Check static function
    expect(Vector.vlength(v1)).toBe(output)
    expect(wasMutated(v1, nums1)).toBe(false)
    // Check in-place method
    expect(v1.length()).toBe(output)
    expect(wasMutated(v1, nums1)).toBe(false)
  })

  test("Running sum function", () => {
    const nums1 = [4, 2, 5, 1, 7]
    const output = [4, 6, 11, 12, 19]

    const v1 = new Vector(nums1)
    // Check static function
    expect(Vector.runningSum(v1).getSelf()).toEqual(output)
    expect(wasMutated(v1, nums1)).toBe(false)
    // Check in-place method
    expect(v1.runningSum().getSelf()).toEqual(output)
  })

  test("Vector find function", () => {
    const point1 = [2, 5]
    const point2 = [3, 12]
    const output = [1, 7]
    // Check static function
    expect(Vector.find(point1, point2).getSelf()).toEqual(output)
  })

  test("Create zero vector", () => {
    const length = 5
    const output = [0, 0, 0, 0, 0]
    // Check static function
    expect(Vector.zeros(length).getSelf()).toEqual(output)
  })

  test("Create a unit basis vector", () => {
    const length = 3
    const index = 1
    const output = [0, 1, 0]
    // Check static function
    expect(Vector.unitBasis(length, index).getSelf()).toEqual(output)
  })

})