'use strict';
// Controllers

appConfigurator.filter('formatNumber', function () {
    return function (n) {
        n = "" + n;
        if (n && n > 9999) return (n.toString().replace(/(?=\B(?:\d{3})+\b)/g, ' '));
        return (n.replace(',', ' '));
    }
});

appConfigurator.filter('ceilNumber', function () {
    return function (n) {
        return Math.ceil(n);
    }
});

appConfigurator.filter('formatDate', function() {
    return function(date) {
        var values = [date.getDate(), date.getMonth()];
        var res = '';
        for (var i in values) {
            res += (values[i] > 9 ? values[i] : '0' + values[i]) + '.';
        }

        res += date.getFullYear();
        return res;
    };
});

appConfigurator.controller('CottageCtrl', function($scope, Configurator, orderByFilter){
	//Configurator = loadLocalStorage({key:'Configurator',val:Configurator});

    //$scope.CONFIGURATOR = Configurator;

    Configurator.params.orderLinksVisible = false;

	$scope.PARAMS = Configurator.params.cottage;
	$scope.COTTAGE = Configurator.cottage;
	$scope.LEVELS = Configurator.levels;
	$scope.BOILER = Configurator.boiler;
	
	$scope.SET_BOILER = function () {
	    Configurator.SetBoilerRoom();
	}
	$scope.UPDATE_ROOMS_COUNT = function () {
	    Configurator.UpdateRoomsConfiguration();
	}

	$scope.UPDATE_COTTAGE_PARAMS = function(){
		var
			area = Configurator.cottage.area,
			levels_count,
			rooms_per_level
		;

		levels_count = (area <= 100) ? 1 : 2, // Количество этажей: до 100 м2 - 1 этаж, больше - 2 этажа
		rooms_per_level = Math.floor(area / levels_count / 15);

		for(var level in Configurator.levels){
		    Configurator.levels[level].isLevel = Configurator.levels[level].id <= levels_count;

            //если был подвал, и этот уровень был убран при пересчете, отменяем флаг подвала в модели
		    Configurator.levels[level].isBasement = Configurator.levels[level].isBasement && Configurator.levels[level].isLevel;

			Configurator.levels[level].roomsCount = rooms_per_level;
		}

		Configurator.cottage.levelsCount = levels_count;

		$scope.UPDATE_ROOMS_COUNT();
	}

	$scope.UPDATE_LEVELS_COUNT = function(){
		var levels_count = 0;

		for(var level in Configurator.levels){
			if(Configurator.levels[level].isLevel) levels_count++;
		}

		Configurator.cottage.levelsCount = levels_count;

		$scope.UPDATE_ROOMS_COUNT();
	}

	$scope.multipleValues = function(expected, actual){  
		return actual.indexOf(expected) > -1;
	};

    $scope.SHOW_HOUSE_IMAGE = function(level, rooms, basement) {
        var count = Configurator.cottage.levelsCount;
        var lastLevel = Configurator.levels[count - 1];
        if (lastLevel.isBasement) {
            count--;
        }

        var size = 's';
        for (var i = 0; i < count; i++) {
            if (Configurator.levels[i].roomsCount > 8) {
                size = 'b';
                break;
            }
        }

        return lastLevel.isBasement == basement && count == level && rooms == size;
    };

    setCustomScroll();
    /*if(Configurator.initialized) return;
	Configurator.initialized = true;

	//Configurator.saveLocalStorage({key:'Configurator',val:Configurator});*/

    //$scope.$watch('CONFIGURATOR.area', setParamsCottage)
    //$scope.$watch('CONFIGURATOR.roomsTotal', setParamsCottage);
});

appConfigurator.controller('SetCollectorDialogCtrl', function ($scope, Configurator, $timeout, $modalInstance, EDITED_COLLECTOR) {

    var
		levels = Configurator.levels
    ;

    $scope.COTTAGE = Configurator.cottage;
    $scope.LEVELS = levels;
    $scope.BOILER = Configurator.boiler;

    $scope.MODAL = $modalInstance;

    $modalInstance.TO_COLLECTOR_ID = 0;
    $modalInstance.TO_COLLECTOR_LEVEL_ID = 0;

    $scope.EDITED_COLLECTOR = EDITED_COLLECTOR;

    $scope.GET_FREE_COLLECTORS = function () {
         if ($scope.EDITED_COLLECTOR == null) return [];

        var res = [];
        angular.forEach($scope.LEVELS, function (_level) {
            angular.forEach(_level.collectors, function (_collector, key2) {
                if (_collector != null
                    && _collector.type == $scope.EDITED_COLLECTOR.type
                    && _collector.isCollector
                    && _collector != $scope.EDITED_COLLECTOR) {
                    _collector.setup_level = _level;
                    _collector.disabled = 24 - _collector.entries < $scope.EDITED_COLLECTOR.entries;
                    _collector._id = _collector.setup_level.id + '|' + _collector.id;
                    res.push(_collector);
                }
            });
        });
        if (res.length > 0 && $modalInstance.TO_COLLECTOR_ID == 0) {
            $modalInstance.TO_COLLECTOR_ID = res[0]._id;
            $modalInstance.TO_COLLECTOR_LEVEL_ID = res[0].setup_level.id;
        }
        return res;
    }

    $scope.SET = function (coll) {
        if (!coll.disabled)
            $modalInstance.TO_COLLECTOR_ID = coll._id;
    }
    $scope.SET_COLLECTOR = function () {
        var _to = $modalInstance.TO_COLLECTOR_ID.split("|")[1];
        var _toLevel = $modalInstance.TO_COLLECTOR_ID.split("|")[0];
        angular.forEach($scope.LEVELS, function (_level) {
            angular.forEach(_level.collectors, function (_collector, key2) {
                if (_collector.id == _to && _level.id == _toLevel) {
                    if (_collector.entries + $scope.EDITED_COLLECTOR.entries > 24) {
                        alert("Превышено ограничение в 24 захода на один коллектор. Для решения вопроса обратитесь в данфосс");
                        return;
                    }
                    _collector.levels[1] = _collector.levels[1] || $scope.EDITED_COLLECTOR.levels[1];
                    _collector.levels[2] = _collector.levels[2] || $scope.EDITED_COLLECTOR.levels[2];
                    _collector.levels[3] = _collector.levels[3] || $scope.EDITED_COLLECTOR.levels[3];
                    _collector.entries += $scope.EDITED_COLLECTOR.entries;
                }
            });
        });
        $scope.EDITED_COLLECTOR.entries = 0;
        $scope.EDITED_COLLECTOR = null;
        $modalInstance.close(true);
    }

    $scope.CANCEL_SET_COLLECTOR = function () {
        $scope.EDITED_COLLECTOR.isCollector = true;
        $scope.EDITED_COLLECTOR = null;
        $modalInstance.close(false);
    }

    setCustomScroll();
});

appConfigurator.service('levelsService', function(Configurator, $stateParams) {
    var $this = this;
    $this.levels = Configurator.levels;
    $this.boiler = Configurator.boiler;
    $this.level = this.levels[$stateParams.levelId - 1];
    $this.collectors = $this.level.collectors;

    $this.setLevel = function(id) {
        $this.level = $this.levels[id - 1];
        $this.collectors = $this.level.collectors;
    };


    $this.hoverRoomId = 0;
    $this.setHoverRoomId = function(id) {
        id = isNaN(id) || id == undefined ? 0 : id;
        $this.hoverRoomId = id;
    };
});

