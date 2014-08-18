'use strict';
// Controllers

appConfigurator.controller('CottageCtrl', function($scope, Configurator, orderByFilter){

	//Configurator = loadLocalStorage({key:'Configurator',val:Configurator});

    //$scope.CONFIGURATOR = Configurator;

    Configurator.params.orderLinksVisible = false;

	$scope.PARAMS = Configurator.params.cottage;
	$scope.COTTAGE = Configurator.cottage;
	$scope.LEVELS = Configurator.levels;
	$scope.BOILER = Configurator.boiler;
	
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

    $scope.GET_COTTAGE_CSS_CLASS = function() {
        var base = 'cottage-size-';
        var count = Configurator.cottage.levelsCount;
        var basement = "";
        if (Configurator.levels[count - 1].isBasement) {
            count--;
            basement = '-basement';
        }

        var size = 's';
        for (var i = 0; i < count; i++) {
            if (Configurator.levels[i].roomsCount > 8) {
                size = 'b';
                break;
            }
        }

        return base + count + size + basement;
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

    /*if(Configurator.initialized) return;
	Configurator.initialized = true;

	//Configurator.saveLocalStorage({key:'Configurator',val:Configurator});*/

    //$scope.$watch('CONFIGURATOR.area', setParamsCottage)
    //$scope.$watch('CONFIGURATOR.roomsTotal', setParamsCottage);
});

appConfigurator.controller('SetCollectorDialogCtrl', function ($scope, Configurator, $modalInstance, EDITED_COLLECTOR) {

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
                    res.push(_collector);
                }
            });
        });

        return res;
    }

    $scope.SET_COLLECTOR = function () {
        angular.forEach($scope.LEVELS, function (_level) {
            angular.forEach(_level.collectors, function (_collector, key2) {
                if (_collector.id == $modalInstance.TO_COLLECTOR_ID && _level.id == $modalInstance.TO_COLLECTOR_LEVEL_ID) {
                    if (_collector.entries + $scope.EDITED_COLLECTOR.entries > 24) {
                        alert("Превышено ограничение в 24 захода на один коллектор. Для решения вопроса обратитесь в данфосс");
                        $modalInstance.close(false);
                    }
                    _collector.levels[1] = _collector.levels[1] || $scope.EDITED_COLLECTOR.levels[1];
                    _collector.levels[2] = _collector.levels[2] || $scope.EDITED_COLLECTOR.levels[2];
                    _collector.levels[3] = _collector.levels[3] || $scope.EDITED_COLLECTOR.levels[3];
                    _collector.entries += $scope.EDITED_COLLECTOR.entries;
                }
            });
        });
        $scope.EDITED_COLLECTOR = null;
        $modalInstance.close(true);
    }

    $scope.CANCEL_SET_COLLECTOR = function () {
        $scope.EDITED_COLLECTOR.isCollector = true;
        $scope.EDITED_COLLECTOR = null;
        $modalInstance.close(false);
    }
});

appConfigurator.controller('LevelCtrl', function($scope, Configurator, $stateParams, $modal){

	var
		levels = Configurator.levels,
		level = levels[$stateParams.levelId - 1]
    ;

    //Выбор следующего уровня с учетом того, что подвал подставляется на место последнего этажа
	var nextLevel = function () {
	    if (level.isBasement) {
	        return levels[0];
	    }

	    var res = levels[$stateParams.levelId];
	    if (res == undefined) {
	        return null;
	    }

	    if (res.isBasement) {
	        return null;
	    }

	    return res;
	};

	var prevLevel = function () {
	    if (level.isBasement) {
	        return null;
	    }

	    if ($stateParams.levelId == 1 && levels[levels.length - 1].isBasement) {
	        return levels[levels.length - 1];
	    }

	    return levels[$stateParams.levelId - 2];
	};

	$scope.COTTAGE = Configurator.cottage;
	$scope.CURRENT_LEVEL = level;
	$scope.PREV_LEVEL = prevLevel();
	$scope.NEXT_LEVEL = nextLevel();
	$scope.COLLECTORS = level.collectors;
	$scope.LEVELS = levels;
	$scope.BOILER = Configurator.boiler;
	$scope.EDITED_COLLECTOR = null;

    $scope.ALERT = function(alert) {
        $scope.ALERT_MESSAGE = alert;

        $scope.alertInstance = $modal.open({
            templateUrl: 'alert.html',
            size: 'sm',
            scope: $scope
        });
    };

    $scope.CLOSE_ALERT = function() {
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
                    $scope.EDITED_COLLECTOR.isCollector = true;
                }
                $scope.EDITED_COLLECTOR = null;
            });
        });
    };

    $scope.refreshRadiatorCollectorsCount = function() {
        Configurator.RefreshCollectorsCount();
    };
});


