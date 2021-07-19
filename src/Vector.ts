import { log, assert, assertNonNegativeInt, Loggable } from './utils'

type Point = number[]

interface UnaryOp<OperandType, ReturnType> {
  (value: OperandType): ReturnType
}

interface BinaryOp<OperandType, ReturnType> {
  (value1: OperandType, value2: OperandType): ReturnType
}

export class Vector implements Loggable {

  private __self: number[]

  constructor()
  constructor(nums: number[])
  constructor(nums?: number[]) {
    this.__self = nums || []
  }

  public getSelf(): number[] {
    return this.__self
  }

  private static __checkInBounds(vector: Vector, index: number): void {
    assertNonNegativeInt(index, "Index")
    assert(index < vector.numDimensions(), "Index out of range")
  }

  private static __checkEqualDimensions: BinaryOp<Vector, void> = (vector1, vector2): void => {
    assert(vector1.numDimensions() === vector2.numDimensions(), "Vectors must have same number of dimensions")
  }

  private static __vectorBinaryOp = (vector1: Vector, vector2: Vector, operation: (n1: number, n2: number) => number): Vector => {
    Vector.__checkEqualDimensions(vector1, vector2)
    return new Vector(vector1.__self.map((value1, index): number => operation(value1, vector2.get(index))))
  }

  public static isEqual: BinaryOp<Vector, boolean> = (vector1, vector2): boolean => {
    Vector.__checkEqualDimensions(vector1, vector2)
    for (let i = 0; i < vector1.numDimensions(); i++) {
      if (vector1.__self[i] !== vector2.__self[i]) {
        return false
      }
    }
    return true
  }

  public static add: BinaryOp<Vector, Vector> = (vector1, vector2): Vector => {
    return Vector.__vectorBinaryOp(vector1, vector2, (n1: number, n2: number): number => n1 + n2)
  }

  public static sub: BinaryOp<Vector, Vector> = (vector1, vector2): Vector => {
    return Vector.__vectorBinaryOp(vector1, vector2, (n1: number, n2: number): number => n1 - n2)
  }

  public static scale(alpha: number, vector: Vector): Vector {
    return new Vector(vector.__self.map(value => value * alpha))
  }

  public static axpy(alpha: number, x: Vector, y: Vector): Vector {
    return Vector.scale(alpha, x).add(y)
  }

  public static dot: BinaryOp<Vector, number> = (vector1 , vector2): number => {
    Vector.__checkEqualDimensions(vector1, vector2)
    return vector1.__self.reduce((total, value, index) => total  + (value * vector2.get(index)), 0)
  }

  public static vlength: UnaryOp<Vector, number> = (vector): number => {
    return Math.sqrt(Vector.dot(vector, vector))
  }

  public static runningSum: UnaryOp<Vector, Vector> = (vector): Vector => {
    let value = 0
    const output = new Vector()
    for (let i = 0; i < vector.numDimensions(); i++) {
      value += vector.__self[i]
      output.push(value)
    }
    return output
  }

  public static find: BinaryOp<Point, Vector> = (start, end): Vector => {
    assert(start.length === end.length, "Points must have the same number of dimensions")
    return new Vector(start.map((startValue, index: number): number => end[index] - startValue))
  }

  public static zeros: UnaryOp<number, Vector> = (length): Vector => {
    assertNonNegativeInt(length, "Length")
    const output = new Vector()
    for (let i = 0; i < length; i++) {
      output.push(0)
    }
    return output
  }

  public static unitBasis(length: number, index: number): Vector {
    assertNonNegativeInt(length, "Length")
    assertNonNegativeInt(index, "Index")
    assert(index < length, "Index must be less than length")
    const values = new Vector()
    for (let i = 0; i < length; i++) {
      values.push(i === index ? 1 : 0)
    }
    return values
  }

  public static outer: BinaryOp<Vector, Matrix> = (vector1, vector2): Matrix => {
    const output = new Matrix()
    for (let i = 0; i < vector1.numDimensions(); i++) {
      output.push(Vector.scale(vector1.get(i), vector2))
    }
    return output
  }

  public toString(): string {
    return `[ ${this.__self.join(" ")} ]`
  }

  public numDimensions(): number {
    return this.__self.length
  }

  public push(value: number): void {
    this.__self.push(value)
  }

  public isEqual(vector2: Vector): boolean {
    return Vector.isEqual(this, vector2)
  }

  public set(index: number, value: number): Vector {
    Vector.__checkInBounds(this, index)
    this.__self[index] = value
    return this
  }

  public get(index: number): number {
    Vector.__checkInBounds(this, index)
    return this.__self[index]
  }

  public add(vector2: Vector): Vector {
    this.__self = vector2.__self.map((value2, index) => this.get(index) + value2)
    return this
  }

  public sub(vector2: Vector): Vector {
    this.__self = vector2.__self.map((value2, index) => this.__self[index] - value2)
    return this
  }

  public scale(alpha: number): Vector {
    this.__self = this.getSelf().map((_, index) => this.__self[index] * alpha)
    return this
  }