appConfigurator.controller('LevelCtrl', function ($scope, Configurator, levelsService, $stateParams, $modal, $location) {

    $scope.COTTAGE = Configurator.cottage;
    $scope.MODEL = levelsService;
    var currentLevelId = parseInt($stateParams.levelId);
    currentLevelId = isNaN(currentLevelId) ? 1 : currentLevelId;

    //rooms equipment
    var getEquipment = function(Configurator) {
        var equipment = {
            items: [],
            radiatorEnding: function(count) {
                if (count == 1) {
                    return '';
                }

                if (count > 1 && count < 5) {
                    return 'а';
                }

                return 'ов';
            },

            floorEnding: function(count) {
                if (count == 1) {
                    return 'ля';
                }

                if (count > 1 && count < 5) {
                    return 'ли';
                }

                return 'ель';
            }
        };

        for (var l = 0; l < Configurator.levels.length; l++) {
            var levelInstance = Configurator.levels[l];
            if (!levelInstance.isLevel) {
                continue;
            }

            for (var r = 0; r < levelInstance.rooms.length; r++) {
                var roomInstance = levelInstance.rooms[r];
                var roomEquipment = {
                    id: roomInstance.id,
                    levelId: levelInstance.id,
                    thermostats: [],
                    radiators: [],
                    floors: 0
                };

                if (roomInstance.radiators.commonControl) {
                    var control = Configurator.params.room.radiators.control[roomInstance.radiators.commonControl - 1];
                    roomEquipment.thermostats.push({
                        title: 'Комнатный термостат',
                        src: 'common/img/products/' + control.preview,
                    });
                }

                if (roomInstance.floors.isFloors && roomInstance.floors.control > 1) {
                    control = Configurator.params.room.floors.control[roomInstance.floors.control - 1];
                    roomEquipment.thermostats.push({
                        title: 'Термостат теплых полов',
                        src: 'common/img/products/' + control.preview
                    });
                }

                roomEquipment.floors = roomInstance.floors.loops;

                for (var radIndex = 0; radIndex < roomInstance.radiators.list.length; radIndex++) {
                    var radiatorType = roomInstance.radiators.list[radIndex];
                    control = radiatorType.control > 4 ? null : Configurator.params.room.radiators.control[radiatorType.control - 1];
                    var valves = Configurator.params.room.radiators.valves[radiatorType.valves - 1];
                    if (radiatorType.count > 0) {
                        roomEquipment.radiators.push({
                            type: radIndex + 1,
                            thermostat: control ? {
                                title: control.name,
                                src: 'common/img/products/' + control.preview
                            } : null,
                            interconnection: {
                                title: 'Обвязка',
                                src: 'common/img/radiator-preview/' + valves.preview + '.png'
                            },
                            count: radiatorType.count
                        });
                    }
                }

                equipment.items.push(roomEquipment);
            }
        }

        return equipment;
    };

    $scope.EQUIPMENT = getEquipment(Configurator);


    $(function () {
        $('#levels').width($('#viewport-inner').width());
        $(window).resize(function () {
            $('#levels').width($('#viewport-inner').width());
        });
    });

    $(function() {
        var applyToSidebarScope = function (action) {
            var scope = angular.element($('.params-collectors > .group:first')).scope();
            scope.$apply(action);
        };

        window.levelsModule && window.levelsModule.buildLevels('#levels', {
            levels: levelsService.levels,
            boilers: levelsService.boiler,
            currentLevelId: currentLevelId,
            roomMouseEnter: function(levelId, roomId) {
                $scope.$apply(levelsService.setHoverRoomId(roomId));
            },
            roomMouseLeave: function(levelId, roomId) {
                $scope.$apply(levelsService.setHoverRoomId(0));
            },
            levelSwitched: function(levelId) {
                var action = function() { levelsService.setLevel(levelId); };
                $scope.$apply(action);
                applyToSidebarScope(action);
            },
            roomClicked: function(levelId, roomId) {
                $scope.$apply(function() {
                    levelsService.setHoverRoomId(0);
                    $location.path('/room/' + levelId + '/' + roomId);
                });
            },
            roomAdded: function(levelId, roomId) {
                levelsService.level.rooms[roomId - 1].isRoom = true;
            },
            roomRemoved: function(levelId, roomId) {
                levelsService.level.rooms[roomId - 1].isRoom = false;
            },
            addRoom: function(levelId, roomId) {
                console.log('attempt to ENABLE room ' + roomId + ' on level ' + levelId);
            },
            removeRoom: function(levelId, roomId) {
                console.log('attempt to DISABLE room ' + roomId + ' on level ' + levelId);
            },
            renameRoom: function(levelId, roomId, newName) {
                console.log('attempt to change the name of the room ' + roomId + ' on level ' + levelId + ' to "' + newName + '"');
            },
        });
    });

    //setCustomScroll();
});

appConfigurator.controller('LevelCollectorsCtrl', function($scope, $stateParams, Configurator, levelsService) {
    $scope.MODEL = levelsService;

    $scope.EDITED_COLLECTOR = null;

    $scope.ALERT = function (alert) {
        $scope.ALERT_MESSAGE = alert;

        $scope.alertInstance = $modal.open({
            templateUrl: 'alert.html',
            size: 'sm',
            scope: $scope
        });
    };

    $scope.CLOSE_ALERT = function () {
        $scope.alertInstance.close();
    };

    $scope.validateCollectors = function (current_level, collector_levels, collector) {
        Configurator.ValidateCollectors(current_level, collector_levels, collector, $scope.ALERT, function (currentCollector) {
            $scope.EDITED_COLLECTOR = currentCollector;

            $scope.modalInstance = $modal.open({
                templateUrl: 'set-dest-collector.html',
                size: 'sm',
                controller: 'SetCollectorDialogCtrl',
                resolve: {
                    EDITED_COLLECTOR: function () {
                        return $scope.EDITED_COLLECTOR;
                    }
                }
            });

            $scope.modalInstance.result.then(function (res) {
                if (res == false) {
                    currentCollector.isCollector = true;
                } else {
                    currentCollector.entries = 0;
                }
                $scope.EDITED_COLLECTOR = null;
            }, function () { currentCollector.isCollector = true; });
        });
    };

    $scope.refreshRadiatorCollectorsCount = function () {
        Configurator.RefreshCollectorsCount();
    };
});

appConfigurator.controller('RoomCtrl', function ($scope, $stateParams, Configurator, Editor, $modal, $location) {
	var
		level = Configurator.levels[$stateParams.levelId - 1],
		room = level.rooms[$stateParams.roomId - 1]
    ;

    if (!room.isRoom) {
        $location.path('/level/' + $stateParams.levelId);
    }

	Configurator.params.room.fittings = Configurator.params.fittings;
	Configurator.params.room.fittingsMaterial = Configurator.params.fittingsMaterial;

	$scope.ROOM = room;

	$scope.BOILER = Configurator.boiler;
	$scope.BOILER_PARAMS = Configurator.params.boiler;	
	$scope.BOILER_VISIBLE = function () { return $scope.ROOM.isBoilerRoom && $scope.BOILER.isBoiler; };

    $scope.SET_PARAMS_FOR_ALL_ROOMS = true;
	$scope.RADIATORS = room.radiators;
	$scope.RADIATORS.current = 1;
	$scope.RADIATORS_LIST = room.radiators.list;
	$scope.RADIATOR = $scope.RADIATORS_LIST[$scope.RADIATORS.current - 1];
	$scope.RADIATOR.preview_valves = $scope.RADIATOR.valves;

	$scope.FLOORS = room.floors;
	$scope.PARAMS = Configurator.params.room;
	$scope.LINK_RETURN = '#/level/' + $stateParams.levelId;
	$scope.EDITOR = Editor;

	$scope.PARAMS.distinctValves = [];
	for (var i in Configurator.params.room.radiators.valves) {
	    var el = Configurator.params.room.radiators.valves[i];
	    var exists = false;
	    for (var j in $scope.PARAMS.distinctValves) {
	        var r = $scope.PARAMS.distinctValves[j];
	        if (el.preview == r.preview
                && el.type == r.type
                && el.connection == r.connection
                && el.builtinValve == r.builtinValve
                && el.pipework == r.pipework
                && el.controlType == r.controlType
                /*&& (el.connectSide == 1 || el.connectSide == 0)*/
                ) {
	            exists = true;
	        }
	    }
	    if (!exists)
	        $scope.PARAMS.distinctValves.push(el);
	}

	$scope.GET_EXTERNAL_VIEW_ITEMS = function () {
	    var all = Configurator.params.room.radiators.externalView;
	    var res = [];
	    var preview = Configurator.params.room.radiators.valves[$scope.RADIATOR.valves - 1].preview;

	    if ($scope.RADIATOR.type == 1) {
	        for (var i in Configurator.params.room.radiators.valves) {
	            var el = Configurator.params.room.radiators.valves[i];	            
	            if (el.preview == preview
                    && el.type == $scope.RADIATOR.type
                    && el.connection == $scope.RADIATOR.connection
                    && el.builtinValve == $scope.RADIATOR.builtinValve
                    && el.pipework == $scope.RADIATOR.pipework
                    && el.controlType == $scope.RADIATORS.controlType
                    ) {	                
	                if (el.externalView > 0) {
	                    res.push({ id: el.id, name: all[el.externalView - 1].name });
	                }
	            }
	        }
	    } else {
	        for (var i in Configurator.params.room.radiators.valves) {
	            var el = Configurator.params.room.radiators.valves[i];
	            if (el.type == $scope.RADIATOR.type
                    && el.use == $scope.RADIATOR.use
                    && el.connectSide == $scope.RADIATOR.connectSide
                    ) {
	                if (el.externalView > 0)
	                    res.push({ id: el.id, name: all[el.externalView - 1].name });
	            }
	        }
	    }
	    return res;
	}

	$scope.PREVIEW = function (valves) {
	    return "common/img/radiator-preview/" + Configurator.params.room.radiators.valves[valves-1].preview + ".png";
	}
    $scope.VIEW = function(radiator) {
        var side = radiator.connectSide == 2 ? "_right" : "";
        if (radiator.type == 2) { //design radiator
            var use = radiator.use == 1 ? 'radiator_valve' : 'towelrail_valve';
            return 'common/img/radiators/design/' + use + side + '.png';
        }

        var preview = Configurator.params.room.radiators.valves[radiator.valves - 1].preview;
        var connectionNum = (radiator.connection == 1 ? "2" : "1");
        if ($scope.PARAMS.radiators.control[radiator.control - 1].previewPrefix) {
            var prefix = $scope.PARAMS.radiators.control[radiator.control - 1].previewPrefix;
            return "common/img/radiators/n/" + preview + "_" + prefix + "_r" + connectionNum + side + ".png";
        } else {
            return "common/img/radiators/n/" + preview + "_r" + connectionNum + side + ".png";
        }
    };

    $scope.CSS_RADIATOR = function(radiator) {
        var cssClasses = 'type' + radiator.connection;
        if (radiator.type == 2) {
            cssClasses += ' design';
        }

        if (radiator.use == 2) {
            cssClasses += ' towelrail';
        }

        if (radiator.connectSide == 1) {
            cssClasses += ' connect-left';
        }

        if (radiator.connectSide == 2) {
            cssClasses += ' connect-right';
        }

        return cssClasses;
    };

    $scope.UPDATE_VALVE = function (valveId) {
	    return "common/img/radiators/" + Configurator.params.room.radiators.valves[$scope.RADIATOR.valves - 1].preview + ".png";
	}

	$scope.filterFunction = function (element) {
	    return ($scope.FLOORS.loops > 1 && element.type == 2) || ($scope.FLOORS.loops == 1) ? true : false;
	};

	$scope.GET_VALVES = function(){
	}

	$scope.UPDATE_RADIATORS_COUNT = function () {
	    Configurator.UpdateCollectorEntries();
	}

	$scope.SET_PARAMS_FOR_ALL = function () {
	    $scope.modalInstance = $modal.open({
	        templateUrl: 'set-room-params-confirm.html',
	        size: 'sm',
	        scope: $scope,
	        resolve: {
	            selectedRoom: function () {
	                return $scope.ROOM;
	            }
	        }
	    });
	}
    
	$scope.SET_PARAMS_FOR_ALL_CONFIRMED = function () {
	    $scope.modalInstance.close();
	    // TODO - Set FOR ALL
	    for (var room = 0; room < level.roomsCount; room++) {
	        $scope.ROOM.copyTo(level.rooms[room]);
	    }

	    Configurator.UpdateCollectorEntries();
	}

	$scope.SET_PARAMS_FOR_ALL_DECLINED = function () {
	    $scope.modalInstance.dismiss('cancel');
	}

	$scope.scopeUpdateRADIATOR = function (obj) {
		$scope.RADIATOR = obj;
	}

	$scope.ALERT = function (alert, confirm, cancel) {
	    $scope.ALERT_MESSAGE = alert;
	    $scope.CONFIRM_ALERT = function () {
	        $scope.alertInstance && $scope.alertInstance.close();
	        confirm && confirm();
	    };
	    $scope.CLOSE_ALERT = cancel && function() {
	        $scope.alertInstance && $scope.alertInstance.dismiss('cancel');
	        cancel();
	    };

	    $scope.alertInstance = $modal.open({
	        templateUrl: 'alert.html',
	        size: 'sm',
	        scope: $scope
	    });
	}

    $scope.DELETE_ROOM = function(evt) {
        evt && evt.preventDefault();

        if (level.roomsCount > 1) {
            $scope.ALERT('Вы хотите убрать эту комнату?',
                function() {
                    room.isRoom = false;
                    level.roomsCount--;
                    $location.path('/level/' + $stateParams.levelId);
                }, function() {

                });

            return;
        }

        $scope.ALERT('Это последняя комната на этаже. Уберите этаж, чтобы убрать комнату.');
    };

    //Room scroll controlls
    $scope.ARROWS = function() {
        return $scope.RADIATORS.radiatorsTypes > 1 || ($scope.RADIATORS.radiatorsTypes > 0 && $scope.BOILER_VISIBLE());
    };

    $scope.BOILER_FOCUS = $scope.BOILER_VISIBLE();
    $scope.ARROW_LEFT = function() {
        return $scope.RADIATORS.current > 1 || ($scope.BOILER_VISIBLE() && !$scope.BOILER_FOCUS);
    };
    $scope.ARROW_RIGHT = function() {
        return $scope.RADIATORS.current < $scope.RADIATORS.radiatorsTypes || ($scope.BOILER_VISIBLE() && $scope.BOILER_FOCUS);
    };

    var resetActiveTab = function() {
        var tabs = $('[ng-tabs]:first');
        if (tabs.length == 0) {
            return;
        }

        var tabScope = angular.element(tabs).scope();
        tabScope.tabs.index = $scope.BOILER_FOCUS ? 3 : 1;
    };

    $scope.FOCUS_LEFT = function () {
        if (!$scope.BOILER_FOCUS && $scope.RADIATORS.current == 1) {
            $scope.BOILER_FOCUS = $scope.BOILER_VISIBLE();
            resetActiveTab();
            return;
        }

        $scope.RADIATORS.current = $scope.RADIATORS.current - 1;
        $scope.scopeUpdateRADIATOR($scope.RADIATORS_LIST[$scope.RADIATORS.current - 1]);
    };

    $scope.FOCUS_RIGHT = function () {
        if ($scope.BOILER_FOCUS) {
            $scope.BOILER_FOCUS = false;
            resetActiveTab();
            return;
        }

        $scope.RADIATORS.current = $scope.RADIATORS.current + 1;
        $scope.scopeUpdateRADIATOR($scope.RADIATORS_LIST[$scope.RADIATORS.current - 1]);
    };

    $scope.BOILER_UNFOCUS = function () {
        var focusItem = $('.radiators');
        if (focusItem.length == 0) {
            return;
        }

        var scope = angular.element(focusItem).scope();
        scope.BOILER_FOCUS = false;
    };

    $scope.BOILER_SET_FOCUS = function () {
        var focusItem = $('.radiators');
        if (focusItem.length == 0) {
            return;
        }

        var scope = angular.element(focusItem).scope();
        scope.BOILER_FOCUS = true;
        scope.RADIATORS.current = 1;
        scope.RADIATOR = scope.RADIATORS_LIST[0];
    };

	$scope.refreshRadiatorCollectorsCount = function () {
	    Configurator.UpdateCollectorEntries();
	}

	$scope.UpdateCollectorEntries = function () {
	    Configurator.UpdateCollectorEntries();
	}

	setCustomScroll();

    getRadiator = function() {
        return $scope.RADIATOR;
    };
});

