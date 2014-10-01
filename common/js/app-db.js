var APP_PARAMS = {
    cottage: {
        minArea: 50,
        maxArea: 300,
        step: 5
    },
    room: {
        roomNames:[
                ['Кухня', 'Гостиная', 'Санузел', 'Прихожая', 'Спальня 1', 'Ванная', 'Спальня 2', 'Коридор', 'Спальня 3', 'Спальня 4', 'Спальня 5', 'Спальня 6'],
                ['Спальня 1', 'Спальня 2', 'Спальня 3', 'Санузел', 'Ванная', 'Гостиная', 'Спальня 4', 'Коридор', 'Спальня 5', 'Спальня 6', 'Спальня 7', 'Спальня 8'],
                ['Спальня 1', 'Спальня 2', 'Спальня 3', 'Санузел', 'Ванная', 'Гостиная', 'Спальня 4', 'Коридор', 'Спальня 5', 'Спальня 7', 'Спальня 8', 'Спальня 9']
        ],
        radiators: {
            controlType: [
                {id: 1, name: 'На радиаторе'},
                {id: 2, name: 'Общее в комнате'}
            ],
            connectSide: [
                {id: 1, name: 'Левая'},
                {id: 2, name: 'Правая'}
            ],
            type: [
                {id: 1, name: 'Стандартный'},
                {id: 2, name: 'Дизайн'}
            ],
            connection: [
                {id: 1, name: 'Боковое'},
                {id: 2, name: 'Нижнее'}
            ],
            builtinValve: [
                {id: 1, connection: [1,2], name: 'Нет'},
                {id: 2, connection: 2, name: 'Клипсовый RA'},
                {id: 3, connection: 2, name: 'Резьбовой M30x1,5'}
            ],
            pipework: [
                { id: 1, connection: [1, 2], name: 'В полу' },
                { id: 2, connection: [1, 2], name: 'В стене' },
                { id: 3, connection: 1, name: 'В коробе'}
            ],
            use: [
                {id: 1, name: 'Радиатор'},
                {id: 2, name: 'Полотенцесушитель'}
            ],
            control: [
                { id: 1, builtinValve: [1, 2], previewPrefix: 'living_Eco', preview:'config-prod-living-eco.png', controlType: 1, name: 'Living eco RA', basket: [['014G0050', 1]] },
                { id: 2, builtinValve: [1, 2], previewPrefix: 'RA2994', controlType: 1, preview: 'config-prod-ra.png', name: 'RA2994', basket: [['013G2994', 1]] },
                { id: 3, builtinValve: 3, previewPrefix: 'living_Eco', controlType: 1, preview: 'config-prod-living-eco.png', name: 'Living eco RA+K', basket: [['014G0052', 1]] },
                { id: 4, builtinValve: 3, previewPrefix: 'RAW-K', controlType: 1, preview: 'config-prod-ra.png', name: 'RAW-K', basket: [['013G5030', 1]] },
                { id: 5, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-3.png', name: 'Простой', basket: [['087N1110', '1/_radiator.count'], ['088H3112', '1', 'radiator-collector'], ['088H0016', 1 / 8, 'radiator-collector']] },
                { id: 6, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-1.png', name: 'Программируемый', basket: [['087N791801', '1/_radiator.count'], ['088H3112', '1', 'radiator-collector'], ['088H0016', 1/8, 'radiator-collector']] },
                { id: 7, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-2-wi.png', name: 'Простой беспроводной', basket: [['087N7270', '1/_radiator.count'], ['087N7478', '1/3', 'radiator-collector'], ['088H3112', '1', 'radiator-collector']] },
                { id: 8, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-1-wi.png', name: 'Программируемый беспроводной', basket: [['087N791301', '1/_radiator.count'], ['087N7478', '1/3', 'radiator-collector'], ['088H3112', '1', 'radiator-collector']] }
            ],
            externalView: [ // Исполнение
                { id: 1, name: 'Никелированный' },
                { id: 2, name: 'Прессовое соединение' },
                { id: 3, name: 'Хромированный' },
                { id: 4, name: 'Радиатор G1/2"' },
                { id: 5, name: 'Радиатор G3/4"' },
                { id: 6, name: 'Холодно белый' },
                { id: 7, name: 'Нержавеющая сталь' }
            ],
            side: [ // сторона
                {id: 1, name: 'Радиатор'},
                {id: 2, name: 'Полотенцесушитель'}
            ],
            valves: [
                { id: 1,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '6_11', externalView: 1, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G0153 RA-N UK никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0153', 1], ['003L0143', 1]] },
                { id: 2,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '6_11', externalView: 2, connectSide: 0, fittingsType: 0, control: [1, 2], name: '013G3239 RA-N UK никелированный press + 003L1825 RLV, угловой, никелированный press', basket: [['013G3239', 1], ['003L1825', 1]] },
                { id: 3,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7_11', externalView: 1, connectSide: 1, fittingsType: 1, control: [1, 2], name: '013G0234 RA-N трехосеваой левый, никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0234', 1], ['003L0143', 1]] },
                { id: 4,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7_11', externalView: 3, connectSide: 1, fittingsType: 1, control: [1, 2], name: '013G4240 RA-NCX трехосеваой левый, хромированный + 003L0273 RLV-CX, угловой, хромированный', basket: [['013G4240', 1], ['003L0273', 1]] },
                { id: 5,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7_11', externalView: 1, connectSide: 2, fittingsType: 1, control: [1, 2], name: '013G0233 RA-N трехосеваой правый, никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0233', 1], ['003L0143', 1]] },
                { id: 6,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7_11', externalView: 3, connectSide: 2, fittingsType: 1, control: [1, 2], name: '013G4239 RA-NCX трехосеваой правый, хромированный + 003L0273 RLV-CX, угловой, хромированный', basket: [['013G4239', 1], ['003L0273', 1]] },
                { id: 7,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '12', externalView: 0, connectSide: 0, fittingsType: 2, control: [1, 2], name: '013G3363 Клапан RA-K + 013G3378 Соединительная трубка 650 мм + 013G3367 Присоединительная деталь RA-K, в пол', basket: [['013G3363', 1], ['013G3378', 1], ['013G3367', 1]] },
                { id: 8,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '14', externalView: 0, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G3215 Гарнитура RA 15/6TB', basket: [['013G3215', 1]] },
                { id: 9,  type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 2, preview: '8_11', externalView: 1, connectSide: 0, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0143 RLV, угловой, никелированный - 2 шт.', basket: [['003L0143', 2]] },
                { id: 10, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 2, preview: '8_11', externalView: 3, connectSide: 0, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0273 RLV-CX, угловой, хромированный - 2 шт.', basket: [['003L0273', 2]] },
                { id: 11, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 2, preview: '8_11', externalView: 2, connectSide: 0, fittingsType: 0, control: [5, 6, 7, 8], name: '003L1825 RLV, угловой, никелированный press - 2 шт.', basket: [['003L1825', 2]] },
                { id: 12, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '3_10', externalView: 1, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G3903 RA-N угловой, никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G3903', 1], ['003L0273', 1]] },
                { id: 13, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '3_10', externalView: 3, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G4247 RA-N NCX хромированный + 003L0273 RLV-CX, угловой, хромированный', basket: [['013G4247', 1], ['003L0273', 1]] },
                { id: 14, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '3_10', externalView: 2, connectSide: 0, fittingsType: 0, control: [1, 2], name: '013G3237 RA-N угловой, никелированный press + 003L1825 RLV, угловой, никелированный press', basket: [['013G3237', 1], ['003L1825', 1]] },
                { id: 15, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '5_10', externalView: 1, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G0153 RA-N UK никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0153', 1], ['003L0143', 1]] },
                { id: 16, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '5_10', externalView: 2, connectSide: 0, fittingsType: 0, control: [1, 2], name: '013G3239 RA-N UK никелированный press + 003L1825 RLV, угловой, никелированный press', basket: [['013G3239', 1], ['003L1825', 1]] },
                { id: 17, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '13', externalView: 0, connectSide: 0, fittingsType: 2, control: [1, 2], name: '013G3363 Клапан RA-K + 013G3378 Соединительная трубка 650 мм + 013G3369 Присоединительная деталь RA-KW, в стену', basket: [['013G3363', 1], ['013G3378', 1], ['013G3369', 1]] },
                { id: 18, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '15', externalView: 0, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G3215 Гарнитура RA 15/6TB', basket: [['013G3215', 1]] },
                { id: 19, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 2, preview: '4_10', externalView: 1, connectSide: 0, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0143 RLV, угловой, никелированный - 2 шт.', basket: [['003L0143', 2]] },
                { id: 20, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 2, preview: '4_10', externalView: 3, connectSide: 0, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0273 RLV-CX, угловой, хромированный - 2 шт.', basket: [['003L0273', 2]] },
                { id: 21, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 2, preview: '4_10', externalView: 2, connectSide: 0, fittingsType: 0, control: [5, 6, 7, 8], name: '003L1825 RLV, угловой, никелированный press - 2 шт.', basket: [['003L1825', 2]] },
                { id: 22, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 1, preview: '1_9', externalView: 1, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G3904 RA-N прямой, никелированный + 003L0144 RLV, прямой, никелированный', basket: [['013G3904', 1], ['003L0144', 1]] },
                { id: 23, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 1, preview: '1_9', externalView: 3, connectSide: 0, fittingsType: 1, control: [1, 2], name: '013G4248 RA-NCX прямой, хромированный + 003L0274 RLV-CX, прямой, хромированный', basket: [['013G4248', 1], ['003L0274', 1]] },
                { id: 24, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 1, preview: '1_9', externalView: 2, connectSide: 0, fittingsType: 0, control: [1, 2], name: '013G3238 RA-N прямой, никелированный, press + 003L1824 RLV, прямой, никелированный, press', basket: [['013G3238', 1], ['003L1824', 1]] },
                { id: 25, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 2, preview: '2_9', externalView: 1, connectSide: 0, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0144 RLV, прямой, никелированный - 2 шт.', basket: [['003L0144', 2]] },
                { id: 26, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 2, preview: '2_9', externalView: 3, connectSide: 0, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0274 RLV-CX, прямой, хромированный - 2 шт.', basket: [['003L0274', 2]] },
                { id: 27, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 2, preview: '2_9', externalView: 2, connectSide: 0, fittingsType: 0, control: [5, 6, 7, 8], name: '003L1824 RLV, прямой, никелированный, press - 2 шт.', basket: [['003L1824', 2]] },
                { id: 28, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 1, preview: '19', externalView: 4, connectSide: 0, fittingsType: 2, control: [1, 2], name: '013G4742 Гарнитура VHS15 прямая, вход G1/2, выход R3/4', basket: [['013G4742', 1]] },
                { id: 29, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 1, preview: '19', externalView: 5, connectSide: 0, fittingsType: 2, control:[1,2], name:'013G4744 Гарнитура VHS15 прямая, вход G3/4, выход G3/4', basket:[['013G4744',1]]},
                { id: 30, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 1, preview: '19', externalView: -1, connectSide: 0, fittingsType: 2, control: [1, 2], name: '013G4742 Гарнитура VHS15 прямая, вход G1/2, выход R3/4', basket: [['013G4742', 1]] },
                { id: 31, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 2, preview: '17', externalView: 4, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 32, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 2, preview: '17', externalView: 5, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                { id: 33, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 2, preview: '17', externalView: -1, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 34, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 1, preview: '20', externalView: 4, connectSide: 0, fittingsType: 2, control: [1, 2], name: '013G4741 Гарнитура VHS15 угловая, вход G1/2, выход R3/4', basket: [['013G4741', 1]] },
                { id: 35, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 1, preview: '20', externalView: 5, connectSide: 0, fittingsType: 2, control: [1, 2], name: '013G4743 Гарнитура VHS15 угловая, вход G3/4, выход G3/4', basket: [['013G4743', 1]] },
                { id: 36, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 1, preview: '20', externalView: -1, connectSide: 0, fittingsType: 2, control: [1, 2], name: '013G4741 Гарнитура VHS15 угловая, вход G1/2, выход R3/4', basket: [['013G4741', 1]] },
                { id: 37, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 2, preview: '18', externalView: 4, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 38, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 2, preview: '18', externalView: 5, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                { id: 39, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 2, preview: '18', externalView: -1, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 40, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 1, preview: '16_17', externalView: 4, connectSide: 0, fittingsType: 2, control: [1, 2], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 41, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 1, preview: '16_17', externalView: 5, connectSide: 0, fittingsType: 2, control: [1, 2], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                { id: 42, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 1, preview: '16_17', externalView: -1, connectSide: 0, fittingsType: 2, control: [1, 2], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 43, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 2, preview: '17', externalView: 4, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 44, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 2, preview: '17', externalView: 5, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                { id: 45, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 2, preview: '17', externalView: -1, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 46, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 1, preview: '16_18', externalView: 4, connectSide: 0, fittingsType: 2, control: [1, 2], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 47, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 1, preview: '16_18', externalView: 5, connectSide: 0, fittingsType: 2, control: [1, 2], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                { id: 48, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 1, preview: '16_18', externalView: -1, connectSide: 0, fittingsType: 2, control: [1, 2], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 49, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 2, preview: '18', externalView: 4, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 50, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 2, preview: '18', externalView: 5, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                { id: 51, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 2, preview: '18', externalView: -1, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 52, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 1, preview: '16_17', externalView: 4, connectSide: 0, fittingsType: 2, control: [3, 4], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 53, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 1, preview: '16_17', externalView: 5, connectSide: 0, fittingsType: 2, control: [3, 4], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                { id: 54, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 1, preview: '16_17', externalView: -1, connectSide: 0, fittingsType: 2, control: [3, 4], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 55, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 2, preview: '17', externalView: 4, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 56, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 2, preview: '17', externalView: 5, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                { id: 57, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 2, preview: '17', externalView: -1, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                { id: 58, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 1, preview: '16_18', externalView: 4, connectSide: 0, fittingsType: 2, control: [3, 4], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 59, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 1, preview: '16_18', externalView: 5, connectSide: 0, fittingsType: 2, control: [3, 4], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                { id: 60, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 1, preview: '16_18', externalView: -1, connectSide: 0, fittingsType: 2, control: [3, 4], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 61, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 2, preview: '18', externalView: 4, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                { id: 62, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 2, preview: '18', externalView: 5, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                { id: 63, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 2, preview: '18', externalView: -1, connectSide: 0, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },

                { id: 64, type: 2, use: 1, fittingsType: 1, connectSide: 2, externalView: 3, preview: 'x_design_rad', name: '013G4003 RAX set Хромированный, для подключения терморегулятора справа, запорного клапана слева', basket: [['013G4003', 1]] },
                { id: 65, type: 2, use: 1, fittingsType: 1, connectSide: 1, externalView: 3, preview: 'x_design_rad', name: '013G4004 RAX set Хромированный, для подключения терморегулятора слева, запорного клапана справа', basket: [['013G4004', 1]] },
                { id: 66, type: 2, use: 1, fittingsType: 1, connectSide: 2, externalView: 6, preview: 'x_design_rad', name: '013G4007 RAX set Холодно-белый (RAL 9016), для подключения терморегулятора справа, запорного клапана слева', basket: [['013G4007', 1]] },
                { id: 67, type: 2, use: 1, fittingsType: 1, connectSide: 1, externalView: 6, preview: 'x_design_rad', name: '013G4008 RAX set Холодно-белый (RAL 9016), для подключения терморегулятора слева, запорного клапана справа', basket: [['013G4008', 1]] },
                { id: 68, type: 2, use: 1, fittingsType: 1, connectSide: 1, externalView: 7, preview: 'x_design_rad', name: '013G4009 RAX set Нержавеющая сталь, для подключения терморегулятора справа, запорного клапана слева', basket: [['013G4009', 1]] },
                { id: 69, type: 2, use: 1, fittingsType: 1, connectSide: 2, externalView: 7, preview: 'x_design_rad', name: '013G4010 RAX set Нержавеющая сталь, для подключения терморегулятора слева, запорного клапана справа', basket: [['013G4010', 1]] },
                    // Полотенцесушитель
                { id: 70, type: 2, use: 2, fittingsType: 1, connectSide: 2, externalView: 3, preview: 'x_design_towel', name: 'RTX set, хромированный, для подключения терморегулятора справа, запорного клапана слева: 013G4132', basket: [['013G4132', 1]] },
                { id: 71, type: 2, use: 2, fittingsType: 1, connectSide: 1, externalView: 3, preview: 'x_design_towel', name: 'RTX set, хромированный, для подключения терморегулятора слева, запорного клапана справа: 013G4133', basket: [['013G4133', 1]] },
                { id: 72, type: 2, use: 2, fittingsType: 1, connectSide: 2, externalView: 6, preview: 'x_design_towel', name: 'RTX set, холодно-белый (RAL 9016), для подключения терморегулятора справа, запорного клапана слева: 013G4136', basket: [['013G4136', 1]] },
                { id: 73, type: 2, use: 2, fittingsType: 1, connectSide: 1, externalView: 6, preview: 'x_design_towel', name: 'RTX set, холодно-белый (RAL 9016), для подключения терморегулятора слева, запорного клапана справа: 013G4137', basket: [['013G4137', 1]] },
                { id: 74, type: 2, use: 2, fittingsType: 1, connectSide: 2, externalView: 7, preview: 'x_design_towel', name: 'RTX set, нержавеющая сталь, для подключения терморегулятора справа, запорного клапана слева: 013G4138', basket: [['013G4138', 1]] },
                { id: 75, type: 2, use: 2, fittingsType: 1, connectSide: 1, externalView: 7, preview: 'x_design_towel', name: 'RTX set, нержавеющая сталь, для подключения терморегулятора слева, запорного клапана справа: 013G4139', basket: [['013G4139', 1]] }
            ]
        },
        floors: {
            control: [
                /*{id: 1, type: 1, name: 'С управлением по температуре воздуха в помещении', basket: [['003L1001', 1],['013G2994', 1]]}, - СНЯТ С ПРОИЗВОДСТВА */
                { id: 1, type: 1, name: 'Механическое', preview: 'config-prod-termo-4.png', basket: [['003L1000', 1],['003L1040', 1]]},
                // 
                { id: 2, type: 2, name: 'Проводное с датчиком', preview: 'config-prod-termo-1.png', basket: [['087N791801', 1], ['087N6784', 1], ['088H3112', '_room.floors.loops', 'floor-collector'], ['088H0016', 1/8, 'floor-collector']] },
                { id: 3, type: 2, name: 'Беспроводное с датчиком', preview: 'config-prod-termo-1-wi.png', basket: [['087N791301', 1], ['087N6784', 1], ['087N7478', '1/3', 'floor-collector'], ['088H3112', '_room.floors.loops', 'floor-collector']] }
            ]
        }
    },
    collector: {
        sets: [
            { id: 1,  isFlowmeter: false, entries: 2, name:  'FHF-2 set: 088U0702', basket: [['088U0702', 1]]},
            { id: 2,  isFlowmeter: false, entries: 3, name:  'FHF-3 set: 088U0703', basket: [['088U0703', 1]]},
            { id: 3,  isFlowmeter: false, entries: 4, name:  'FHF-4 set: 088U0704', basket: [['088U0704', 1]]},
            { id: 4,  isFlowmeter: false, entries: 5, name:  'FHF-5 set: 088U0705', basket: [['088U0705', 1]]},
            { id: 5,  isFlowmeter: false, entries: 6, name:  'FHF-6 set: 088U0706', basket: [['088U0706', 1]]},
            { id: 6,  isFlowmeter: false, entries: 7, name:  'FHF-7 set: 088U0707', basket: [['088U0707', 1]]},
            { id: 7,  isFlowmeter: false, entries: 8, name:  'FHF-8 set: 088U0708', basket: [['088U0708', 1]]},
            { id: 8,  isFlowmeter: false, entries: 9, name:  'FHF-9 set: 088U0709', basket: [['088U0709', 1]]},
            { id: 9,  isFlowmeter: false, entries: 10, name: 'FHF-10 set: 088U0710', basket: [['088U0710', 1]]},
            { id: 10, isFlowmeter: false, entries: 11, name: 'FHF-11 set: 088U0711', basket: [['088U0711', 1]]},
            { id: 11, isFlowmeter: false, entries: 12, name: 'FHF-12 set: 088U0712', basket: [['088U0712', 1]]},
            { id: 12, isFlowmeter: true, entries: 2, name:  'FHF-2 set: 088U0722', basket: [['088U0722', 1]]},
            { id: 13, isFlowmeter: true, entries: 3, name:  'FHF-3 set: 088U0723', basket: [['088U0723', 1]]},
            { id: 14, isFlowmeter: true, entries: 4, name:  'FHF-4 set: 088U0724', basket: [['088U0724', 1]]},
            { id: 15, isFlowmeter: true, entries: 5, name:  'FHF-5 set: 088U0725', basket: [['088U0725', 1]]},
            { id: 16, isFlowmeter: true, entries: 6, name:  'FHF-6 set: 088U0726', basket: [['088U0726', 1]]},
            { id: 17, isFlowmeter: true, entries: 7, name:  'FHF-7 set: 088U0727', basket: [['088U0727', 1]]},
            { id: 18, isFlowmeter: true, entries: 8, name:  'FHF-8 set: 088U0728', basket: [['088U0728', 1]]},
            { id: 19, isFlowmeter: true, entries: 9, name:  'FHF-9 set: 088U0729', basket: [['088U0729', 1]]},
            { id: 20, isFlowmeter: true, entries: 10, name: 'FHF-10 set: 088U0730', basket: [['088U0730', 1]]},
            { id: 21, isFlowmeter: true, entries: 11, name: 'FHF-11 set: 088U0731', basket: [['088U0731', 1]]},
            { id: 22, isFlowmeter: true, entries: 12, name: 'FHF-12 set: 088U0732', basket: [['088U0732', 1]]},
            { id: 23, isFlowmeter: false, entries: 13, name: 'FHF-7 set: 088U0707 + FHF-6: 088U0506 + FHF-C: 088U0583', basket: [['088U0707', 1], ['088U0506', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 24, isFlowmeter: false, entries: 14, name: 'FHF-7 set: 088U0707 + FHF-7: 088U0507 + FHF-C: 088U0583', basket: [['088U0707', 1], ['088U0507', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 25, isFlowmeter: false, entries: 15, name: 'FHF-8 set: 088U0708 + FHF-7: 088U0507 + FHF-C: 088U0583', basket: [['088U0708', 1], ['088U0507', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 26, isFlowmeter: false, entries: 16, name: 'FHF-8 set: 088U0708 + FHF-8: 088U0508 + FHF-C: 088U0583', basket: [['088U0708', 1], ['088U0508', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 27, isFlowmeter: false, entries: 17, name: 'FHF-9 set: 088U0709 + FHF-8: 088U0508 + FHF-C: 088U0583', basket: [['088U0709', 1], ['088U0508', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 28, isFlowmeter: false, entries: 18, name: 'FHF-9 set: 088U0709 + FHF-9: 088U0509 + FHF-C: 088U0583', basket: [['088U0709', 1], ['088U0509', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 29, isFlowmeter: false, entries: 19, name: 'FHF-10 set: 088U0710 + FHF-9: 088U0509 + FHF-C: 088U0583', basket: [['088U0710', 1], ['088U0509', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 30, isFlowmeter: false, entries: 20, name: 'FHF-10 set: 088U0710 + FHF-10: 088U0510 + FHF-C: 088U0583', basket: [['088U0710', 1], ['088U0510', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 31, isFlowmeter: false, entries: 21, name: 'FHF-11 set: 088U0711 + FHF-10: 088U0510 + FHF-C: 088U0583', basket: [['088U0711', 1], ['088U0510', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 32, isFlowmeter: false, entries: 22, name: 'FHF-11 set: 088U0711 + FHF-11: 088U0511 + FHF-C: 088U0583', basket: [['088U0711', 1], ['088U0511', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 33, isFlowmeter: false, entries: 23, name: 'FHF-12 set: 088U0712 + FHF-11: 088U0511 + FHF-C: 088U0583', basket: [['088U0712', 1], ['088U0511', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 34, isFlowmeter: false, entries: 24, name: 'FHF-12 set: 088U0712 + FHF-12: 088U0512 + FHF-C: 088U0583', basket: [['088U0712', 1], ['088U0512', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 35, isFlowmeter: true, entries: 13, name: 'FHF-7F set: 088U0727 + FHF-6F: 088U0526 + FHF-C: 088U0583', basket: [['088U0727', 1], ['088U0526', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 36, isFlowmeter: true, entries: 14, name: 'FHF-7F set: 088U0727 + FHF-7F: 088U0527 + FHF-C: 088U0583', basket: [['088U0727', 1], ['088U0527', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 37, isFlowmeter: true, entries: 15, name: 'FHF-8F set: 088U0728 + FHF-7F: 088U0527 + FHF-C: 088U0583', basket: [['088U0728', 1], ['088U0527', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 38, isFlowmeter: true, entries: 16, name: 'FHF-8F set: 088U0728 + FHF-8F: 088U0528 + FHF-C: 088U0583', basket: [['088U0728', 1], ['088U0528', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 39, isFlowmeter: true, entries: 17, name: 'FHF-9F set: 088U0729 + FHF-8F: 088U0528 + FHF-C: 088U0583', basket: [['088U0729', 1], ['088U0528', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 40, isFlowmeter: true, entries: 18, name: 'FHF-9F set: 088U0729 + FHF-9F: 088U0529 + FHF-C: 088U0583', basket: [['088U0729', 1], ['088U0529', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 41, isFlowmeter: true, entries: 19, name: 'FHF-10F set: 088U0730 + FHF-9F: 088U0529 + FHF-C: 088U0583', basket: [['088U0730', 1], ['088U0529', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 42, isFlowmeter: true, entries: 20, name: 'FHF-10F set: 088U0730 + FHF-10F: 088U0530 + FHF-C: 088U0583', basket: [['088U0730', 1], ['088U0530', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 43, isFlowmeter: true, entries: 21, name: 'FHF-11F set: 088U0731 + FHF-10F: 088U0530 + FHF-C: 088U0583', basket: [['088U0731', 1], ['088U0530', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 44, isFlowmeter: true, entries: 22, name: 'FHF-11F set: 088U0731 + FHF-11F: 088U0531 + FHF-C: 088U0583', basket: [['088U0731', 1], ['088U0531', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 45, isFlowmeter: true, entries: 23, name: 'FHF-12F set: 088U0732 + FHF-11F: 088U0531 + FHF-C: 088U0583', basket: [['088U0732', 1], ['088U0531', 1], ['088U0583', 1], ['088U0585', 1]] },
            { id: 46, isFlowmeter: true, entries: 24, name: 'FHF-12F set: 088U0732 + FHF-12F: 088U0532 + FHF-C: 088U0583', basket: [['088U0732', 1], ['088U0532', 1], ['088U0583', 1], ['088U0585', 1]] }
        ],
        ballValves: [
            {id: 1, name: 'Шаровые краны', basket: [['088U0586', 1]]}
        ],
        thermometers: [
            {id: 1, name: 'Термометры', basket: [['088U0029', '_collector.thermometersCount']]}
        ],
        // С узлом не должен по умолчанию добавлять код 088U0305, код 088U0305 и '088U0301' должны быть опциями на экране “Коллектор теплых полов”
        fit_088U0305: [
            { id: 1, name: '088U0305', preview:'config-prod-fittings-uglovoy.png', mixing:[1,2], basket: [['088U0305', 1]] }
        ],
        fit_088U0301: [
            { id: 1, name: '088U0301', preview: 'config-prod-term-bez.png', mixing: [1, 2], basket: [['088U0301', 1]] }
        ],
        mixing: [
            /*{ id: 1, name: 'FHM-C5', preview: 'config-prod-FHM-C5.png', basket: [['088U0095', 1]] },*/
            { id: 1, name: 'FHM-C6', preview: 'config-prod-FHM-C6.png', basket: [['088U0096', 1]] },
            /*{ id: 3, name: 'FHM-C7', preview: 'config-prod-FHM-C7.png', basket: [['088U0097', 1]] },*/
            { id: 2 , name: 'FHM-C8', preview: 'config-prod-FHM-C8-9.png', basket: [['088U0098', 1]] }
            /*{ id: 5, name: 'FHM-C9', preview: 'config-prod-FHM-C8-9.png', basket: [['088U0099', 1]] }*/
        ]
    },
    boiler: {
        embodiment: [
            {id: 1, name: 'Одноконтурный'},
            {id: 2, name: 'Двухконтурный'}
        ],
        hws: [
            {id: 1, name: 'Бойлер'},
            {id: 2, name: 'Газовая колонка'}
        ],
        pump: [
            {id: 1, name: 'UPS 25-60', basket: [['004F5877', 1]]},
            {id: 2, name: 'Alpha2 25-60', basket: [['004F4592', 1]]}
        ]
    },
    fittingsMaterial:[
        { id: 1, name: 'Медная' },
        { id: 2, name: 'PEX' },
        { id: 3, name: 'ALUPEX' }
    ],
    fittings: [
        {id: 1, type: 1, name: 'Внешняя 1/2" Медная 10 мм', fittingsMaterial: 1, basket: [['013G4110', 1]]},
        { id: 2, type: 1, name: 'Внешняя 1/2" Медная 12 мм', fittingsMaterial: 1, basket: [['013G4112', 1]] },
        { id: 3, type: 1, name: 'Внешняя 1/2" Медная 14 мм', fittingsMaterial: 1, basket: [['013G4114', 1]] },
        { id: 4, type: 1, name: 'Внешняя 1/2" Медная 15 мм', fittingsMaterial: 1, basket: [['013G4115', 1]] },
        { id: 5, type: 1, name: 'Внешняя 1/2" Медная 16 мм', fittingsMaterial: 1, basket: [['013G4116', 1]] },
        { id: 6, type: 1, name: 'Внешняя 1/2" PEX 14 x 2 мм', fittingsMaterial: 2, basket: [['013G4144', 1]] },
        { id: 7, type: 1, name: 'Внешняя 1/2" PEX 15 x 2,5 мм', fittingsMaterial: 2, basket: [['013G4147', 1]] },
        { id: 8, type: 1, name: 'Внешняя 1/2" ALUPEX 14 x 2 мм', fittingsMaterial: 3, basket: [['013G4174', 1]] },
        { id: 9, type: 2, name: 'Внутренняя 3/4" Медная 10 мм', fittingsMaterial: 1, basket: [['013G4120', 1]] },
        { id: 10, type: 2, name: 'Внутренняя 3/4" Медная 12 мм', fittingsMaterial: 1, basket: [['013G4122', 1]] },
        { id: 11, type: 2, name: 'Внутренняя 3/4" Медная 14 мм', fittingsMaterial: 1, basket: [['013G4124', 1]] },
        { id: 12, type: 2, name: 'Внутренняя 3/4" Медная 15 мм', fittingsMaterial: 1, basket: [['013G4125', 1]] },
        { id: 13, type: 2, name: 'Внутренняя 3/4" Медная 16 мм', fittingsMaterial: 1, basket: [['013G4126', 1]] },
        { id: 14, type: 2, name: 'Внутренняя 3/4" Медная 18 мм', fittingsMaterial: 1, basket: [['013G4128', 1]] },
        { id: 15, type: 2, name: 'Внутренняя 3/4" PEX 12 x 2 мм', fittingsMaterial: 2, basket: [['013G4152', 1]] },
        { id: 16, type: 2, name: 'Внутренняя 3/4" PEX 14 x 2 мм', fittingsMaterial: 2, basket: [['013G4154', 1]] },
        { id: 17, type: 2, name: 'Внутренняя 3/4" PEX 15 x 2,5 мм', fittingsMaterial: 2, basket: [['013G4155', 1]] },
        { id: 18, type: 2, name: 'Внутренняя 3/4" PEX 16 x 1,5 мм', fittingsMaterial: 2, basket: [['013G4157', 1]] },
        { id: 19, type: 2, name: 'Внутренняя 3/4" PEX 16 x 2 мм', fittingsMaterial: 2, basket: [['013G4156', 1]] },
        { id: 19, type: 2, name: 'Внутренняя 3/4" PEX 16 x 2,2 мм', fittingsMaterial: 2, basket: [['013G4163', 1]] },
        { id: 20, type: 2, name: 'Внутренняя 3/4" PEX 17 x 2 мм', fittingsMaterial: 2, basket: [['013G4162', 1]] },
        { id: 20, type: 2, name: 'Внутренняя 3/4" PEX 18 x 2 мм', fittingsMaterial: 2, basket: [['013G4158', 1]] },
        { id: 21, type: 2, name: 'Внутренняя 3/4" PEX 18 x 2,5 мм', fittingsMaterial: 2, basket: [['013G4159', 1]] },
        { id: 21, type: 2, name: 'Внутренняя 3/4" PEX 20 x 2 мм', fittingsMaterial: 2, basket: [['013G4160', 1]] },
        { id: 22, type: 2, name: 'Внутренняя 3/4" PEX 20 x 2,5 мм', fittingsMaterial: 2, basket: [['013G4161', 1]] },
        { id: 22, type: 2, name: 'Внутренняя 3/4" ALUPEX 14 x 2 мм', fittingsMaterial: 3, basket: [['013G4184', 1]] },
        { id: 23, type: 2, name: 'Внутренняя 3/4" ALUPEX 16 x 2 мм', fittingsMaterial: 3, basket: [['013G4186', 1]] },
        { id: 24, type: 2, name: 'Внутренняя 3/4" ALUPEX 16 x 2,2 мм', fittingsMaterial: 3, basket: [['013G4187', 1]] },
        { id: 25, type: 2, name: 'Внутренняя 3/4" ALUPEX 18 x 2 мм', fittingsMaterial: 3, basket: [['013G4188', 1]] },
        { id: 26, type: 2, name: 'Внутренняя 3/4" ALUPEX 20 x 2 мм', fittingsMaterial: 3, basket: [['013G4190', 1]] },
        { id: 27, type: 2, name: 'Внутренняя 3/4" ALUPEX 20 x 2,5 мм', fittingsMaterial: 3, basket: [['013G4191', 1]] }
    ]
};
