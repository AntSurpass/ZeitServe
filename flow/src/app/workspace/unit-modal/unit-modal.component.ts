import { Component, OnInit } from '@angular/core';
import { GlobalOperatorService } from 'src/app/services/global-operator.service';
import { StoreService } from 'src/app/services/store.service';
import { ZrenderHelperService } from 'src/app/services/zrender-helper.service';
import {
  UnitTrack,
  UnitAngle,
  UnitEarth,
  UnitEnv,
  UnitJoystick,
  UnitWeigh,
  UnitServo,
  UnitPulse,
  UnitMakey,
  UnitLight,
  UnitNeopixel,
  UnitPIR,
  BaseUnit,
  Unit396,
  UnitButton,
  UnitColor,
  UnitDac,
  UnitDualButton,
  UnitIR,
  UnitHub,
  UnitM5Camera,
  UnitNicr,
  UnitProto,
  UnitRelay,
  UnitRGB,
  UnitTOF,
  UnitThermal,
  UnitADC,
  UnitExtio,
  UnitFinger,
  UnitRfid,
  UnitLidarCar,
  UnitCardkb,
} from '../../domain/unit';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';
import { CodeEditorService } from 'src/app/services/code-editor.service';
import { timingSafeEqual } from 'crypto';
import { ZrenderHelperMbService } from 'src/app/services/zrender-helper-mb.service';

/**
 * 生成Unit目录
 */
const createUnitCategory = () => {
  return [
    new UnitEnv({ name: '', port: PORT.A }),
    new UnitPIR({ name: '', port: PORT.B }),
    new UnitNeopixel({ name: '', port: PORT.A, count: 10 }),
    new UnitJoystick({ name: '', port: PORT.A }),

    new UnitMakey({ name: '', port: PORT.A }),
    new UnitServo({ name: '', port: PORT.A }),
    new UnitWeigh({ name: '', port: PORT.A }),
    new UnitTrack({ name: '', port: PORT.A }),
    new UnitButton({ name: '', port: PORT.B }),
    new UnitDualButton({ name: '', port: PORT.A }),
    new UnitRGB({ name: '', port: PORT.A }),
    new UnitRelay({ name: '', port: PORT.A }),
    new UnitADC({ name: '', port: PORT.B }),
    new UnitDac({ name: '', port: PORT.A }),
    new UnitNicr({ name: '', port: PORT.B }),
    new UnitIR({ name: '', port: PORT.A }),
    new UnitExtio({ name: '', port: PORT.A }),
    new UnitAngle({ name: '', port: PORT.B }),
    new UnitLight({ name: '', port: PORT.B }),
    new UnitEarth({ name: '', port: PORT.B }),
    
    new UnitTOF({ name: '', port: PORT.A }),
    new UnitColor({ name: '', port: PORT.A }),

    new UnitRfid({ name: '', port: PORT.A }),
    new UnitFinger({ name: '', port: PORT.C }),

    new UnitCardkb({ name: '', port: PORT.A }),
    
    new UnitPulse({ name: '', port: PORT.A }),

    // new Unit396({ name: '', port: PORT.A }),
    // new UnitHub({ name: '', port: PORT.A }),
    // new UnitM5Camera({ name: '', port: PORT.B }),
    // new UnitProto({ name: '', port: PORT.A }),
    new UnitThermal({ name: '', port: PORT.A }),
  ];
}

@Component({
  selector: 'app-unit-modal',
  templateUrl: './unit-modal.component.html',
  styleUrls: ['./unit-modal.component.scss']
})
export class UnitModalComponent implements OnInit {

  /** Unit目录 */
  category: BaseUnit[] = [];

  /** 遮罩层对象 */
  maskModal = null;

  /** 已选择Unit */
  selectedUnit = null;


  selectMoreUnit = [];

  Allunit = {};
  isstick;
  constructor(
    private globalOperatorSrv: GlobalOperatorService,
    private storeSrv: StoreService,
    private zrenderHelperSrv: ZrenderHelperService,
    private zrenderHelperSrvmb: ZrenderHelperMbService,
    private codeEditorSrv: CodeEditorService
  ) { }

  ngOnInit() {
    this.storeSrv.getType().subscribe( res => {
      this.isstick = res;
    });
    this.category = createUnitCategory();
  }

  cancel() {
    this.globalOperatorSrv.maskModal.instance.removeMask();
  }

  createUnit(type) {
    // let type = this.selectedUnit.type;
    switch (type) {
      case UNIT_TYPE.ENV:
        return new UnitEnv({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.ANGLE:
        return new UnitAngle({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.PIR:
        return new UnitPIR({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.NEOPIXEL:
        return new UnitNeopixel({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port, count: this.selectedUnit.count });
      case UNIT_TYPE.JOYSTICK:
        return new UnitJoystick({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.LIGHT:
        return new UnitLight({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.EARTH:
        return new UnitEarth({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.MAKEY:
        return new UnitMakey({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.SERVO:
        return new UnitServo({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.WEIGH:
        return new UnitWeigh({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.PULSE:
        return new UnitPulse({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.TRACK:
        return new UnitTrack({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.BUTTON:
        return new UnitButton({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.DUALBUTTON:
        return new UnitDualButton({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.RGB:
        return new UnitRGB({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.RELAY:
        return new UnitRelay({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.DAC:
        return new UnitDac({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.ADC:
        return new UnitADC({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.TOF:
        return new UnitTOF({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.NCIR:
        return new UnitNicr({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.IR:
        return new UnitIR({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
      case UNIT_TYPE.EXTIO:
        return new UnitExtio({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
        case UNIT_TYPE.COLOR:
        return new UnitColor({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
        case UNIT_TYPE.FINGER:
        return new UnitFinger({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
        case UNIT_TYPE.RFID:
        return new UnitRfid({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
        case UNIT_TYPE.CARDKB:
        return new UnitCardkb({ name: this.storeSrv.getUnitDefauleName(type), port: this.selectedUnit.port });
    }
  }

  handle(e) {
    let _val = e.target.value;
    if (  _val in this.Allunit ) {
      delete this.Allunit[e.target.value];
    } else {
      this.Allunit[_val] = this.createUnit(_val);
    }
  }
  ok() {
    for (let i in this.Allunit) {
      this.storeSrv.addUnit(this.Allunit[i]);
     }
    // this.selectMoreUnit.forEach( e => {
    // this.storeSrv.addUnit(this.createUnit(e));
    // });
    this.globalOperatorSrv.maskModal.instance.removeMask();
    if (this.globalOperatorSrv.ismb) {
      this.zrenderHelperSrvmb.updateUnitSvg();

    } else {
      this.zrenderHelperSrv.updateUnitSvg();

    }
    if (!this.globalOperatorSrv.codeLock.value) {
      this.codeEditorSrv.updateWorkspaceValue();
    }
  }

  selectUnit(unit) {
    this.selectedUnit = unit;
  }

  stopPropagation(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  setUnit(type,ev, key) {
    this.Allunit[type][key] =  ev.target.value;
    
  }
  toDocs(unit, e) {
    e.stopPropagation();
    window.open(`https://docs.m5stack.com/#/en/unit/${unit.type}`, '_blank');
    // e.preventDefault();
  }
}