var getRadiator = function() { return null; };


appConfigurator.controller('BoilerCtrl', function($scope, Configurator, $stateParams, Editor, $modal){

	$scope.BOILER = Configurator.boiler;
	$scope.BOILER_PARAMS = Configurator.params.boiler;
	$scope.LINK_RETURN = '#/level/' + Configurator.boiler.level;

	var level = Configurator.levels[Configurator.boiler.level - 1];

	Configurator.params.room.fittings = Configurator.params.fittings;
	
	for (var _level in Configurator.levels) {
	    for (var _room in Configurator.levels[_level].rooms) {
	        //теплые полы устанавливаются только на первом этаже
	        if (Configurator.levels[_level].rooms[_room].isBoilerRoom) {
	            var room = Configurator.levels[_level].rooms[_room];
	        }
	    }
	}

	$scope.ROOM = room;
	$scope.SET_PARAMS_FOR_ALL_ROOMS = true;
	$scope.RADIATORS = room.radiators;
	$scope.RADIATORS.current = 1;
	$scope.RADIATORS_LIST = room.radiators.list;
	$scope.RADIATOR = $scope.RADIATORS_LIST[$scope.RADIATORS.current - 1];
	$scope.FLOORS = room.floors;
	$scope.PARAMS = Configurator.params.room;
	$scope.EDITOR = Editor;

	$scope.UPDATE_RADIATORS_COUNT = function () {
	    Configurator.UpdateCollectorEntries();
	}

	$scope.SET_PARAMS_FOR_ALL = function () {
	    $scope.modalInstance = $modal.open({
	        templateUrl: 'set-room-params-confirm.html',
	        size: 'sm',
	        scope: $scope,
	        resolve: {
	            selectedRoom: function () {
	                return $scope.ROOM;
	            }
	        }
	    });
	}

	$scope.SET_PARAMS_FOR_ALL_CONFIRMED = function () {
	    $scope.modalInstance.close();
	    // TODO - Set FOR ALL
	    for (var room = 0; room < level.roomsCount; room++) {
	        $scope.ROOM.copyTo(level.rooms[room]);
	    }

	    Configurator.UpdateCollectorEntries();
	}

	$scope.SET_PARAMS_FOR_ALL_DECLINED = function () {
	    $scope.modalInstance.dismiss('cancel');
	}

	$scope.scopeUpdateRADIATOR = function (obj) {
	    $scope.RADIATOR = obj;
	}

	setCustomScroll();
});

