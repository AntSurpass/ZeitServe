export const TYPE_ALIAS = {
    TITLE: 'title',
    LABEL: 'label',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    IMAGE: 'image',
    SCREEN: 'screen',
    BUTTON: 'button'
};

export const COMPONENT_ALIAS = {
    ID: 'id',
    NAME: 'name',
    COLOR: 'color',
    BORDER_COLOR: 'borderColor',
    BACKGROUND_COLOR: 'backgroundColor',
    TEXT: 'text',
    LAYER: 'layer',
    CREATE_TIME: 'createTime',
    TYPE: 'type',
    X: 'x',
    Y: 'y',
    FONT: 'font',
    WIDTH: 'width',
    HEIGHT: 'height',
    RADIUS: 'radius',
    IMAGE_PATH: 'imagePath',
    IMAGE_WIDTH: 'imageWidth',
    IMAGE_HEIGHT: 'imageHeight',
    VISIBILITY: 'visibility',
    BACKGROUND_IMAGE: 'backgroundImage'
};

export const FONT_ALIAS = {
    DEFAULT: 'lcd.FONT_Default',
    DEFAULT_SMALL: 'lcd.FONT_DefaultSmall',
    UBUNTU_C: 'lcd.FONT_Ubuntu',
    COMIC: 'lcd.FONT_Comic',
    DEJAVUSANS: 'lcd.FONT_DejaVu24',
    DEJAVUSANS_SMALL: 'lcd.FONT_DejaVu18',
    DEJAVUSANS_18PX: 'lcd.FONT_DejaVu18',
    DEJAVUSANS_24PX: 'lcd.FONT_DejaVu24',
    DEJAVUSANS_40PX: 'lcd.FONT_DejaVu40',
    DEJAVUSANS_56PX: 'lcd.FONT_DejaVu56',
    DEJAVUSANS_72PX: 'lcd.FONT_DejaVu72'
};

export const PORT = {
    A: 'A',
    B: 'B',
    C: 'C'
};

export const UNIT_TYPE = {
    ENV: 'env',
    ANGLE: 'angle',
    PIR: 'pir',
    NEOPIXEL: 'neopixel',
    JOYSTICK: 'joystick',
    LIGHT: 'light',
    EARTH: 'earth',
    MAKEY: 'makey',
    SERVO: 'servo',
    WEIGH: 'weigh',
    PULSE: 'pulse',
    TRACK: 'track',
    TPNX: '3.96',

    ADC: 'adc',
    BUTTON: 'button',
    COLOR: 'color',
    DAC: 'dac',
    DUALBUTTON: 'dual_button',
    HUB: 'hub',
    IR: 'ir',
    M5CAMEAR: 'm5camera',
    NCIR: 'ncir',
    PROTO: 'proto',
    RELAY: 'relay',
    RGB: 'rgb',
    THERMAL: 'thermal',
    TOF: 'tof',
    EXTIO: 'ext_io',
    FINGER: 'finger',
    RFID: 'rfid',
    LIDARCAR: 'lidarcar',
    CARDKB: 'cardkb'
};

export const MODE = {
    BLOCKLY: 'blockly',
    CODE: 'code'
};

export enum DYNAMIC_COMPONENT_TYPE {
    UNIT_MODAL,
    SETTING_PANEL,
    RESOURCE_MANAGER
};

export const LANG = [
    {
        name: 'English',
        file: 'en'
    },
    {
        name: '简体中文',
        file: 'zh-hans'
    },
    {
        name: 'Русский язык',
        file: 'ru'
    },
    {
        name: 'Español',
        file: 'es'
    },
    {
        name: '日本語',
        file: 'ja'
    },
    {
        name: '한국어',
        file: 'ko'
    },
    {
        name: 'ไทย',
        file: 'th'
    }
];

export const CONNECT_STATUS = {
    DISCONNECTED: 'DISCONNECTED',
    CONNECTED: 'CONNECTED',
    CONNECTING: 'CONNECTING'
};

export const LOCALSTORAGE_KEY = {
    API_KEY: 'mui_apikey',
    LANGUAGE: 'mui_language'
};

export const MESSAGE_TYPE = {
    WARNING: 'warning',
    SUCCESS: 'success',
    ERROR: 'error',
    LOADING: 'loading'
};

