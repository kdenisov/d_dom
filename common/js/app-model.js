'use strict'; 
 
var appConfigurator = angular.module('appConfigurator', ['ngSanitize', 'ui.router', 'tabs', 'ui.slider', 'ui.bootstrap', 'ngAnimate']);

appConfigurator.constant('appConfig', {
        appPath: "../"//"http://dom.danfoss.ru"
    , DanfossAuthorisationID: "DanfossCottageAuthorisationID"
    , DanfossAuthorisationCookieName: ".d-auth"
});

appConfigurator.service('StorageManager', function(){
    
    var Storage = {};

    Storage.supportsLocalStorage = function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    Storage.saveLocalStorage = function (obj) {
        if (Storage.supportsLocalStorage()) {
            localStorage[obj.key] = JSON.stringify(obj.val);
            return;
        }
        return false;
    }

    Storage.loadLocalStorage = function (obj) {
        if (Storage.supportsLocalStorage() && localStorage[obj.key]) {
            return JSON.parse(localStorage[obj.key]);
        }
        return obj.val;
    }

    Storage.saveCookie = function (obj) {
        obj.val = obj.val != null ? encodeURIComponent(obj.val) : '';
        var updatedCookie = obj.key + "=" + obj.val;
        document.cookie = updatedCookie;
    }

    Storage.loadCookie = function (key) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : null;
    }
    return Storage;
});