appConfigurator.controller('CollectorCtrl', function($scope, Configurator, $stateParams, $modal){
	var
		level = Configurator.levels[$stateParams.levelId - 1],
		collector = level.collectors[$stateParams.collectorId - 1]
	;

	//Configurator = loadLocalStorage({key:'Configurator',val:Configurator});

	Configurator.params.collector.fittings = Configurator.params.fittings;

    //$scope.ROOM = room;

	$scope.TITLE = collector.name;
	$scope.COLLECTOR = collector;
	$scope.LEVELS = Configurator.levels;
	$scope.PROPERTIES = Configurator.properties;
	$scope.PARAMS = Configurator.params.collector;
	$scope.FITTINGS = Configurator.params.fittings;
	$scope.MATERIALS = Configurator.params.fittingsMaterial;

	$scope.LINK_RETURN = '#/level/' + level.id;
	$scope.LINK_NEXT = '#/boiler';

    var getNodes = function() {
        var nodes = [];
        while (nodes.length < $scope.COLLECTOR.entries) {
            nodes.push(nodes.length);
        }

        return nodes;
    };

    var receiverTypes = { wired: 1, wireless: 2 };

    var ReceiverModel = function(type) {
        this.type = type;
        return this;
    };

    var getThermoControls = function(targetCollector, levels) {
        var controls = { receivers: [], valves: 0 };

        var thermometersCount = { wired: 0, wireless: 0};
        var controlOptions = Configurator.params.room.radiators.control;
        for (var l = 0; l < levels.length; l++) {
            var lvl = levels[l];
            if (!targetCollector.levels[l + 1]) {
                continue;
            }

            for (var r = 0; r < lvl.rooms.length; r++) {
                var room = lvl.rooms[r];
                if (!room.isRoom) {
                    continue;
                }

                if (targetCollector.type == 'radiator' && room.radiators.commonControl) {
                    var commonControl = controlOptions[room.radiators.commonControl - 1];

                    if (commonControl.id == 5 || commonControl.id == 6) {
                        thermometersCount.wired++;
                        controls.valves += room.getRadiatorsCount();
                    }

                    if (commonControl.id == 7 || commonControl.id == 8) {
                        thermometersCount.wireless++;
                        controls.valves += room.getRadiatorsCount();
                    }

                } else if (targetCollector.type == 'floor' && room.floors.isFloors) {
                    if (room.floors.control == 2) {
                        thermometersCount.wired += room.floors.loops;
                        controls.valves += room.floors.loops;
                    }

                    if (room.floors.control == 3) {
                        thermometersCount.wireless += room.floors.loops;
                        controls.valves += room.floors.loops;
                    }
                }

            }
        }

        for (var i = 0; i < Math.ceil(thermometersCount.wired / 8) ; i++) {
            controls.receivers.push(new ReceiverModel(receiverTypes.wired));
        }

        for (i = 0; i < Math.ceil(thermometersCount.wireless / 3) ; i++) {
            controls.receivers.push(new ReceiverModel(receiverTypes.wireless));
        }

        return controls;
    };

    var sliderDefaultLeft = 70;
    var nodeWidth = 39;

    var toggleScrollButtons = function () {
        var panel = $('.collector-panel');
        var slider = $('.collector-slider');
        var leftBtn = panel.children('.arrow-left');
        var rightBtn = panel.children('.arrow-right');
        if (slider.width() + sliderDefaultLeft > panel.width()) {
            if (slider.position().left == sliderDefaultLeft) {
                leftBtn.hide();
                rightBtn.show();
                return;
            }

            leftBtn.show();
            rightBtn.hide();
            return;
        }

        leftBtn.hide();
        rightBtn.hide();

        if (slider.position().left != sliderDefaultLeft) {
            scrollLeft();
        }
    };

    var scrollRight = function() {
        var panel = $('.collector-panel');
        var slider = $('.collector-slider');
        slider.animate({ left: (panel.width() - slider.width() - sliderDefaultLeft) + 'px' }, 300);
        panel.children('.arrow-left').show();
        panel.children('.arrow-right').hide();
    };

    var scrollLeft = function () {
        var panel = $('.collector-panel');
        var slider = $('.collector-slider');
        slider.animate({ left: sliderDefaultLeft + 'px' }, 300);
        panel.children('.arrow-left').hide();
        panel.children('.arrow-right').show();
    };

    $scope.NODES = getNodes(); // массив узлов коллектора
    $scope.THERMOCONTROLS = getThermoControls($scope.COLLECTOR, $scope.LEVELS);

    $scope.SET_TERMOMETRS_COUNT = function () {
        if (!$scope.COLLECTOR.isBallValves) {
            $scope.COLLECTOR._thermometerIn = false;
            $scope.COLLECTOR._thermometerOut = false;
        }

        $scope.COLLECTOR.thermometersCount = (collector._thermometerIn ? 1 : 0) + (collector._thermometerOut ? 1 : 0);
        $scope.COLLECTOR.isThermometers = $scope.COLLECTOR.thermometersCount > 0;
    };

    $scope.AUTO_CALC_INPUTS = function () {
        if (PROPERTIES.autoCalcCollectorInputs) {
            Configurator.RefreshCollectorsCount();
            $scope.UPDATE_NODES();
        }
    };

    $scope.UPDATE_NODES = function() {
        var slider = $('.collector-slider');
        var inner = slider.find('.collector-inner');
        slider.css('left', sliderDefaultLeft + 'px');
        var $currentScope = angular.element(slider).scope();
        var count = $currentScope.COLLECTOR.entries;

        while ($currentScope.NODES.length < count) {
            inner.width(inner.width() + nodeWidth);
            $currentScope.NODES.push($currentScope.NODES.length);
        }

        while ($currentScope.NODES.length > count) {
            $currentScope.NODES.pop();
            inner.width(inner.width() - nodeWidth);
        }

        toggleScrollButtons();
    };


    $scope.GET_NODE_CSS_CLASS = function (index) {
        if ($scope.NODES.length <= 12) {
            return '';
        }

        return index == Math.floor($scope.NODES.length / 2) - 1 ? 'middle' : '';
    };

    $scope.SHOW_SECTION_FITTING = function (index) {
        return $scope.NODES.length > 12 && index == Math.floor($scope.NODES.length / 2) - 1;
    };

    $scope.SHOW_MIXER = function () {
        return $scope.COLLECTOR.mixing;
    };

    $scope.HAS_ELECTRO_VALVE = function(index) {
        return index < $scope.THERMOCONTROLS.valves;
    };

    $scope.GET_RECEIVER_CCS_CLASS = function(receiverModel) {
        return receiverModel.type == receiverTypes.wired ? 'wired' : 'wireless';
    };

    $scope.TOGGLE_THERMOMETERS = function(e) {
        if (e) {
            e.preventDefault();
        }

        if (!$scope.COLLECTOR.isBallValves) {
            return;
        }

        if ($scope.COLLECTOR._thermometerIn && $scope.COLLECTOR._thermometerOut) {
            $scope.COLLECTOR._thermometerIn = false;
            $scope.COLLECTOR._thermometerOut = false;
        } else {
            $scope.COLLECTOR._thermometerIn = true;
            $scope.COLLECTOR._thermometerOut = true;
        }
    };

    $scope.TOGGLE_BALL_VALVES = function() {
        $scope.COLLECTOR._thermometerIn &= $scope.COLLECTOR.isBallValves;
        $scope.COLLECTOR._thermometerOut &= $scope.COLLECTOR.isBallValves;
    };

    $scope.validateCollectors = function (currentLevel, levels, currentCollector) {
        Configurator.ValidateCollectors(currentLevel, levels, currentCollector, $scope.ALERT, function (currentCollector) {
            $scope.COLLECTOR = currentCollector;

            $scope.modalInstance = $modal.open({
                templateUrl: 'set-dest-collector.html',
                size: 'sm',
                controller: 'SetCollectorDialogCtrl',
                resolve: {
                    EDITED_COLLECTOR: function () {
                        return $scope.COLLECTOR;
                    }
                }
            });

            $scope.modalInstance.result.then(function (res) {
                if (res == false) {
                    currentCollector.isCollector = true;
                } else {
                    currentCollector.entries = 0;
                }
            }, function () { currentCollector.isCollector = true; });
        });
    };

    $scope.ALERT = function (alert) {
        $scope.ALERT_MESSAGE = alert;

        $scope.alertInstance = $modal.open({
            templateUrl: 'alert.html',
            size: 'sm',
            scope: $scope
        });
    };

    $scope.CLOSE_ALERT = function () {
        $scope.alertInstance.close();
    };

    setCustomScroll();

    $(function() {
        $(window).resize(function () { setTimeout(toggleScrollButtons, 300); });
        var panel = $('.collector-panel');
        var leftBtn = panel.children('.arrow-left');
        var rightBtn = panel.children('.arrow-right');
        leftBtn.click(function(e) {
            e.preventDefault();
            scrollLeft();
        });
        rightBtn.click(function (e) {
            e.preventDefault();
            scrollRight();
        });

        $('.collector-inner').width($scope.COLLECTOR.entries * nodeWidth + 120);
        if (panel.width() < $('.collector-slider').width() + sliderDefaultLeft) {
            rightBtn.show();
        }
    });
});


appConfigurator.controller('BasketCtrl', function($scope, $filter, Configurator, Catalog){

	var params = Configurator.params;
	$scope.CATALOG = [];

	Catalog.fetch().then(function (data) {
        $scope.CATALOG = data;

        $scope.BASKET_TOTAL_PRICE = function () {
            var
                price = 0,
                basket = $scope.BASKET(),
                catalog = $scope.CATALOG
            ;

            if (typeof $scope.CATALOG == 'undefined') return 0;
            for (var k in basket) {
                if (catalog[k])
                    price += basket[k] * catalog[k].price;
            }
            price = Math.round(price);
            return ($filter('formatNumber')(price));
        }
	});

	$scope.BASKET = function(){		
		return Configurator.Basket();
	}

	$scope.ORDER = function () {
	    Catalog.makeOrder(Configurator.Basket());
	}

	$scope.BASKET_TOTAL_COUNT = function(){
		var count = 0;
		for (var k in $scope.BASKET()) {
			++count;
		}
		return(count);
	}
});