appConfigurator.controller('RoomCtrl', function ($scope, $stateParams, Configurator, Editor, $modal) {
	var
		level = Configurator.levels[$stateParams.levelId - 1],
		room = level.rooms[$stateParams.roomId - 1]
	;

	Configurator.params.room.fittings = Configurator.params.fittings;
	Configurator.params.room.fittingsMaterial = Configurator.params.fittingsMaterial;

	$scope.BOILER = Configurator.boiler;
	$scope.BOILER_PARAMS = Configurator.params.boiler;	
	$scope.ROOM = room;
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
	$scope.VIEW = function (valves, connection, control) {
	    if ($scope.PARAMS.radiators.control[$scope.RADIATOR.control - 1].previewPrefix)
	        return "common/img/radiators/n/" + Configurator.params.room.radiators.valves[valves - 1].preview + "_" + $scope.PARAMS.radiators.control[control - 1].previewPrefix + "_r" + (connection == 1 ? "2" : "1") + ".png";
	    else
	        return "common/img/radiators/n/" + Configurator.params.room.radiators.valves[valves - 1].preview + "_r" + (connection == 1 ? "2" : "1") + ".png";
	}

	$scope.UPDATE_VALVE = function (valveId) {
	    return "common/img/radiators/" + Configurator.params.room.radiators.valves[$scope.RADIATOR.valves - 1].preview + ".png";
	}

	$scope.filterFunction = function (element) {
	    return ($scope.FLOORS.loops > 1 && element.type == 2) || ($scope.FLOORS.loops == 1) ? true : false;
	};

	$scope.GET_VALVES = function(){
	}

	$scope.UPDATE_RADIATORS_COUNT = function () {
	    var c = Configurator;
	    var
			area = Configurator.cottage.area,
			levels_count = Configurator.cottage.levelsCount
	    ;

	    Configurator.RefreshCollectorsCount();
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

	    Configurator.RefreshCollectorsCount();
	}

	$scope.SET_PARAMS_FOR_ALL_DECLINED = function () {
	    $scope.modalInstance.dismiss('cancel');
	}

	$scope.scopeUpdateRADIATOR = function (obj) {
		$scope.RADIATOR = obj;
	}

	$scope.ALERT = function (alert) {
	    $scope.ALERT_MESSAGE = alert;

	    $scope.alertInstance = $modal.open({
	        templateUrl: 'alert.html',
	        size: 'sm',
	        scope: $scope
	    });
	}

	$scope.refreshRadiatorCollectorsCount = function () {
	    Configurator.RefreshCollectorsCount();
	}

});


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
	    var c = Configurator;
	    var
			area = Configurator.cottage.area,
			levels_count = Configurator.cottage.levelsCount
	    ;

	    Configurator.RefreshCollectorsCount();
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

	    Configurator.RefreshCollectorsCount();
	}

	$scope.SET_PARAMS_FOR_ALL_DECLINED = function () {
	    $scope.modalInstance.dismiss('cancel');
	}

	$scope.scopeUpdateRADIATOR = function (obj) {
	    $scope.RADIATOR = obj;
	}

});

