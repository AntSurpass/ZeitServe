import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { COMPONENT_ALIAS } from '../utils/common-data';

@Injectable({
  providedIn: 'root'
})
export class CodeMakerService {

  constructor(private storeSrv: StoreService) { }

  /**
   * 生成代码
   */
  makeCode() {

    let blocks = window['BlocklyEditor'].getAllBlocks();
    let units = this.storeSrv.unitList.value;
    let libraryBlocks = [];
    let unitVarnames = [];
    let defFuncs = [];

    blocks.forEach(block => {
      if (block.type === 'procedures_defnoreturn' ||
        block.type === 'procedures_defreturn' ||
        block.type === 'button_callback' ||
        block.type === 'unit_button_callback' ||
        block.type === 'mqtt_sub' ||
        block.type === 'remote_add_switch') {

      }
      else {
        libraryBlocks.push(block);
      }
    });

    unitVarnames = units.map(u => u.name);
    defFuncs = window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[0].concat(window["Blockly"].Procedures.allProcedures(window["BlocklyEditor"])[1]).filter(f => f[3] != false).map(f => f[0]);


    let code = [];

    let libraryCode = this.makeLibraryCode(libraryBlocks);
    let unitCode = this.makeUnitCode();
    
    let instanceCode = this.makeInstanceCode(libraryBlocks);
    let componentCode = this.makeComponentCode();
    let blockCode = this.makeBlockCode();
    let moduleCode = this.makeModuleCode(window["Blockly"].modules);

    if(this.getblockCode('wifi_connect') !== '') {
      code.push(this.getblockCode('wifi_connect').split('\n').splice(0,2).join('\n'));
    }
    code.push(libraryCode);
    code.push(moduleCode);


    code.push(`clear_bg(${this.storeSrv.componentList.value[0][COMPONENT_ALIAS.BACKGROUND_COLOR].replace('#', '0x')})`);
    code.push(unitCode);
    code.push(instanceCode);

    if(this.getblockCode('lorawan_initp2p') !== '') {
      code.push(this.getblockCode('lorawan_initp2p').split('\n').splice(0,1).join('\n'));
    }

    code.push(componentCode);
    code.push(blockCode);

    let codeStr = code.join('\n');
    let event = this.makeEventCode();

    codeStr = codeStr.replace('# Define Event\n', event + '\n');


    if (window["Blockly"].defineGlobal().length > 0 || defFuncs.length > 0) {
      codeStr = codeStr.replace(/# global params/g, 'global ' + window["Blockly"].defineGlobal().join(', '));
      // codeStr = codeStr.replace(/# global params/g, 'global ' + window["Blockly"].concat(unitVarnames).concat(defFuncs).join(', '));
    }

    let mqtt_code = '';
    // mqtt_code = this.getblockCode('mqtt_set_client');
    // if (mqtt_code !== '') {
    //   let arrCodeStr = codeStr.split('\n');
    //   for(var i = arrCodeStr.length - 1; i >= 0; i--) {
    //     if(arrCodeStr[i].indexOf('m5mqtt = M5mqtt') > -1) {
    //       arrCodeStr.splice(i, 1);
    //       break;
    //     }
    //   }
    //   codeStr = arrCodeStr.join('\n');
    // }
    codeStr = this.removemoreBlocklyCode('mqtt_set_client' , codeStr);
    codeStr = this.removewifiBlocklyCode('wifi_connect' , codeStr);
    codeStr = this.removelorwanBlocklyCode('lorawan_initp2p' , codeStr);
    return codeStr;

  }

  /**
   * 生成引用库代码
   * @param libraryBlocks 需要引用库的块对象
   */
  private makeLibraryCode(libraryBlocks) {
    let code = ['from m5stack import *', 'from m5ui import *'];
    libraryBlocks.forEach(block => {
      if (block.disabled) return;
      // Emoji
      if (block.type === 'emoji_show' || block.type === 'emoji_set_single') {
        if (code.indexOf('from square import Square') === -1) code.push('from square import Square');
      }
      // IMU
      else if (block.type === 'IMU_GET_X' || block.type === 'IMU_GET_Y' || block.type === 'IMU_GET_Z' || block.type === 'IMU_IS_LEVEL' || block.type === 'IMU_IS_STAND' || block.type === 'IMU_IS_LEFT_TILT' || block.type === 'IMU_IS_RIGHT_TILT' || block.type === 'IMU_IS_OTHER_SIDE' ||  block.type === 'IMU_GET_ACC_Y' ||  block.type === 'IMU_GET_ACC_X' ||  block.type === 'IMU_GET_ACC_Z') {
        if (code.indexOf('from mpu6050 import MPU6050') === -1) code.push('from mpu6050 import MPU6050');
        if (code.indexOf('import i2c_bus') === -1) code.push('import i2c_bus');
      }
      // Servo
      else if (block.type === 'servo_init' || block.type === 'servo_angle') {
        if (code.indexOf('from servo import *') === -1) code.push('from servo import *');
      }
      // Bala
      else if (block.type === 'm5bala_start' || block.type === 'm5bala_move' || block.type === 'm5bala_turn' || block.type === 'm5bala_rotate' || block.type === 'm5bala_loop') {
        if (code.indexOf('from m5bala import M5Bala') === -1) code.push('from m5bala import M5Bala');
        if (code.indexOf('import i2c_bus') === -1) code.push('import i2c_bus');
      }
      // Bala Motor
      else if (block.type === 'nxt_init' ||
        block.type === 'nxt_set_pwm' ||
        block.type === 'nxt_run' ||
        block.type === 'nxt_stop' ||
        block.type === 'nxt_read_encoder') {
        if (code.indexOf('import lego') === -1) code.push('import lego');
      }
      // Lego Motor
      else if (block.type === 'lego_register_motor' ||
        block.type === 'lego_set_pwm' ||
        block.type === 'lego_set_speed' ||
        block.type === 'lego_set_angle' ||
        block.type === 'lego_set_angle_zero' ||
        block.type === 'lego_stop' ||
        block.type === 'lego_brake') {
        if (code.indexOf('from lego_board import NXT_Motor') === -1) code.push('from lego_board import NXT_Motor');
      }
      // step Motor
      else if (block.type === 'motor_instance' ||
        block.type === 'motor_move_xyz' ||
        block.type === 'motor_g_code' ||
        block.type === 'motor_set_mode' ||
        block.type === 'motor_lock' ||
        block.type === 'motor_unlock') {
        if (code.indexOf('from step_motor import StepMotor') === -1) code.push('from step_motor import StepMotor');
      }
      // Pin
      else if (block.type === 'pins_analog_read' ||
        block.type === 'pins_analog_write' ||
        block.type === 'pins_digital_read' ||
        block.type === 'pins_digital_write' ||
        block.type === 'pins_set_mode' ||
        block.type === 'pins_set_map') {
        if (code.indexOf('from m5_pin import *') === -1) code.push('from m5_pin import *');
      }
      // iic
      else if (block.type === 'iic_set') {
        if (code.indexOf('import i2c_bus') === -1) code.push('import i2c_bus');
      }
      // matt
      else if (block.type === 'mqtt_set_client') {
        if (code.indexOf('from m5mqtt import M5mqtt') === -1) code.push('from m5mqtt import M5mqtt');
      }
      // lidarcar
      else if (block.type === 'lidarcar_setrgb' || block.type === 'lidarcar_setOnergb' || block.type === 'lidarcar_goahead' || block.type === 'lidarcar_goback' || block.type === 'lidarcar_turnLeft' || block.type === 'lidarcar_turnRight' || block.type === 'lidarcar_setStepMotor' || block.type === 'lidarcar_setServo' || block.type === 'lidarcar_drawMap' || block.type === 'lidarcar_getdistance') {
        if (code.indexOf('import module\n') === -1) code.push('import module\n');
      }
      // lorawan
      else if (block.type === 'lorawan_initrx' || block.type === 'lorawan_initp2p' || block.type === 'lorawan_data'|| block.type === 'lorawan_txt') {
        if (code.indexOf('import module\n') === -1) code.push('import module\n');
      }
    });

    if (this.storeSrv.unitList.value.length > 0) code.push('import units');

    return code.join('\n');
  }

  /**
   * 生成组件代码
   */
  private makeComponentCode() {
    let clone = this.storeSrv.componentList.value.slice().sort((a, b) => a.layer - b.layer);
    let code = [];
    clone.forEach(c => code.push(c.transformToCode()));
    return code.join('');
  }

  /**
   * 生成实例化代码
   * @param importBlocks 需要实例化的块对象
   */
  private makeInstanceCode(importBlocks) {
    let code = [];
    importBlocks.forEach(block => {
      if (block.disabled) return;
      // Emoji
      if (block.type === 'emoji_show' || block.type === 'emoji_set_single' || block.type === 'emoji_change') {
        if (code.indexOf('emoji = Square(7, 7, 15, 9, lcd)') === -1) code.push('emoji = Square(7, 7, 15, 9, lcd)');
      }
      // IMU
      else if (block.type === 'IMU_GET_X' || block.type === 'IMU_GET_Y' || block.type === 'IMU_GET_Z' || block.type === 'IMU_IS_LEVEL' || block.type === 'IMU_IS_STAND' || block.type === 'IMU_IS_LEFT_TILT' || block.type === 'IMU_IS_RIGHT_TILT' || block.type === 'IMU_IS_OTHER_SIDE' || block.type === 'IMU_GET_ACC_Y' ||  block.type === 'IMU_GET_ACC_X' ||  block.type === 'IMU_GET_ACC_Z') {
        if (code.indexOf('imu = MPU6050(i2c_bus.get(i2c_bus.M_BUS))')) code.push('imu = MPU6050(i2c_bus.get(i2c_bus.M_BUS))');
      }
      // Servo
      else if (block.type === 'servo_init' || block.type === 'servo_angle') {
        if (code.indexOf('servo = Servo()') === -1) code.push('servo = Servo()');
      }
      // Bala
      else if (block.type === 'm5bala_start' || block.type === 'm5bala_move' || block.type === 'm5bala_turn' || block.type === 'm5bala_rotate' || block.type === 'm5bala_loop') {
        if (code.indexOf('m5bala = M5Bala(i2c_bus.get(i2c_bus.M_BUS))') === -1) code.push('m5bala = M5Bala(i2c_bus.get(i2c_bus.M_BUS))');
      }
      // Lego Motor
      // else if(block.type === 'lego_register_motor' || 
      //         block.type === 'lego_set_pwm' || 
      //         block.type === 'lego_set_speed' || 
      //         block.type === 'lego_set_angle' ||
      //         block.type === 'lego_set_angle_zero' ||
      //         block.type === 'lego_stop' ||
      //         block.type === 'lego_brake') {
      //   if(code.indexOf('motor = Lego_Motor()') === -1) code.push('motor = Lego_Motor()');
      // }
      // RGB bar
      else if (block.type === 'rgb_set_all' || block.type === 'rgb_set_dir' || block.type === 'rgb_set') {
        if (code.indexOf('rgb = RGB_Bar()') === -1) code.push('rgb = RGB_Bar()');
      }
      // Pin
      else if (block.type === 'pins_analog_read' ||
        block.type === 'pins_analog_write' ||
        block.type === 'pins_digital_read' ||
        block.type === 'pins_digital_write' ||
        block.type === 'pins_set_mode' ||
        block.type === 'pins_set_map') {
        if (code.indexOf('pin = M5_Pin()') === -1) code.push('pin = M5_Pin()');
      }
      else if (block.type === 'lorawan_initrx' || block.type === 'lorawan_initp2p' || block.type === 'lorawan_data'|| block.type === 'lorawan_txt') {
        if (code.indexOf('lorawan0 = module.get(module.lorawan)') === -1) code.push('lorawan0 = module.get(module.lorawan)');
      }
      else if (block.type === 'lidarcar_setrgb' || block.type === 'lidarcar_setOnergb' || block.type === 'lidarcar_goahead' || block.type === 'lidarcar_goback' || block.type === 'lidarcar_turnLeft' || block.type === 'lidarcar_turnRight' || block.type === 'lidarcar_setStepMotor' || block.type === 'lidarcar_setServo' || block.type === 'lidarcar_drawMap' || block.type === 'lidarcar_getdistance') {
        if (code.indexOf('lidarcar0 = module.get(module.lidarCar)') === -1) code.push('lidarcar0 = module.get(module.lidarCar)');
      }
    });
    return code.join('\n');
  }

// 移除块多余的代码
  private removemoreBlocklyCode(name: string, codeStrs) {
    let mqtt_code = '';
    mqtt_code = this.getblockCode(name);
    if (mqtt_code !== '') {
      let arrCodeStr = codeStrs.split('\n');
      for(var i = arrCodeStr.length - 1; i >= 0; i--) {
        if(arrCodeStr[i].indexOf('m5mqtt = M5mqtt') > -1) {
          arrCodeStr.splice(i, 1);
          break;
        }
      }
      codeStrs = arrCodeStr.join('\n');
    }
    return codeStrs;
  }

  private removewifiBlocklyCode(name: string, codeStrs) {
    let mqtt_code = '';
    mqtt_code = this.getblockCode(name);
    if (mqtt_code !== '') {
      let arrCodeStr = codeStrs.split('\n');
      for(var i = arrCodeStr.length - 1; i >= 0; i--) {
        if(arrCodeStr[i].indexOf('wifisetup.auto_connect') > -1) {
          arrCodeStr.splice(i, 1);
          arrCodeStr.splice(i - 1, 1);
          break;
        };
      }
      codeStrs = arrCodeStr.join('\n');
    }
    return codeStrs;
  }

  private removelorwanBlocklyCode(name: string, codeStrs) {
    let mqtt_code = '';
    mqtt_code = this.getblockCode(name);
    if (mqtt_code !== '') {
      let arrCodeStr = codeStrs.split('\n');
      for(var i = arrCodeStr.length - 1; i >= 0; i--) {
        if(arrCodeStr[i].indexOf('lorawan0.initP2PMode') > -1) {
          arrCodeStr.splice(i, 1);
          break;
        }
      }
      codeStrs = arrCodeStr.join('\n');
    }
    return codeStrs;
  }

// 生成一个块代码
public getblockCode(name: string): any {
  let a = '';
  window['BlocklyEditor'].getAllBlocks().map(b => {
    if (b.type === name) {
       a =  window["Blockly"].Python.blockToCode(b);
    }
  });
  return a;
}

  /**
   * 生成Unit代码
   */
  private makeUnitCode() {
    let mqtt_code = '';
    mqtt_code = this.getblockCode('mqtt_set_client').split('\n')[0];
    // console.log(mqtt_code);
    // if (mqtt_code === '') {
    //   return;
    // }
    return (this.storeSrv.unitList.value.map(u => u.getCode())).join('') + '\n' + mqtt_code;
  }

  /**
   * 生成块代码
   */
  private makeBlockCode() {

    let special = ['button_callback'];
    window['BlocklyEditor'].topBlocks_.sort((a, b) => {
      return special.indexOf(b.type) - special.indexOf(a.type);
    });
    let unbutton = ['unit_button_callback'];
    window['BlocklyEditor'].topBlocks_.sort((a, b) => {
      return unbutton.indexOf(b.type) - unbutton.indexOf(a.type);
    });
    let dualunbutton = ['unit_dual_button_callback'];
    window['BlocklyEditor'].topBlocks_.sort((a, b) => {
      return dualunbutton.indexOf(b.type) - dualunbutton.indexOf(a.type);
    });
    let mqtt_sub = ['mqtt_sub'];
    window['BlocklyEditor'].topBlocks_.sort((a, b) => {
      return mqtt_sub.indexOf(b.type) - mqtt_sub.indexOf(a.type);
    });
    let finger_read = ['finger_read'];
    window['BlocklyEditor'].topBlocks_.sort((a, b) => {
      return finger_read.indexOf(b.type) - finger_read.indexOf(a.type);
    });
    let lorawan_initrx = ['lorawan_initrx'];
    window['BlocklyEditor'].topBlocks_.sort((a, b) => {
      return lorawan_initrx.indexOf(b.type) - lorawan_initrx.indexOf(a.type);
    });
    return window['Blockly'].Python.workspaceToCode(window['BlocklyEditor']);
  }

  /**
   * 生成事件代码
   */
  private makeEventCode() {
    let buttonEvents = [];
    for (let i = 0; i < window['Blockly']['ButtonEvents'].length; i++) {
      buttonEvents.push(window['Blockly']['ButtonEvents'][i].event);
    }
    let remoteEvents = [];
    for (let i = 0; i < window['Blockly']['Remotes'].length; i++) {
      remoteEvents.push(window['Blockly']['Remotes'][i].code);
    }
    return buttonEvents.concat(remoteEvents).join('\n');
  }
  // 添加模块声明
  private makeModuleCode(modules) {
    let mod = [];
    modules.forEach(e => {
      if (e === 'machine') {
        if (mod.indexOf('import machine') === -1) mod.push('import machine');
      } else if (e === 'remote') {
        if (mod.indexOf('try:\n  remote_start()\nexcept:\n  pass') === -1) mod.push('try:\n  remote_start()\nexcept:\n  pass');
      }
    });
    if(window['Blockly']['Remotes'].length === 0) {
      mod = [];
    }
    return mod.join('\n');
  }
}