// классы работы с текущим пользователем
appConfigurator.service('CurrentUser', function ($q, $timeout, $http, StorageManager, appConfig) {

    // аксессры к гуиду пользователя (хранится в локальном хранилище)
    var _userGUID = function (guid) {
        if (typeof guid === 'undefined')
            return StorageManager.loadCookie(appConfig.DanfossAuthorisationCookieName);
        else
            StorageManager.saveCookie({ key: appConfig.DanfossAuthorisationCookieName, val: guid });
    }

    // генератор частей гуида
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    // если при инициализации гуида нет, то генерируем
    if (!_userGUID()) {
        _userGUID((S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase());

    }

    // текущий пользователь
    var _currentUser = undefined;

    // парсер ответа от сервера. Признак - успех\не успех 
    var _isSuccessResult = function (data) {
        return data === true || (data && (data.result || !("result" in data)));
    }

    // парсер информационного ответа от сервера - сообщение которое вернул сервер
    var _getMessage = function (data) {
        return (data && "message" in data && data.message) || "";
    }

    var _User = {
        // Есть ли пользователь с таким GUID в БД на сервере
        isGuidExistsInDB: function () {
            var deferred = $q.defer();

            if (_currentUser && "Guid" in _currentUser)
                deferred.resolve(_currentUser);

            $http({
                url: appConfig.appPath + "/JsonOperations/GetCurrentUser?jsonp=JSON_CALLBACK",
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            })
			.success(function (data) {
			    if (_isSuccessResult(data) && "Guid" in data) {
			        // если есть, то и авторизуем его сразу
			        _currentUser = data;
			        deferred.resolve(data);
			    } else {
			        deferred.reject(_getMessage(data));
			    }
			})
			.error(function (data) {
			    deferred.reject("Пользователь не авторизован");
			});

            return deferred.promise;
        },

        // Сгенерировать PIN по телефону или email
        GetPIN: function (phoneOrEmail) {
            var deferred = $q.defer();

            $http.jsonp(appConfig.appPath + "/JsonOperations/GetPIN?jsonp=JSON_CALLBACK&phoneOrEmail=" + phoneOrEmail)
			.success(function (data) {
			    deferred.resolve(data);
			})
			.error(function (data) {
			    deferred.reject("Ошибка отправки PIN кода");
			});

            return deferred.promise;
        },
        // Войти по телефону или email и пин коду
        Login: function (phoneOrEmail, pin) {
            var deferred = $q.defer();

            $http({
                url: appConfig.appPath + "/JsonOperations/Login?jsonp=JSON_CALLBACK",
                method: "POST",
                data: { phoneOrEmail: phoneOrEmail, pin: pin },
                headers: { 'Content-Type': 'application/json' }
            })
			.success(function (data) {
			    if (_isSuccessResult(data)) {
			        _currentUser = data;
			        _userGUID(data.Guid);
			        deferred.resolve(data);
			    } else {
			        deferred.reject(_getMessage(data));
			    }
			})
			.error(function (data) {
			    deferred.reject("Ошибка при входе");
			});

            return deferred.promise;
        },
        // Зарегистрировать пользователя
        Register: function (name, phone, address, email) {
            var deferred = $q.defer();

            $http({
                url: appConfig.appPath + "/JsonOperations/Register?jsonp=JSON_CALLBACK",
                method: "POST",
                data: { phone: phone, name: name, address: address, email: email },
                headers: { 'Content-Type': 'application/json' }
            })
			.success(function (data) {
			    if (_isSuccessResult(data)) {
			        _currentUser = data;
			        _userGUID(data.Guid);
			        deferred.resolve(data);
			    } else {
			        deferred.reject(_getMessage(data));
			    }
			})
			.error(function (data) {
			    deferred.reject("Ошибка при регистрации");
			});

            return deferred.promise;
        },
        // Загрузить последнюю конфигурацию сохраненную на сервере
        LoadConfiguration: function (id) {
            var deferred = $q.defer();

            if (typeof id == 'undefined') {
                $http.get(appConfig.appPath + "/JsonOperations/GetLastConfiguration?jsonp=JSON_CALLBACK")
                .success(function (data) {
                    if (typeof data === 'string') {
                        deferred.resolve(JSON.parse(JSON.parse(data)));
                    } else {
                        deferred.reject(_getMessage(data));
                    }
                })
                .error(function (data) {
                    deferred.reject("Ошибка при загрузке конфигурации");
                });
            } else {
                $http.get(appConfig.appPath + "/JsonOperations/GetConfigurationById?id=" + id)
                .success(function (data) {
                    data = JSON.parse(data);
                    if (typeof data === 'string'){
                        deferred.resolve(JSON.parse(data));
                    } else {
                        deferred.reject(_getMessage(data));
                    }
                })
                .error(function (data) {
                    deferred.reject("Ошибка при загрузке конфигурации");
                });
            }

            return deferred.promise;
        },
        // Сохранить конфигурацию на сервер под определенным именем
        SendConfiguration: function (email, name, configuration, price) {
            var deferred = $q.defer();

            $http({
                url: appConfig.appPath + "/JsonOperations/SendConfiguration?jsonp=JSON_CALLBACK",
                method: "POST",
                data: { email:email, configuration: configuration, name: name, price: price },
                headers: { 'Content-Type': 'application/json' }
            })
			.success(function (data) {
			    if (_isSuccessResult(data)) {
			        deferred.resolve("Конфигурация сохранена успешно");
			    } else {
			        deferred.reject(_getMessage(data));
			    }
			})
			.error(function (data) {
			    deferred.reject("Ошибка при сохранении конфигурации.");
			});

            return deferred.promise;
        },
        // Сохранить конфигурацию на сервер под определенным именем
        SaveConfiguration: function (name, configuration, price) {
            var deferred = $q.defer();

            $http({
                url: appConfig.appPath + "/JsonOperations/SaveConfiguration?jsonp=JSON_CALLBACK",
                method: "POST",
                data: { configuration: configuration, name: name, price: price },
                headers: { 'Content-Type': 'application/json' }
            })
			.success(function (data) {
			    if (_isSuccessResult(data)) {
			        deferred.resolve("Конфигурация сохранена успешно");
			    } else {
			        deferred.reject(_getMessage(data));
			    }
			})
			.error(function (data) {
			    deferred.reject("Ошибка при сохранении конфигурации.");
			});

            return deferred.promise;
        },
        // публичный аксессор к гуиду пользователя
        GetUserGUID: function () {
            return _userGUID();
        },
        // префикс по умолчанию для номеров заказов  пользователя
        SetOrderName: function () {
            var _self = this;
            var deferred = $q.defer();
            var defaultName = _userGUID().substring(0, 5) + "-01";
            this.isGuidExistsInDB().then(
                function() {
                    _self.LoadConfiguration().then(
                        function (cfg) {
                            if (cfg && "name" in cfg) {
                                var prevName = cfg.name;
                                if (prevName.indexOf("-") > 0) {
                                    var newName = prevName.split('-')[0] + '-' + (parseInt(prevName.split('-')[1]) + 1);
                                    deferred.resolve(newName);
                                } else {
                                    deferred.resolve(defaultName);
                                }
                            } else {
                                deferred.resolve(defaultName);
                            }
                        }
                        , function () { deferred.resolve(defaultName); })
                }
                , function() {
                    setTimeout(function () { deferred.resolve(defaultName); }, 100);
                }
            );

            return deferred.promise;
        }
    }

    return _User;
});

// Configurator Factory
appConfigurator.factory('Configurator', function (StorageManager, CurrentUser, Catalog, appConfig) {
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
			properties: {
			    autoCalcCollectorInputs: true // авторасчет входов коллектора
			},
			RefreshCollectorsCount: function () { },
			ValidateCollectors: function (currentLevel, levels, collector, alertCallback, popupCallback) { },
            createCollector: function() { },
		};
	};
	
	var initParams = function(){
	    Cfg.params = APP_PARAMS;
    }

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
		Cfg.boiler.hose_10 = 0;
	    return Cfg.boiler;
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
	            controlType: 1,
	            connectSide: 1,
	            count: radiator_id == 1 ? 2 : 0 // Количество радиаторов	            
            }

	        radiators.push(r);
	    }
	    return radiators;
	}

	var initRoom = function (level, room_id, active, hasBoiler) {
	    
	    return { // Комнаты по умолчанию
	        id: room_id,
	        isRoom: active && true,
            isBoilerRoom: hasBoiler && true,
            name: Cfg.params.room.roomNames[level][room_id - 1],
            canonicalName: Cfg.params.room.roomNames[level][room_id - 1],
	        radiators: {
	            controlType: 1,			// Управление: Отдельное
	            commonControl: null,// Общее управление
	            radiatorsTypes: 1,	// Типов радиаторов
	            list: initRadiators()			// Радиаторы
	        },
	        floors: {							// Теплые полы
	            isFloors: level == 0,			// Теплые полы: есть
	            loops: 1,						// Количество петель
	            control: 2,					// Управление
	            fittings: 0					// Фитинги
	        }, // объект теплого пола
            visited: false,

	        // @public methods
	        getRadiatorsCount: function () {
	            var radiators_count = 0;
	            for (var r in this.radiators.list) {	                
	                radiators_count += this.radiators.list[r].count;
	            }
	            return radiators_count;
	        },
	        setFloorLoops: function (loops) { // метод устанавливающий значение петель для теплого пола
	            this.floors.loops = loops;
	            this.floors.isFloors = (loops > 0);

	            setCollectorEntriesForLevel();
	        },

	        copyTo: function (destRoom) { // метод копирующий все параметры комнаты
	            if (destRoom.id == room_id) return; // самого в себя не копируем
                // клонирование основных параметров
	            destRoom.radiators = {
	                controlType: this.radiators.controlType,
	                commonControl: this.radiators.commonControl,
	                radiatorsTypes: this.radiators.radiatorsTypes,
	                list: destRoom.radiators.list
	            };
	            // клонирование радиаторов
	            for (var r in this.radiators.list) {
	                destRoom.radiators.list[r].type = this.radiators.list[r].type;					// Вид радиатора
	                destRoom.radiators.list[r].connection = this.radiators.list[r].connection;		// Подключение
	                destRoom.radiators.list[r].builtinValve = this.radiators.list[r].builtinValve;	// Встроенный клапан
	                destRoom.radiators.list[r].pipework = this.radiators.list[r].pipework;			// Разводка трубопроводов
	                destRoom.radiators.list[r].use = this.radiators.list[r].use;					    // Применение
	                destRoom.radiators.list[r].control = this.radiators.list[r].control;			    // Управление
	                destRoom.radiators.list[r].valves = this.radiators.list[r].valves;				// Клапаны
	                destRoom.radiators.list[r].fittingsType = this.radiators.list[r].fittingsType;	// Тип фитингов
	                destRoom.radiators.list[r].fittings = this.radiators.list[r].fittings;			// Фитинги
	                destRoom.radiators.list[r].count = this.radiators.list[r].count;
	            }

	            // клонирование полов
	            destRoom.floors.isFloors = this.floors.isFloors;    // Теплые полы: есть
	            destRoom.floors.loops = this.floors.loops;       // Количество петель
	            destRoom.floors.control = this.floors.control;     // Управление
	            destRoom.floors.fittings = this.floors.fittings;
	        }
	    }
	}

	var initRooms = function (level, roomsPerLevel, levelHasBoiler) {
	    // "Конструктор" комнат
	    for (var room_id = 1, rooms = []; room_id <= 12; room_id++) {
	        rooms.push(initRoom(level, room_id, room_id <= roomsPerLevel, levelHasBoiler && room_id == roomsPerLevel));
	    }
	    return rooms;
	}

	var setBoilerRoom = function () {
	    iterateActiveLevels(function (level) {
	        iterateActiveRooms(level, function (room) {
	            if (room.isBoilerRoom) {
	                room.name = room.canonicalName;
	                room.isBoilerRoom = false;
	            }
	        });
	        level.isBoiler = false;
	    });

	    var onRoom = 1; // котельная на кухне

	    // если в отдельном помещении - то занимаем последнюю комнату
	    if (Cfg.boiler.roomType == 1) {
	        for (var room = Cfg.levels[Cfg.boiler.level - 1].rooms.length - 1; room >= 0 ; room--) {
	            if (Cfg.levels[Cfg.boiler.level - 1].rooms[room].isRoom) {
	                onRoom = Cfg.levels[Cfg.boiler.level - 1].rooms[room].id;
	                break;
	            }
	        }
	    }


	    Cfg.levels[Cfg.boiler.level - 1].rooms[onRoom - 1].isBoilerRoom = true;
	    Cfg.levels[Cfg.boiler.level - 1].isBoiler = true;

	    if (Cfg.levels[Cfg.boiler.level - 1].rooms[onRoom - 1].name != 'Кухня') {
	        Cfg.levels[Cfg.boiler.level - 1].rooms[onRoom - 1].name = 'Котельная';
	    }
	}

	var initLevels = function(boiler){
		var
			rooms_per_level = 5
		;

		// "Конструктор" радиаторов
		for(var radiator_id = 1, radiators = []; radiator_id <= 3; radiator_id++){
		    radiators.push(initRadiators(radiator_id));
		}

		// "Конструктор" этажей
		for(var level_id = 1, levels = []; level_id <= 3; level_id++) {

		    // "Конструктор" коллекторов
		    // всего коллекторов - 4 (два теплого пола + 2 радиаторов)
			for (var collector_id = 1, collectors = []; collector_id <= 2; collector_id++) {
			    collectors.push({ // Коллекторы по умолчанию
			        id: collector_id,											// id, он же тип колектора: радиаторов || теплых полов
			        name: collector_id <= 1 ? 'Коллектор радиаторов' : 'Коллектор теплых полов',
			        type: collector_id <= 1 ? 'radiator' : 'floor',			        
			        levels: {															// Этажи коллекторов
			            1: level_id == 1,
			            2: level_id == 2,
			            3: level_id == 3
			        },
			        isCollector: function () {
			            return (this.levels[1] || this.levels[2] || this.levels[3])/* && this.entries > 0*/
			        }, // Коллектор: есть
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
			        fit_088U0301: collector_id > 1 ? 1 : 0 // термостат безопасности
			    });
			}

			levels.push({ // Этажи по умолчанию
				id: level_id,
				//name: level_id == 3 && 'Подвал' || 'Этаж ' + (level_id),
				name: level_id == 1 ? '1 этаж' : level_id == 2 ? '2 этаж' : '3 этаж',
				canonicalName: function(){
					return(this.isBasement && 'Подвал' || this.name);
				},
				isLevel: level_id <= Cfg.cottage.levelsCount, //level_id != 3,
				roomsCount: rooms_per_level,
				isBasement: false,
				isBoiler: false,
				//isCollectors: true, //level_id == 1 || false,
				//isFloors: false,
				collectors: collectors,
				rooms: initRooms(level_id - 1, rooms_per_level, false)
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

		Cfg.levels = levels;

		if (Cfg.boiler.isBoiler) {
		    // Котельная на первом этаже в отдельном помещении
		    Cfg.boiler.level = 1;
		    Cfg.boiler.roomType = 1;
		    setBoilerRoom();
		}
	}

    //@private методы

	var updateRoomsConfiguration = function (alertCallback) {
	    alertCallback = alertCallback ? alertCallback : function (title, message) {
	        console.log(title);
	        console.log(message);
	    };
	    var Configurator = Cfg;
	    var
			area = Cfg.cottage.area,
			levels_count = Cfg.cottage.levelsCount
	    ;

	    for (var level in Configurator.levels) {
	        var total_radiators_count = Math.ceil(Math.sqrt(area * levels_count / 5) / levels_count);
	        for (var room in Configurator.levels[level].rooms) {

	            //make room available if it is required
	            var roomInstance = Configurator.levels[level].rooms[room];
	            roomInstance.isRoom = roomInstance.id <= Configurator.levels[level].roomsCount;

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

		Configurator.RefreshCollectorsCount(alertCallback);
	}

	var updateCottageConfiguration = function (alertCallback) {

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

	    updateRoomsConfiguration(alertCallback);
	}

    // @private автоконфигурирование коллекторов радиаторов для каждого этажа
	var refreshRadiatorCollectorsCount = function(alertCallback){
		 alertCallback = alertCallback ? alertCallback : function (title, message) {
	        console.log(title);
	        console.log(message);
	    };
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
					alertCallback("Превышено ограничение в 24 захода на один коллектор.", "Для решения вопроса обратитесь в данфосс");
	            }

	            for (var i in Cfg.levels[level].collectors) {
	                if (Cfg.levels[level].collectors[i].type == 'radiator') {
	                    // если кол0во коллекторов больше нуля, то активируем текущий
	                    if (collectors_count > 0) {
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
	                        Cfg.levels[level].collectors[i].levels = {															// Этажи коллекторов
	                            1: false,
	                            2: false,
	                            3: false
	                        };
	                    }
	                }
	            }
	        }
	    }
	}


    // @private автоконфигурирование коллекторов теплого пола для каждого этажа
	var refreshCollectorsCount = function (alertCallback) {
		 alertCallback = alertCallback ? alertCallback : function (title, message) {
	        console.log(title);
	        console.log(message);
	    };
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
					alertCallback("Превышено ограничение в 24 захода на один коллектор.", "Для решения вопроса обратитесь в данфосс");
	            }

	            for (var i in Cfg.levels[level].collectors) {
	                if (Cfg.levels[level].collectors[i].type == 'floor') {
	                    // если кол0во коллекторов больше нуля, то активируем текущий
	                    if (collectors_count > 0) {
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
	                        Cfg.levels[level].collectors[i].levels = {															// Этажи коллекторов
	                            1: false,
	                            2: false,
	                            3: false
	                        };
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
	var setCollectorEntriesForLevel = function (alertCallback) {
	    alertCallback = alertCallback ? alertCallback : alert;
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
	                alertCallback("Превышено ограничение в 24 захода на один коллектор.", "Для решения вопроса обратитесь в данфосс");
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
	                    for (var j = 0; j < Cfg.levels[__level].collectors.length; j++) {
	                        if (Cfg.levels[__level].collectors[j].isCollector()) {
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
	        refreshCollectorsCount(alertCallback);
	        //return;
	    }

	    if (rebuild_radiator_collectors) {
	        refreshRadiatorCollectorsCount(alertCallback);
	        //return;
	    }

	    // по всем этажам - по всем коллекторам - рассовываем петли (в имеющейся конфигурации)
	    for (var level in Cfg.levels) {
	        // если этаж активный
	        if (Cfg.levels[level].isLevel) {
	            for (var i in Cfg.levels[level].collectors) {
	                if (Cfg.levels[level].collectors[i].isCollector()) {
	                    // смотрим к каким этажам подключен коллектор
	                    for (var __l = 0; __l < 3; __l++) {
	                        // __l-ый этаж
	                        if (Cfg.levels[level].collectors[i].levels[__l + 1]) {
                                // если __l-ый этаж подключен к этому коллектору, то считаем сколько входов есть
	                            var _entries = Cfg.levels[level].collectors[i].type == 'floor' ? Cfg.levels[__l].floor_loops_count : Cfg.levels[__l].radiators_count;
	                            
	                            if (Cfg.levels[level].collectors[i].entries + _entries > 24) {
	                                alertCallback("Превышено ограничение в 24 захода на один коллектор.", "Для решения вопроса обратитесь в данфосс");
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
	var boiler = initBoiler();
	initLevels(boiler);
    //initCollectors();

	Cfg.SetBoilerRoom = function () {
	    setBoilerRoom();
	}

    // @public автоконфигурирование коллекторов радиаторов и теплых полов
	Cfg.RefreshCollectorsCount = function (alertCallback) {

	    Cfg.properties.autoCalcCollectorInputs = true;

	    refreshCollectorsCount(alertCallback);

	    refreshRadiatorCollectorsCount(alertCallback);
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

    Cfg.createCollector = function(id, type, levelId) {
        return {
            // Коллекторы по умолчанию
            id: id, // id, он же тип колектора: радиаторов || теплых полов
            name: type === 'radiator' ? 'Коллектор радиаторов' : 'Коллектор теплых полов',
            type: type,
            levels: {
                // Этажи коллекторов
                1: levelId == 1,
                2: levelId == 2,
                3: levelId == 3
            },
            isCollector: function() {
                return (this.levels[1] || this.levels[2] || this.levels[3]) /* && this.entries > 0*/
            }, // Коллектор: есть
            entries: 0, // Количество заходов коллектора радиаторов на этаже
            sets: id == 1 && 13 || 2, // Коллектор (зависит от типа и количества заходов)
            isFlowmeter: type === 'floor', // Расходомер (для коллектора теплых полов: есть)
            isBallValves: true, // Шаровые краны
            isThermometers: true, // Термометры
            thermometersCount: 1, // Количество термометров
            _thermometerIn: true,
            _thermometerOut: false,
            fittings: 0, // Фитинги для трубы
            mixing: type === 'floor', // Узел смешения
            fit_088U0305: 0, // фиттинги для узла смешения
            fit_088U0301: type === 'floor' ? 1 : 0 // термостат безопасности
        };
    };

    // @public пересчет входов коллекторов без изменения конфигурации по этажам
	Cfg.UpdateCollectorEntries = function (alertCallback) {
	    setCollectorEntriesForLevel(alertCallback);
	}


    // @public пересчет кол-ва радиаторов и теплых полов в комнатах
	Cfg.UpdateRoomsConfiguration = function (alertCallback) {
	    updateRoomsConfiguration(alertCallback);
	}

	Cfg.UpdateCottageConfiguration = function (alertCallback) {
	    updateCottageConfiguration(alertCallback);
	}

    // снимает коллектор с этажа
	Cfg.UnSetCollectorForLevel = function (currentLevel, currentCollector, collectorForLevel) {
	    angular.forEach(Cfg.levels, function (_level) {
	        angular.forEach(_level.collectors, function (_collector, key2) {
	            if (currentLevel.id != _level.id && _collector.type == currentCollector.type && _collector.isCollector())
	                if (_collector.levels[collectorForLevel]) {
	                    _collector.levels[collectorForLevel] = false;
	                    return _collector;
	                }
	        });
	    });
	}
    // устанавливает коллектор на этаж
	Cfg.SetCollectorForLevel = function (collector, collectorForLevel) {
	    collector.levels[collectorForLevel] = true;
	}
    // currentLevel - этаж на котором установлен коллектор
    // collectorForLevel номер этажа которвц подключается\отключается от коллектора
    // levels - ссылка на этажи
    // currentCollector - ссылка на коллектор
	Cfg.ValidateCollectors = function (currentLevel, collectorForLevel, levels, collector, alertCallback, popupCallback) {
        if (!alertCallback) {
            alertCallback = function (str) { };
        }

        if (!popupCallback) {
            popupCallback = function (currentCollector) { };
        }

	    if (collector.levels[collectorForLevel]) {
	        // включили этаж
            // если установили здесь, то надо где-то снять
	        // если коллектор на этаже включается, то пересчитать входы
	        
	        var unsetted = Cfg.UnSetCollectorForLevel(currentLevel, collector, collectorForLevel);
	        setCollectorEntriesForLevel(function () {
	            alertCallback("Превышено ограничение в 24 захода на один коллектор.", "Для решения вопроса обратитесь в данфосс");
	            // откатываем изменения
	            collector.levels[collectorForLevel] = false;
	            unsetted.levels[collectorForLevel] = true;
	        });
	        return;
	    } else {
	        // выключили этаж
	        if (collector.isCollector() == true) {
	            angular.forEach(levels[collectorForLevel - 1].collectors, function (_collector, key2) {
	                if (_collector.type == collector.type)
	                    Cfg.SetCollectorForLevel(_collector, collectorForLevel);
	            });
	            setCollectorEntriesForLevel(function () {
	                alertCallback("Превышено ограничение в 24 захода на один коллектор.", "Для решения вопроса обратитесь в данфосс");
	                // откатываем изменения
	                collector.levels[collectorForLevel] = false;
	                unsetted.levels[collectorForLevel] = true;
	            });
	            return;
	        }
	        
	        // если выключили все этажи у коллектора, то отключается и коллектор
	    }

	    var collector_id = collector.id;
	    if (collector.isCollector() == false) {
	        // Коллектор радиаторов должен быть минимум один, должно быть нельзя выключить все
	        var noRadiatorCollectors = true;
	        iterateActiveLevels(function (_level) {
	            angular.forEach(_level.collectors, function (_collector, key2) {
	                if (_collector.type == 'radiator' && _collector.isCollector())
	                    noRadiatorCollectors = false;
	            });
	        });

	        if (noRadiatorCollectors) {
	            alertCallback("Коллектор радиаторов должен быть как минимум один.");
	            collector.levels[collectorForLevel] = true;
	            return;
	        }

	        if (collector.type == 'floor') {
	            // Если есть теплый пол - значит должен быть коллектор, минимум один
	            var isFloorExists = false;
	            var isFloorCollectorExists = false;
	            iterateActiveLevels(function (_level) {
	                angular.forEach(_level.rooms, function (_room) {
	                    isFloorExists = isFloorExists || (_room.isRoom && _room.floors.isFloors);
	                    angular.forEach(_level.collectors, function (_collector, key2) {
	                        if (_collector.type == 'floor') {
	                            isFloorCollectorExists = isFloorCollectorExists || (_collector.type == 'floor' && _collector.isCollector());
	                        }
	                    });
	                });
	            });
	            if (isFloorExists && !isFloorCollectorExists) {
	                alertCallback("Коллектор теплых полов должен быть как минимум один");
	                collector.levels[collectorForLevel] = true;
	                return;
	            }
	        }

	        if (collector.entries > 0) {
	            popupCallback(collector);
	        }
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
			        pushToBasket(_basket, _room.radiators.controlType, 1)
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
							    if (_control.length == 3) {
							        pushToBasket(_basket, _control[0], eval(_control[1]), _control[2]);
							    } else {
							        pushToBasket(_basket, _control[0], _radiator.count * eval(_control[1]), 'radiator-control');
							    }
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
						    if (_control.length == 3) {
						        pushToBasket(_basket, _control[0], eval(_control[1]), _control[2]);
						    } else {
						        pushToBasket(_basket, _control[0], eval(_control[1]), 'floor-control');
						    }
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

			    if (_collector.isCollector()) {

			        var collector_1 = _collector.entries;
			        angular.forEach(Configurator.params.collector.sets, function (_set) {
			            if (_collector.type == 'radiator' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    if (_sets.length == 3) {
			                        pushToBasket(_basket, _sets[0], eval(_sets[1]), _sets[2]);
			                    }else{
			                        pushToBasket(_basket, _sets[0], eval(_sets[1]), 'radiator-collector');
			                    }
			                });
			            }
			            if (_collector.type == 'floor' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    if (_sets.length == 3) {
			                        pushToBasket(_basket, _sets[0], eval(_sets[1]), _sets[2]);
			                    } else {
			                        pushToBasket(_basket, _sets[0], eval(_sets[1]), 'floor-collector');
			                    }
			                });
			            }
			        });
			    }

			    _collector.isCollector() && (
					(_collector.isBallValves && angular.forEach(Configurator.params.collector.ballValves[0].basket, function (_ballValves) {
					    pushToBasket(_basket, _ballValves[0], _ballValves[1], _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					}))
					+
					(_collector.isThermometers && angular.forEach(Configurator.params.collector.thermometers[0].basket, function (_thermometers) {
					    pushToBasket(_basket, _thermometers[0], eval(_thermometers[1]), _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					}))
					+
					(_collector.fittings && angular.forEach(Configurator.params.fittings[_collector.fittings - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _collector.entries, _collector.type == 'radiator' ? 'radiator-collector-fitting' : 'floor-collector-fitting');
					}))
                    +
					(_collector.fit_088U0305 && angular.forEach(Configurator.params.collector.fit_088U0305[_collector.fit_088U0305 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _collector.type == 'radiator' ? 'radiator-collector-fitting' : 'floor-collector-fitting');
					}))
                    +
					(_collector.fit_088U0301 && angular.forEach(Configurator.params.collector.fit_088U0301[_collector.fit_088U0301 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _collector.type == 'radiator' ? 'radiator-collector-fitting' : 'floor-collector-fitting');
					}))
					+
					(_collector.mixing && angular.forEach(Configurator.params.collector.mixing[_collector.mixing - 1].basket, function (_mixing) {
					    pushToBasket(_basket, _mixing[0], _mixing[1], _collector.type == 'radiator' ? 'radiator-collector' : 'floor-collector');
					})))
			}));
	    });

	    Configurator.boiler.isBoiler && Configurator.boiler.pump > 0
            && pushToBasket(_basket, Configurator.params.boiler.pump[Configurator.boiler.pump - 1].basket[0][0], 1, 'boiler');

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
            && (angular.forEach(_level.collectors, function (_collector) {

                if (_collector.isCollector()) {

                    var collector_1 = _collector.entries;
                    angular.forEach(Configurator.params.collector.sets, function (_set) {
                        if (_collector.type == 'radiator' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
                            angular.forEach(_set.basket, function (_sets) {
                                pushToBasket(_basket, _sets[0], eval(_sets[1]), _level.name + '|Коллектор радиаторов');
                            });
                        }
                        if (_collector.type == 'floor' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
                            angular.forEach(_set.basket, function (_sets) {
                                pushToBasket(_basket, _sets[0], eval(_sets[1]), _level.name + '|Коллектор теплого пола');
                            });
                        }
                    });
                }

                _collector.isCollector() && (
					(_collector.isBallValves && angular.forEach(Configurator.params.collector.ballValves[0].basket, function (_ballValves) {
					    pushToBasket(_basket, _ballValves[0], _ballValves[1], _level.name + '|' + (_collector.type == 'floor' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
					}))
					+
					(_collector.isThermometers && angular.forEach(Configurator.params.collector.thermometers[0].basket, function (_thermometers) {
					    pushToBasket(_basket, _thermometers[0], eval(_thermometers[1]), _level.name + '|' + (_collector.type == 'floor' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
					}))
					+
					(_collector.fittings && angular.forEach(Configurator.params.fittings[_collector.fittings - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _collector.entries, _level.name + '|' + (_collector.type == 'floor' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
					}))
                    +
					(_collector.fit_088U0305 && angular.forEach(Configurator.params.collector.fit_088U0305[_collector.fit_088U0305 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _level.name + '|' + (_collector.type == 'floor' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
					}))
                    +
					(_collector.fit_088U0301 && angular.forEach(Configurator.params.collector.fit_088U0301[_collector.fit_088U0301 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1], _level.name + '|' + (_collector.type == 'floor' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
					}))
					+
					(_collector.mixing && angular.forEach(Configurator.params.collector.mixing[_collector.mixing - 1].basket, function (_mixing) {
					    pushToBasket(_basket, _mixing[0], _mixing[1], _level.name + '|' + (_collector.type == 'floor' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
					})))
            }))
			&&
			(angular.forEach(_level.rooms, function (_room) {
			    _room.id <= _level.roomsCount && (
					(angular.forEach(_room.radiators.list, function (_radiator) {
					    _radiator.id <= _room.radiators.radiatorsTypes && (
							(_radiator.type == 1 && _radiator.control && angular.forEach(Configurator.params.room.radiators.control[_radiator.control - 1].basket, function (_control) {
							    if (_control.length == 3) {
							        pushToBasket(_basket, _control[0], eval(_control[1]), _level.name + '|' + (_control[2] == 'floor-collector' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
							    } else {
							        pushToBasket(_basket, _control[0], _radiator.count * eval(_control[1]), _level.name + '|' + _room.name);
							    }
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
						    if (_control.length == 3) {
						        pushToBasket(_basket, _control[0], eval(_control[1]), _level.name + '|' + (_control[2] == 'floor-collector' ? 'Коллектор теплого пола' : 'Коллектор радиаторов'));
						    } else {
						        pushToBasket(_basket, _control[0], eval(_control[1]), _level.name + '|' + _room.name);
						    }
						}))
						+
						(_room.floors.fittings && angular.forEach(Configurator.params.fittings[_room.floors.fittings - 1].basket, function (_fittings) {
						    pushToBasket(_basket, _fittings[0], 2, _level.name + '|' + _room.name);
						}))
					)
                    +
                    (_room.isBoilerRoom && Configurator.boiler.pump > 0
                        && pushToBasket(_basket, Configurator.params.boiler.pump[Configurator.boiler.pump - 1].basket[0][0], 1, _level.name + '|' + _room.name))
				)
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

	    for (var k in _basket) {
	        _basket[k] = Math.ceil(_basket[k]);
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

    // функция которая мержит два объекта игнорируя методы - из obj2 -> obj1
	var merge = function (obj1,obj2){ // Our merge function

	    for (var i in obj2) { // add the remaining properties from object 2

	        if (typeof obj2[i] == 'function' || typeof obj1[i] == 'function') continue;

	        if (typeof obj2[i] === "object" && obj2[i] != null) {
	            if (!obj1[i])
	                obj1[i] = {};

	            merge(obj1[i], obj2[i]);
	        } else {
	            obj1[i] = obj2[i];
	        }
	    }
	    return obj1;
	}

	Cfg._serializeConfiguration = function (successCallback) {
	    var savedObj = {
	        cottage: Cfg.cottage,
	        levels: Cfg.levels,
	        collectors: Cfg.collectors,
	        boiler: Cfg.boiler,
	        name: Cfg.name
	    }

	    if (typeof successCallback === 'undefined') {
	        successCallback = function () { };
	    }

	    Catalog.fetch().then(function (data) {
	        var
                price = 0,
                basket = Cfg.Basket(),
                catalog = data
	        ;

	        if (typeof catalog == 'undefined') return 0;
	        for (var k in basket) {
	            if (catalog[k])
	                price += basket[k] * catalog[k].price;
	        }
	        price = Math.round(price);

	        successCallback({ name: Cfg.name, savedObj: JSON.stringify(savedObj), price: price });
	    });
	}

    // Метод сохраняющий конфигурацию авторизованного пользователя
	Cfg.saveConfiguration = function (successCallback, failCallback) {
	    var savedObj = {
	        cottage: Cfg.cottage,
	        levels: Cfg.levels,
	        collectors: Cfg.collectors,
	        boiler: Cfg.boiler,
            name: Cfg.name
	    }

	    if (typeof successCallback === 'undefined') {
	        successCallback = function () { };
	    }

	    if (typeof failCallback === 'undefined') {
	        failCallback = function () { };
	    }
        // В любом случае сохраняем в localStorage
	    StorageManager.saveLocalStorage({ key: "Danfoss.LastConfiguration", val: savedObj });
	    // если пользователь залогинен
	    CurrentUser.isGuidExistsInDB().then(
            function (m) {
                Cfg._serializeConfiguration(function (conf) {
                    // сохраняем на сервере
                    CurrentUser.SaveConfiguration(conf.name, conf.savedObj, conf.price).then(function (res) {
                        successCallback(res);
                    }, function (res) {
                        failCallback(res);
                    });
                })
            },
            function ()
	        {
	            successCallback();
	        });
	}

    // Метод отправляющий конфигурацию на email
	Cfg.sendConfiguration = function (email, successCallback, failCallback) {
	    var savedObj = {
	        cottage: Cfg.cottage,
	        levels: Cfg.levels,
	        collectors: Cfg.collectors,
	        boiler: Cfg.boiler,
	        name: Cfg.name
	    }

	    if (typeof successCallback === 'undefined') {
	        successCallback = function () { };
	    }

	    if (typeof failCallback === 'undefined') {
	        failCallback = function () { };
	    }
	    // В любом случае сохраняем в localStorage
	    StorageManager.saveLocalStorage({ key: "Danfoss.LastConfiguration", val: savedObj });
	    // если пользователь залогинен
	    CurrentUser.isGuidExistsInDB().then(
            function (m) {
                Cfg._serializeConfiguration(function (conf) {
                    // сохраняем на сервере
                    CurrentUser.SendConfiguration(email, conf.name, conf.savedObj, conf.price).then(function (res) {
                        successCallback(res);
                    }, function (res) {
                        failCallback(res);
                    });
                })
            },
            function () {
                successCallback();
            });
	}

    // Восстанавливает конфигурацию по Id
	Cfg.restoreConfiguration = function (id, callback) {
	    var restoredCfg = null;

	    if (typeof callback === 'undefined') {
	        callback = function () { };
	    }
	    // если Id не задан то пытаемся из localStorage
        if (typeof id === 'undefined')
            var restoredCfg = StorageManager.loadLocalStorage({ key: "Danfoss.LastConfiguration", val: null });
        // если не получилось или задан какой-то конкретный идентификатор, то достаем его
        if (restoredCfg === null) {
            CurrentUser.isGuidExistsInDB().then(
                function () {
                    CurrentUser.LoadConfiguration(id).then(function (r) {
                        Cfg.restoreJsonConfiguration(r);
                        callback();
                    });
                });
        } else {
            Cfg.restoreJsonConfiguration(restoredCfg)
            callback();
        }
	}

	Cfg.generateConfigurationName = function () {
	    CurrentUser.SetOrderName().then(function (name) { Cfg.name = name;})
	}

	Cfg.restoreJsonConfiguration = function (restoredCfg) {
	    Cfg.name = restoredCfg.name;
	    merge(Cfg.cottage, restoredCfg.cottage);
	    merge(Cfg.levels, restoredCfg.levels);
	    merge(Cfg.collectors, restoredCfg.collectors);
	    merge(Cfg.boiler, restoredCfg.boiler);
	}

	Cfg.ReInitConfigurator = function (alertCallback) {

	    Cfg.cottage = {
	        area: 160,
	        levelsCount: 2
	    };
	    Cfg.levels = [];
	    Cfg.collectors = [];
	    Cfg.boiler = {};
	    Cfg.properties = {
	        autoCalcCollectorInputs: true // авторасчет входов коллектора
	    };

	    boiler = initBoiler();
	    initLevels(boiler);
	    Cfg.generateConfigurationName();
	    updateCottageConfiguration(alertCallback);
	}

    updateCottageConfiguration();

    Cfg.generateConfigurationName();

    // при старте пытаемся достать последнюю конфигурацию с которой работали
    Cfg.restoreConfiguration();

	return Cfg;
});

// Фабрика работы с каталогом
appConfigurator.factory('Catalog', function ($q, $timeout, $http, appConfig) {
    var _jsonCatalogData = undefined;

    var _Catalog = {
        // Загрузить каталог
	    fetch: function () {
			var deferred = $q.defer();
			$timeout(function() {
			    if (typeof _jsonCatalogData != 'undefined') {
			        deferred.resolve(_jsonCatalogData);
			        return;
			    }
			    $http.jsonp(appConfig.appPath + "/json/all?jsonp=JSON_CALLBACK")
				.success(function (data) {
				    _jsonCatalogData = data.data;
					deferred.resolve(data.data);
				})
				.error(function (data) {
					return;
				});

			}, 0);
			return deferred.promise;
	    },
        // Отправить заказ на сервер и отредиректить пользователя
		makeOrder: function (orderName, basket, configurationObj, price) {
		    var deferred = $q.defer();
		    $timeout(function () {
		        var data = { orderName: orderName, codes: "", configurationObj: configurationObj, price: price };
		        for (var b in basket){
		            data.codes += b + " " + basket[b] + "; ";
		        }
		        $http.post(appConfig.appPath + "/checkout/MakeExternalOrder/", data)
				.success(function (data) {
				    document.location.href = appConfig.appPath + "/Checkout/Cart";
				})
				.error(function (data) {
				    return;
				});

		    }, 30);
		},

        fetchFake: function() {
            var deferred = $q.defer();
            $.ajax({
                    url: 'common/js/test-catalog.js',
                    dataType: 'json',
                    cache: false
                })
                .success(function(data) {
                    deferred.resolve(data.data);
                })
                .error(function() {
                    console.log('Test data retrieving failed.');
                    deferred.resolve({});
                });

            return deferred.promise;
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