appConfigurator.controller('CollectorCtrl', function($scope, Configurator, $stateParams, $modal){
	var
		level = Configurator.levels[$stateParams.levelId - 1],
		collector = level.collectors[$stateParams.collectorId - 1]
	;

	//Configurator = loadLocalStorage({key:'Configurator',val:Configurator});

	Configurator.params.collector.fittings = Configurator.params.fittings;

    //$scope.ROOM = room;

	$scope.AUTO_CALC_INPUT = false;
	$scope.TITLE = collector.name;
	$scope.COLLECTOR = collector;
	$scope.LEVELS = Configurator.levels;
	$scope.PARAMS = Configurator.params.collector;
	$scope.LINK_RETURN = '#/level/' + level.id;
	$scope.LINK_NEXT = '#/boiler';

	var scrollThreshold = function () {
	    return $scope.COLLECTOR.type == 'radiator' ? 8 : ($scope.COLLECTOR.mixing ? 5 : 7);
	};

	$scope.SCROLLABLE_LEFT = false;
	$scope.SCROLLABLE_RIGHT = $scope.COLLECTOR.entries > scrollThreshold();

	var leftBtn = function (show) {
	    var btn = $('.collector-frame .arrow-left').eq(0);
	    if (!show && !btn.hasClass('ng-hide')) {
	        btn.addClass('ng-hide');
	        return;
	    }

	    if (show && btn.hasClass('ng-hide')) {
	        btn.removeClass('ng-hide');
        }
	};

	var rightBtn = function (show) {
	    var btn = $('.collector-frame .arrow-right').eq(0);
	    if (!show && !btn.hasClass('ng-hide')) {
	        btn.addClass('ng-hide');
	        return;
	    }

	    if (show && $scope.COLLECTOR.entries > scrollThreshold() && btn.hasClass('ng-hide')) {
	        btn.removeClass('ng-hide');
        }
	};

	$scope.SLIDE_LEFT = function (e) {
	    if (e && e.preventDefault) {
	        e.preventDefault();
	    }

	    var set = $('.collector-set:first');
	    var inner = set.parent();
	    var left = -inner.position().left;

	    leftBtn(false);
	    inner.animate({ left: '+=' + left }, 1500, function () {
	        rightBtn(true);
	    });
	};

	$scope.SLIDE_RIGHT = function (e) {
	    if (e && e.preventDefault) {
	        e.preventDefault();
	    }

	    var set = $('.collector-set:first');
	    var inner = set.parent();
	    var frame = inner.parent();
	    var left = set.width() - frame.width() + inner.position().left + 20;

	    rightBtn(false);
	    inner.animate({ left: '-=' + left }, 1500, function () {
	        leftBtn(true);
	    });
	};

    var getNodes = function() {
        var nodes = [];
        while (nodes.length < $scope.COLLECTOR.entries) {
            nodes.push(nodes.length);
        }

        return nodes;
    };

    $scope.NODES = getNodes(); // Узлы коллектора, сгрупированные по секциям

    $scope.SET_TERMOMETRS_COUNT = function() {
        $scope.COLLECTOR.thermometersCount = (collector._thermometerIn ? 1 : 0) + (collector._thermometerOut ? 1 : 0);
        $scope.COLLECTOR.isThermometers = $scope.COLLECTOR.thermometersCount > 0;
    };

    $scope.AUTO_CALC_INPUTS = function () {
        Configurator.RefreshCollectorsCount();
        $scope.UPDATE_NODES();
    };

    $scope.UPDATE_COLLECTOR = function (toggleLevelId) {
        Configurator.ToggleCollectorToLevel(collector.id, level.id, toggleLevelId)
    };

    $scope.UPDATE_NODES = function() {
        var items = $('.collector-nodes .node');
        var $currentScope = angular.element(items).scope();
        var count = $currentScope.COLLECTOR.entries;

        while ($currentScope.NODES.length < count) {
            $currentScope.NODES.push($currentScope.NODES.length);
        }

        while ($currentScope.NODES.length > count) {
            $currentScope.NODES.pop();
        }

        $('.collector-inside').css('left', 0);
        leftBtn(false);
        rightBtn(true);
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
                    $scope.COLLECTOR.isCollector = true;
                }
            });
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
});


