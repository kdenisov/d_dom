'use strict';

var appConfigurator = angular.module('appConfigurator', ['ngSanitize', 'ui.router', 'tabs', 'ui.slider', 'ui.bootstrap', 'ngAnimate']);


// Configurator Factory

appConfigurator.factory('Configurator', function(){
	var Cfg = {};

	var initStructure = function(){
		Cfg = {
			initialized: false,
			params: {},
			cottage: {
				area: 160,
				levelsCount: 2
			},
			levels: [],
			collectors: [],
			boiler: {},
			RefreshCollectorsCount: function () { },
			ValidateCollectors: function(currentLevel, levels, collector, alertCallback, popupCallback) {},
		};
	};
	
	var initParams = function(){
		Cfg.params = {
			cottage: {
				minArea: 50,
				maxArea: 300,
				step: 5
			},
			room: {
			    roomNames:[
                        ['Кухня', 'Гостиная', 'Санузел', 'Прихожая', 'Спальня 1', 'Ванная', 'Спальня 2', 'Коридор', 'Спальня 3', 'Спальня 4'],
                        ['Спальня 1', 'Спальня 2', 'Спальня 3', 'Санузел', 'Ванная', 'Гостиная', 'Спальня 4', 'Коридор', 'Спальня 5', 'Спальня 6'],
                        ['Спальня 1', 'Спальня 2', 'Спальня 3', 'Санузел', 'Ванная', 'Гостиная', 'Спальня 4', 'Коридор', 'Спальня 5', 'Спальня 7']
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
						{id: 2, connection: 2, name: 'RA'},
						{id: 3, connection: 2, name: 'M30x1,5'}
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
						{ id: 3, builtinValve: 3, previewPrefix: 'Livin-eco', controlType: 1, preview: 'config-prod-living-eco.png', name: 'Living eco RA+K', basket: [['014G0052', 1]] },
						{ id: 4, builtinValve: 3, previewPrefix: 'RAW-K', controlType: 1, preview: 'config-prod-ra.png', name: 'RAW-K', basket: [['013G5030', 1]] },
						{ id: 5, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-3.png', name: 'Простой', basket: [['087N1110', '1/_radiator.count'], ['088H3112', '1'], ['088H0016', 1/8]] },
						{ id: 6, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-1.png', name: 'Программируемый', basket: [['087N791801', '1/_radiator.count'], ['088H3112', '1'], ['088H0016', 1/8]] },
						{ id: 7, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-2.png', name: 'Простой беспроводной', basket: [['087N7270', '1/_radiator.count'], ['087N7478', '1/3'], ['088H3112', '1']] },
						{ id: 8, builtinValve: [1, 2, 3], controlType: 2, preview: 'config-prod-termo-1.png', name: 'Программируемый беспроводной', basket: [['087N791301', '1/_radiator.count'], ['087N7478', '1/3'], ['088H3112', '1']] }
					],
					externalView: [ // Исполнение
						{ id: 1, name: 'Никелированный' },
						{ id: 2, name: 'Прессовое соединение' },
                        { id: 3, name: 'Хромированный' },
                        { id: 4, name: 'Радиатор G1/2"' },
                        { id: 5, name: 'Радиатор G3/4"' },
                        { id: 6, name: 'Холодно белый' },
                        { id: 6, name: 'Нержавеющая сталь' }
					],
					side: [ // сторона
						{id: 1, name: 'Радиатор'},
						{id: 2, name: 'Полотенцесушитель'}
					],
					valves: [
                        { id: 1, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '6_11', externalView: 1, fittingsType: 1, control: [1, 2], name: '013G0153 RA-N UK никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0153', 1], ['003L0143', 1]] },
                        { id: 2, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '6_11', externalView: 2, fittingsType: 0,control: [1, 2], name: '013G3239 RA-N UK никелированный press + 003L1825 RLV, угловой, никелированный press', basket: [['013G3239', 1], ['003L1825', 1]] },
	                    { id: 3, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7l_11', externalView: 1, fittingsType: 1, control: [1, 2], name: '013G0234 RA-N трехосеваой левый, никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0234', 1], ['003L0143', 1]] },
	                    { id: 4, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7l_11', externalView: 3, fittingsType: 1, control: [1, 2], name: '013G4240 RA-NCX трехосеваой левый, хромированный + 003L0273 RLV-CX, угловой, хромированный', basket: [['013G4240', 1], ['003L0273', 1]] },
	                    { id: 5, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7r_11', externalView: 1, fittingsType: 1, control: [1, 2], name: '013G0233 RA-N трехосеваой правый, никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0233', 1], ['003L0143', 1]] },
	                    { id: 6, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '7r_11', externalView: 3, fittingsType: 1, control: [1, 2], name: '013G4239 RA-NCX трехосеваой правый, хромированный + 003L0273 RLV-CX, угловой, хромированный', basket: [['013G4239', 1], ['003L0273', 1]] },
	                    { id: 7, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '12', externalView: 0, fittingsType: 2, control: [1, 2], name: '013G3363 Клапан RA-K + 013G3378 Соединительная трубка 650 мм + 013G3367 Присоединительная деталь RA-K, в пол', basket: [['013G3363', 1], ['013G3378', 1], ['013G3367', 1]] },
	                    { id: 8, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 1, preview: '14', externalView: 0, fittingsType: 1, control: [1, 2], name: '013G3215 Гарнитура RA 15/6TB', basket: [['013G3215', 1]] },
                        { id: 9, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 2, preview: '8_11', externalView: 1, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0143 RLV, угловой, никелированный - 2 шт.', basket: [['003L0143', 2]] },
                        { id: 10, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 2, preview: '8_11', externalView: 3, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0273 RLV-CX, угловой, хромированный - 2 шт.', basket: [['003L0273', 2]] },
                        { id: 11, type: 1, connection: 1, builtinValve: 1, pipework: 1, controlType: 2, preview: '8_11', externalView: 2, fittingsType: 0, control: [5, 6, 7, 8], name: '003L1825 RLV, угловой, никелированный press - 2 шт.', basket: [['003L1825', 2]] },
                        { id: 12, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '3_10', externalView: 1, fittingsType: 1, control: [1, 2], name: '013G3903 RA-N угловой, никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G3903', 1], ['003L0273', 1]] },
	                    { id: 13, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '3_10', externalView: 3, fittingsType: 1, control: [1, 2], name: '013G4247 RA-N NCX хромированный + 003L0273 RLV-CX, угловой, хромированный', basket: [['013G4247', 1], ['003L0273', 1]] },
	                    { id: 14, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '3_10', externalView: 2, fittingsType: 0, control: [1, 2], name: '013G3237 RA-N угловой, никелированный press + 003L1825 RLV, угловой, никелированный press', basket: [['013G3237', 1], ['003L1825', 1]] },
	                    { id: 15, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '5_10', externalView: 1, fittingsType: 1, control: [1, 2], name: '013G0153 RA-N UK никелированный + 003L0143 RLV, угловой, никелированный', basket: [['013G0153', 1], ['003L0143', 1]] },
                        { id: 16, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '5_10', externalView: 2, fittingsType: 0, control: [1, 2], name: '013G3239 RA-N UK никелированный press + 003L1825 RLV, угловой, никелированный press', basket: [['013G3239', 1], ['003L1825', 1]] },
	                    { id: 17, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '13', externalView: 0, fittingsType: 2, control: [1, 2], name: '013G3363 Клапан RA-K + 013G3378 Соединительная трубка 650 мм + 013G3369 Присоединительная деталь RA-KW, в стену', basket: [['013G3363', 1], ['013G3378', 1], ['013G3369', 1]] },
	                    { id: 18, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 1, preview: '15', externalView: 0, fittingsType: 1, control: [1, 2], name: '013G3215 Гарнитура RA 15/6TB', basket: [['013G3215', 1]] },
                        { id: 19, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 2, preview: '4_10', externalView: 1, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0143 RLV, угловой, никелированный - 2 шт.', basket: [['003L0143', 2]] },
                        { id: 20, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 2, preview: '4_10', externalView: 3, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0273 RLV-CX, угловой, хромированный - 2 шт.', basket: [['003L0273', 2]] },
                        { id: 21, type: 1, connection: 1, builtinValve: 1, pipework: 2, controlType: 2, preview: '4_10', externalView: 2, fittingsType: 0, control: [5, 6, 7, 8], name: '003L1825 RLV, угловой, никелированный press - 2 шт.', basket: [['003L1825', 2]] },
                        { id: 22, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 1, preview: '1_9', externalView: 1, fittingsType: 1, control: [1, 2], name: '013G3904 RA-N прямой, никелированный + 003L0144 RLV, прямой, никелированный', basket: [['013G3904', 1], ['003L0144', 1]] },
	                    { id: 23, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 1, preview: '1_9', externalView: 3, fittingsType: 1, control: [1, 2], name: '013G4248 RA-NCX прямой, хромированный + 003L0274 RLV-CX, прямой, хромированный', basket: [['013G4248', 1], ['003L0274', 1]] },
	                    { id: 24, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 1, preview: '1_9', externalView: 2, fittingsType: 0, control: [1, 2], name: '013G3238 RA-N прямой, никелированный, press + 003L1824 RLV, прямой, никелированный, press', basket: [['013G3238', 1], ['003L1824', 1]] },
	                    { id: 25, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 2, preview: '2_9', externalView: 1, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0144 RLV, прямой, никелированный - 2 шт.', basket: [['003L0144', 2]] },
                        { id: 26, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 2, preview: '2_9', externalView: 3, fittingsType: 1, control: [5, 6, 7, 8], name: '003L0274 RLV-CX, прямой, хромированный - 2 шт.', basket: [['003L0274', 2]] },
                        { id: 27, type: 1, connection: 1, builtinValve: 1, pipework: 3, controlType: 2, preview: '2_9', externalView: 2, fittingsType: 0, control: [5, 6, 7, 8], name: '003L1824 RLV, прямой, никелированный, press - 2 шт.', basket: [['003L1824', 2]] },
                        { id: 28, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 1, preview: '19', externalView: 4, fittingsType: 2, control: [1, 2], name: '013G4742 Гарнитура VHS15 прямая, вход G1/2, выход R3/4', basket: [['013G4742', 1]] },
                        {id:29, type: 1, connection: 2, builtinValve : 1, pipework:1, controlType:1, preview: '19', externalView:5, fittingsType: 2, control:[1,2], name:'013G4744 Гарнитура VHS15 прямая, вход G3/4, выход G3/4', basket:[['013G4744',1]]},
                        { id: 30, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 1, preview: '19', externalView: -1, fittingsType: 2, control: [1, 2], name: '013G4742 Гарнитура VHS15 прямая, вход G1/2, выход R3/4', basket: [['013G4742', 1]] },
                        { id: 31, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 2, preview: '17', externalView: 4, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 32, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 2, preview: '17', externalView: 5, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                        { id: 33, type: 1, connection: 2, builtinValve: 1, pipework: 1, controlType: 2, preview: '17', externalView: -1, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 34, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 1, preview: '20', externalView: 4, fittingsType: 2, control: [1, 2], name: '013G4741 Гарнитура VHS15 угловая, вход G1/2, выход R3/4', basket: [['013G4741', 1]] },
                        { id: 35, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 1, preview: '20', externalView: 5, fittingsType: 2, control: [1, 2], name: '013G4743 Гарнитура VHS15 угловая, вход G3/4, выход G3/4', basket: [['013G4743', 1]] },
                        { id: 36, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 1, preview: '20', externalView: -1, fittingsType: 2, control: [1, 2], name: '013G4741 Гарнитура VHS15 угловая, вход G1/2, выход R3/4', basket: [['013G4741', 1]] },
                        { id: 37, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 2, preview: '18', externalView: 4, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 38, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 2, preview: '18', externalView: 5, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                        { id: 39, type: 1, connection: 2, builtinValve: 1, pipework: 2, controlType: 2, preview: '18', externalView: -1, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 40, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 1, preview: '16_17', externalView: 4, fittingsType: 2, control: [1, 2], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 41, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 1, preview: '16_17', externalView: 5, fittingsType: 2, control: [1, 2], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                        { id: 42, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 1, preview: '16_17', externalView: -1, fittingsType: 2, control: [1, 2], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 43, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 2, preview: '17', externalView: 4, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 44, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 2, preview: '17', externalView: 5, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                        { id: 45, type: 1, connection: 2, builtinValve: 2, pipework: 1, controlType: 2, preview: '17', externalView: -1, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 46, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 1, preview: '16_18', externalView: 4, fittingsType: 2, control: [1, 2], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 47, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 1, preview: '16_18', externalView: 5, fittingsType: 2, control: [1, 2], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                        { id: 48, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 1, preview: '16_18', externalView: -1, fittingsType: 2, control: [1, 2], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 49, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 2, preview: '18', externalView: 4, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 50, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 2, preview: '18', externalView: 5, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                        { id: 51, type: 1, connection: 2, builtinValve: 2, pipework: 2, controlType: 2, preview: '18', externalView: -1, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 52, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 1, preview: '16_17', externalView: 4, fittingsType: 2, control: [3, 4], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 53, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 1, preview: '16_17', externalView: 5, fittingsType: 2, control: [3, 4], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                        { id: 54, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 1, preview: '16_17', externalView: -1, fittingsType: 2, control: [3, 4], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 55, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 2, preview: '17', externalView: 4, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 56, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 2, preview: '17', externalView: 5, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0241 RLV-KD, прямой, G3/4A x G3/4', basket: [['003L0241', 1]] },
                        { id: 57, type: 1, connection: 2, builtinValve: 3, pipework: 1, controlType: 2, preview: '17', externalView: -1, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0240 RLV-KD, прямой, с переходниками, G3/4A x G1/2A', basket: [['003L0240', 1]] },
                        { id: 58, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 1, preview: '16_18', externalView: 4, fittingsType: 2, control: [3, 4], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 59, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 1, preview: '16_18', externalView: 5, fittingsType: 2, control: [3, 4], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                        { id: 60, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 1, preview: '16_18', externalView: -1, fittingsType: 2, control: [3, 4], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 61, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 2, preview: '18', externalView: 4, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },
                        { id: 62, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 2, preview: '18', externalView: 5, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0243 RLV-KD, угловой, G3/4A x G3/4', basket: [['003L0243', 1]] },
                        { id: 63, type: 1, connection: 2, builtinValve: 3, pipework: 2, controlType: 2, preview: '18', externalView: -1, fittingsType: 2, control: [5, 6, 7, 8], name: '003L0242 RLV-KD, угловой, с переходниками, G3/4A x G1/2A', basket: [['003L0242', 1]] },


						// Обычный радиатор
							// С боковым подключением, БЕЗ встроенного клапана терморегулятора
								// В стяжке
									// Радиаторный термостат
						/*{ id: 1, preview: '7p+11', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1, 2, 5, 6, 7, 8], fittingsType: 1, name: 'Клапан терморегулятора RA-N трехосевой правый: 013G0233 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G0233', 1], ['003L0143', 1]] },
                        { id: 101, preview: '7l+11', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1, 2, 5, 6, 7, 8], fittingsType: 1, name: '013G0234 RA-N трехосеваой левый, никелированный 003L0143 RLV, угловой, никелированный', basket: [['013G0234', 1], ['003L0143', 1]] },
						{id: 2, type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1,2,5,6,7,8],  fittingsType: 1, name: 'Клапан терморегулятора RA-N трехосевой левый: 013G0234 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G0234', 1],['003L0143', 1]]},
						{id: 3, preview: '6_11', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1,2,5,6,7,8],  fittingsType: 1, name: 'Клапан терморегулятора RA-N UK угловой: 013G0153 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G0153', 1],['003L0143', 1]]},
						{ id: 4, preview: '6_11', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1, 2, 5, 6, 7, 8], fittingsType: 0, name: 'Клапан терморегулятора RA-N UK Press для прессового соединения: 013G3239 + клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825', basket: [['013G3239', 1], ['003L1825', 1]] },
						{ id: 5, preview: '12', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1, 2, 5, 6, 7, 8], fittingsType: 2, name: 'Гарнитура клапан с отводом RA-K: 013G3363 + соединительная трубка 650 мм: 013G3378 + присоединительная деталь RA-K: 013G3367', basket: [['013G3363', 1], ['013G3378', 1], ['013G3367', 1]] },
						{ id: 6, type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1, 2, 5, 6, 7, 8], fittingsType: 2, name: 'Гарнитура клапан с отводом RA-K: 013G3363 + соединительная трубка 950 мм: 013G3377 + присоединительная деталь RA-K: 013G3367', basket: [['013G3363', 1], ['013G3377', 1], ['013G3367', 1]] },
						{ id: 7, preview: '14', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [1, 2, 5, 6, 7, 8], fittingsType: 1, name: 'Гарнитура RA 15/6TB для одноместного подключения: 013G3215', basket: [['013G3215', 1]] },
									// Электронный термостат
						{ id: 8, preview: '8+11', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [5, 6, 7, 8], fittingsType: 1, name: 'Клапан RLV-15 запорный угловой: 003L0143 - 2 шт.', basket: [['003L0143', 2]] },
                        { id: 108, preview: '8+11', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [5, 6, 7, 8], fittingsType: 1, name: '003L0273 RLV-CX, угловой, хромированный - 2 шт.', basket: [['003L0273', 2]] },
						{ id: 9, preview: '8+11', type: 1, connection: 1, builtinValve: 1, pipework: 2, control: [5, 6, 7, 8], fittingsType: 0, name: 'Клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825 - 2 шт.', basket: [['003L1825', 2]] },
								// По плинтусу
									// Радиаторный термостат
						{id: 10, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 1, name: 'Клапан терморегулятора RA-N трехосевой правый: 013G0233 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G0233', 1],['003L0143', 1]]},
						{id: 11, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 1, name: 'Клапан терморегулятора RA-N трехосевой правый: 013G0233 + клапан RLV-15 запорный прямой: 003L0144', basket: [['013G0233', 1],['003L0144', 1]]},
						{id: 12, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 1, name: 'Клапан терморегулятора RA-N трехосевой левый: 013G0234 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G0234', 1],['003L0143', 1]]},
						{id: 13, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 1, name: 'Клапан терморегулятора RA-N трехосевой левый: 013G0234 + клапан RLV-15 запорный прямой: 003L0144', basket: [['013G0234', 1],['003L0144', 1]]},
						{id: 14, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 1, name: 'Клапан терморегулятора RA-N UK угловой: 013G0153 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G0153', 1],['003L0143', 1]]},
						{id: 15, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 1, name: 'Клапан терморегулятора RA-N UK угловой: 013G0153 + клапан RLV-15 запорный прямой: 003L0144', basket: [['013G0153', 1],['003L0144', 1]]},
						{id: 16, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 0, name: 'Клапан терморегулятора RA-N UK Press для прессового соединения: 013G3239 + клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825', basket: [['013G3239', 1],['003L1825', 1]]},
						{ id: 17, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1, 2, 5, 6, 7, 8], fittingsType: 0, name: 'Клапан терморегулятора RA-N UK Press для прессового соединения: 013G3239 + клапан RLV-15 Press запорный прямой: 003L1824', basket: [['013G3239', 1], ['003L1824', 1]] },

                      { id: 117, preview: '1+9', type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1, 2, 5, 6, 7, 8], fittingsType: 0, name: '013G3238 RA-N прямой, никелированный, press + 003L1824 RLV, прямой, никелированный, press', basket: [['013G3238', 1], ['003L1824', 1]] },
                      { id: 118, preview: '1+9', type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1, 2, 5, 6, 7, 8], fittingsType: 0, name: '013G4248 RA-NCX прямой, хромированный 003L0274 RLV-CX, прямой, хромированный', basket: [['013G4248', 1], ['003L0274', 1]] },
                     { id: 119, preview: '1+9', type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1, 2, 5, 6, 7, 8], fittingsType: 0, name: '013G3904 RA-N прямой, никелированный 003L0144 RLV, прямой, никелированный', basket: [['013G3904', 1], ['003L0144', 1]] },

						{id: 18, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Гарнитура клапан с отводом RA-K: 013G3363 + соединительная трубка 650 мм: 013G3378', basket: [['013G3363', 1],['013G3378', 1]]},
						{id: 19, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Гарнитура клапан с отводом RA-K: 013G3363 + соединительная трубка 950 мм: 013G3377 + присоединительная деталь RA-KW: 013G3367', basket: [['013G3363', 1],['013G3377', 1],['013G3367', 1]]},
						{id: 20, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Гарнитура RA 15/6TB для одноместного подключения: 013G3215', basket: [['013G3215', 1]]},
									// Электронный термостат
						{ id: 21,   preview: '4+10', type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [5, 6, 7, 8], fittingsType: 1, name: 'Клапан RLV-15 запорный угловой: 003L0143 - 2 шт.', basket: [['003L0143', 2]] },
                        { id: 121,  preview: '4+10', type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [5, 6, 7, 8], fittingsType: 1, name: '003L0273 RLV-CX, угловой, хромированный - 2 шт.', basket: [['003L0273', 2]] },
                        { id: 23,   preview: '4+10', type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [5, 6, 7, 8], fittingsType: 0, name: 'Клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825 - 2 шт.', basket: [['003L1825', 2]] },

						{id: 22, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [5,6,7,8],     fittingsType: 1, name: 'Клапан RLV-15 запорный угловой: 003L0143 - 1 шт. и прямой: 003L0144 - 1 шт.', basket: [['003L0143', 1],['003L0144', 1]]},
						{id: 24, type: 1, connection: 1, builtinValve: 1, pipework: 3, control: [5,6,7,8],     fittingsType: 0, name: 'Клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825 - 1 шт. и прямой: 003L1824', basket: [['003L1825', 1],['003L1824', 1]]},
								// В стене
									// Радиаторный термостат
						{id: 25, preview:'3+10', type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [1,2,5,6,7,8], fittingsType: 1, name: 'Клапан терморегулятора RA-N угловой: 013G3903 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G3903', 1],['003L0143', 1]]},
						{ id: 26, preview: '5+10', type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [1, 2, 5, 6, 7, 8], fittingsType: 1, name: 'Клапан терморегулятора RA-N UK угловой: 013G0153 + клапан RLV-15 запорный угловой: 003L0143', basket: [['013G0153', 1], ['003L0143', 1]] },
						{ id: 27, preview: '3+10', type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [1, 2, 5, 6, 7, 8], fittingsType: 0, name: 'Клапан терморегулятора RA-N угловой Press для прессового соединения: 013G3237 + клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825', basket: [['013G3237', 1], ['003L1825', 1]] },
						{ id: 28, preview: '5+10', type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [1, 2, 5, 6, 7, 8], fittingsType: 0, name: 'Клапан терморегулятора RA-N UK Press для прессового соединения: 013G3239 + клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825', basket: [['013G3239', 1], ['003L1825', 1]] },
						{ id: 29,   preview: '13', type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [1, 2, 5, 6, 7, 8], fittingsType: 2, name: 'Гарнитура клапан с отводом RA-K: 013G3363 + соединительная трубка 650 мм: 013G3378 + 013G3369 Присоединительная деталь RA-KW, в стену', basket: [['013G3363', 1], ['013G3378', 1], ['013G3369', 1]] },
                        { id: 130,  preview: '15', type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [1, 2, 5, 6, 7, 8], fittingsType: 1, name: 'Гарнитура RA 15/6TB для одноместного подключения: 013G3215', basket: [['013G3215', 1]] },

                        { id: 30, type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [1, 2, 5, 6, 7, 8], fittingsType: 2, name: 'Гарнитура клапан с отводом RA-K: 013G3363 + соединительная трубка 950 мм: 013G3377 + присоединительная деталь RA-KW: 013G3369', basket: [['013G3363', 1], ['013G3377', 1]] },
                        
									// Электронный термостат
						{id: 31, type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [5,6,7,8],     fittingsType: 1, name: 'Клапан RLV-15 запорный угловой: 003L0143 - 2 шт.', basket: [['003L0143', 2]]},
						{id: 32, type: 1, connection: 1, builtinValve: 1, pipework: 4, control: [5,6,7,8],     fittingsType: 0, name: 'Клапан RLV-15 Press запорный угловой для прессового соединения: 003L1825 - 2 шт.', basket: [['003L1825', 2]]},
							// С нижним подключением, БЕЗ встроенного клапана терморегулятора
								// В стяжке / по плинтусу
									// Радиаторный термостат
						{id: 33, type: 1, connection: 2, builtinValve: 1, pipework: 1, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Гарнитура VHS прямая 1/2\": 013G4742', basket: [['013G4742', 1]]},
						{id: 34, type: 1, connection: 2, builtinValve: 1, pipework: 1, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Гарнитура VHS прямая 3/4\": 013G4744', basket: [['013G4744', 1]]},
									// Электронный термостат
						{id: 35, type: 1, connection: 2, builtinValve: 1, pipework: 1, control: [5,6,7,8],     fittingsType: 2, name: 'Клапан RLV-KD прямой 1/2\": 003L0240', basket: [['003L0240', 1]]},
						{id: 36, type: 1, connection: 2, builtinValve: 1, pipework: 1, control: [5,6,7,8],     fittingsType: 2, name: 'Клапан RLV-KD прямой 3/4\": 003L0241', basket: [['003L0241', 1]]},
								// В стене
									// Радиаторный термостат
						{id: 37, type: 1, connection: 2, builtinValve: 1, pipework: 4, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Гарнитура VHS угловая 1/2\": 013G4741', basket: [['013G4741', 1]]},
						{id: 38, type: 1, connection: 2, builtinValve: 1, pipework: 4, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Гарнитура VHS угловая 3/4\": 013G4743', basket: [['013G4743', 1]]},
									// Электронный термостат
						{id: 39, type: 1, connection: 2, builtinValve: 1, pipework: 4, control: [5,6,7,8],     fittingsType: 2, name: 'Клапан RLV-KD угловой 1/2\": 003L0242', basket: [['003L0242', 1]]},
						{id: 40, type: 1, connection: 2, builtinValve: 1, pipework: 4, control: [5,6,7,8],     fittingsType: 2, name: 'Клапан RLV-KD угловой 3/4\": 003L0243', basket: [['003L0243', 1]]},
							// С нижним подключением, СО встроенным клапаном терморегулятора с клипсовым соединением RA
								// В стяжке / по плинтусу
						{id: 41, type: 1, connection: 2, builtinValve: 2, pipework: 1, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD прямой 1/2\": 003L0240', basket: [['003L0240', 1]]},
						{id: 42, type: 1, connection: 2, builtinValve: 2, pipework: 1, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD прямой 3/4\": 003L0241', basket: [['003L0241', 1]]}, // *
								// В стене
						{id: 43, type: 1, connection: 2, builtinValve: 2, pipework: 4, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD угловой 1/2\": 003L0242', basket: [['003L0242', 1]]},
						{id: 44, type: 1, connection: 2, builtinValve: 2, pipework: 4, control: [1,2,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD угловой 3/4\": 003L0243', basket: [['003L0243', 1]]},
							// С нижним подключением, СО встроенным клапаном терморегулятора с резьбовым соединением M30x1,5
								// В стене
									// Радиаторный термостат
						{id: 45, type: 1, connection: 2, builtinValve: 3, pipework: 1, control: [3,4,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD прямой 1/2\": 003L0240', basket: [['003L0240', 1]]},
						{id: 46, type: 1, connection: 2, builtinValve: 3, pipework: 1, control: [3,4,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD прямой 3/4\": 003L0241', basket: [['003L0241', 1]]},
									// Электронный термостат
						{id: 47, type: 1, connection: 2, builtinValve: 3, pipework: 4, control: [3,4,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD угловой 1/2\": 003L0242', basket: [['003L0242', 1]]},
						{id: 48, type: 1, connection: 2, builtinValve: 3, pipework: 4, control: [3,4,5,6,7,8], fittingsType: 2, name: 'Клапан RLV-KD угловой 3/4\": 003L0243', basket: [['003L0243', 1]]},
                        */
						// Дизайнерский
							// Радиатор



						{ id: 49, type: 2, use: 1, fittingsType: 1, connectSide: 2, externalView: 3, preview:'0_0', name: '013G4003 RAX set Хромированный, для подключения терморегулятора справа, запорного клапана слева', basket: [['013G4003', 1]] },
						{ id: 50, type: 2, use: 1, fittingsType: 1, connectSide: 1, externalView: 3, preview: '0_0', name: '013G4004 RAX set Хромированный, для подключения терморегулятора слева, запорного клапана справа', basket: [['013G4004', 1]] },
						{ id: 51, type: 2, use: 1, fittingsType: 1, connectSide: 2, externalView: 6, preview: '0_0', name: '013G4007 RAX set Холодно-белый (RAL 9016), для подключения терморегулятора справа, запорного клапана слева', basket: [['013G4007', 1]] },
						{ id: 52, type: 2, use: 1, fittingsType: 1, connectSide: 1, externalView: 6, preview: '0_0', name: '013G4008 RAX set Холодно-белый (RAL 9016), для подключения терморегулятора слева, запорного клапана справа', basket: [['013G4008', 1]] },
						{ id: 53, type: 2, use: 1, fittingsType: 1, connectSide: 1, externalView: 7, preview: '0_0', name: '013G4009 RAX set Нержавеющая сталь, для подключения терморегулятора справа, запорного клапана слева', basket: [['013G4009', 1]] },
						{ id: 54, type: 2, use: 1, fittingsType: 1, connectSide: 2, externalView: 7, preview: '0_0', name: '013G4010 RAX set Нержавеющая сталь, для подключения терморегулятора слева, запорного клапана справа', basket: [['013G4010', 1]] },
							// Полотенцесушитель
						{ id: 55, type: 2, use: 2, fittingsType: 1, connectSide: 2, externalView: 3, preview: '0_0', name: 'RTX set, хромированный, для подключения терморегулятора справа, запорного клапана слева: 013G4132', basket: [['013G4132', 1]] },
						{ id: 56, type: 2, use: 2, fittingsType: 1, connectSide: 1, externalView: 3, preview: '0_0', name: 'RTX set, хромированный, для подключения терморегулятора слева, запорного клапана справа: 013G4133', basket: [['013G4133', 1]] },
						{ id: 57, type: 2, use: 2, fittingsType: 1, connectSide: 2, externalView: 6, preview: '0_0', name: 'RTX set, холодно-белый (RAL 9016), для подключения терморегулятора справа, запорного клапана слева: 013G4136', basket: [['013G4136', 1]] },
						{ id: 58, type: 2, use: 2, fittingsType: 1, connectSide: 1, externalView: 6, preview: '0_0', name: 'RTX set, холодно-белый (RAL 9016), для подключения терморегулятора слева, запорного клапана справа: 013G4137', basket: [['013G4137', 1]] },
						{ id: 59, type: 2, use: 2, fittingsType: 1, connectSide: 2, externalView: 7, preview: '0_0', name: 'RTX set, нержавеющая сталь, для подключения терморегулятора справа, запорного клапана слева: 013G4138', basket: [['013G4138', 1]] },
						{ id: 60, type: 2, use: 2, fittingsType: 1, connectSide: 1, externalView: 7, preview: '0_0', name: 'RTX set, нержавеющая сталь, для подключения терморегулятора слева, запорного клапана справа: 013G4139', basket: [['013G4139', 1]] }
					]
				},
				floors: {
					control: [
						/*{id: 1, type: 1, name: 'С управлением по температуре воздуха в помещении', basket: [['003L1001', 1],['013G2994', 1]]}, - СНЯТ С ПРОИЗВОДСТВА */
						{id: 1, type: 1, name: 'Механическое', preview: 'config-prod-termo-4.png', basket: [['003L1000', 1],['003L1040', 1]]},
                        // 
                        { id: 2, type: 2, name: 'Проводное с датчиком', preview: 'config-prod-termo-1.png', basket: [['087N791801', 1], ['087N6784', 1], ['088H3112', '_room.floors.loops'], ['088H0016', 1]] },
	                    { id: 3, type: 2, name: 'Беспроводное с датчиком', preview: 'config-prod-termo-1.png', basket: [['087N791301', 1], ['087N6784', 1], ['087N7478', '1/3'], ['088H3112', '_room.floors.loops']] }
					]
				}
			},
			collector: {
				sets: [
					{id: 1,  isFlowmeter: false, entries: 2, name:  'FHF-2 set: 088U0702', basket: [['088U0702', 1]]},
					{id: 2,  isFlowmeter: false, entries: 3, name:  'FHF-3 set: 088U0703', basket: [['088U0703', 1]]},
					{id: 3,  isFlowmeter: false, entries: 4, name:  'FHF-4 set: 088U0704', basket: [['088U0704', 1]]},
					{id: 4,  isFlowmeter: false, entries: 5, name:  'FHF-5 set: 088U0705', basket: [['088U0705', 1]]},
					{id: 5,  isFlowmeter: false, entries: 6, name:  'FHF-6 set: 088U0706', basket: [['088U0706', 1]]},
					{id: 6,  isFlowmeter: false, entries: 7, name:  'FHF-7 set: 088U0707', basket: [['088U0707', 1]]},
					{id: 7,  isFlowmeter: false, entries: 8, name:  'FHF-8 set: 088U0708', basket: [['088U0708', 1]]},
					{id: 8,  isFlowmeter: false, entries: 9, name:  'FHF-9 set: 088U0709', basket: [['088U0709', 1]]},
					{id: 9,  isFlowmeter: false, entries: 10, name: 'FHF-10 set: 088U0710', basket: [['088U0710', 1]]},
					{id: 10, isFlowmeter: false, entries: 11, name: 'FHF-11 set: 088U0711', basket: [['088U0711', 1]]},
					{id: 11, isFlowmeter: false, entries: 12, name: 'FHF-12 set: 088U0712', basket: [['088U0712', 1]]},
					{id: 12, isFlowmeter: true, entries: 2, name:  'FHF-2 set: 088U0722', basket: [['088U0722', 1]]},
					{id: 13, isFlowmeter: true, entries: 3, name:  'FHF-3 set: 088U0723', basket: [['088U0723', 1]]},
					{id: 14, isFlowmeter: true, entries: 4, name:  'FHF-4 set: 088U0724', basket: [['088U0724', 1]]},
					{id: 15, isFlowmeter: true, entries: 5, name:  'FHF-5 set: 088U0725', basket: [['088U0725', 1]]},
					{id: 16, isFlowmeter: true, entries: 6, name:  'FHF-6 set: 088U0726', basket: [['088U0726', 1]]},
					{id: 17, isFlowmeter: true, entries: 7, name:  'FHF-7 set: 088U0727', basket: [['088U0727', 1]]},
					{id: 18, isFlowmeter: true, entries: 8, name:  'FHF-8 set: 088U0728', basket: [['088U0728', 1]]},
					{id: 19, isFlowmeter: true, entries: 9, name:  'FHF-9 set: 088U0729', basket: [['088U0729', 1]]},
					{id: 20, isFlowmeter: true, entries: 10, name: 'FHF-10 set: 088U0730', basket: [['088U0730', 1]]},
					{id: 21, isFlowmeter: true, entries: 11, name: 'FHF-11 set: 088U0731', basket: [['088U0731', 1]]},
					{id: 22, isFlowmeter: true, entries: 12, name: 'FHF-12 set: 088U0732', basket: [['088U0732', 1]]},
					{id: 23, isFlowmeter: false, entries: 13, name: 'FHF-7 set: 088U0707 + FHF-6: 088U0506 + FHF-C: 088U0583', basket: [['088U0707', 1],['088U0506', 1],['088U0583', 1]]},
					{id: 24, isFlowmeter: false, entries: 14, name: 'FHF-7 set: 088U0707 + FHF-7: 088U0507 + FHF-C: 088U0583', basket: [['088U0707', 1],['088U0507', 1],['088U0583', 1]]},
					{id: 25, isFlowmeter: false, entries: 15, name: 'FHF-8 set: 088U0708 + FHF-7: 088U0507 + FHF-C: 088U0583', basket: [['088U0708', 1],['088U0507', 1],['088U0583', 1]]},
					{id: 26, isFlowmeter: false, entries: 16, name: 'FHF-8 set: 088U0708 + FHF-8: 088U0508 + FHF-C: 088U0583', basket: [['088U0708', 1],['088U0508', 1],['088U0583', 1]]},
					{id: 27, isFlowmeter: false, entries: 17, name: 'FHF-9 set: 088U0709 + FHF-8: 088U0508 + FHF-C: 088U0583', basket: [['088U0709', 1],['088U0508', 1],['088U0583', 1]]},
					{id: 28, isFlowmeter: false, entries: 18, name: 'FHF-9 set: 088U0709 + FHF-9: 088U0509 + FHF-C: 088U0583', basket: [['088U0709', 1],['088U0509', 1],['088U0583', 1]]},
					{id: 29, isFlowmeter: false, entries: 19, name: 'FHF-10 set: 088U0710 + FHF-9: 088U0509 + FHF-C: 088U0583', basket: [['088U0710', 1],['088U0509', 1],['088U0583', 1]]},
					{id: 30, isFlowmeter: false, entries: 20, name: 'FHF-10 set: 088U0710 + FHF-10: 088U0510 + FHF-C: 088U0583', basket: [['088U0710', 1],['088U0510', 1],['088U0583', 1]]},
					{id: 31, isFlowmeter: false, entries: 21, name: 'FHF-11 set: 088U0711 + FHF-10: 088U0510 + FHF-C: 088U0583', basket: [['088U0711', 1],['088U0510', 1],['088U0583', 1]]},
					{id: 32, isFlowmeter: false, entries: 22, name: 'FHF-11 set: 088U0711 + FHF-11: 088U0511 + FHF-C: 088U0583', basket: [['088U0711', 1],['088U0511', 1],['088U0583', 1]]},
					{id: 33, isFlowmeter: false, entries: 23, name: 'FHF-12 set: 088U0712 + FHF-11: 088U0511 + FHF-C: 088U0583', basket: [['088U0712', 1],['088U0511', 1],['088U0583', 1]]},
					{id: 34, isFlowmeter: false, entries: 24, name: 'FHF-12 set: 088U0712 + FHF-12: 088U0512 + FHF-C: 088U0583', basket: [['088U0712', 1],['088U0512', 1],['088U0583', 1]]},
					{id: 35, isFlowmeter: true, entries: 13, name: 'FHF-7F set: 088U0727 + FHF-6F: 088U0526 + FHF-C: 088U0583', basket: [['088U0727', 1],['088U0526', 1],['088U0583', 1]]},
					{id: 36, isFlowmeter: true, entries: 14, name: 'FHF-7F set: 088U0727 + FHF-7F: 088U0527 + FHF-C: 088U0583', basket: [['088U0727', 1],['088U0527', 1],['088U0583', 1]]},
					{id: 37, isFlowmeter: true, entries: 15, name: 'FHF-8F set: 088U0728 + FHF-7F: 088U0527 + FHF-C: 088U0583', basket: [['088U0728', 1],['088U0527', 1],['088U0583', 1]]},
					{id: 38, isFlowmeter: true, entries: 16, name: 'FHF-8F set: 088U0728 + FHF-8F: 088U0528 + FHF-C: 088U0583', basket: [['088U0728', 1],['088U0528', 1],['088U0583', 1]]},
					{id: 39, isFlowmeter: true, entries: 17, name: 'FHF-9F set: 088U0729 + FHF-8F: 088U0528 + FHF-C: 088U0583', basket: [['088U0729', 1],['088U0528', 1],['088U0583', 1]]},
					{id: 40, isFlowmeter: true, entries: 18, name: 'FHF-9F set: 088U0729 + FHF-9F: 088U0529 + FHF-C: 088U0583', basket: [['088U0729', 1],['088U0529', 1],['088U0583', 1]]},
					{id: 41, isFlowmeter: true, entries: 19, name: 'FHF-10F set: 088U0730 + FHF-9F: 088U0529 + FHF-C: 088U0583', basket: [['088U0730', 1],['088U0529', 1],['088U0583', 1]]},
					{id: 42, isFlowmeter: true, entries: 20, name: 'FHF-10F set: 088U0730 + FHF-10F: 088U0530 + FHF-C: 088U0583', basket: [['088U0730', 1],['088U0530', 1],['088U0583', 1]]},
					{id: 43, isFlowmeter: true, entries: 21, name: 'FHF-11F set: 088U0731 + FHF-10F: 088U0530 + FHF-C: 088U0583', basket: [['088U0731', 1],['088U0530', 1],['088U0583', 1]]},
					{id: 44, isFlowmeter: true, entries: 22, name: 'FHF-11F set: 088U0731 + FHF-11F: 088U0531 + FHF-C: 088U0583', basket: [['088U0731', 1],['088U0531', 1],['088U0583', 1]]},
					{id: 45, isFlowmeter: true, entries: 23, name: 'FHF-12F set: 088U0732 + FHF-11F: 088U0531 + FHF-C: 088U0583', basket: [['088U0732', 1],['088U0531', 1],['088U0583', 1]]},
					{id: 46, isFlowmeter: true, entries: 24, name: 'FHF-12F set: 088U0732 + FHF-12F: 088U0532 + FHF-C: 088U0583', basket: [['088U0732', 1],['088U0532', 1],['088U0583', 1]]}
				],
				ballValves: [
					{id: 1, name: 'Шаровые краны', basket: [['088U0586', 1]]}
				],
				thermometers: [
					{id: 1, name: 'Термометры', basket: [['088U0029', '_collector.thermometersCount']]}
				],
				/*mixing: [
					{id: 1, name: 'FHM-C5', basket: [['088U0095', 1],['088U0305', 1]]},
					{id: 2, name: 'FHM-C6', basket: [['088U0096', 1],['088U0305', 1],['088U0301', 1]]},
					{id: 3, name: 'FHM-C7', basket: [['088U0097', 1],['088U0305', 1]]},
					{id: 4, name: 'FHM-C8', basket: [['088U0098', 1],['088U0305', 1],['088U0301', 1]]},
					{id: 5, name: 'FHM-C9', basket: [['088U0099', 1],['088U0305', 1],['088U0301', 1]]}
				]*/
			    // С узлом не должен по умолчанию добавлять код 088U0305, код 088U0305 и '088U0301' должны быть опциями на экране “Коллектор теплых полов”
				fit_088U0305: [
                    { id: 1, name: '088U0305', preview:'config-prod-fittings-uglovoy.png', mixing:[1,2,3,4,5], basket: [['088U0305', 1]] }
			    ],
				fit_088U0301: [
                    { id: 1, name: '088U0301', preview: 'config-prod-term-bez.png', mixing: [2, 4, 5], basket: [['088U0301', 1]] }
		        ],
				mixing: [
					{ id: 1, name: 'FHM-C5', preview: 'config-prod-FHM-C5.png', basket: [['088U0095', 1]] },
					{ id: 2, name: 'FHM-C6', preview: 'config-prod-FHM-C6.png', basket: [['088U0096', 1]] },
					{ id: 3, name: 'FHM-C7', preview: 'config-prod-FHM-C7.png', basket: [['088U0097', 1]] },
					{ id: 4, name: 'FHM-C8', preview: 'config-prod-FHM-C8-9.png', basket: [['088U0098', 1]] },
					{ id: 5, name: 'FHM-C9', preview: 'config-prod-FHM-C8-9.png', basket: [['088U0099', 1]] }
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
	};

	var initBoiler = function(){
		// "Конструктор" котельной
	    Cfg.boiler = {};
        // Котельная по умолчанию
	    Cfg.boiler.isBoiler = true;
		Cfg.boiler.level = 1;
		Cfg.boiler.roomType = 1;
		Cfg.boiler.canonicalName = function(){
			return(this.roomType == 1 && 'Котельная' || 'Кухня');
		},
		Cfg.boiler.embodiment = 1;
		Cfg.boiler.hws = 1;
		Cfg.boiler.pump = 1;
		Cfg.boiler.hose_05 = 0;
		Cfg.boiler.hose_08 = 0;
		Cfg.boiler.hose_10 = 0
	}

	var initRadiators = function () {
	    // "Конструктор" радиаторов
	    for (var radiator_id = 1, radiators = []; radiator_id <= 3; radiator_id++) {
            var r = {
	            id: radiator_id,
	            type: 1,			// Вид радиатора: Обычный
	            connection: 2,		// Подключение: Нижнее
	            builtinValve: 2,	// Встроенный клапан: RA
	            pipework: 1,		// Разводка трубопроводов: В стяжке/По плинтусу
	            use: 1,				// Применение: Радиатор
	            control: 2,			// Управление (отдельное)
	            valves: 40,			// Клапаны: RLV-KD прямой 3/4"
	            fittingsType: 2,	// Тип фитингов: Внутренняя 3/4"
	            fittings: 0,		// Фитинги
	            controlType:1,
	            count: radiator_id == 1 ? 2 : 0 // Количество радиаторов	            
            }

	        radiators.push(r);
	    }
	    return radiators;
	}

	var room = function (level, room_id) {
	    var floor = {							// Теплые полы
	        isFloors: level == 0,			// Теплые полы: есть
	        loops: 1,						// Количество петель
	        control: 2,					// Управление
	        fittings: 0					// Фитинги
	    };

	    var radiators = {
	        controlType: 1,			// Управление: Отдельное
	        commonControl: null,// Общее управление
	        radiatorsTypes: 1,	// Типов радиаторов
	        list: initRadiators()			// Радиаторы
	    }

	    return { // Комнаты по умолчанию
	        id: room_id,
	        isRoom: false,
	        name: Cfg.params.room.roomNames[level][room_id - 1],
	        radiators: radiators,
	        floors: floor, // объект теплого пола

	        // @public methods
	        getRadiatorsCount: function () {
	            var radiators_count = 0;
	            for (var r in radiators.list) {	                
	                radiators_count += radiators.list[r].count;
	            }
	            return radiators_count;
	        },
	        setFloorLoops: function (loops) { // метод устанавливающий значение петель для теплого пола
	            floor.loops = loops;
	            floor.isFloors = (loops > 0);

	            setCollectorEntriesForLevel();
	        },

	        copyTo: function (destRoom) { // метод копирующий все параметры комнаты
	            if (destRoom.id == room_id) return; // самого в себя не копируем
                // клонирование основных параметров
	            destRoom.radiators = {
	                controlType: radiators.controlType,
	                commonControl: radiators.commonControl,
	                radiatorsTypes: radiators.radiatorsTypes,
	                list: destRoom.radiators.list
	            };
	            // клонирование радиаторов
	            for (var r in radiators.list) {
	                destRoom.radiators.list[r].type = radiators.list[r].type;					// Вид радиатора
	                destRoom.radiators.list[r].connection = radiators.list[r].connection;		// Подключение
	                destRoom.radiators.list[r].builtinValve = radiators.list[r].builtinValve;	// Встроенный клапан
	                destRoom.radiators.list[r].pipework = radiators.list[r].pipework;			// Разводка трубопроводов
	                destRoom.radiators.list[r].use = radiators.list[r].use;					    // Применение
	                destRoom.radiators.list[r].control = radiators.list[r].control;			    // Управление
	                destRoom.radiators.list[r].valves = radiators.list[r].valves;				// Клапаны
	                destRoom.radiators.list[r].fittingsType = radiators.list[r].fittingsType;	// Тип фитингов
	                destRoom.radiators.list[r].fittings = radiators.list[r].fittings;			// Фитинги
	                destRoom.radiators.list[r].count = radiators.list[r].count;
	            }

	            // клонирование полов
	            destRoom.floors.isFloors = destRoom.floors.isFloors;    // Теплые полы: есть
	            destRoom.floors.loops = destRoom.floors.loops;       // Количество петель
	            destRoom.floors.control = destRoom.floors.control;     // Управление
	            destRoom.floors.fittings = destRoom.floors.fittings;
	        }
	    }
	}

	var initRooms = function (level) {
	    // "Конструктор" комнат
	    for (var room_id = 1, rooms = []; room_id <= 12; room_id++) {
	        rooms.push(room(level, room_id));
	    }
	    return rooms;
	}

	var initLevels = function(){
		var
			rooms_per_level = 5
		;

		// "Конструктор" радиаторов
		for(var radiator_id = 1, radiators = []; radiator_id <= 3; radiator_id++){
		    radiators.push(initRadiators(radiator_id));
		}

		// "Конструктор" этажей
		for(var level_id = 1, levels = []; level_id <= 3; level_id++){

		    // "Конструктор" коллекторов
		    // всего коллекторов - 4 (два теплого пола + 2 радиаторов)
			for (var collector_id = 1, collectors = []; collector_id <= 2; collector_id++) {
			    collectors.push({ // Коллекторы по умолчанию
			        id: collector_id,											// id, он же тип колектора: радиаторов || теплых полов
			        name: collector_id <= 1 ? 'Коллектор радиаторов' : 'Коллектор теплых полов',
			        type: collector_id <= 1 ? 'radiator' : 'floor',
			        isCollector: false,										// Коллектор: есть
			        levels: {															// Этажи коллекторов
			            1: level_id == 1,
			            2: level_id == 2,
			            3: level_id == 3
			        },
			        entries: 0,														// Количество заходов коллектора радиаторов на этаже
			        sets: collector_id == 1 && 13 || 2,		// Коллектор (зависит от типа и количества заходов)
			        isFlowmeter: collector_id > 1,				// Расходомер (для коллектора теплых полов: есть)
			        isBallValves: true,										// Шаровые краны
			        isThermometers: true,									// Термометры
			        thermometersCount: 1,									// Количество термометров
			        _thermometerIn: true,
			        _thermometerOut: false,
			        fittings: 0,											// Фитинги для трубы
			        mixing: collector_id > 1 && 1 || 0,	// Узел смешения
			        fit_088U0305: 0, // фиттинги для узла смешения
			        fit_088U0301: 0 // термостат безопасности
			    });
			}

			levels.push({ // Этажи по умолчанию
				id: level_id,
				//name: level_id == 3 && 'Подвал' || 'Этаж ' + (level_id),
				name: 'Этаж ' + level_id,
				canonicalName: function(){
					return(this.isBasement && 'Подвал' || this.name);
				},
				isLevel: level_id <= Cfg.cottage.levelsCount, //level_id != 3,
				roomsCount: rooms_per_level,
				isBasement: false,
				isBoiler: level_id == 1,
				//isCollectors: true, //level_id == 1 || false,
				//isFloors: false,
				collectors: collectors,
				rooms: initRooms(level_id - 1)
			});
		}
		        // параметры по умолчанию
		levels[0].isLevel = true; // 1 этаж
	    // на первом этаже три комнаты в каждой по два радиатора
		levels[0].roomsCount = 3;
		levels[0].rooms[0].isRoom = true;
		levels[0].rooms[0].radiators.list[0].count = 2;
		levels[0].rooms[1].isRoom = true;
		levels[0].rooms[1].radiators.list[0].count = 2;
		levels[0].rooms[2].isRoom = true;
		levels[0].rooms[2].radiators.list[0].count = 2;

		levels[1].isLevel = true; // 2 этаж
	    // на втором этаже три комнаты
		levels[1].roomsCount = 3;
		levels[1].rooms[0].isRoom = true;
		levels[1].rooms[0].radiators.list[0].count = 2;
		levels[1].rooms[1].isRoom = true;
		levels[1].rooms[1].radiators.list[0].count = 2;
		levels[1].rooms[2].isRoom = true;
		levels[1].rooms[2].radiators.list[0].count = 2;

		if (Cfg.boiler.isBoiler) {
		    for (room = levels[Cfg.boiler.level - 1].rooms.length - 1; room >= 0 ; room--) {
		        if (levels[Cfg.boiler.level - 1].rooms[room].isRoom) {
		            levels[Cfg.boiler.level - 1].rooms[room].isBoilerRoom = true;
		            break;
		        }
		    }
		}



		Cfg.levels = levels;
	}

	Cfg.supportsLocalStorage = function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
			return false;
		}
	}

	Cfg.saveLocalStorage = function(obj) {
		if(Cfg.supportsLocalStorage()){
			localStorage[obj.key] = JSON.stringify(obj.val);
			return;
		}
		return false;
	}

	Cfg.loadLocalStorage = function(obj) {
		if(Cfg.supportsLocalStorage() && localStorage[obj.key]){
			return JSON.parse(localStorage[obj.key]);
		}
		return obj.val;
	}

    //@private методы

	var updateRoomsConfiguration = function () {
	    var Configurator = Cfg;
	    var
			area = Cfg.cottage.area,
			levels_count = Cfg.cottage.levelsCount
	    ;

	    for (var level in Configurator.levels) {
	        var total_radiators_count = Math.ceil(Math.sqrt(area * levels_count / 5) / levels_count);
	        for (var room in Configurator.levels[level].rooms) {
	            // пересчет количества радиаторов = корень(S * levels_count / 5)
	            for (var r in Configurator.levels[level].rooms[room].radiators.list) {
	                // считаем что есть только один тип радиаторов (заполняем только нулевой)
	                if (r > 0) {
	                    Configurator.levels[level].rooms[room].radiators.list[r].count = 0;
	                    continue;
	                }

	                if (total_radiators_count > Configurator.levels[level].roomsCount) {
	                    // если первый этаж
	                    if (level == 0) {
	                        // избыток в первую комнату
	                        if (room == 0) {
	                            Configurator.levels[level].rooms[room].radiators.list[r].count = total_radiators_count - Configurator.levels[level].roomsCount + 1;
	                        } else {
	                            Configurator.levels[level].rooms[room].radiators.list[r].count = 1;
	                        }
	                    } else {
	                        // для всех остальных этажей избыток распределяем равномерно                            
	                        room = parseInt(room);
	                        var __c = Math.ceil(total_radiators_count / Configurator.levels[level].roomsCount); // максимальное количество радиаторов в комнате
	                        var __c1 = (__c - 1) * (Configurator.levels[level].roomsCount - room);
	                        var __c2 = __c * (1 + room);
	                        Configurator.levels[level].rooms[room].radiators.list[r].count = __c1 + __c2 <= total_radiators_count ? __c : __c - 1;
	                    }
	                } else {
	                    Configurator.levels[level].rooms[room].radiators.list[r].count = 1;
	                }
	            }

	            //теплые полы устанавливаются только на первом этаже
	            // если колво - помещ больше то в каждом по одной 
	            // избыточные в комнату номер 1
	            var _floorsCount = Math.ceil(area / levels_count / 15);

	            Configurator.levels[level].rooms[room].setFloorLoops(
                    level == 0
                        ? (room == 0 && _floorsCount > Configurator.levels[level].roomsCount ? _floorsCount - Configurator.levels[level].roomsCount + 1 : 1)
                        : 0);
	        }
	    }

	    Configurator.RefreshCollectorsCount();
	}

	var updateCottageConfiguration = function () {

	    var Configurator = Cfg;

	    var
			area = Configurator.cottage.area,
			levels_count,
			rooms_per_level
	    ;

	    levels_count = (area <= 100) ? 1 : 2, // Количество этажей: до 100 м2 - 1 этаж, больше - 2 этажа
		rooms_per_level = Math.floor(area / levels_count / 15);

	    for (var level in Configurator.levels) {
	        Configurator.levels[level].isLevel = Configurator.levels[level].id <= levels_count;
	        Configurator.levels[level].roomsCount = rooms_per_level;
	    }

	    Configurator.cottage.levelsCount = levels_count;

	    updateRoomsConfiguration();
	}

    // @private автоконфигурирование коллекторов радиаторов для каждого этажа
	var refreshRadiatorCollectorsCount = function(){
	    // по всем этажам
	    for (var level in Cfg.levels) {
	        // если этаж активный
	        if (Cfg.levels[level].isLevel) {
	            // общее кол-во радиаторов на этаже
	            var level_radiators_count = 0;
	            // по всем комнатам этажа	            
	            for (var room = 0; room < Cfg.levels[level].roomsCount; room++) {
	                level_radiators_count += Cfg.levels[level].rooms[room].getRadiatorsCount();
	            }
	            // кол-во коллекторов = кол-во петель / 12
	            if (level_radiators_count > 0)
	                var collectors_count = Math.ceil(level_radiators_count / 24) || 1;
	            else
	                var collectors_count = 0;

	            if (collectors_count > 1) {
	                alert("Превышено ограничение в 24 захода на один коллектор. Для решения вопроса обратитесь в данфосс");
	            }

	            for (var i in Cfg.levels[level].collectors) {
	                if (Cfg.levels[level].collectors[i].type == 'radiator') {
	                    // если кол0во коллекторов больше нуля, то активируем текущий
	                    Cfg.levels[level].collectors[i].isCollector = collectors_count > 0;

	                    if (Cfg.levels[level].collectors[i].isCollector) {
	                        // считаем кол-во заходов
	                        Cfg.levels[level].collectors[i].entries = level_radiators_count > 24 ? level_radiators_count % 1 : level_radiators_count;
	                        Cfg.levels[level].collectors[i].levels = {															// Этажи коллекторов
	                            1: level == 0,
	                            2: level == 1,
	                            3: level == 2
	                        };
	                        collectors_count--;
	                        level_radiators_count -= Cfg.levels[level].collectors[i].entries;
	                    } else {
	                        Cfg.levels[level].collectors[i].entries = 0;
	                    }
	                }
	            }
	        }
	    }
	}


    // @private автоконфигурирование коллекторов теплого пола для каждого этажа
	var refreshCollectorsCount = function () {
	    // по всем этажам
	    for (var level in Cfg.levels) {
	        // если этаж активный
	        if (Cfg.levels[level].isLevel) {
	            // общее кол-во петель на этаже
	            var level_loops_count = 0;
	            // по всем комнатам этажа	            
	            for (var room = 0; room < Cfg.levels[level].roomsCount; room++) {
	                // если есть теплый пол	                
	                if (Cfg.levels[level].rooms[room].floors.isFloors) {
	                    // считаем количество петель
	                    level_loops_count += Cfg.levels[level].rooms[room].floors.loops;
	                }
	            }
	            // кол-во коллекторов = кол-во петель / 12
	            if (level_loops_count > 0)
	                var collectors_count = Math.ceil(level_loops_count / 24) || 1;
	            else
	                var collectors_count = 0;

	            if (collectors_count > 1) {
	                alert("Превышено ограничение в 24 захода на один коллектор. Для решения вопроса обратитесь в данфосс");
	            }

	            for (var i in Cfg.levels[level].collectors) {
	                if (Cfg.levels[level].collectors[i].type == 'floor') {
	                    // если кол0во коллекторов больше нуля, то активируем текущий
	                    Cfg.levels[level].collectors[i].isCollector = collectors_count > 0;

	                    if (Cfg.levels[level].collectors[i].isCollector) {
	                        // считаем кол-во заходов
	                        Cfg.levels[level].collectors[i].entries = level_loops_count > 24 ? level_loops_count % 24 : level_loops_count;
	                        Cfg.levels[level].collectors[i].levels = {
	                            // Этажи коллекторов
	                            1: level == 0,
	                            2: level == 1,
	                            3: level == 2
	                        };
	                        collectors_count--;
	                        level_loops_count -= Cfg.levels[level].collectors[i].entries;
	                    } else {
	                        Cfg.levels[level].collectors[i].entries = 0;
	                    }
	                }
	            }
	        }
	    }
	}

	var iterateActiveLevels = function (callback) {
	    for (var level in Cfg.levels) {
	        // если этаж активный
	        if (Cfg.levels[level].isLevel) {
	            callback(Cfg.levels[level]);
	        }
	    }
	}

	var iterateActiveRooms = function (level, callback) {
	    for (var room = 0; room < level.roomsCount; room++) {
	        if (level.rooms[room].isRoom) {
	            callback(level.rooms[room]);
	        }
	    }
	}	

    // @private пересчет кол-ва входов для конкретного этажа (не меняя конфигурацию коллекторов)
	var setCollectorEntriesForLevel = function () {
	    
	    // по всем этажам - очищаем коллекторные входы
	    for (var level in Cfg.levels) {
	        // если этаж активный
	        if (Cfg.levels[level].isLevel) {
	            for (var i in Cfg.levels[level].collectors) {
	                Cfg.levels[level].collectors[i].entries = 0;
	            }
	        }
	    }

	    var rebuild_floor_collectors = false;
	    var rebuild_radiator_collectors = false;

	    // по всем этажам считаем кол-во петель
	    for (var level in Cfg.levels) {
	        // если этаж активный
	        if (Cfg.levels[level].isLevel) {
	            // общее кол-во петель на этаже
	            var level_loops_count = 0;
                // общее количество радиаторов на этаже
	            var level_radiators_count = 0;
	            // по всем комнатам этажа	            
	            for (var room = 0; room < Cfg.levels[level].roomsCount; room++) {
                    // считаем количество радиаторов
	                level_radiators_count += Cfg.levels[level].rooms[room].getRadiatorsCount();
	                // если есть теплый пол	                
	                if (Cfg.levels[level].rooms[room].floors.isFloors) {
	                    // считаем количество петель
	                    level_loops_count += Cfg.levels[level].rooms[room].floors.loops;
	                }
	            }

	            if (level_loops_count > 24 || level_radiators_count > 24) {
	                alert("Превышено ограничение в 24 захода на один коллектор. Для решения вопроса обратитесь в данфосс");
	                return false;
	            }

	            Cfg.levels[level].floor_loops_count = level_loops_count;
	            Cfg.levels[level].radiators_count = level_radiators_count;

	            // проверяем состоятельность - есть ли включенные коллекторы для этажей на которых они нужны
	            // если нет, то заново переконфигурируем
	            // по всем этажам - по всем коллекторам - рассовываем петли (в имеющейся конфигурации)
	            var is_exists_floor_collector = false;
	            var is_exists_radiator_collector = false;
	            for (var __level in Cfg.levels) {
	                // если этаж активный
	                if (Cfg.levels[__level].isLevel) {
	                    for (var j in Cfg.levels[__level].collectors) {
	                        if (Cfg.levels[__level].collectors[j].isCollector) {
	                            if (Cfg.levels[__level].collectors[j].levels[parseInt(level) + 1]) {
	                                if (Cfg.levels[__level].collectors[j].type == 'floor')
	                                    is_exists_floor_collector = true;
	                                else
	                                    is_exists_radiator_collector = true;
	                            }
	                        }
	                    }
	                }
	            }
	            if (!is_exists_floor_collector)
	                rebuild_floor_collectors = true;
	            if (!is_exists_radiator_collector)
	                rebuild_radiator_collectors = true;
	        }
	    }

	    if (rebuild_floor_collectors) {
	        refreshCollectorsCount();
	        return;
	    }

	    if (rebuild_radiator_collectors) {
	        refreshRadiatorCollectorsCount();
	        return;
	    }

	    // по всем этажам - по всем коллекторам - рассовываем петли (в имеющейся конфигурации)
	    for (var level in Cfg.levels) {
	        // если этаж активный
	        if (Cfg.levels[level].isLevel) {
	            for (var i in Cfg.levels[level].collectors) {
	                if (Cfg.levels[level].collectors[i].isCollector) {
	                    // смотрим к каким этажам подключен коллектор
	                    for (var __l = 0; __l < 3; __l++) {
	                        // __l-ый этаж
	                        if (Cfg.levels[level].collectors[i].levels[__l + 1]) {

                                // если __l-ый этаж подключен к этому коллектору, то считаем сколько входов есть
	                            var _entries = Cfg.levels[level].collectors[i].type == 'floor' ? Cfg.levels[__l].floor_loops_count : Cfg.levels[__l].radiators_count;
	                            if (Cfg.levels[level].collectors[i].entries + _entries > 24) {
	                                alert("Превышено ограничение в 24 захода на один коллектор. Для решения вопроса обратитесь в данфосс");
	                                return false;
	                            }
	                            Cfg.levels[level].collectors[i].entries += _entries;
	                            if (Cfg.levels[level].collectors[i].type == 'floor')
	                                Cfg.levels[__l].floor_loops_count = 0;
	                            else
	                                Cfg.levels[__l].radiators_count = 0;

	                        }
	                    }                        
	                } 	                
	            }
	        }
	    }
	}

	initStructure();
	initParams();
	initBoiler();
	initLevels();
	//initCollectors();

    // @public автоконфигурирование коллекторов радиаторов и теплых полов
	Cfg.RefreshCollectorsCount = function () {

	    refreshCollectorsCount();

	    refreshRadiatorCollectorsCount();
	}

    // @public кол-во этажей
	Cfg.GetLevelsCount = function () {
	    var __c = 0;
	    iterateActiveLevels(function () {
	        __c++;
	    });
	    return __c;
	}

    // @public кол-во комнат всего
	Cfg.GetTotalRoomsCount = function () {
	    var __c = 0;
	    iterateActiveLevels(function (level) {
	        iterateActiveRooms(level, function () {
	            __c++;
	        });
	    });
	    return __c;
	}

    // @public пересчет входов коллекторов без изменения конфигурации по этажам
	Cfg.UpdateCollectorEntries = function () {
	    setCollectorEntriesForLevel();
	}


    // @public пересчет кол-ва радиаторов и теплых полов в комнатах
	Cfg.UpdateRoomsConfiguration = function () {
	    updateRoomsConfiguration();
	}

	Cfg.UpdateCottageConfiguration = function () {
	    updateCottageConfiguration();
	}

	Cfg.ValidateCollectors = function (currentLevel, levels, collector, alertCallback, popupCallback) {
        if (!alertCallback) {
            alertCallback = function (str) { };
        }

        if (!popupCallback) {
            popupCallback = function (currentCollector) { };
        }

	    var collector_id = collector.id;

	    if (collector.isCollector == false) {
	        // Коллектор радиаторов должен быть минимум один, должно быть нельзя выключить все
	        var noRadiatorCollectors = true;
	        angular.forEach(levels, function (_level) {
	            angular.forEach(_level.collectors, function (_collector, key2) {
	                if (_collector.type == 'radiator' && _collector.isCollector)
	                    noRadiatorCollectors = false;
	            });
	        });

	        if (noRadiatorCollectors) {
	            alertCallback("Коллектор радиаторов должен быть как минимум один.");
	            collector.isCollector = true;
	            return;
	        }

	        if (collector.type == 'floor') {
	            // Если есть теплый пол - значит должен быть коллектор, минимум один
	            var isFloorExists = false;
	            var isFloorCollectorExists = false;
	            angular.forEach(levels, function (_level) {
	                angular.forEach(_level.rooms, function (_room) {
	                    isFloorExists = isFloorExists || (_room.isRoom && _room.floors.isFloors);
	                    angular.forEach(_level.collectors, function (_collector, key2) {
	                        isFloorCollectorExists = isFloorCollectorExists || (_collector.type == 'floor' && _collector.isCollector);
	                    });
	                });
	            });

	            if (isFloorExists && !isFloorCollectorExists) {
	                alertCallback("Коллектор теплых полов должен быть как минимум один");
	                collector.isCollector = true;
	                return;
	            }
	        }

	        if (collector.entries > 0) {
	            popupCallback(collector);
	        }
	    } else {
	        // если коллектор на этаже включается, то пересчитать входы
	        if (collector.type == 'floor')
	            refreshCollectorsCount();
	        else
	            refreshRadiatorCollectorsCount();
	    }
	}
	
	var pushToBasket = function (basket, key, val, section) {
	    if (key in basket) {
	        basket[key] += parseFloat(val);
	    } else
	        basket[key] = parseFloat(val);
	}

	Cfg.RadiatorControlTypes = function () {
	    var _basket = {};

	    var Configurator = Cfg;

	    angular.forEach(Configurator.levels, function (_level) {
	        _level.isLevel
			&&
			(angular.forEach(_level.rooms, function (_room) {
			    if (_room.id <= _level.roomsCount) {
			        pushToBasket(_basket, _room.controlType, 1)
			    }			    
			}))
	    });

	    return _basket;
	}

	Cfg.RadiatorValves = function () {
	    var _basket = {};

	    var Configurator = Cfg;

	    angular.forEach(Configurator.levels, function (_level) {
	        _level.isLevel
			&&
			(angular.forEach(_level.rooms, function (_room) {
			    _room.id <= _level.roomsCount && (
					(angular.forEach(_room.radiators.list, function (_radiator) {
					    if (_radiator.id <= _room.radiators.radiatorsTypes)
							pushToBasket(_basket, _radiator.valves, 1)
					}))
				)
			}))
	    });

	    return _basket;
	}

    /*возвращает все коды сгруппированные по группам товаров*/
	Cfg.GetCodesBySection = function () {
	    var _basket = {};

	    var pushToBasket = function (basket, key, val, section) {
	        if (section in basket) {
	            if (key in basket[section].equip) {
	                basket[section].equip[key].value += parseFloat(val);
	            } else {
	                basket[section].equip[key] = { key: key, value: parseFloat(val) };
	            }
	        } else {
	            var e = {};
	            e[key] = { key: key, value: parseFloat(val) };	            
	            basket[section] = { equip: e };	            
	        }
	    }

	    var Configurator = Cfg;

	    angular.forEach(Configurator.levels, function (_level) {
	        _level.isLevel
			&&
			(angular.forEach(_level.rooms, function (_room) {
			    _room.id <= _level.roomsCount && (
					(angular.forEach(_room.radiators.list, function (_radiator) {
					    _radiator.id <= _room.radiators.radiatorsTypes && (
							(_radiator.type == 1 && _radiator.control && angular.forEach(Configurator.params.room.radiators.control[_radiator.control - 1].basket, function (_control) {
							    pushToBasket(_basket, _control[0], _radiator.count * eval(_control[1]), 'radiator-control');
							}))
							+
							(angular.forEach(Configurator.params.room.radiators.valves[_radiator.valves - 1].basket, function (_valves) {
							    pushToBasket(_basket, _valves[0], _radiator.count * _valves[1], 'radiator-valve');
							}))
							+
							(_radiator.fittings && angular.forEach(Configurator.params.fittings[_radiator.fittings - 1].basket, function (_fittings) {
							    pushToBasket(_basket, _fittings[0], _radiator.count * 2, 'radiator-fitting');
							}))
						)
					}))
					+
					(_room.floors.isFloors &&
						(angular.forEach(Configurator.params.room.floors.control[_room.floors.control - 1].basket, function (_control) {
						    pushToBasket(_basket, _control[0], eval(_control[1]), 'floor-control');
						}))
						+
						(_room.floors.fittings && angular.forEach(Configurator.params.fittings[_room.floors.fittings - 1].basket, function (_fittings) {
						    pushToBasket(_basket, _fittings[0], 2, 'floor-fitting');
						}))
					)
				)
			}))
			&&
			(angular.forEach(_level.collectors, function (_collector) {

			    if (_collector.isCollector) {

			        var collector_1 = _collector.entries;
			        angular.forEach(Configurator.params.collector.sets, function (_set) {
			            if (_collector.type == 'radiator' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    pushToBasket(_basket, _sets[0], eval(_sets[1]), 'radiator-collector');
			                });
			            }
			            if (_collector.type == 'floor' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    pushToBasket(_basket, _sets[0], eval(_sets[1]), 'floor-collector');
			                });
			            }
			        });
			    }

			    _collector.isCollector && (
					(_collector.isBallValves && angular.forEach(Configurator.params.collector.ballValves[0].basket, function (_ballValves) {
					    pushToBasket(_basket, _ballValves[0], _ballValves[1], _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					}))
					+
					(_collector.isThermometers && angular.forEach(Configurator.params.collector.thermometers[0].basket, function (_thermometers) {
					    pushToBasket(_basket, _thermometers[0], eval(_thermometers[1]), _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					}))
					+
					(_collector.fittings && angular.forEach(Configurator.params.fittings[_collector.fittings - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _collector.entries, _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					}))
                    +
					(_collector.fit_088U0305 && angular.forEach(Configurator.params.collector.fit_088U0305[_collector.fit_088U0305 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					}))
                    +
					(_collector.fit_088U0301 && angular.forEach(Configurator.params.collector.fit_088U0301[_collector.fit_088U0301 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					}))
					+
					(_collector.mixing && angular.forEach(Configurator.params.collector.mixing[_collector.mixing - 1].basket, function (_mixing) {
					    pushToBasket(_basket, _mixing[0], _mixing[1], _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					})))
			}));
	    });

	    Configurator.boiler.isBoiler && pushToBasket(_basket, Configurator.params.boiler.pump[Configurator.boiler.pump - 1].basket[0][0], 1, 'boiler');

	    /*for (var k in _basket) {
	        _basket[k] = Math.ceil(_basket[k]);
	    }*/

	    return _basket;
	};


    /*возвращает все коды сгруппированные по комнатам */
	Cfg.GetCodesByRooms = function () {
	    var _basket = {};

	    var pushToBasket = function (basket, key, val, room) {
	        if (room in basket) {
	            if (key in basket[room].equip) {
	                basket[room].equip[key].value += parseFloat(val);
	            } else {
	                basket[room].equip[key] = { key: key, value: parseFloat(val) };
	            }
	        } else {
	            var e = {};
	            e[key] = { key: key, value: parseFloat(val) };
	            basket[room] = { equip: e };
	        }
	    }

	    var Configurator = Cfg;

	    angular.forEach(Configurator.levels, function (_level) {
	        _level.isLevel
			&&
			(angular.forEach(_level.rooms, function (_room) {
			    _room.id <= _level.roomsCount && (
					(angular.forEach(_room.radiators.list, function (_radiator) {
					    _radiator.id <= _room.radiators.radiatorsTypes && (
							(_radiator.type == 1 && _radiator.control && angular.forEach(Configurator.params.room.radiators.control[_radiator.control - 1].basket, function (_control) {
							    pushToBasket(_basket, _control[0], _radiator.count * eval(_control[1]), _level.name + '|' + _room.name);
							}))
							+
							(angular.forEach(Configurator.params.room.radiators.valves[_radiator.valves - 1].basket, function (_valves) {
							    pushToBasket(_basket, _valves[0], _radiator.count * _valves[1], _level.name + '|' + _room.name);
							}))
							+
							(_radiator.fittings && angular.forEach(Configurator.params.fittings[_radiator.fittings - 1].basket, function (_fittings) {
							    pushToBasket(_basket, _fittings[0], _radiator.count * 2, _level.name + '|' + _room.name);
							}))
						)
					}))
					+
					(_room.floors.isFloors &&
						(angular.forEach(Configurator.params.room.floors.control[_room.floors.control - 1].basket, function (_control) {
						    pushToBasket(_basket, _control[0], eval(_control[1]), _level.name + '|' + _room.name);
						}))
						+
						(_room.floors.fittings && angular.forEach(Configurator.params.fittings[_room.floors.fittings - 1].basket, function (_fittings) {
						    pushToBasket(_basket, _fittings[0], 2, _level.name + '|' + _room.name);
						}))
					)
                    +
                    (_room.isBoilerRoom
                        && pushToBasket(_basket, Configurator.params.boiler.pump[Configurator.boiler.pump - 1].basket[0][0], 1, _level.name + '|' + _room.name))
				)
			}))
			&&
			(angular.forEach(_level.collectors, function (_collector) {

			    if (_collector.isCollector) {

			        var collector_1 = _collector.entries;
			        angular.forEach(Configurator.params.collector.sets, function (_set) {
			            if (_collector.type == 'radiator' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    pushToBasket(_basket, _sets[0], eval(_sets[1]), _level.name + '|Коллектор');
			                });
			            }
			            if (_collector.type == 'floor' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    pushToBasket(_basket, _sets[0], eval(_sets[1]), _level.name + '|Коллектор');
			                });
			            }
			        });
			    }

			    _collector.isCollector && (
					(_collector.isBallValves && angular.forEach(Configurator.params.collector.ballValves[0].basket, function (_ballValves) {
					    pushToBasket(_basket, _ballValves[0], _ballValves[1], _level.name + '|collector');
					}))
					+
					(_collector.isThermometers && angular.forEach(Configurator.params.collector.thermometers[0].basket, function (_thermometers) {
					    pushToBasket(_basket, _thermometers[0], eval(_thermometers[1]), _level.name + '|collector');
					}))
					+
					(_collector.fittings && angular.forEach(Configurator.params.fittings[_collector.fittings - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _collector.entries, _level.name + '|collector');
					}))
                    +
					(_collector.fit_088U0305 && angular.forEach(Configurator.params.collector.fit_088U0305[_collector.fit_088U0305 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _level.name + '|collector');
					}))
                    +
					(_collector.fit_088U0301 && angular.forEach(Configurator.params.collector.fit_088U0301[_collector.fit_088U0301 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _level.name + '|collector');
					}))
					+
					(_collector.mixing && angular.forEach(Configurator.params.collector.mixing[_collector.mixing - 1].basket, function (_mixing) {
					    pushToBasket(_basket, _mixing[0], _mixing[1], _level.name + '|collector');
					})))
			}));
	    });

	    return _basket;
	};

	Cfg.Basket = function () {
	    var _basket = {};

	    var Configurator = Cfg;

	    var __b = Cfg.GetCodesBySection();

	    for (var cat in __b) {
	        for (var key in __b[cat].equip) {
	            pushToBasket(_basket, key, __b[cat].equip[key].value);
	        }
	    }

	    return _basket;
	}

	Cfg.ifBasketContains = function (basket, code) {
	    return basket[code] > 0;
	}

	Cfg.ifBasketContainCodes = function (basket, codes) {
	    var res = false;
	    for (var i = 0; i < codes.length; i++) {
	        if (basket[codes[i]]) {
	            res = true;
	            break;
	        }
	    }
	    return res;
	}

    updateCottageConfiguration();

	return Cfg;
});


// Catalog Factory

appConfigurator.factory('Catalog', function($q, $timeout, $http) {
	var _Catalog = {
		fetch: function() {
			var deferred = $q.defer();
			$timeout(function() {
			
			    $http.jsonp("http://dom.danfoss.ru/json/all?jsonp=JSON_CALLBACK")
				.success(function(data) {
					deferred.resolve(data.data);
				})
				.error(function (data) {
					return;
				});

			}, 30);
			return deferred.promise;
		},
		makeOrder: function (basket) {
		    var deferred = $q.defer();
		    $timeout(function () {
		        var data = {codes : ""};
		        for (var b in basket){
		            data.codes += b + " " + basket[b] + "; ";
		        }
		        $http.post("http://dom.danfoss.ru/checkout/express/", data)
				.success(function (data) {
				    document.location.href = "http://dom.danfoss.ru/Checkout/Cart";
				})
				.error(function (data) {
				    return;
				});

		    }, 30);
		}
	}

	return _Catalog;
});


appConfigurator.factory('Editor', function() {
	
	var _Editor = {};

	_Editor.editMode = false;
	
	_Editor.pressEnter = function(e){
		if(e.keyCode == 13) {
			_Editor.editMode = false;
			e.target.blur();
			return(true);
		}
	}

	return _Editor;
});