  public axpy(alpha: number, y: Vector): Vector {
    this.__self = y.getSelf().map((value2, index) => (this.__self[index] * alpha) + value2)
    return this
  }

  public dot(vector2: Vector): number {
    return Vector.dot(this, vector2)
  }

  public length(): number {
    return Vector.vlength(this)
  }

  public runningSum(): Vector {
    return Vector.runningSum(this)
  }
}

type TriangularMatrix = "standard" | "strict" | "unit"
type UpperOrLower = "upper" | "lower"

export class Matrix implements Loggable {

  private static __checkRowInBounds(matrix: Matrix, row: number): void {
    assertNonNegativeInt(row, "Row")
    assert(row < matrix.numRows(), `Row ${row} out of bounds`)
  }

  private static __checkColInBounds(matrix: Matrix, col: number): void {
    assertNonNegativeInt(col, "Column")
    assert(col < matrix.numColumns(), `Column ${col} out of bounds`)
  }

  private static __checkInBounds(matrix: Matrix, row: number, col: number) {
    Matrix.__checkRowInBounds(matrix, row)
    Matrix.__checkColInBounds(matrix, col)
  }

  private static __checkEqualRows: BinaryOp<Matrix, void> = (matrix1, matrix2): void => {
    assert(matrix1.numRows() === matrix2.numRows(), "Matrix must have same number of rows")
  }

  private static __checkEqualColumns: BinaryOp<Matrix, void> = (matrix1, matrix2): void => {
    assert(matrix1.numColumns() === matrix2.numColumns(), "Matrix must have same number of columns")
  }

  private static __checkEqualDimensions: BinaryOp<Matrix, void> = (matrix1, matrix2): void => {
    Matrix.__checkEqualColumns(matrix1, matrix2)
    Matrix.__checkEqualRows(matrix1, matrix2)
  }

  private static __assertIsSquare(matrix: Matrix, operation: string): void {
    assert(matrix.isSquare(), `Matrix must be square to perform {${operation}} operation`)
  }

  private static __findDimensions: BinaryOp<Matrix, number[]> = (matrix1, matrix2): number[] => {
    assert(matrix1.numColumns() === matrix2.numRows(), "Matrix1 number of columns must match matrix2 number of rows")
    return [matrix1.numRows(), matrix2.numColumns()]
  }

  private static __triangle(matrix: Matrix, operation: UpperOrLower, type: TriangularMatrix = "standard"): Matrix {
    Matrix.__assertIsSquare(matrix, "Lower Triangle")
    for (let row: number = operation === "upper" ? 1 : 0; row < matrix.numRows(); row++) {
      for (let col: number = operation === "upper" ? 0 : row + 1; col < (operation === "upper" ? row : matrix.numColumns()); col++) {
        matrix.set(row, col, 0)
      }
    }
    if (type === "strict" || type === "unit") {
      for (let i = 0; i < matrix.numRows(); i++) {
        matrix.set(i, i, type === "strict" ? 0 : 1)
      }
    }
    return matrix
  }

  private static __matrixBinaryOp = (matrix1: Matrix, matrix2: Matrix, operation: (v1: Vector, v2: Vector) => Vector): Matrix => {
    Matrix.__checkEqualDimensions(matrix1, matrix2)
    const matrix3 = new Matrix()
    for (let i = 0; i < matrix1.numRows(); i++) {
      matrix3.push(operation(matrix1.getRow(i), matrix2.getRow(i)))
    }
    return matrix3
  }

  public static isEqual: BinaryOp<Matrix, boolean> = (matrix1, matrix2): boolean => {
    try {
      Matrix.__checkEqualDimensions(matrix1, matrix2)
    } catch (error) {
      if (error instanceof TypeError) {
        return false
      } else {
        throw error
      }
    }
    for (let row = 0; row < matrix1.numRows(); row++) {
      if (!matrix1.__self[row].isEqual(matrix2.__self[row])) {
        return false
      }
    }
    return true
  }

  public static add: BinaryOp<Matrix, Matrix> = (matrix1, matrix2): Matrix => {
    return Matrix.__matrixBinaryOp(matrix1, matrix2, Vector.add)
  }

  public static sub: BinaryOp<Matrix, Matrix> = (matrix1, matrix2): Matrix => {
    return Matrix.__matrixBinaryOp(matrix1, matrix2, Vector.sub)
  }

  public static vectorMult(matrix: Matrix, vector: Vector): Vector {
    assert(matrix.numColumns() === vector.numDimensions(), "Matrix columns must match vector dimensions")
    const output = new Vector()
    for (let i = 0; i < matrix.numRows(); i++) {
      output.push(Vector.dot(matrix.getRow(i), vector))
    }
    return output
  }

  public static matrixMult: BinaryOp<Matrix, Matrix> = (matrix1, matrix2): Matrix => {
    const [rows, cols]: number[] = Matrix.__findDimensions(matrix1, matrix2)
    const matrix3 = new Matrix()
    for (let row = 0; row < rows; row++) {
      let vector = new Vector()
      for (let col = 0; col < cols; col++) {
        vector.push(Vector.dot(matrix1.getRow(row), matrix2.getCol(col)))
      }
      matrix3.push(vector)
    }
    return matrix3
  }