appConfigurator.controller('BasketCtrl', function($scope, $filter, Configurator, Catalog){

	var params = Configurator.params;

	Catalog.fetch().then(function(data) {
    $scope.CATALOG = data;

		$scope.BASKET_TOTAL_PRICE = function(){
			var
				price = 0,
				basket = $scope.BASKET(),
				catalog = $scope.CATALOG
			;

			for (var k in basket) {
				price += basket[k] * catalog[k].price;
			}
			price = Math.round(price);
			return($filter('formatNumber')(price));
		}
	});

	$scope.BASKET = function(){
		var _basket = {};

		angular.forEach(Configurator.levels, function(_level) {
			_level.isLevel
			&& 
			(angular.forEach(_level.rooms, function(_room) {
				_room.id <= _level.roomsCount && (
					(angular.forEach(_room.radiators.list, function(_radiator) {
						_radiator.id <= _room.radiators.radiatorsTypes && (
							(_radiator.type == 1 && _radiator.control && angular.forEach(params.room.radiators.control[_radiator.control-1].basket, function(_control) {
							    pushToBasket(_basket, _control[0], _radiator.count * eval(_control[1]));
							}))
							+
							(angular.forEach(params.room.radiators.valves[_radiator.valves-1].basket, function(_valves) {
							    pushToBasket(_basket, _valves[0], _radiator.count * _valves[1]);
							}))
							+
							(_radiator.fittings && angular.forEach(params.fittings[_radiator.fittings-1].basket, function(_fittings) {
								pushToBasket(_basket, _fittings[0], _radiator.count * 2);
							}))
						)
					}))
					+
					(_room.floors.isFloors && 
						(angular.forEach(params.room.floors.control[_room.floors.control - 1].basket, function (_control) {
							pushToBasket(_basket, _control[0], eval(_control[1]));
						}))
						+
						(_room.floors.fittings && angular.forEach(params.fittings[_room.floors.fittings-1].basket, function(_fittings) {
							pushToBasket(_basket, _fittings[0], 2);
						}))
					)
				)
			}))
			&&
			(angular.forEach(_level.collectors, function (_collector) {

			    if (_collector.isCollector) {
			        
			        var collector_1 = _collector.entries;
			        angular.forEach(params.collector.sets, function (_set) {			           
			            if (_collector.type == 'radiator' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    pushToBasket(_basket, _sets[0], eval(_sets[1]));
			                });
			            }
			            if (_collector.type == 'floor' && _set.isFlowmeter == _collector.isFlowmeter && _set.entries == collector_1) {
			                angular.forEach(_set.basket, function (_sets) {
			                    pushToBasket(_basket, _sets[0], eval(_sets[1]));
			                });
			            }
			        });
			    }

				_collector.isCollector && (
					(_collector.isBallValves && angular.forEach(params.collector.ballValves[0].basket, function(_ballValves) {
						pushToBasket(_basket, _ballValves[0], _ballValves[1]);
					}))
					+
					(_collector.isThermometers && angular.forEach(params.collector.thermometers[0].basket, function(_thermometers) {
						pushToBasket(_basket, _thermometers[0], eval(_thermometers[1]));
					}))
					+
					(_collector.fittings && angular.forEach(params.fittings[_collector.fittings-1].basket, function(_fittings) {
						pushToBasket(_basket, _fittings[0], _collector.entries);
					}))
                    +
					(_collector.fit_088U0305 && angular.forEach(params.collector.fit_088U0305[_collector.fit_088U0305 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1]);
					}))
                    +
					(_collector.fit_088U0301 && angular.forEach(params.collector.fit_088U0301[_collector.fit_088U0301 - 1].basket, function (_fittings) {
					    pushToBasket(_basket, _fittings[0], _fittings[1]);
					}))
					+
					(_collector.mixing && angular.forEach(params.collector.mixing[_collector.mixing-1].basket, function(_mixing) {
						pushToBasket(_basket, _mixing[0], _mixing[1]);
					})))				
			}));
		});

		Configurator.boiler.isBoiler && pushToBasket(_basket, params.boiler.pump[Configurator.boiler.pump-1].basket[0][0], 1);
		for (var k in _basket) {
		    _basket[k] = Math.ceil(_basket[k]);
		}
		return _basket;
	}

	$scope.BASKET_TOTAL_COUNT = function(){
		var count = 0;
		for (var k in $scope.BASKET()) {
			++count;
		}
		return(count);
	}

	var pushToBasket = function(basket, key, val){
		if(key in basket) {
			basket[key] += parseFloat(val);
		}else 
		    basket[key] = parseFloat(val);
	}

});


appConfigurator.filter('formatNumber', function () {
	return function (n) {
		if(n && n > 9999) return(n.toString().replace(/(?=\B(?:\d{3})+\b)/g, ' '));
		return( n.replace(',',' ') );
	}
});