appConfigurator.controller('RestoreCtrl', function ($scope, $filter, $stateParams, $sce, $timeout, Configurator, Catalog, CurrentUser) {
    var idLoad = parseInt($stateParams.idLoad);
    if (!isNaN(idLoad)) {
        Configurator.restoreConfiguration(idLoad, function () {
            $scope.$apply(function() {$location.path("/summary");});
        });
    }

});
appConfigurator.controller('SummaryCtrl', function ($scope, $filter, $stateParams, $sce, $timeout, Configurator, Catalog, CurrentUser) {
    var page = parseInt($stateParams.page);
    page = isNaN(page) || page > 5 ? 1 : page;
    var itemCode = $stateParams.itemCode;

    var getMenuPointerTop = function (selectedIndex) {
        var dh = 58;
        var h0 = 25;
        return selectedIndex * dh + h0;
    };


    var ViewModel = function(pageNum, itemCode) {
        var _this = this;
        _this._page = pageNum;

        _this.visible = function(n) {
            return _this._page == n;
        };

        _this.setPage = function(n, e) {
            if (e) {
                e.preventDefault();
            }

            var contentPage = $('.summary-page:first');
            var scroller = contentPage.closest('.autoscroll');
            scroller.scrollTop(0);
            scroller.perfectScrollbar('update');

            $('#summary-menu-pointer').animate({ top: getMenuPointerTop(n - 1) + 'px' }, 300);
            var contentScope = angular.element(contentPage).scope();
            contentScope.MODEL._page = n;

            var sidebarScope = angular.element($('.summary-nav')).scope();
            sidebarScope.MODEL._page = n;
        };

        _this.productCard = {};

        _this.showCard = function(card, count) {
            _this.productCard = card;
            _this.productCard.count = count;
        };
        return _this;
    };

    $scope.BASKET = function () {
        return Configurator.Basket();
    }

    var _basket = Configurator.Basket();
    var _groupedBasket = Configurator.GetCodesBySection();
    var _groupedByRooms = Configurator.GetCodesByRooms();

    Catalog.fetch().then(function (data) {
        $scope.CATALOG = data;
        if (typeof itemCode == 'undefined' || !_basket[itemCode]) {
            for (itemCode in _basket) break;
        }
        $scope.MODEL.showCard($scope.CATALOG[itemCode], _basket[itemCode]);
        $timeout(function () {
            for (itemCode in _basket) {
                for (var i in $scope.PAGE_GENERAL.clauses) {
                    if ($scope.PAGE_GENERAL.clauses[i].html.indexOf(itemCode) >= 0) {
                        $scope.PAGE_GENERAL.clauses[i].html = $scope.PAGE_GENERAL.clauses[i].html.split(itemCode).join($scope.CATALOG[itemCode].name);
                    }
                }
            }
        }, 200);
    });

    $scope.SAVE_CONFIGURATION = function () {
        CurrentUser.isGuidExistsInDB().then(
            function (user) { // success
                Configurator.saveConfiguration();
            },
            function (msg) { // failure
                alert(msg);
                CurrentUser.Register("Денисов К", "+79631216973", "Односторонки гривки 10").then(
                    function(user){ // success
                        CurrentUser.SaveConfiguration(Configurator.name, Configurator.saveConfiguration()).then(
                            function (m) { // success
                                alert(m);
                            },
                            function (m) { //fail
                                alert(m)
                            }
                        );
                    }, 
                    function(msg){ // fail
                        alert(msg);
                    }
                )
            });
    }
    $scope.ORDER = function () {
        Catalog.makeOrder(Configurator.Basket());
    }

    $scope.BASKET_TOTAL_PRICE = function () {
        var
            price = 0,
            basket = $scope.BASKET(),
            catalog = $scope.CATALOG
        ;

        if (typeof $scope.CATALOG == 'undefined') return 0;

        for (var k in basket) {
            if (catalog[k])
                price += basket[k] * catalog[k].price;
        }
        price = Math.round(price);
        return ($filter('formatNumber')(price));
    }    

    $scope.MODEL = new ViewModel(page, itemCode);

    var homeClause = {
        title: 'Параметры дома',
        src: 'common/img/summary/general-cottage.jpg',
        html: 'Расчет системы отопления произведен для 6 помещений в 2 этажном доме, с котлом в отдельном помещении в подвале.'
    };

    var roomsCount = Configurator.GetTotalRoomsCount();
    if (roomsCount % 10 == 1)
        roomsCount = roomsCount + " помещение";
    else if (roomsCount % 10 >= 2 && roomsCount % 10 <= 4)
        roomsCount = roomsCount + " помещения";
    else
        roomsCount = roomsCount + " помещений";

    var levelsCount = Configurator.GetLevelsCount();
    if (levelsCount == 1)
        levelsCount = "одноэтажном";
    else if (levelsCount == 2)
        levelsCount = "двухэтажном";
    else if (levelsCount == 3)
        levelsCount = "трехэтажном";

    homeClause.html = 'Расчет системы отопления произведен для ' + roomsCount + ' в ' + levelsCount + ' доме, с котлом ' + (Configurator.boiler.roomType == 1 ? ' в отдельном помещении ' + (Configurator.boiler.level == 1 ? ' на первом этаже ' : ' в подвале') : ' на кухне ');

    if (Configurator.boiler.embodiment == 1) {
        var boilerClause = {
            title: 'Параметры котла и узла',
            src: 'common/img/summary/general-boiler.jpg',
            html: 'Источником тепловой энергии для теплоснабжения дома служит собственный котел, работающий на газообразном или жидком топливе. В данном проекте предусмотрен одноконтурный котел. <br/>Одноконтурные котлы предназначены для нагрева теплоносителя контура отопления. В состав котла, как правило, входит система управления и защиты горелки. Циркуляционные насосы и теплообменник нагрева горячей воды должны устанавливаться отдельно. Для приготовления горячей воды используется бойлер косвенного нагрева, представляющий собой накопительный бак горячей воды со встроенным в него теплообменником. Для подачи теплоносителя в контур отопления и нагрева ГВС применен насосный узел обвязки котла ' + Configurator.params.boiler.pump[Configurator.boiler.pump - 1].name + '. <br/> Насос контура отопления прокачивает теплоноситель через котел, радиаторы и (с помощью узла смешения) через конуры теплого пола. В контуре отопления устанавливаются термостатические регуляторы, которые изменяют сопротивление контура в зависимости от температуры в помещениях. Чтобы обеспечить циркуляцию теплоносителя через котел в любых режимах работы, в контуре отопления насосного узла DSM-BPU предусмотрен перепускной клапан AVDO. Клапан AVDO может быть настроен на поддержание необходимого минимального расхода в зависимости от применяемого котла. Насос контура ГВС прокачивает теплоноситель через котел и бойлер косвенного нагрева. Сопротивление контура нагрева ГВС постоянно, поэтому установка перепускного клапана не требуется. <br/>В состав насосного узла обвязки котла входят фильтры для каждого контура, предохранительный клапан, кран для подключения расширительного бака, запорные краны на каждом контуре для удобства сервисного обслуживания системы. Установка дополнительной трубопроводной арматуры не требуется.',
            thumbs: []
        };
    } else {
        var boilerClause = {
            title: 'Параметры котла и узла',
            src: 'common/img/summary/general-boiler.jpg',
            html: 'Источником тепловой энергии для теплоснабжения дома служит собственный котел, работающий на газообразном или жидком топливе. В данном проекте предусмотрен двухконтурный котел. <br/>Двухконтурные котлы предназначены для нагрева и подачи теплоносителя в контур отопления, а также для приготовления горячей воды (ГВС). В состав двухконтурных котлов входит теплообменник нагрева горячей воды, трехходовой вентиль для переключения режима отопления / приготовления ГВС, циркуляционный насос, автоматика. Горячая вода приготавливается в проточном теплообменнике, поэтому котел должен иметь достаточную мощность, перекрывающую пиковую потребность в горячей воде.', 
            thumbs: []
        };
    }

   for (var k in _groupedBasket["boiler"].equip)
        boilerClause.thumbs.push({ src: k, count: _groupedBasket["boiler"].equip[k].value });

    var collectorClause = {
        title: 'Коллекторы радиаторов',
        src: 'common/img/summary/general-radiator-collector.jpg',
        html: 'Разводка трубопроводов лучевая, то есть к каждому радиатору от расположенного на этаже коллектора проложен независимый подающий и обратный трубопроводы. Такая разводка позволяет скрыть трубопроводы в стене или стяжке, так как от коллектора до радиатора прокладывается цельный трубопровод, без стыков и соединений. Использование труб малого диаметра (так как тепловая нагрузка на каждый радиатор относительно мала) позволяет уменьшить толщину стяжки. Также лучевая разводка позволяет оптимально управлять температурой в помещении, так как изменение расхода отдельно взятого отопительного прибора не оказывает влияние на другие отопительные приборы.',
        thumbs: []
    };

    for (var k in _groupedBasket["radiator-collector"].equip)
        collectorClause.thumbs.push({ src: k, count: _groupedBasket["radiator-collector"].equip[k].value });
    
    if (Configurator.ifBasketContainCodes(_groupedBasket["radiator-collector"].equip, ['088U0722', '088U0723', '088U0724', '088U0725', '088U0726', '088U0727', '088U0728', '088U0729', '088U0730', '088U0731', '088U0732'])) {
        collectorClause.html += '<br/>Для подключения применены распределительные коллекторы FHF-F, оснащенные расходомерами. Расходомеры позволяют визуально наблюдать поток теплоносителя в каждом контуре, что существенно упрощает наладку и обслуживание системы. Чтобы избежать попадания воздуха в трубопровод, коллекторы оснащены автоматическими воздухоотводчиками.Каждый контур коллектора оснащен вентильной вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Кроме того, коллекторы позволяют перекрыть любой контур для проведения ремонта или обслуживания.';
    }

    if (Configurator.ifBasketContainCodes(_groupedBasket["radiator-collector"].equip, ['088U0702', '088U0703', '088U0704', '088U0705', '088U0706', '088U0707', '088U0708', '088U0709', '088U0710', '088U0711', '088U0712'])) {
        collectorClause.html += '<br/>Для подключения применены распределительные коллекторы FHF. Чтобы избежать попадания воздуха в трубопровод коллекторы оснащены автоматическими воздухоотводчиками. Каждый контур коллектора оснащен вентильной вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Кроме того, коллекторы позволяют перекрыть любой контур для проведения ремонта или обслуживания';
    }

    if (Configurator.ifBasketContainCodes(_groupedBasket["radiator-collector"].equip, ['088H3112', '088H3113'])) {
        collectorClause.html += '<br/>Коллекторы также оснащены термоэлектрическими приводами TWA-A, на которые через ресивер подается управляющий сигнал от комнатного термостата.';
    }

    var radiatorsClause = {
        title: 'Обвязка радиатора',
        src: 'common/img/summary/general-interconnections.jpg',
        html: 'Обвязка радиатора выполняет следующие основные функции: регулировать мощность радиатора в зависимости от температуры в помещении, перекрывать поток теплоносителя в радиатор для обслуживания, ремонта или замены, обеспечивать возможность слива теплоносителя из радиатора на время ремонта',
        thumbs: [            
        ]
    }

    for (var k in _groupedBasket["radiator-valve"].equip)
        radiatorsClause.thumbs.push({ src: k, count: _groupedBasket["radiator-valve"].equip[k].value });

    var _radiators = Configurator.RadiatorValves();

    if (Configurator.ifBasketContainCodes(_radiators, ['1', '2', '3', '4', '5', '6'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с боковым подключением.<br/> К системе отопления данные радиаторы подключены с помощью регулирующего клапана RA и запорного клапана RLV. Регулирующий клапан RA позволяет поддерживать заданную температуру в помещении – для этого на клапан необходимо установить термостатический элемент. Кроме того, клапан оснащен вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Запорный клапан RLV позволяет отключить радиатор для обслуживания и ремонта, а также с помощью спускного крана с насадкой для шланга 3/4" аккуратно опорожнить радиатор, не допуская попадания теплоносителя на отделочные материалы.';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['8', '18'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с боковым подключением. К системе отопления данные радиаторы подключены с помощью гарнитуры RA 15/6TB, которая обеспечивает простоту монтажа и современный дизайн. Гарнитура RA 15/6TB включает в себя регулирующий клапан RA и запорный клапан. Регулирующий клапан RA позволяет поддерживать заданную температуру в помещении – для этого на клапан необходимо установить термостатический элемент. Запорный клапан позволяет отключить радиатор для обслуживания и ремонта.';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['7'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с боковым подключением. К системе отопления данные радиаторы подключены с помощью гарнитуры RA-K, которая обеспечивает простоту монтажа и современный дизайн. Гарнитура RA-K состоит из отвода, регулирующего клапана RA, соединительной трубки и запорного клапана. Регулирующий клапан RA позволяет поддерживать заданную температуру в помещении – для этого на клапан необходимо установить термостатический элемент. Кроме того, клапан оснащен вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Запорный клапан позволяет отключить радиатор для обслуживания и ремонта, а также с помощью спускного крана с насадкой для шланга 3/4" аккуратно опорожнить радиатор, не допуская попадания теплоносителя на отделочные материалы.';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['17'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с боковым подключением. К системе отопления данные радиаторы подключены с помощью гарнитуры RA-KW, которая обеспечивает простоту монтажа и современный дизайн. Гарнитура RA-KW состоит из отвода, регулирующего клапана RA, соединительной трубки и запорного клапана. Регулирующий клапан RA позволяет поддерживать заданную температуру в помещении – для этого на клапан необходимо установить термостатический элемент. Кроме того, клапан оснащен вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Запорный клапан позволяет отключить радиатор для обслуживания и ремонта, а также с помощью спускного крана с насадкой для шланга 3/4" аккуратно опорожнить радиатор, не допуская попадания теплоносителя на отделочные материалы.';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с нижним подключением. В конструкции радиатора предусмотрен терморегулирующий клапан, смонтированный на заводе. Клапан предусматривает установку термостатического элемента с современным клипсовым соединением типа RA <br/>Для возможности отключения радиаторов и слива из них теплоносителя для обвязки применены специальные запорные клапаны RLV-KD для радиаторов с нижним подключением. К этим клапанам можно подключить спускной кран с насадкой для шланга 3/4" и предотвратить попадание теплоносителя на отделочные материалы при обслуживании и ремонте.<br/>';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с нижним подключением. В конструкции радиатора предусмотрен терморегулирующий клапан, смонтированный на заводе. Клапан предусматривает установку термостатического элемента с резьбовым М30х1,5 соединением.<br/>К системе отопления данные радиаторы подключены с помощью запорного клапана RLV-KD. Запорный клапан RLV-KD позволяет отключить радиатор для обслуживания и ремонта, а также с помощью спускного крана с насадкой для шланга 3/4" аккуратно опорожнить радиатор, не допуская попадания теплоносителя на отделочные материалы.<br/>';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с нижним подключением. В конструкции радиатора не предусмотрен терморегулирующий клапан. К системе отопления данные радиаторы подключены с помощью гарнитуры VHS, включающей в себя регулирующий клапан RA и запорный клапан. Регулирующий клапан RA позволяет поддерживать заданную температуру в помещении – для этого на клапан необходимо установить термостатический элемент. Кроме того, клапан оснащен вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Запорный клапан позволяет отключить радиатор для обслуживания и ремонта, а также с помощью спускного крана с насадкой для шланга 3/4" аккуратно опорожнить радиатор, не допуская попадания теплоносителя на отделочные материалы. <br/>';
    }

    var radiatorControlClause = {
        title: 'Управление радиаторным отоплением',
        src: 'common/img/summary/general-radiator-control.jpg',
        html: '',
        thumbs: [            
        ]
    };

    for (var k in _groupedBasket["radiator-control"].equip)
        radiatorControlClause.thumbs.push({ src: k, count: _groupedBasket["radiator-control"].equip[k].value });

    var _controlTypes = Configurator.RadiatorControlTypes();
    var controlOne = [];
    var controlTwo = [];
    angular.forEach(Configurator.levels, function (_level) {
        _level.isLevel
        &&
        (angular.forEach(_level.rooms, function (_room) {
            if (_room.id <= _level.roomsCount) {
                if (_room.controlType == 1) {
                    controlOne.push(_room.name);
                } else {
                    controlTwo.push(_room.name);
                }
            }
        }))
    });

    var _codesControl = [];
    if (Configurator.ifBasketContainCodes(_basket, ['087N1110']))
        _codesControl.push("087N1110");
    if (Configurator.ifBasketContainCodes(_basket, ['087N791801']))
        _codesControl.push("087N791801");
    if (Configurator.ifBasketContainCodes(_basket, ['087N7270']))
        _codesControl.push("087N7270");
    if (Configurator.ifBasketContainCodes(_basket, ['087N791301']))
        _codesControl.push("087N791301");

    var _recievierControl = [];
    if (Configurator.ifBasketContainCodes(_basket, ['088H0016']))
        _recievierControl.push("088H0016");
    if (Configurator.ifBasketContainCodes(_basket, ['087N6784']))
        _recievierControl.push("087N6784");
    
    //   Регулирование только радиаторными (radiators: controlType: 1)
    if (!Configurator.ifBasketContainCodes(_controlTypes, '2')) {
        // только living eco radiators: control:1,3 (014G0050)
        if (!Configurator.ifBasketContainCodes(_basket, ['013G2994'])) {
            radiatorControlClause.html += '<br/>Для управления радиаторами использованы электронные термостатические элементы living eco, которые благодаря интеллектуальной программе позволяют достичь максимального уровня комфорта и экономии до 46% энергии на отопление помещения.';
        } else if (!Configurator.ifBasketContainCodes(_basket, ['014G0050'])) { // только RA2994 radiators: control:2 (013G2994)
            radiatorControlClause.html += '<br/>Для управления радиаторами использованы термостатические элементы с газовым наполнением RA2994, обеспечивающие высокий уровень комфорта и экономию до 36% энергии на отопление помещения.';
        } else if (Configurator.ifBasketContainCodes(_basket, ['014G0050']) && Configurator.ifBasketContainCodes(_basket, ['013G2994'])) { // И RA2994 и living eco radiators: control:1,2,3 (013G2994, 014G0050)
            radiatorControlClause.html += '<br/>Для управления радиаторами использованы термостатические элементы с газовым наполнением RA2994, обеспечивающие высокий уровень комфорта и экономию до 36% энергии на отопление помещения. А также электронный электронные термостатические элементы living eco, которые благодаря интеллектуальной программе позволяют достичь максимального уровня комфорта и экономии до 46% энергии на отопление помещения';
        }
    } else if (!Configurator.ifBasketContainCodes(_controlTypes, '1')) {
        // только living eco radiators: control:1,3 (014G0050)
        radiatorControlClause.html += '<br/>В данном проекте удобство управление радиаторами во всех помещениях предусмотрено с помощью комнатных термостатов. Установленные(ый) ';
        
        radiatorControlClause.html += _codesControl.join(',');
        radiatorControlClause.html += ' подают(ет) сигнал к приемнику беспроводного сигнала ';
        
        radiatorControlClause.html += _recievierControl.join(',');
        radiatorControlClause.html += '. Таким образом осуществляется единое управление всеми радиаторами, установленными в каждом отдельном помещении. В этом случае установка на каждый радиатор термостатического элемента не требуется. Комнатный термостат применяют, если радиаторы закрыты декоративной решеткой, в этом случае температура в месте установки радиатора значительно отличается от температуры в комнате, и радиаторный термостат будет работать некорректно. Также, если в комнате установлено большое количество радиаторов, удобнее регулировать температуру в помещении одним прибором – комнатным термостатом. В этом случае установка на каждый радиатор термостатического элемента не требуется.';
    } else {
        radiatorControlClause.html += 'Регулировать мощность радиаторного отопления производится двумя способами: ';
        radiatorControlClause.html += '<br/>- управляя всеми радиаторами в одном помещении одновременно по комнатному термостату.';

        radiatorControlClause.html += '<br/>Для удобства управления в комнатах ' + controlTwo.join(', ') + ': установлены ' + _codesControl.join(',') + ' подающ' + (_codesControl.length == 1 ? 'ий' : 'ие') + ' сигнал к приемнику\ам беспроводного сигнала ' + _recievierControl.join(',') + '. Таким образом осуществляется единое управление всеми радиаторами, установленными в каждом отдельном помещении. <br/>';
        radiatorControlClause.html += 'Комнатный термостат применяют, если радиаторы закрыты декоративной решеткой, в этом случае температура в месте установки радиатора значительно отличается от температуры в комнате, и радиаторный термостат будет работать некорректно. Также, если в комнате установлено большое количество радиаторов, удобнее регулировать температуру в помещении одним прибором – комнатным термостатом. В этом случае установка на каждый радиатор термостатического элемента не требуется.';

        if (!Configurator.ifBasketContainCodes(_basket, ['013G2994'])) {
            radiatorControlClause.html += '<br/>В  остальных помещениях данного проекта предусмотрено управление каждым радиатором с помощью электронных термостатических элементов living eco, которые благодаря интеллектуальной программе позволяют достичь максимального уровня комфорта и экономии до 46% энергии на отопление помещения.';
        } else if (!Configurator.ifBasketContainCodes(_basket, ['014G0050'])) { // только RA2994 radiators: control:2 (013G2994)
            radiatorControlClause.html += '<br/>В  остальных помещениях данного проекта предусмотрено управление каждым радиатором с помощью термостатических элементов с газовым наполнением RA2994, обеспечивающих высокий уровень комфорта и экономию до 36% энергии на отопление помещения';
        } else if (Configurator.ifBasketContainCodes(_basket, ['014G0050']) && Configurator.ifBasketContainCodes(_basket, ['013G2994'])) { // И RA2994 и living eco radiators: control:1,2,3 (013G2994, 014G0050)
            radiatorControlClause.html += '<br/>В  остальных помещениях данного проекта предусмотрено управление каждым радиатором с помощью элементов с газовым наполнением RA2994, обеспечивающие высокий уровень комфорта и экономию до 36% энергии на отопление помещения. А также электронных термостатических элементов living eco, которые благодаря интеллектуальной программе позволяют достичь максимального уровня комфорта и экономии до 46% энергии на отопление помещения.';
        }
    }

    if (Configurator.ifBasketContainCodes(_basket, ['013G4003', '013G4004', '013G4007', '013G4008', '013G4009', '013G4010', '013G4132', ' 013G4133', '013G4136', '013G4137', '013G4138', '013G4139'])) {
        if (Configurator.ifBasketContainCodes(_basket, ['013G4003', '013G4004', '013G4007', '013G4008', '013G4009', '013G4010']) && Configurator.ifBasketContainCodes(_basket, ['013G4132', ' 013G4133', '013G4136', '013G4137', '013G4138', '013G4139'])) {
            radiatorControlClause.html += '<br/>Для подключения полотенцесушителей и дизайн-радиаторов к контуру отопления применены  комплекты из дизайн-серии X-tra Collection. Данный комплект подключается через невидимые снаружи переходники, таким образом обеспечивается безупречный внешний вид';
        } else if (Configurator.ifBasketContainCodes(_basket, ['013G4132', ' 013G4133', '013G4136', '013G4137', '013G4138', '013G4139'])) {
            radiatorControlClause.html += '<br/>Для подключения полотенцесушителей к контуру отопления применены  комплекты из дизайн-серии X-tra Collection. Данный комплект подключается через невидимые снаружи переходники, таким образом обеспечивается безупречный внешний вид';
        }else {
            radiatorControlClause.html += '<br/>Для подключения дизайн-радиатора к контуру отопления применен  комплект из дизайн-серии X-tra Collection. Данный комплект подключается через невидимые снаружи переходники, таким образом обеспечивается безупречный внешний вид';
        }
    }

    $scope.PAGE_GENERAL = {
        orderNum: '-',
        clauses: [
            homeClause,
            boilerClause,
            radiatorsClause,
            collectorClause,
            radiatorControlClause
        ]
    };

    // если есть теплый пол
    if ("floor-collector" in _groupedBasket) {
        var floorsCollectors = {
            title: 'Коллекторы теплого пола',
            src: 'common/img/summary/general-floor-collector.jpg',
            html: '',
            thumbs: []
        }
        
        floorsCollectors.html = 'Теплый пол обеспечивает особый комфорт в помещении. В данном проекте напольное отопление предусмотрено на первом этаже, а также в санузле и ванной на втором этаже.<br/>';

        if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0095', '088U0096', '088U0097', '088U0098', '088U0099'])) {
            var floorMixing = [];
            if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0095'])) floorMixing.push("088U0095");
            if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0096'])) floorMixing.push("088U0096");
            if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0097'])) floorMixing.push("088U0097");
            if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0098'])) floorMixing.push("088U0098");
            if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0099'])) floorMixing.push("088U0099");
            
            floorsCollectors.html += '<br/>Для радиаторов и для теплых полов требуется разная температура теплоносителя. Классические параметры для радиаторов – это 80 С на подаче и 60 С на возврате. Для комфортного и безопасного проживания средняя температура поверхности пола не должна быть выше +26 С для помещений с постоянным пребыванием людей, это значение регламентировано Сводом Правил СП60.13330.2012 (актуализированная редакция СНиП 41-01). Для достижения такой температуры поверхности пола температура подаваемого теплоносителя должна быть около 40 С. Чтобы температура поверхности пола была равномерной, температура возвращаемого теплоносителя должна отличаться от температуры подачи не более чем на 5…10 С. Для получения таких параметров теплоносителя теплого пола применяют узлы смешения.<br/>В данном проекте применен компактный узел смешения ' + floorMixing.join(', ') + '. Глубина компактного узла в сборе с коллектором составляет 110 мм, что позволяет установить сборку в стандартный шкаф.';
        }

        for (var k in _groupedBasket["floor-collector"].equip)
            floorsCollectors.thumbs.push({ src: k, count: _groupedBasket["floor-collector"].equip[k].value });

        if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0722', '088U0723', '088U0724', '088U0725', '088U0726', '088U0727', '088U0728', '088U0729', '088U0730', '088U0731', '088U0732'])) {
            floorsCollectors.html += '<br/>Для подключения контуров теплого пола применены распределительные коллекторы FHF-F, оснащенные расходомерами. Расходомеры позволяют визуально наблюдать поток теплоносителя в каждом контуре, что существенно упрощает наладку и обслуживание системы. Чтобы избежать попадания воздуха в петли теплого пола, коллекторы оснащены автоматическими воздухоотводчиками. Каждый контур коллектора оснащен вентильной вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Кроме того, коллекторы позволяют перекрыть любой контур для проведения ремонта или обслуживания.';
        }
        if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088U0702', '088U0703', '088U0704', '088U0705', '088U0706', '088U0707', '088U0708', '088U0709', '088U0710', '088U0711', '088U0712'])) {
            floorsCollectors.html += '<br/>Для подключения контуров теплого пола применены распределительные коллекторы FHF-F. Чтобы избежать попадания воздуха в петли теплого пола, коллекторы оснащены автоматическими воздухоотводчиками. Каждый контур коллектора оснащен вентильной вставкой с предварительной настройкой пропускной способности, что позволяет обеспечить оптимальную гидравлическую балансировку системы. Кроме того, коллекторы позволяют перекрыть любой контур для проведения ремонта или обслуживания.';
        }
        if (Configurator.ifBasketContainCodes(_groupedBasket["floor-collector"].equip, ['088H3112', '088H3113'])) {
            floorsCollectors.html += '<br/>Коллекторы также оснащены термоэлектрическими приводами TWA-A, на которые через ресивер подается управляющий сигнал от комнатного термостата.';
        }

        if (_groupedBasket["floor-collector-fitting"]) {
            for (var k in _groupedBasket["floor-collector-fitting"].equip)
                floorsCollectors.thumbs.push({ src: k, count: _groupedBasket["floor-collector-fitting"].equip[k].value });

            floorsCollectors.html += '<br/>Для подключения трубопроводов к запорно-регулирующей арматуре применены уплотнительные фитинги, обеспечивающие надежное и долговременное соединение при температуре до 95 С и давлении до 6 бар.';
        }

        $scope.PAGE_GENERAL.clauses.push(floorsCollectors);
    }
    if ("floor-control" in _groupedBasket) {
        var floorControls = {
            title: 'Управление теплым полом',
            src: 'common/img/summary/general-floor-control.jpg',
            html: '',
            thumbs: []
        }
        for (var k in _groupedBasket["floor-control"].equip)
            floorControls.thumbs.push({ src: k, count: _groupedBasket["floor-control"].equip[k].value });


        if (Configurator.ifBasketContainCodes(_groupedBasket["floor-control"].equip, ['087N791801']) && Configurator.ifBasketContainCodes(_groupedBasket["floor-control"].equip, ['087N791301'])) {
            floorControls.html += '<br/>Для регулирования теплых полов применены проводные программируемые  комнатные термостаты TP5001МA и беспроводныйые программируемыйые  комнатныйые  термостаты TP5001A-RF. Использование беспроводных моделей позволяет легко менять размещение комнатного термостата, например, при перестановке мебели. Комнатный термостат устанавливается в каждой комнате с напольным отоплением. Управляющий сигнал комнатного термостата подается к приемнику беспроводного сигнала RX3 и коммутационному устройству FH-WC, которые передают сигнал к термоэлектрическим приводам TWA-A, установленным на распределительный коллектор теплых полов.';
        }else if (Configurator.ifBasketContainCodes(_groupedBasket["floor-control"].equip, ['087N791801'])) {
            floorControls.html += '<br/>Для регулирования теплых полов применены проводные программируемые  комнатные  термостаты TP5001МA. Комнатный термостат устанавливается в каждой комнате с напольным отоплением. Управляющий сигнал комнатного термостата подается к приемнику беспроводного сигнала RX3, который передает сигнал к термоэлектрическим приводам TWA-A, установленным на распределительный коллектор теплых полов.';
        } else if (Configurator.ifBasketContainCodes(_groupedBasket["floor-control"].equip, ['087N791301'])) {
            floorControls.html += '<br/>Для регулирования теплых полов применены беспроводные программируемые  комнатные  термостаты TP5001A-RF. Использование беспроводных моделей позволяет легко менять размещение комнатного термостата, например, при перестановке мебели. Комнатный термостат устанавливается в каждой комнате с напольным отоплением. Управляющий сигнал комнатного термостата подается к коммутационному устройству FH-WC, установленному совместно с коллектором теплых полов.';
        }

        if (Configurator.ifBasketContainCodes(_groupedBasket["floor-control"].equip, ['003L1000'])) {
            floorControls.html += '<br/>Для регулирования теплых полов в помещениях с повышенной влажностью использованы терморегуляторы FHV для напольного отопления. Модель FHV-R с термостатическим элементом FJVR регулирует температуру возвращаемого теплоносителя, таким образом поддерживая постоянную температуру поверхности пола.';
        }

        $scope.PAGE_GENERAL.clauses.push(floorControls);
    }

    var _scheme = {
        levels: [],
        radiatorCollectors: [],
        floorCollectors: []
    };

    angular.forEach(Configurator.levels, function (_level) {
        if (_level.isLevel){
            var _l = { title: _level.canonicalName(), rooms: [] };

            (angular.forEach(_level.rooms, function (_room) {
                _l.rooms.push({ show: _room.id <= _level.roomsCount, title: _room.name, radiators: _room.getRadiatorsCount(), floors: _room.floors.isFloors ? _room.floors.loops : 0, boiler: _room.isBoilerRoom })
            }))

            _scheme.levels.push(_l);

            angular.forEach(_level.collectors, function (_collector) {
                if (_collector.isCollector) {
                    var collector_1 = _collector.entries;
                    angular.forEach(Configurator.params.collector.sets, function (_set) {
                        if (_collector.type == 'radiator' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
                            var connectedTo = [];
                            for (var i in _collector.levels) {
                                if (_collector.levels[i] == true)
                                    connectedTo.push(i - 1);
                            }
                            _scheme.radiatorCollectors.push({ installedLevelIndex: (_level.id - 1), connectedLevelIndex: connectedTo, title: _set.basket[0][0], entries: _collector.entries });
                        }

                        if (_collector.type == 'floor' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
                            var connectedTo = [];
                            for (var i in _collector.levels) {
                                if (_collector.levels[i] == true)
                                    connectedTo.push(i - 1);
                            }
                            _scheme.floorCollectors.push({ installedLevelIndex: _level.id - 1, connectedLevelIndex: connectedTo, title: _set.basket[0][0], entries: _collector.entries });
                        }
                    });
                }
            });
        }
    });

    $scope.PAGE_SCHEME = _scheme;

    if ($scope.PAGE_SCHEME.levels.length == 3 && Configurator.levels[2].isBasement) {
        $scope.PAGE_SCHEME.levels = [_scheme.levels[1], _scheme.levels[0], _scheme.levels[2]];
    } else if ($scope.PAGE_SCHEME.levels.length == 3) {
        $scope.PAGE_SCHEME.levels = [_scheme.levels[2], _scheme.levels[1], _scheme.levels[0]];
    } else if ($scope.PAGE_SCHEME.levels.length == 2) {
        $scope.PAGE_SCHEME.levels = [_scheme.levels[1], _scheme.levels[0]];
    }

    var getSchemeLevelIndex = function (level) {
        if ($scope.PAGE_SCHEME.levels.length == 3 && Configurator.levels[2].isBasement) {
            return level == 0 ? 1 : level == 1 ? 0 : 2;
        } else if ($scope.PAGE_SCHEME.levels.length == 3) {
            $scope.PAGE_SCHEME.levels = [_scheme.levels[2], _scheme.levels[1], _scheme.levels[0]];
            return level == 0 ? 2 : level == 1 ? 1 : 0;
        } else if ($scope.PAGE_SCHEME.levels.length == 2) {
            return level == 0 ? 1 : 0;
        }
        return level;
    }

    $scope.CSS_SCHEME_CONNECTION = function (installedAt, connectedTo) {
        installedAt = getSchemeLevelIndex(installedAt);
        connectedTo = getSchemeLevelIndex(connectedTo);
        var top = 'top-' + Math.min(installedAt, connectedTo);
        var displ = 'height-' + Math.abs(installedAt - connectedTo);
        var placed = installedAt < connectedTo ? 'on-top' : 'on-bottom';

        return top + ' ' + displ + ' ' + placed;
    };

    $scope.CSS_SCHEME_COLLECTOR = function (installedAt) {
        installedAt = getSchemeLevelIndex(installedAt);
        var top = 'offset-' + installedAt;

        return top;
    };

    $scope.PAGE_INSTALLATION = { levels: [] };

    angular.forEach(Configurator.levels, function (_level) {
        if (_level.isLevel) {
            var _l = { title: _level.name, groups: [] };
            for (var _groupName in _groupedByRooms) {
                if (_groupName.indexOf(_level.name + "|") >= 0){
                    var _group = {
                        title: _groupName.split("|")[1],
                        items: []
                    };

                    for (var _el in _groupedByRooms[_groupName].equip) {
                        _group.items.push({ title: _el, count: _groupedByRooms[_groupName].equip[_el].value });
                    }
                    _l.groups.push(_group);
                }
            }
            $scope.PAGE_INSTALLATION.levels.push(_l);
        }
    });

    // set default product card
    //

    $scope.RAW = function(html) {
        return $sce.trustAsHtml(html);
    };

    $(function() {
        $('#summary-menu-pointer').css('top', getMenuPointerTop(page-1) + 'px');
    });

    setCustomScroll();
});

