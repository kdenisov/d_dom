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

    setCustomScroll();
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

    setCustomScroll();
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

	$scope.ALERT = function (alert) {
	    $scope.ALERT_MESSAGE = alert;

	    $scope.alertInstance = $modal.open({
	        templateUrl: 'alert.html',
	        size: 'sm',
	        scope: $scope
	    });
	}

	$scope.refreshRadiatorCollectorsCount = function () {
	    Configurator.UpdateCollectorEntries();
	}

	$scope.UpdateCollectorEntries = function () {
	    Configurator.UpdateCollectorEntries();
	}

	setCustomScroll();
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

    setCustomScroll();
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
		return Configurator.Basket();
	}

	$scope.BASKET_TOTAL_COUNT = function(){
		var count = 0;
		for (var k in $scope.BASKET()) {
			++count;
		}
		return(count);
	}
});

appConfigurator.controller('SummaryCtrl', function ($scope, $stateParams, $sce, Configurator) {
    var page = parseInt($stateParams.page);
    page = isNaN(page) || page > 5 ? 1 : page;

    var getMenuPointerTop = function (selectedIndex) {
        var dh = 58;
        var h0 = 25;
        return selectedIndex * dh + h0;
    };

    var ViewModel = function(pageNum) {
        var _this = this;
        _this._page = pageNum;

        _this.visible = function(n) {
            return _this._page == n;
        };

        _this.setPage = function(n, e) {
            if (e) {
                e.preventDefault();
            }

            $('#summary-menu-pointer').animate({ top: getMenuPointerTop(n - 1) + 'px' }, 300);
            var scope = angular.element($('.summary-page:first')).scope();
            scope.MODEL._page = n;
            _this._page = n;
        };

        _this.productCard = {};

        _this.showCard = function(card) {
            _this.productCard = card;
        };

        return _this;
    };

    var _basket = Configurator.Basket();

    $scope.MODEL = new ViewModel(page);

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

    homeClause.html = 'Расчет системы отопления произведен для ' + roomsCount + ' в ' + levelsCount + ' доме, с котлом в ' + (Configurator.boiler.roomType == 1 ? ' в отдельном помещении ' + (Configurator.boiler.level == 1 ? ' на первом этаже ' : ' в подвале') : ' на кухне ');

    if (Configurator.boiler.embodiment == 1) {
        var boilerClause = {
            title: 'Параметры котла и узла',
            src: 'common/img/summary/general-boiler.jpg',
            html: 'Источником тепловой энергии для теплоснабжения дома служит собственный котел, работающий на газообразном или жидком топливе. В данном проекте предусмотрен одноконтурный котел. <br/>Одноконтурные котлы предназначены для нагрева теплоносителя контура отопления. В состав котла, как правило, входит система управления и защиты горелки. Циркуляционные насосы и теплообменник нагрева горячей воды должны устанавливаться отдельно. Для приготовления горячей воды используется бойлер косвенного нагрева, представляющий собой накопительный бак горячей воды со встроенным в него теплообменником. Для подачи теплоносителя в контур отопления и нагрева ГВС применен насосный узел обвязки котла ' + Configurator.params.boiler.pump[Configurator.boiler.pump - 1].name + '. <br/> Насос контура отопления прокачивает теплоноситель через котел, радиаторы и (с помощью узла смешения) через конуры теплого пола. В контуре отопления устанавливаются термостатические регуляторы, которые изменяют сопротивление контура в зависимости от температуры в помещениях. Чтобы обеспечить циркуляцию теплоносителя через котел в любых режимах работы, в контуре отопления насосного узла DSM-BPU предусмотрен перепускной клапан AVDO. Клапан AVDO может быть настроен на поддержание необходимого минимального расхода в зависимости от применяемого котла. Насос контура ГВС прокачивает теплоноситель через котел и бойлер косвенного нагрева. Сопротивление контура нагрева ГВС постоянно, поэтому установка перепускного клапана не требуется. <br/>В состав насосного узла обвязки котла входят фильтры для каждого контура, предохранительный клапан, кран для подключения расширительного бака, запорные краны на каждом контуре для удобства сервисного обслуживания системы. Установка дополнительной трубопроводной арматуры не требуется.', thumbs: [{ src: 'common/img/summary/thumbs/boiler.jpg', count: 1 }]
        };
    } else {
        var boilerClause = {
            title: 'Параметры котла и узла',
            src: 'common/img/summary/general-boiler.jpg',
            html: 'Источником тепловой энергии для теплоснабжения дома служит собственный котел, работающий на газообразном или жидком топливе. В данном проекте предусмотрен двухконтурный котел. <br/>Двухконтурные котлы предназначены для нагрева и подачи теплоносителя в контур отопления, а также для приготовления горячей воды (ГВС). В состав двухконтурных котлов входит теплообменник нагрева горячей воды, трехходовой вентиль для переключения режима отопления / приготовления ГВС, циркуляционный насос, автоматика. Горячая вода приготавливается в проточном теплообменнике, поэтому котел должен иметь достаточную мощность, перекрывающую пиковую потребность в горячей воде.', thumbs: [{ src: 'common/img/summary/thumbs/boiler.jpg', count: 1 }]
        };
    }

    var collectorClause = {
        title: 'Коллекторы радиаторов',
        src: 'common/img/summary/general-radiator-collector.jpg',
        html: 'Разводка трубопроводов лучевая, то есть к каждому радиатору от расположенного на этаже коллектора проложен независимый подающий и обратный трубопроводы. Такая разводка позволяет скрыть трубопроводы в стене или стяжке, так как от коллектора до радиатора прокладывается цельный трубопровод, без стыков и соединений. Использование труб малого диаметра (так как тепловая нагрузка на каждый радиатор относительно мала) позволяет уменьшить толщину стяжки. Также лучевая разводка позволяет оптимально управлять температурой в помещении, так как изменение расхода отдельно взятого отопительного прибора не оказывает влияние на другие отопительные приборы.',
        thumbs: [
        ]
    };

    if (Configurator.ifBasketContainCodes(_basket, ['088U0722', '088U0723', '088U0724', '088U0725', '088U0726', '088U0727', '088U0728', '088U0729', '088U0730', '088U0731', '088U0732'])) {
        collectorClause.html += '<br/>Для подключения применены распределительные коллекторы FHF-F, оснащенные расходомерами. Расходомеры позволяют визуально наблюдать поток теплоносителя в каждом контуре, что существенно упрощает наладку и обслуживание системы. Чтобы избежать попадания воздуха в трубопровод, коллекторы оснащены автоматическими воздухоотводчиками.';
    }

    if (Configurator.ifBasketContainCodes(_basket, ['088U0702', '088U0703', '088U0704', '088U0705', '088U0706', '088U0707', '088U0708', '088U0709', '088U0710', '088U0711', '088U0712'])) {
        collectorClause.html += '<br/>Для подключения применены распределительные коллекторы FHF. Чтобы избежать попадания воздуха в трубопровод коллекторы оснащены автоматическими воздухоотводчиками.';
    }

    if (Configurator.ifBasketContainCodes(_basket, ['088H3112', '088H3113'])) {
        collectorClause.html += '<br/>Коллекторы также оснащены термоэлектрическими приводами TWA-A, на которые через ресивер подается управляющий сигнал от комнатного термостата.';
    }

    var radiatorsClause = {
        title: 'Обвязка радиатора',
        src: 'common/img/summary/general-interconnections.jpg',
        html: 'Обвязка радиатора выполняет следующие основные функции: регулировать мощность радиатора в зависимости от температуры в помещении, перекрывать поток теплоносителя в радиатор для обслуживания, ремонта или замены, обеспечивать возможность слива теплоносителя из радиатора на время ремонта',
        thumbs: [
            
        ]
    }

    var _radiators = Configurator.RadiatorValves();

    if (Configurator.ifBasketContainCodes(_radiators, ['1', '2', '3', '4', '5', '6'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с боковым подключением.<br/> Термостатический элемент устанавливается на клапан терморегулятора RA с боковым подключением трубопровода.<br/>Для возможности отключения радиаторов и слива из них теплоносителя для обвязки радиаторов применены специальные запорные клапаны RLV для радиаторов с боковым подключением. К этим клапанам можно подключить спускной кран с насадкой для шланга 3/4" и предотвратить попадание теплоносителя на отделочные материалы при обслуживании и ремонте.';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['7', '8'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с боковым подключением.<br/> Термостатический элемент устанавливается на клапан терморегулятора RA с боковым подключением трубопровода.<br/>Для возможности отключения радиаторов и слива из них теплоносителя для обвязки радиаторов применены специальные запорные клапаны RLV для радиаторов с боковым подключением. К этим клапанам можно подключить спускной кран с насадкой для шланга 3/4" и предотвратить попадание теплоносителя на отделочные материалы при обслуживании и ремонте.';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с нижним подключением. В конструкции радиатора предусмотрен терморегулирующий клапан, смонтированный на заводе. Клапан предусматривает установку термостатического элемента с {современным клипсовым соединением типа RA <br/>Для возможности отключения радиаторов и слива из них теплоносителя для обвязки применены специальные запорные клапаны RLV-KD для радиаторов с нижним подключением. К этим клапанам можно подключить спускной кран с насадкой для шланга 3/4" и предотвратить попадание теплоносителя на отделочные материалы при обслуживании и ремонте.<br/>';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с нижним подключением. В конструкции радиатора предусмотрен терморегулирующий клапан, смонтированный на заводе. Клапан предусматривает установку термостатического элемента с резьбовым М30х1,5 соединением.<br/>Для возможности отключения радиаторов и слива из них теплоносителя для обвязки применены специальные запорные клапаны RLV-KD для радиаторов с нижним подключением. К этим клапанам можно подключить спускной кран с насадкой для шланга 3/4" и предотвратить попадание теплоносителя на отделочные материалы при обслуживании и ремонте.<br/>';
    }

    if (Configurator.ifBasketContainCodes(_radiators, ['29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'])) {
        radiatorsClause.html += '<br/>В данном проекте используются радиаторы с нижним подключением. В конструкции радиатора не предусмотрен терморегулирующий клапан, поэтому гарнитура VHS<br/>';
    }

    var radiatorControlClause = {
        title: 'Управление радиаторным отоплением',
        src: 'common/img/summary/general-radiator-control.jpg',
        html: '',
        thumbs: [            
        ]
    };

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

        radiatorControlClause.html += '<br/>Для удобства управления в комнатах ' + controlTwo.join(', ') + ': установлены ' +  _codes.join(',') + ' подающ' + (_codes.length == 1 ? 'ий' : 'ие') + ' сигнал к приемнику\ам беспроводного сигнала ' + _recievierControl.join(',') + '. Таким образом осуществляется единое управление всеми радиаторами, установленными в каждом отдельном помещении. <br/>';
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
        if (Configurator.ifBasketContainCodes(_basket, ['013G4003', '013G4007', '013G4010', '013G4132', '013G4136', '013G4138']) && Configurator.ifBasketContainCodes(_basket, ['013G4004', '013G4008', '013G4009', '013G4133', '013G4137'])) {
            radiatorControlClause.html += '<br/>Для подключения полотенцесушителей и дизайн-радиаторов к контуру отопления применены  комплекты из дизайн-серии X-tra Collection. Данный комплект подключается через невидимые снаружи переходники, таким образом обеспечивается безупречный внешний вид';
        }else  if (Configurator.ifBasketContainCodes(_basket, ['013G4003', '013G4007', '013G4010', '013G4132', '013G4136', '013G4138'])) {
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
    if (Configurator.ifBasketContainCodes(_basket, ['003L1000', '087N791801', '087N791301'])) {
        var floorsCollectors = {
            title: 'Коллекторы теплого пола',
            src: 'common/img/summary/general-floor-collector.jpg',
            html: '',
            thumbs: []
        }

        if (Configurator.ifBasketContainCodes(_basket, ['088U0722', '088U0723', '088U0724', '088U0725', '088U0726', '088U0727', '088U0728', '088U0729', '088U0730', '088U0731', '088U0732'])) {
            floorsCollectors.html += '<br/>Для подключения контуров теплого пола применены распределительные коллекторы FHF-F, оснащенные расходомерами. Расходомеры позволяют визуально наблюдать поток теплоносителя в каждом контуре, что существенно упрощает наладку и обслуживание системы. Чтобы избежать попадания воздуха в петли теплого пола, коллекторы оснащены автоматическими воздухоотводчиками.';
        }
        if (Configurator.ifBasketContainCodes(_basket, ['088U0702', '088U0703', '088U0704', '088U0705', '088U0706', '088U0707', '088U0708', '088U0709', '088U0710', '088U0711', '088U0712'])) {
            floorsCollectors.html += '<br/>Для подключения контуров теплого пола применены распределительные коллекторы FHF-F. Чтобы избежать попадания воздуха в петли теплого пола, коллекторы оснащены автоматическими воздухоотводчиками.';
        }
        if (Configurator.ifBasketContainCodes(_basket, ['088H3112', '088H3113'])) {
            floorsCollectors.html += '<br/>Коллекторы также оснащены термоэлектрическими приводами TWA-A, на которые через ресивер подается управляющий сигнал от комнатного термостата.';
        }

        $scope.PAGE_GENERAL.clauses.push(floorsCollectors);

        var floorControls = {
            title: 'Управление теплым полом',
            src: 'common/img/summary/general-floor-collector.jpg',
            html: '',
            thumbs: []
        }

        if (Configurator.ifBasketContainCodes(_basket, ['087N791801']) && Configurator.ifBasketContainCodes(_basket, ['087N791301'])) {
            floorControls.html += '<br/>Для регулирования теплых полов применены проводные программируемые  комнатные термостаты TP5001МA и беспроводныйые программируемыйые  комнатныйые  термостаты TP5001A-RF. Использование беспроводных моделей позволяет легко менять размещение комнатного термостата, например, при перестановке мебели. Комнатный термостат устанавливается в каждой комнате с напольным отоплением. Управляющий сигнал комнатного термостата подается к приемнику беспроводного сигнала RX3 и коммутационному устройству FH-WC, которые передают сигнал к термоэлектрическим приводам TWA-A, установленным на распределительный коллектор теплых полов.';
        }else if (Configurator.ifBasketContainCodes(_basket, ['087N791801'])) {
            floorControls.html += '<br/>Для регулирования теплых полов применены проводные программируемые  комнатные  термостаты TP5001МA. Комнатный термостат устанавливается в каждой комнате с напольным отоплением. Управляющий сигнал комнатного термостата подается к приемнику беспроводного сигнала RX3, который передает сигнал к термоэлектрическим приводам TWA-A, установленным на распределительный коллектор теплых полов.';
        } else if (Configurator.ifBasketContainCodes(_basket, ['087N791301'])) {
            floorControls.html += '<br/>Для регулирования теплых полов применены беспроводные программируемые  комнатные  термостаты TP5001A-RF. Использование беспроводных моделей позволяет легко менять размещение комнатного термостата, например, при перестановке мебели. Комнатный термостат устанавливается в каждой комнате с напольным отоплением. Управляющий сигнал комнатного термостата подается к коммутационному устройству FH-WC, установленному совместно с коллектором теплых полов.';
        }

        if (Configurator.ifBasketContainCodes(_basket, ['003L1000'])) {
            floorControls.html += '<br/>Для регулирования теплых полов в помещениях с повышенной влажностью использованы терморегуляторы FHV для напольного отопления. Модель FHV-R с термостатическим элементом FJVR регулирует температуру возвращаемого теплоносителя, таким образом поддерживая постоянную температуру поверхности пола.';
        }

        $scope.PAGE_GENERAL.clauses.push(floorControls);
    }


    $scope.PAGE_SCHEME = {
        levels: [
            {
                title: 'Этаж 2',
                rooms: [
                    { show: true, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: true, title: 'Комната 2', radiators: 2, floors: 2 },
                    { show: true, title: 'Комната 3', radiators: 1, floors: 2 },
                    { show: true, title: 'Комната 4', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 }
                ]
            },
            {
                title: 'Этаж 1',
                rooms: [
                    { show: true, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: true, title: 'Комната 2', radiators: 2, floors: 1 },
                    { show: true, title: 'Комната 3', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 }
                ]
            },
            {
                title: 'Подвал',
                rooms: [
                    { show: true, title: 'Котельная', radiators: 0, floors: 0, boiler: true },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 },
                    { show: false, title: 'Комната 1', radiators: 2, floors: 1 }
                ]
            }
        ],

        radiatorCollectors: [
            { installedLevelIndex: 2 , connectedLevelIndex: [ 1, 2 ], title: 'FHF' },
            { installedLevelIndex: 0, connectedLevelIndex: [ 0 ], title: 'FHF' }
        ],

        floorCollectors: [
            { installedLevelIndex: 2, connectedLevelIndex: [ 1, 2 ], title: 'FHF' },
            { installedLevelIndex: 0, connectedLevelIndex: [ 0 ], title: 'FHF' }
        ]
    };

    $scope.CSS_SCHEME_CONNECTION = function (installedAt, connectedTo) {
        var top = 'top-' + Math.min(installedAt, connectedTo);
        var displ = 'height-' + Math.abs(installedAt - connectedTo);
        var placed = installedAt < connectedTo ? 'on-top' : 'on-bottom';

        return top + ' ' + displ + ' ' + placed;
    };

    $scope.CSS_SCHEME_COLLECTOR = function (installedAt) {
        var top = 'offset-' + installedAt;

        return top;
    };

    $scope.PAGE_MERCHANDISE = {
        totalRub: '123 456',
        items: [
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4.', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' }
        ]
    };

    $scope.PAGE_INSTALLATION = {
        totalRub: '123 456',
        levels: [
            {
                title: 'Первый этаж',
                groups: [
                    {
                        title: 'Комната 1',
                        items: [
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4.', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                        ]
                    },
                    {
                        title: 'Комната 2',
                        items: [
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4.', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' }
                        ]
                    },
                    {
                        title: 'Коллектор на первом этаже',
                        items: [
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4.', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' }
                        ]
                    }
                ]
            },
            {
                title: 'Второй этаж',
                groups: [
                    {
                        title: 'Комната 1',
                        items: [
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4.', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                        ]
                    },
                    {
                        title: 'Комната 2',
                        items: [
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4, Прямой, G3/4A x G3/4.', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' },
                            { title: 'Прямой, G3/4A x G3/4', thumb: 'common/img/summary/thumbs/merchandise.jpg', count: 8, rub: '24 000' }
                        ]
                    }
                ]
            }
        ]
    };

    $scope.PAGE_CARDS = {
        items: [
            {
                title: 'Термостат RA2994 с газонаполненным температурным датчиком',
                count: 3,
                rub: '900',
                description: {
                    html: '<p>Термостатический элемент - устройство автоматического регулирования температуры. Термостатический элемент - устройство автоматического регулирования температуры. Термостатический элемент - устройство автоматического регулирования температуры. </p>Термостатический элемент - устройство автоматического регулирования температуры. Термостатический элемент - устройство автоматического регулирования температуры. Термостатический элемент - устройство автоматического регулирования температуры. </p>Термостатический элемент - устройство автоматического регулирования температуры. Термостатический элемент - устройство автоматического регулирования температуры. Термостатический элемент - устройство автоматического регулирования температуры. </p>',
                    linksTitle: 'Документация',
                    links: [
                        { href: '#/summary/download/1', text: 'Техническое описание', css: 'icon-download' },
                        { href: '#/summary/download/2', text: 'Инструкция', css: 'icon-download' },
                    ]
                },
                techData: {
                    html: '<p>Sup!</p>',
                    linksTitle: 'Документация 2',
                    links: [
                        { href: '#/summary/download/3', text: 'Техническое описание 2', css: 'icon-download' },
                        { href: '#/summary/download/4', text: 'Инструкция 2', css: 'icon-download' },
                    ]
                },
                thumb: 'common/img/summary/thumbs/controls.jpg',
                src: 'common/img/summary/summary-card-control.png'
            },

            {
                title: 'Бойлер etc',
                count: 1,
                rub: '3 000',
                description: {
                    html: '<p>Бойлер - это бойлер</p>',
                    linksTitle: 'Документация 3',
                    links: [
                        { href: '#/summary/download/5', text: 'Техническое описание', css: 'icon-download' },
                        { href: '#/summary/download/6', text: 'Инструкция', css: 'icon-download' },
                    ]
                },
                techData: {
                    html: '<p>Sup!</p>',
                    linksTitle: 'Документация 4',
                    links: [
                        { href: '#/summary/download/7', text: 'Техническое описание 2', css: 'icon-download' },
                        { href: '#/summary/download/8', text: 'Инструкция 2', css: 'icon-download' },
                    ]
                },
                thumb: 'common/img/summary/thumbs/boiler.jpg',
                src: 'common/img/summary/summary-card-control.png'
            }
        ]
    };

    // set default product card
    $scope.MODEL.showCard($scope.PAGE_CARDS.items[0]);

    $scope.RAW = function(html) {
        return $sce.trustAsHtml(html);
    };

    $(function() {
        $('#summary-menu-pointer').css('top', getMenuPointerTop(page-1) + 'px');
    });

    setCustomScroll();
});

appConfigurator.controller('BaseCtrl', function($scope) {
    $scope.BASE_PAGE = { title: 'Конфигуратор' };

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

appConfigurator.filter('formatNumber', function () {
	return function (n) {
		if(n && n > 9999) return(n.toString().replace(/(?=\B(?:\d{3})+\b)/g, ' '));
		return( n.replace(',',' ') );
	}
});

function setCustomScroll() {
    $('.autoscroll').perfectScrollbar({ wheelSpeed: 300, includePadding: false });
}