  public static scale(alpha: number, matrix: Matrix): Matrix {
    for (let row = 0; row < matrix.numRows(); row++) {
      matrix.setRow(row, matrix.getRow(row).scale(alpha))
    }
    return matrix
  }

  public static zeros(size: number): Matrix
  public static zeros(height: number, width: number): Matrix
  public static zeros(sizeOrHeight: number, width?: number): Matrix {
    const output = []
    for (let i = 0; i < sizeOrHeight; i++) {
      output.push(Vector.zeros(width || sizeOrHeight))
    }
    return new Matrix(output)
  }

  public static identity: UnaryOp<number, Matrix> = (size): Matrix => {
    assertNonNegativeInt(size, "Size")
    const output = []
    for (let i = 0; i < size; i++) {
      output.push(Vector.unitBasis(size, i))
    }
    return new Matrix(output)
  }

  public static diag: UnaryOp<Vector, Matrix> = (vector): Matrix => {
    const size = vector.numDimensions()
    const output = Matrix.zeros(size)
    for (let i = 0; i < size; i++) {
      output.set(i, i, vector.get(i))
    }
    return output
  }

  public static transpose: UnaryOp<Matrix, Matrix> = (matrix): Matrix => {
    const output = new Matrix()
    for (let col = 0; col < matrix.numColumns(); col++) {
      output.push(matrix.getCol(col))
    }
    matrix.__self = output.__self
    return matrix
  }

  public static lowerTriangle(matrix: Matrix, type: TriangularMatrix = "standard"): Matrix {
    return Matrix.__triangle(matrix, "lower", type)
  }

  public static upperTriangle(matrix: Matrix, type: TriangularMatrix = "standard"): Matrix {
    return Matrix.__triangle(matrix, "upper", type)
  }

  public static linearCombination(matrix: Matrix, vector: Vector): Vector {
    return new Vector(matrix.__self.map(row => row.dot(vector)))
  }

  public static isSquare: UnaryOp<Matrix, boolean> = (matrix): boolean => {
    return matrix.numRows() === matrix.numColumns()
  }

  private __self: Vector[]

  constructor()
  constructor(vectorList: Vector[])
  constructor(values: string)
  constructor(values?: Vector[] | string) {
    if (typeof values === 'string') {
      values = values.split(';').map(item => new Vector(item.trim().split(" ").map(value => Number(value))))
    }
    this.__self = values || []
  }

  private __update: UnaryOp<Matrix, Matrix> = (matrix): Matrix => {
    this.__self = matrix.__self
    return matrix
  }

  public isEqual(matrix2: Matrix): boolean {
    return Matrix.isEqual(this, matrix2)
  }

  public toString(): string {
    return this.__self.map(row => row.toString()).join("\n") + "\n"
  }

  public push(vector: Vector) {
    this.__self.push(vector)
  }

  public numRows(): number {
    return this.__self.length
  }

  public numColumns(): number {
    return this.__self[0].numDimensions()
  }

  public set(row: number, col: number, value: number): Matrix {
    Matrix.__checkInBounds(this, row, col)
    this.__self[row].set(col, value)
    return this
  }

  public get(row: number, col: number): number {
    Matrix.__checkInBounds(this, row, col)
    return this.__self[row].get(col)
  }

  public getRow(row: number): Vector {
    Matrix.__checkRowInBounds(this, row)
    return this.__self[row]
  }

  public setRow(row: number, vector: Vector): void {
    Matrix.__checkRowInBounds(this, row)
    assert(vector.numDimensions() === this.getRow(row).numDimensions(), "Vector must match matrix dimensions")
    this.__self[row] = vector
  }

  public getCol(col: number): Vector {
    Matrix.__checkColInBounds(this, col)
    let vector = new Vector()
    for (let row = 0; row < this.numRows(); row++) {
      vector.push(this.get(row, col))
    }
    return vector
  }

  public setCol(col: number, vector: Vector): void {
    Matrix.__checkColInBounds(this, col)
    assert(this.getCol(col).numDimensions() === vector.numDimensions(), "Vector must match matrix dimensions")
    for (let row = 0; row < this.numColumns(); row++) {
      this.__self[row].set(col, vector.get(row))
    }
  }

  public add(matrix2: Matrix): Matrix {
    return this.__update(Matrix.add(this, matrix2))
  }

  public sub(matrix2: Matrix): Matrix {
    return this.__update(Matrix.sub(this, matrix2))
  }

  public mult(matrix2: Matrix): Matrix {
    return this.__update(Matrix.matrixMult(this, matrix2))
  }

  public scale(alpha: number): Matrix {
    return Matrix.scale(alpha, this)
  }

  public isSquare(): boolean {
    return Matrix.isSquare(this)
  }

  public transpose(): Matrix {
    return Matrix.transpose(this)
  }

  public lowerTriangle(type: TriangularMatrix = "standard"): Matrix {
    return Matrix.lowerTriangle(this, type)
  }

  public upperTriangle(type: TriangularMatrix = "standard"): Matrix {
    return Matrix.upperTriangle(this, type)
  }
}
