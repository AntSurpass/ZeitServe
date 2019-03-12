import {
    ScreenComponent,
    ButtonComponent,
    TitleComponent,
    LabelComponent,
    RectangleComponent,
    CircleComponent,
    ImageComponent,
    ButtonProp,
    TitleProp,
    ScreenProp,
    LabelProp,
    RectangleProp,
    CircleProp,
    ImageProp,
    ButtonIndex
} from "../domain/component";
import { TYPE_ALIAS, UNIT_TYPE } from "./common-data";
import * as Unit from "../domain/unit";

/**
 * 生成组件ID
 */
export const genComponentId = (): string => {
    let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`!@#$%^&*_+-=';
    let id = '';
    for(let i = 0; i < 16; i++) {
        let random = Math.floor(Math.random() * str.length);
        id += str[random];
    }
    return id;
}

/**
 * 重建组件实例
 * @param data 实例数据
 */
export const rebuildComponentInstance = (data) => {
    switch(data.type) {
        case TYPE_ALIAS.SCREEN:
            return new ScreenComponent(<ScreenProp>data);
        case TYPE_ALIAS.BUTTON:
            return new ButtonComponent(<ButtonProp>data);
        case TYPE_ALIAS.TITLE:
            return new TitleComponent(<TitleProp>data);
        case TYPE_ALIAS.LABEL:
            return new LabelComponent(<LabelProp>data);
        case TYPE_ALIAS.RECTANGLE:
            return new RectangleComponent(<RectangleProp>data);
        case TYPE_ALIAS.CIRCLE:
            return new CircleComponent(<CircleProp>data);
        case TYPE_ALIAS.IMAGE:
            return new ImageComponent(<ImageProp>data);
    }
}

/**
 * 重建Unit实例
 * @param data Unit实例数据
 */
export const rebuildUnitInstance = (data) => {
    switch(data.type) {
        case UNIT_TYPE.ENV:
            return new Unit.UnitEnv(data);
        case UNIT_TYPE.ANGLE:
            return new Unit.UnitAngle(data);
        case UNIT_TYPE.PIR:
            return new Unit.UnitPIR(data);
        case UNIT_TYPE.NEOPIXEL:
            return new Unit.UnitNeopixel(data);
        case UNIT_TYPE.JOYSTICK:
            return new Unit.UnitJoystick(data);
        case UNIT_TYPE.LIGHT:
            return new Unit.UnitLight(data);
        case UNIT_TYPE.EARTH:
            return new Unit.UnitEarth(data);
        case UNIT_TYPE.MAKEY:
            return new Unit.UnitMakey(data);
        case UNIT_TYPE.SERVO:
            return new Unit.UnitServo(data);
        case UNIT_TYPE.WEIGH:
            return new Unit.UnitWeigh(data);
        case UNIT_TYPE.PULSE:
            return new Unit.UnitPulse(data);
            case UNIT_TYPE.TRACK:
            return new Unit.UnitTrack(data);
            case UNIT_TYPE.TPNX:
            return new Unit.Unit396(data);
            case UNIT_TYPE.ADC:
            return new Unit.UnitADC(data);
            case UNIT_TYPE.BUTTON:
            return new Unit.UnitButton(data);
            case UNIT_TYPE.COLOR:
            return new Unit.UnitADC(data);
            case UNIT_TYPE.DAC:
            return new Unit.UnitDac(data);
            case UNIT_TYPE.DUALBUTTON:
            return new Unit.UnitDualButton(data);
            case UNIT_TYPE.HUB:
            return new Unit.UnitHub(data);
            case UNIT_TYPE.IR:
            return new Unit.UnitIR(data);
            case UNIT_TYPE.M5CAMEAR:
            return new Unit.UnitM5Camera(data);
            case UNIT_TYPE.NCIR:
            return new Unit.UnitNicr(data);
            case UNIT_TYPE.PROTO:
            return new Unit.UnitProto(data);
            case UNIT_TYPE.RELAY:
            return new Unit.UnitRelay(data);
            case UNIT_TYPE.RGB:
            return new Unit.UnitRGB(data);
            case UNIT_TYPE.THERMAL:
            return new Unit.UnitThermal(data);
            case UNIT_TYPE.TOF:
            return new Unit.UnitTOF(data);
            case UNIT_TYPE.TRACK:
            return new Unit.UnitTrack(data);
            case UNIT_TYPE.EXTIO:
            return new Unit.UnitExtio(data);           
        }
}

/**
 * 兼容旧版M5F文件 Component部分
 * @param component 旧版组件实例
 */
export const updateOldComponent = (component: any) => {
    switch(component.type) {
        case 'button':
            return new ButtonComponent({
                name: component.name === 'button0' ? 'ButtonA' : component.name === 'button1' ? 'ButtonB' : 'ButtonC',
                buttonIndex: component.name === 'button0' ? ButtonIndex.A : component.name === 'button1' ? ButtonIndex.B : ButtonIndex.C,
                text: component.text,
                visibility: component.visibility
            });
        case 'title':
            return new TitleComponent({
                name: component.name,
                layer: component.layer,
                text: component.text,
                backgroundColor: component.backgroundColor,
                color: component.color
            });
        case 'label':
            return new LabelComponent({
                name: component.name,
                layer: component.layer,
                text: component.text,
                x: component.x,
                y: component.y,
                color: component.color
            });
        case 'rect':
            return new RectangleComponent({
                name: component.name,
                layer: component.layer,
                x: component.x,
                y: component.y,
                width: component.width,
                height: component.height,
                borderColor: component.borderColor,
                backgroundColor: component.backgroundColor
            });
        case 'circle':
            return new CircleComponent({
                name: component.name,
                layer: component.layer,
                x: component.x,
                y: component.y,
                radius: component.radius,
                borderColor: component.borderColor,
                backgroundColor: component.backgroundColor
            });
        case 'image':
            return new ImageComponent({
                name: component.name,
                layer: component.layer,
                x: component.x,
                y: component.y,
                imagePath: 'default.jpg'
            });
    }
}

/**
 * 兼容旧版M5F文件 Unit部分
 * @param data 旧版Unit实例
 */
export const updateOldUnit = (data) => {
    switch(data.name) {
        case 'ENV':
            return new Unit.UnitEnv({ name: data.varname, port: data.defaultPort });
        case 'Angle':
            return new Unit.UnitAngle({ name: data.varname, port: data.defaultPort });
        case 'PIR':
            return new Unit.UnitPIR({ name: data.varname, port: data.defaultPort });
        case 'Neopixel':
            return new Unit.UnitNeopixel({ name: data.varname, port: data.defaultPort, count: data.count });
        case 'Joystick':
            return new Unit.UnitJoystick({ name: data.varname, port: data.defaultPort });
        case 'Light':
            return new Unit.UnitLight({ name: data.varname, port: data.defaultPort });
        case 'Earth':
            return new Unit.UnitEarth({ name: data.varname, port: data.defaultPort });
        case 'Makey':
            return new Unit.UnitMakey({ name: data.varname, port: data.defaultPort });
        case 'Servo':
            return new Unit.UnitServo({ name: data.varname, port: data.defaultPort });
        case 'Weigh':
            return new Unit.UnitWeigh({ name: data.varname, port: data.defaultPort });
        case 'Pulse':
            return new Unit.UnitPulse({ name: data.varname, port: data.defaultPort });      
    }
}