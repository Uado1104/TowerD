import { ModuleDef } from './ModuleDef';

export class SceneDef {
  /**
   * @en start scene, must be loaded from this scene
   * @zh 首场景，必须从这个场景启动
   */
  static START = { name: 'start', bundle: 'main' };
  /**
   * @en login scene
   * @zh 登录场景
   * */
  static LOGIN = { name: 'login', bundle: ModuleDef.BASIC };
  /**
   * @en login scene , after login, will jump to this scene
   * @zh 主大厅场景，登录成功后会首先进入这个场景
   */
  static LOBBY = { name: 'lobby', bundle: ModuleDef.BASIC };
  /**
   * @en create role scene, after login, if user has no role, will jump to this scene
   * @zh 创建角色场景，登录成功后如果没有创建过角色，会跳转到此场景
   **/
  static CREATE_ROLE = { name: 'create_role', bundle: ModuleDef.BASIC };

  /**
   * @en game scene
   * @zh 游戏场景
   **/
  static GAME = { name: 'game', bundle: ModuleDef.GAME };
}