appConfigurator.controller('AuthenticateModalCtrl', function ($scope, $modalInstance, CurrentUser, Configurator) {
    var form = {
        phone: '',
        email: '',
        rulesAccepted: false,
        submitted: false,
        valid: true,
        validate: function (formCtrl) {
            form.valid = !form.submitted || form.phone != '' || (form.email != '' && !form.email.$error.email);
            return form.valid && form.rulesAccepted;
        },
        submit: function (formCtrl) {
            form.submitted = true;
            if (form.validate(formCtrl)) {
                var authenticated = true; //todo some authentication code here
                $modalInstance.close(authenticated);
            }
        },
        dismiss: function () {
            $modalInstance.dismiss('cancel');
        }
    };

    $scope.FORM = form;
});

appConfigurator.controller('SaveModalCtrl', function ($scope, $modalInstance, CurrentUser, Configurator) {

    $scope.CONFIGURATION_NAME = Configurator.name;

    var form = {
        createId: Configurator.name, //initialize with some default value
        submitted: false,
        valid: true,
        errorMessage:"",
        duplicateId: false,
        saved: false,
        validate: function (formCtrl) {
            /*form.duplicateId = form.submitted && form.useCreateId && $.inArray(form.createId, form.orders) > -1;*/ // - эта проверка будет на сервере
            form.valid = !form.submitted || !Configurator.name || Configurator.name != '';
            return form.valid;
        },
        submit: function (formCtrl) {
            form.submitted = true;
            if (form.validate(formCtrl)) {
                //todo save data here with form.createId or replace with form.replaceId
                Configurator.saveConfiguration(function (message) {
                    form.saved = true;
                    Configurator.ReInitConfigurator();
                }, function (message) {
                    form.errorMessage = message;
                    form.saved = false;
                });
            }
        },
        dismiss: function () {
            $modalInstance.dismiss('cancel');
        }
    };

    $scope.FORM = form;
});

