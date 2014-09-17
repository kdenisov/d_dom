function getScheme(){
    var Cfg = {};

    var initStructure = function() {
        Cfg = {
            levels: [],
            boilers: {},
            cottage: {
                area: 160,
                levelsCount: 2
            },
            params: {
                room: {
                    roomNames: [
                        ['Кухня', 'Гостиная', 'Санузел', 'Прихожая', 'Спальня 1', 'Ванная', 'Спальня 2', 'Коридор', 'Спальня 3', 'Спальня 4'],
                        ['Спальня 1', 'Спальня 2', 'Спальня 3', 'Санузел', 'Ванная', 'Гостиная', 'Спальня 4', 'Коридор', 'Спальня 5', 'Спальня 6'],
                        ['Спальня 1', 'Спальня 2', 'Спальня 3', 'Санузел', 'Ванная', 'Гостиная', 'Спальня 4', 'Коридор', 'Спальня 5', 'Спальня 7']
                    ]
                }
            }
        };
    };


    var initBoiler = function() {
        // "Конструктор" котельной
        Cfg.boilers = {};
        // Котельная по умолчанию
        Cfg.boilers.isBoiler = true;
        Cfg.boilers.level = 1;
        Cfg.boilers.roomType = 1;
        Cfg.boilers.canonicalName = function() {
                return(this.roomType == 1 && 'Котельная' || 'Кухня');
            },
            Cfg.boilers.embodiment = 1;
        Cfg.boilers.hws = 1;
        Cfg.boilers.pump = 1;
        Cfg.boilers.hose_05 = 0;
        Cfg.boilers.hose_08 = 0;
        Cfg.boilers.hose_10 = 0;
        return Cfg.boilers;
    };

    var initRadiators = function() {
        // "Конструктор" радиаторов
        for (var radiator_id = 1, radiators = []; radiator_id <= 3; radiator_id++) {
            var r = {
                id: radiator_id,
                type: 1, // Вид радиатора: Обычный
                connection: 2, // Подключение: Нижнее
                builtinValve: 2, // Встроенный клапан: RA
                pipework: 1, // Разводка трубопроводов: В стяжке/По плинтусу
                use: 1, // Применение: Радиатор
                control: 2, // Управление (отдельное)
                valves: 40, // Клапаны: RLV-KD прямой 3/4"
                fittingsType: 2, // Тип фитингов: Внутренняя 3/4"
                fittings: 0, // Фитинги
                controlType: 1,
                connectSide: 1,
                count: radiator_id == 1 ? 2 : 0 // Количество радиаторов	            
            };

            radiators.push(r);
        }
        return radiators;
    };

    var room = function(level, room_id, active, hasBoiler) {
        var floor = {
// Теплые полы
            isFloors: level == 0, // Теплые полы: есть
            loops: 1, // Количество петель
            control: 2, // Управление
            fittings: 0 // Фитинги
        };

        var radiators = {
            controlType: 1, // Управление: Отдельное
            commonControl: null, // Общее управление
            radiatorsTypes: 1, // Типов радиаторов
            list: initRadiators() // Радиаторы
        };

        return {
// Комнаты по умолчанию
            id: room_id,
            isRoom: active && true,
            isBoilerRoom: hasBoiler && true,
            name: Cfg.params.room.roomNames[level][room_id - 1],
            radiators: radiators,
            floors: floor, // объект теплого пола
            visited: false,

            // @public methods
            getRadiatorsCount: function() {
                var radiators_count = 0;
                for (var r in radiators.list) {
                    radiators_count += radiators.list[r].count;
                }
                return radiators_count;
            },
            setFloorLoops: function(loops) { // метод устанавливающий значение петель для теплого пола
                floor.loops = loops;
                floor.isFloors = (loops > 0);

                setCollectorEntriesForLevel();
            },

            copyTo: function(destRoom) { // метод копирующий все параметры комнаты
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
                    destRoom.radiators.list[r].type = radiators.list[r].type; // Вид радиатора
                    destRoom.radiators.list[r].connection = radiators.list[r].connection; // Подключение
                    destRoom.radiators.list[r].builtinValve = radiators.list[r].builtinValve; // Встроенный клапан
                    destRoom.radiators.list[r].pipework = radiators.list[r].pipework; // Разводка трубопроводов
                    destRoom.radiators.list[r].use = radiators.list[r].use; // Применение
                    destRoom.radiators.list[r].control = radiators.list[r].control; // Управление
                    destRoom.radiators.list[r].valves = radiators.list[r].valves; // Клапаны
                    destRoom.radiators.list[r].fittingsType = radiators.list[r].fittingsType; // Тип фитингов
                    destRoom.radiators.list[r].fittings = radiators.list[r].fittings; // Фитинги
                    destRoom.radiators.list[r].count = radiators.list[r].count;
                }

                // клонирование полов
                destRoom.floors.isFloors = destRoom.floors.isFloors; // Теплые полы: есть
                destRoom.floors.loops = destRoom.floors.loops; // Количество петель
                destRoom.floors.control = destRoom.floors.control; // Управление
                destRoom.floors.fittings = destRoom.floors.fittings;
            }
        };
    };

    var initRooms = function(level, roomsPerLevel, levelHasBoiler) {
        // "Конструктор" комнат
        for (var room_id = 1, rooms = []; room_id <= 12; room_id++) {
            rooms.push(room(level, room_id, room_id <= roomsPerLevel, levelHasBoiler && room_id == roomsPerLevel));
        }
        return rooms;
    };

    var initLevels = function() {
        var
            rooms_per_level = 5;

        // "Конструктор" радиаторов
        for (var radiator_id = 1, radiators = []; radiator_id <= 3; radiator_id++) {
            radiators.push(initRadiators(radiator_id));
        }

        // "Конструктор" этажей
        for (var level_id = 1, levels = []; level_id <= 3; level_id++) {

            var levelHasBoiler = Cfg.boilers.level == level_id;

            // "Конструктор" коллекторов
            // всего коллекторов - 4 (два теплого пола + 2 радиаторов)
            for (var collector_id = 1, collectors = []; collector_id <= 2; collector_id++) {
                collectors.push({
// Коллекторы по умолчанию
                    id: collector_id, // id, он же тип колектора: радиаторов || теплых полов
                    name: collector_id <= 1 ? 'Коллектор радиаторов' : 'Коллектор теплых полов',
                    type: collector_id <= 1 ? 'radiator' : 'floor',
                    isCollector: function () { return this.levels[1] || this.levels[2] || this.levels[3] }, // Коллектор: есть
                    levels: {
// Этажи коллекторов
                        1: level_id == 1,
                        2: level_id == 2,
                        3: level_id == 3
                    },
                    entries: 0, // Количество заходов коллектора радиаторов на этаже
                    sets: collector_id == 1 && 13 || 2, // Коллектор (зависит от типа и количества заходов)
                    isFlowmeter: collector_id > 1, // Расходомер (для коллектора теплых полов: есть)
                    isBallValves: true, // Шаровые краны
                    isThermometers: true, // Термометры
                    thermometersCount: 1, // Количество термометров
                    _thermometerIn: true,
                    _thermometerOut: false,
                    fittings: 0, // Фитинги для трубы
                    mixing: collector_id > 1 && 1 || 0, // Узел смешения
                    fit_088U0305: 0, // фиттинги для узла смешения
                    fit_088U0301: 0 // термостат безопасности
                });
            }

            levels.push({
// Этажи по умолчанию
                id: level_id,
                //name: level_id == 3 && 'Подвал' || 'Этаж ' + (level_id),
                name: level_id == 1 ? '1 этаж' : level_id == 2 ? '2 этаж' : '3 этаж',
                canonicalName: function() {
                    return(this.isBasement && 'Подвал' || this.name);
                },
                isLevel: level_id <= Cfg.cottage.levelsCount, //level_id != 3,
                roomsCount: rooms_per_level,
                isBasement: false,
                isBoiler: levelHasBoiler,
                //isCollectors: true, //level_id == 1 || false,
                //isFloors: false,
                collectors: collectors,
                rooms: initRooms(level_id - 1, rooms_per_level, levelHasBoiler)
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

        if (Cfg.boilers.isBoiler) {
            for (room = levels[Cfg.boilers.level - 1].rooms.length - 1; room >= 0; room--) {
                if (levels[Cfg.boilers.level - 1].rooms[room].isRoom) {
                    levels[Cfg.boilers.level - 1].rooms[room].isBoilerRoom = true;
                    break;
                }
            }
        }


        Cfg.levels = levels;
    };
    
    //@private методы
    // @private пересчет кол-ва входов для конкретного этажа (не меняя конфигурацию коллекторов)
    var setCollectorEntriesForLevel = function() {

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
            refreshCollectorsCount();
            //return;
        }

        if (rebuild_radiator_collectors) {
            refreshRadiatorCollectorsCount();
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
    };

    var updateRoomsConfiguration = function() {
        var Configurator = Cfg;
        var
            area = Cfg.cottage.area,
            levels_count = Cfg.cottage.levelsCount;

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

        Configurator.RefreshCollectorsCount();
    };

    var updateCottageConfiguration = function() {

        var Configurator = Cfg;

        var
            area = Configurator.cottage.area,
            levels_count,
            rooms_per_level;

        levels_count = (area <= 100) ? 1 : 2, // Количество этажей: до 100 м2 - 1 этаж, больше - 2 этажа
            rooms_per_level = Math.floor(area / levels_count / 15);

        for (var level in Configurator.levels) {
            Configurator.levels[level].isLevel = Configurator.levels[level].id <= levels_count;
            Configurator.levels[level].roomsCount = rooms_per_level;
        }

        Configurator.cottage.levelsCount = levels_count;

        updateRoomsConfiguration();
    };

    // @private автоконфигурирование коллекторов радиаторов для каждого этажа
    var refreshRadiatorCollectorsCount = function() {
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
                        if (collectors_count > 0) {
                            // считаем кол-во заходов
                            Cfg.levels[level].collectors[i].entries = level_radiators_count > 24 ? level_radiators_count % 1 : level_radiators_count;
                            Cfg.levels[level].collectors[i].levels = {
// Этажи коллекторов
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
    };


    // @private автоконфигурирование коллекторов теплого пола для каждого этажа
    var refreshCollectorsCount = function() {
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
                        }
                    }
                }
            }
        }
    };

    initStructure();
    initBoiler();
    initLevels();
    //initCollectors();

    // @public автоконфигурирование коллекторов радиаторов и теплых полов
    Cfg.RefreshCollectorsCount = function() {

        refreshCollectorsCount();

        refreshRadiatorCollectorsCount();
    };

    updateCottageConfiguration();

    var scheme = {
        levels: Cfg.levels,
        boilers: Cfg.boilers,
        currentLevelId: 1,

        levelSwitched: function(level) {
            console.log('level ' + level);
        },
        roomMouseEnter: function(levelId, roomId) {
            console.log('mouse ENTER level ' + levelId + ' room ' + roomId);
        },

        roomMouseLeave: function(levelId, roomId) {
            console.log('mouse LEAVE level ' + levelId + ' room ' + roomId);
        },

        roomAdded: function(levelId, roomId) {
            console.log('added room ' + roomId + ' on level ' + levelId);
        },

        roomRemoved: function(levelId, roomId) {
            console.log('removed room ' + roomId + ' on level ' + levelId);
        },

        roomClicked: function(levelId, roomId) {
            console.log('clicked room ' + roomId + ' on level ' + levelId);
        },

        addRoom: function(levelId, roomId) {
            console.log('attempt to ENABLE room ' + roomId + ' on level ' + levelId);
        },

        removeRoom: function (levelId, roomId) {
            console.log('attempt to DISABLE room ' + roomId + ' on level ' + levelId);
        },

        renameRoom: function (levelId, roomId, newName) {
            console.log('attempt to change the name of the room ' + roomId + ' on level ' + levelId + ' to "' + newName + '"');
        },
    };

    return scheme;
}