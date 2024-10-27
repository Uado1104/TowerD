import { Mat4, Quat, Vec2, Vec3 } from 'cc';

export class MathUtils {
  /**
   * 环形映射
   * @param value
   * @param min
   * @param max
   */
  static CircularMapping(value: number, max: number, min = 0): number {
    const dif = value - min;
    const dis: number = max - min;
    if (dif < 0) {
      return dis + (dif % dis);
    }
    return dif % dis;
  }

  /**
   * 绕点旋转
   * @param angle
   * @param point
   * @param origin
   * @param out
   */
  static RotationFormOrigin(angle: number, point: Vec3, origin: Vec3, out: Vec3): void {
    //旋转
    const q: Quat = new Quat();
    Quat.fromEuler(q, 0, 0, angle);
    const m: Mat4 = new Mat4();
    Mat4.fromRTSOrigin(m, q, Vec3.ZERO, new Vec3(1, 1, 1), origin);
    //应用矩阵
    Vec3.transformMat4(out, point, m);
  }
  /**
   * 求圆内多边形的中心点的高度
   * @param l     边长
   * @param n     内角
   */
  static InCirclePolygonCentre(l: number, n: number): number {
    const hl: number = l * 0.5;
    const angle: number = n * 0.5;
    //角度转弧度
    const radian: number = this.angle2Radian(angle);
    const value: number = hl / Math.tanh(radian);
    return value;
  }

  /**
   * 随机范围值
   * @param min
   * @param max
   */
  static RandomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
  /**
   * 获取速度分量 从2个点及速度计算
   * @param currentPoint
   * @param targetPoint
   * @param speed
   * @param result
   */
  static getSpeed2dByPoint(currentPoint: Vec2, targetPoint: Vec2, speed: number, vec?: Vec2): Vec2 {
    const result = vec ?? new Vec2();
    const angle: number = this.getRadian(targetPoint.x, targetPoint.y, currentPoint.x, currentPoint.y);
    this.getSpeed2DR(angle, speed, result);
    return result;
  }
  /**
   * 速度转2维速度
   * @param angle         角度
   * @param speed         速度
   * @param result        结果
   */
  static getSpeed2D(angle: number, speed: number, result: Vec2 = null): Vec2 {
    //角度转弧度
    const radian: number = angle * (Math.PI / 180);
    return this.getSpeed2DR(radian, speed, result);
  }

  static getSpeed2DR(radian: number, speed: number, vec: Vec2 = null): Vec2 {
    const result = vec ?? new Vec2();
    result.x = Math.cos(radian) * speed;
    result.y = Math.sin(radian) * speed;
    return result;
  }

  /**
   * 根据角度和X轴计算Y轴速度
   * @param angle
   * @param speedX
   * @param result
   */
  static getSpeed2DByX(angle: number, speedX: number, vec: Vec2 = null): Vec2 {
    const result = vec ?? new Vec2();
    //角度转弧度
    const radian: number = angle * (Math.PI / 180);
    //求出斜边的长度
    const leg: number = speedX / Math.cos(radian);
    result.x = speedX;
    result.y = Math.sin(radian) * leg;
    return result;
  }
  /**
   * 求旋转后的点坐标
   * @param angle         角度
   * @param point         旋转前的坐标点
   * @param result
   */
  static rotationPoint(ang: number, point: { x: number; y: number }, result: { x: number; y: number }): void {
    //角度转弧度
    const angle = ang * (Math.PI / 180);
    result.x = Math.cos(angle) * point.x - Math.sin(angle) * point.y;
    result.y = Math.cos(angle) * point.y + Math.sin(angle) * point.x;
  }

  static getAngle(a: Vec2, b: Vec2): number {
    return this.getRadianByPoint(a, b) * (180 / Math.PI);
  }

  static getRadianByPoint(a: Vec2, b: Vec2): number {
    return Math.atan2(a.y - b.y, a.x - b.x);
  }

  static getRadian(ax: number, ay: number, bx: number, by: number): number {
    return Math.atan2(ay - by, ax - bx);
  }

  static angle2Radian(angle: number): number {
    return angle * (Math.PI / 180);
  }

  static radian2Angle(radian: number): number {
    return radian * (180 / Math.PI);
  }

  /**
   * 计算两线段相交点坐标
   * @param line1Point1
   * @param line1Point2
   * @param line2Point1
   * @param line2Point2
   * @return 返回该点
   */
  static getIntersectionPoint(
    line1Point1: Vec2,
    line1Point2: Vec2,
    line2Point1: Vec2,
    line2Point2: Vec2,
    vec?: Vec2,
  ): Vec2 {
    const result = vec ?? new Vec2();
    const x1 = line1Point1.x;
    const y1 = line1Point1.y;
    const x2 = line1Point2.x;
    const y2 = line1Point2.y;
    const x3 = line2Point1.x;
    const y3 = line2Point1.y;
    const x4 = line2Point2.x;
    const y4 = line2Point2.y;

    result.x =
      Math.ceil((x1 - x2) * (x3 * y4 - x4 * y3) - (x3 - x4) * (x1 * y2 - x2 * y1)) /
      ((x3 - x4) * (y1 - y2) - (x1 - x2) * (y3 - y4));
    result.y =
      Math.ceil((y1 - y2) * (x3 * y4 - x4 * y3) - (x1 * y2 - x2 * y1) * (y3 - y4)) /
      ((y1 - y2) * (x3 - x4) - (x1 - x2) * (y3 - y4));
    return result;
  }

  /**
   * 判断点是否在线段内
   * @param Pi
   * @param Pj
   * @param Q
   */
  static onSegment(Pi: Vec2, Pj: Vec2, Q: Vec2): boolean {
    Q.x = Math.round(Q.x);
    Q.y = Math.round(Q.y);
    const xValue: number = (Q.x - Pi.x) * (Pj.y - Pi.y) - (Pj.x - Pi.x) * (Q.y - Pi.y);
    if (
      Math.floor(xValue) == 0 &&
      //保证Q点坐标在pi,pj之间
      Math.min(Pi.x, Pj.x) <= Q.x &&
      Q.x <= Math.max(Pi.x, Pj.x) &&
      Math.min(Pi.y, Pj.y) <= Q.y &&
      Q.y <= Math.max(Pi.y, Pj.y)
    ) {
      return true;
    }
    return false;
  }

  /**
   * 求两个向量之间的夹角
   * @param av        单位向量
   * @param bv        单位向量
   */
  static calculateAngle(av: Vec3, bv: Vec3): number {
    //cos=a.b/(|a||b|);
    return Math.acos(Vec3.dot(av, bv) / (av.length() * bv.length()));
  }

  static calculateAngleByPoints(a: Vec3, b: Vec3, c: Vec3) {
    const av: Vec3 = new Vec3();
    const bv: Vec3 = new Vec3();
    Vec3.subtract(b, a, av);
    Vec3.subtract(b, c, bv);
    return this.calculateAngle(av, bv);
  }
}