appConfigurator.controller('BaseCtrl', function($scope, $modal, CurrentUser, Configurator) {
    $scope.BASE_PAGE = { title: 'Конфигуратор' };

    var save = function() {
        var saveModal = $modal.open({
            templateUrl: 'common/views/modal-save.htm',
            controller: 'SaveModalCtrl',
            size: 'sm',
        });

        saveModal.result.then(
            function() {
                //close it
            },
            function() {
                //just close it
            });
    };

    var authenticateAndSave = function() {
        var authModal = $modal.open({
            templateUrl: 'common/views/modal-save-authenticate.htm',
            controller: 'AuthenticateModalCtrl',
            size: 'sm',
        });

        authModal.result.then(
            function(authenticationComplete) {
                if (authenticationComplete) {
                    save();
                }
            },
            function() {
                //just close it
            });
    };

    $scope.SAVE = function () {
        CurrentUser.isGuidExistsInDB().then(
            function () { save(); }
          , function () { authenticateAndSave(); }
        );
    };

    $scope.$on('$locationChangeSuccess', function (event, toUrl, fromUrl) {
        if (toUrl.indexOf('#/summary') >= 0) {
            $scope.BASE_PAGE.title = 'Информация по заказу';
            $('#basket').hide();
        } else {
            $scope.BASE_PAGE.title = 'Конфигуратор';
            $('#basket').show();
        }
    });
});