export const EXAMPLES = [
    {
        icon: 'WeatherStation.jpg',
        title: 'Weather Station',
        description: 'Display temperature, humidity, atmospheric pressure values, different animations based on humidity values',
        required: [
            {
                unit: 'ENV',
                port: 'A'
            }
        ],
        file: 'WeatherStation.m5f',
        others: []
    },
    {
        icon: 'BreathingRGB.jpg',
        title: 'Breathing RGB',
        description: 'The RGB bar on both sides of the fuselage is like breathing, gradually lighting up and gradually extinguishing, and changing color',
        required: [],
        file: 'BreathingRGB.m5f',
        others: []
    },
    {
        icon: 'Neopixel.jpg',
        title: 'Neopixel',
        description: 'The neopixel flow is lit and extinguished, and the color of the light is randomly changed to achieve the effect of the marquee',
        required: [
            {
                unit: 'Neopixel',
                port: 'A'
            }
        ],
        file: 'Neopixel.m5f',
        others: []
    },
    {
        icon: 'PIR.jpg',
        title: 'PIR',
        description: 'When the human body is detected, the RGB bar is lit and the speaker emits a sound',
        required: [
            {
                unit: 'PIR',
                port: 'B'
            }
        ],
        file: 'PIR.m5f',
        others: []
    },
    {
        icon: 'Earth.png',
        title: 'Earth',
        description: 'Detect soil moisture and display it on the screen',
        required: [
            {
                unit: 'Earth',
                port: 'B'
            }
        ],
        file: 'Earth.m5f',
        others: []
    },
    {
        icon: 'Remote.jpg',
        title: 'Remote',
        description: 'Remote control of RGB bar lighting and extinction, and brightness control via mobile phone or computer',
        required: [],
        file: 'Remote.m5f',
        others: [
            'Scan the screen or the QR code of the UIFlow menu bar to enter the control page'
        ]
    },
    {
        icon: 'Charge.jpg',
        title: 'Battery Animation',
        description: 'Use different size square elements to piece together the shape of the battery, change the color of the square by program, and create an animation of battery charging',
        required: [],
        file: 'Charge.m5f',
        others: []
    },
    {
        icon: 'Joystick.jpg',
        title: 'Joystick',
        description: 'Use the joystick to control the circular movement on the screen, press the rocker to make the circle animate',
        required: [
            {
                unit: 'Joystick',
                port: 'A'
            }
        ],
        file: 'Joystick.m5f',
        others: []
    },
    {
        icon: 'Light.jpg',
        title: 'Light',
        description: 'According to the ambient light intensity, the switch light is controlled to turn on the light at night and turn off the light during the day',
        required: [
            {
                unit: 'Light',
                port: 'B'
            }
        ],
        file: 'Light.m5f',
        others: []
    },
    {
        icon: 'ToF.jpg',
        title: 'ToF',
        description: 'By laser ranging, the distance from the sensor to the object is detected. When the distance is lower than the set value and closer, an alarm of different frequency will be issued according to the distance',
        required: [
            {
                unit: 'ToF',
                port: 'A'
            }
        ],
        file: 'ToF.m5f',
        others: []
    },
    {
        icon: 'RGB.jpg',
        title: 'Traffic light',
        description: 'Controls the three lights on the RGB Unit, changes regularly like a traffic light, and displays a countdown on the screen',
        required: [
            {
                unit: 'RGB',
                port: 'B'
            }
        ],
        file: 'RGB.m5f',
        others: []
    },
    {
        icon: 'servoTest.jpg',
        title: 'Servo tester',
        description: 'Manual Mode: You can set RC servo from 0 to 180 degree.(10 degree per step.)  Center Mode: This mode will lock servo at 90 degree  Sweep Mode: This mode will loop sweeping servo to 0, 90 and 180 degree then sweep back to 90 and 0 degree',
        required: [
            {
                unit: 'Servo',
                port: 'A'
            }
        ],
        file: 'servoTester.m5f',
        others: [],
        author: 'pattiuak'
    },
    {
        icon: 'Neoflash.png',
        title: 'Neoflash',
        description: 'After reboot，breathing led. Then enter the detection mode, once the pir detected any object past in front, one led light up. After button press and the pir detect no object past,turn off all of the led.',
        required: [
            {
                unit: 'Neoflash',
                port: 'A'
            }
        ],
        file: 'Neoflash.m5f',
        others: []
    },
    {
        icon: 'Remote1.jpg',
        title: 'Remote1',
        description: 'The Remote block is featured with network function based on MQTT protocol,you can control your M5 remotely on a web page Just by scan the QRcode generate by your program,call firmware interface through mqtt push on control page to remotely control your M5.',
        required: [
            {
                unit: 'ENV',
                port: 'A'
            }
        ],
        file: 'Remote1.m5f',
        others: []
    },
    {
        icon: 'FlashCard.jpg',
        title: 'Flash Card',
        description: 'After start the device, display the title and the content of the flashcard.In this instance we have ‘M5 Flash Card Real estate Terms Chapter 1 The button A and C ,which are located on the side the device  ,is functional for go through the list of the terms And the button B is used to flip it,just like a flash card u have words on one side and the explanation on the other side.',
        required: [
        ],
        file: 'FlashCard.m5f',
        others: []
    }
];