appConfigurator.directive('ngFocus', function () {
    var FOCUS_CLASS = "ng-focused";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function(evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function() { ctrl.$focused = true; });
            }).bind('blur', function(evt) {
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function() { ctrl.$focused = false; });
            });
        }
    };
});

appConfigurator.controller('AccountCtrl', function ($scope, $stateParams) {
    var tab = parseInt($stateParams.tab);
    tab = isNaN(tab) || tab > 2 ? 1 : tab;

    var OrderStatuses = { saved: 0, confirmed: 1 };

    var OrderViewModel = function(id, date, rub, status) {
        var $this = this;
        $this.id = id;
        $this.date = date;
        $this.rub = rub;
        $this.status = status;
        return $this;
    };

    var ViewModel = function(tabNum) {
        var $this = this;
        $this.name = 'Иван Иванов';
        $this.email = 'test@yandex.ru';
        $this.phone = '+7 800 123 45 67';
        $this.city = '';
        $this.street = '';
        $this.building = '';
        $this.apartment = '';

        $this.orders = [];

        $this.activeTab = tabNum;

        return $this;
    };

    var model = new ViewModel(tab);

    //push test orders
    for (var i = 0; i < 10; i++) {
        var randomDate = new Date(Math.ceil(Math.random() * 2 + 2013), Math.floor(Math.random() * 12) + 1, Math.ceil(Math.random() * 27));
        var randomStatus = Math.random() < 0.5 ? OrderStatuses.confirmed : OrderStatuses.saved;
        model.orders.push(new OrderViewModel(i + 1, randomDate, '9 000 000', randomStatus));
    }

    $scope.STATUS = OrderStatuses;
    $scope.MODEL = model;
    $scope.FORM = {
        invalid: function(ctrl) {
            return ctrl.$dirty && ctrl.$invalid && !ctrl.$focused;
        }
    };

    setCustomScroll();
});

function setCustomScroll() {
    $(function() {
        $('.autoscroll').perfectScrollbar({ wheelSpeed: 150, includePadding: true });
    });
}